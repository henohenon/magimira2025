# 現在の技術スタック

> **目的**: TypeScript + Bun(+Node) + Vite で開発し、Cloudflare Pages & Workers へデプロイするフルスタック構成。

---

## TypeScript

* JavaScript を **型安全** に書くための superset（ES2024 以降の提案も先取り）。
* **静的解析**: `strictNullChecks`・`noImplicitAny` 等で実行前にバグを検知。
* **開発体験**: VS Code との連携で IntelliSense／リファクタが強力。
* **言語機能**: Generics・Conditional Types・Template Literal Types で複雑な型も表現可。
* React／Next.js／Node.js プロジェクトのデファクト標準。

---

## Node.js （土台ランタイム）

* Google V8 をベースにした **サーバーサイド JavaScript 実行環境**。
* **非同期 I/O / イベントループ** による高スループット。
* CommonJS と ESModules の両方に対応（LTS v20.x 時点）。
* ネイティブアドオン（C/C++）で CPU 集中タスクも拡張可。
* Windows/macOS/Linux 向けに幅広く採用、ホスティング選択肢も豊富。

### npm (Node Package Manager)

* Node 同梱の **公式パッケージマネージャ**。世界最大級の OSS レジストリを持つ。
* `package.json` に依存とメタ情報を宣言、`semver` でバージョン管理。
* `npm install / update / ci`、`npx` でワンショット実行、`npm run` スクリプトでタスク自動化。
* lockfile は `package-lock.json`、モノレポでは `workspaces` 機能。
* 兄弟ツール: **pnpm**（ハードリンクで超高速・省容量）、**yarn**（Berry/PnP）など。

---

## Bun（高速ランタイム & PM）

* **Zig 製 JIT** + Bundler + npm 互換 PM を一体化したオールインワン。
* `bun install` と lockfile `bun.lockb` で pnpm 並みの速度。
* ts/tsx をそのまま実行 (`bun run src/app.tsx`)。ビルトイン transpiler は esbuild ベース。
* **Node API 互換**: 約 80–90% を実装、Esm/CJS 混在も可（未実装 API は polyfill 必要）。
* **課題**: Windows 未対応、古いネイティブアドオンに弱い、リリース頻度高め。

---

## Vite（ビルド & Dev サーバ）

* **開発時**: esbuild で TS → ESM を数十 ms で変換、HMR 爆速。
* **本番ビルド**: Rollup ベースで tree‑shaking／code‑splitting／dynamic import 対応。
* プラグイン公式: React・Vue・Svelte・Solid など、`vite.config.ts` で容易に拡張。
* **環境変数**: `.env` → `import.meta.env` で型安全に取得。
* Storybook／Vitest／Playwright との親和性高。

---

## デプロイ : Cloudflare Pages ＋ Workers

* **CI/CD**: GitHub Push → Pages が自動ビルド → Cloudflare Edge に数秒で配信。
* **Edge Functions (Workers)**: 50 ms CPU・128 MB RAM／リクエスト、cold start 数 ms。
* **ストレージ**:

  * **R2**: S3 互換オブジェクト、巨大アセット（>100 MB）を安価に配置。
  * **KV**: 低レイテンシ Key‑Value。
  * **D1**: サーバーレス SQLite。
* **ルーティング**: Functions で `/api/*` だけ SSR、その他は静的というハイブリッド構成が簡単。
* **セキュリティ**: PASS\_KEY を環境変数に設定し Basic 認証で非公開運用可。
* **ローカルプレビュー**: `wrangler pages dev` で Workers 含む本番同等環境を起動。

---
