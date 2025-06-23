import mitt, { type Emitter } from 'mitt';

type KeyFrame = {
  name: string;
  position: number;
};

type Events = {
  onLoaded: undefined;
  onGameStart: undefined;
  onKeyFrame: {
    action: KeyFrame;
    position: number;
  };
}

export const events: Emitter<Events> = mitt<Events>();

// Array of key frames with their trigger positions
export const keyFrames: KeyFrame[] = [
  { "name": "init", "position": 0 },
  { "name": "Sotellusストリートライト", "position": 3234.437 },
  { "name": "揺らめく都市のmagic", "position": 11216.412499999999 },
  { "name": "街明かりが渦巻く躓くmymind", "position": 21281.940000000002 },
  { "name": "再起動theothernight", "position": 25286.610500000003 },
  { "name": "(Don’tyouknow？)", "position": 28150.415 },
  { "name": "Ah強引にgoin'on", "position": 28717.314 },
  { "name": "好きも得意も", "position": 30900.7055 },
  { "name": "もう全部奏でたいんだ", "position": 33000 },
  { "name": "(Yeahdoit！)", "position": 35848.0465 },
  { "name": "めくるめくこの雑踏をかき分けていく", "position": 37370.935 },
  { "name": "光差す道を目指して", "position": 41370.016 },
  { "name": "不安感だって攫っていく未来にrideon", "position": 49111.59 },
  { "name": "Yeah！", "position": 53777.278 },
  { "name": "終わりなんてない", "position": 54546.803375 },
  { "name": "この手掴めばまた始まるんだ", "position": 56524.625 },
  { "name": "グシャグシャのまま描いた“アイ”", "position": 59953.888 },
  { "name": "It'sallright！", "position": 63452.569625000004 },
  { "name": "灯した歌は君に届く", "position": 64735.7213125 },
  { "name": "灯した歌は君に届く", "position": 64834.94415625 },
  { "name": "そう、一人じゃないから", "position": 69655.016375 },
  { "name": "立ち尽くす街角", "position": 88871.06137499999 },
  { "name": "どれほど間違っても", "position": 90473.01775 },
  { "name": "(宿すagainstgravity)", "position": 95019.415 },
  { "name": "ここからはノンストップ", "position": 97120.4625 },
  { "name": "揺らぐ主役舞台は未知の最前線", "position": 108617.38187499999 },
  { "name": "Yeah！", "position": 113261.647375 },
  { "name": "もう正解なんてない", "position": 114021.4953125 },
  { "name": "奏でた今日が僕らの道だ", "position": 116009.593125 },
  { "name": "ずっと手放したくないんだ“アイ”", "position": 119451.60943750001 },
  { "name": "いつだって願いを歌えば君に会える", "position": 123007.03932226563 },
  { "name": "最高のステージ", "position": 127889.41437500001 },
  { "name": "夢はもう譲れないんじゃない？", "position": 129153.454 },
  { "name": "零れたメモリを誘って", "position": 135746.4045 },
  { "name": "Twilighttotellus", "position": 140291.508 },
  { "name": "Starlighttotellus", "position": 142173.532 },
  { "name": "終わりなんてない", "position": 146814.235 },
  { "name": "この手掴めばまた始まるんだ", "position": 148908.65984375 },
  { "name": "グシャグシャのまま描いた\"アイ\"", "position": 152252.38225 },
  { "name": "It'sallright！", "position": 155924.41225 },
  { "name": "灯した歌は君に届く", "position": 157107.06942968746 },
  { "name": "躊躇いはない", "position": 160692.407 },
  { "name": "そう、一人じゃないから", "position": 161967.50185937498 },
  { "name": "(鼓動、心、不可能を超えてゆけ)", "position": 164700.058 },
  { "name": "曖昧な夢さえも抱いて", "position": 168882.959 },
  { "name": "(踊る、震える、重なる想いだけ)", "position": 173137.323 },
  { "name": "あふれるストーリーに乗せて", "position": 177128.2795 },
  { "name": "咲かせた未来のその先へ", "position": 180800.384625 }
];

export const updateKeyFrames = (lastPosition: number, currentPosition: number): void => {
  for (const action of keyFrames) {
    if (action.position >= lastPosition && action.position < currentPosition) {
      events.emit("onKeyFrame", { action, position: currentPosition });
    }
  }
};
