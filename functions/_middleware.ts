import { Response, URL, type PagesFunction } from "@cloudflare/workers-types";

export interface Env {
	PASS_KEY: string; // Pages の環境変数で設定
	LOCAL?: string; // .dev.vars に LOCAL=true
}

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
	// ローカル or Preview は何もしない
	if (env.LOCAL === "true") return next();

	const url = new URL(request.url);
	const token = url.searchParams.get("k"); // ?k=xxxx で渡す
	const cookies = request.headers.get("cookie") ?? "";
	const authed =
		cookies.includes(`k=${env.PASS_KEY}`) || token === env.PASS_KEY;

	if (authed) {
		// 初回アクセスなら 30 日クッキーをセットして通過
		const res = await next();
		if (token)
			res.headers.set(
				"set-cookie",
				`k=${env.PASS_KEY}; Max-Age=2592000; Path=/; Secure; SameSite=Strict`,
			);
		return res;
	}

	// まだ未認証ならシンプルな入力フォームを返す
	return new Response(
		`
      <form action="/" method="GET">
        <input name="k" placeholder="key"><button>enter</button>
      </form>
    `,
		{ headers: { "content-type": "text/html;charset=utf-8" } },
	);
};
