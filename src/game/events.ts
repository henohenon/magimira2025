import mitt, { type Emitter } from 'mitt';

type KeyFrame = {
  name: string;
  position: number;
};

type Events = {
  onLoaded: undefined;
  onGameStart: undefined;
  onMusicStart: undefined;
  onKeyFrame: {
    key: KeyFrame;
    position: number;
  };
}

export const events: Emitter<Events> = mitt<Events>();

// Array of key frames with their trigger positions
export const keyFrames: KeyFrame[] = [
  { name: "Intro", position: 0 },
  { name: "Sotellusストリートライト", position: 3290 },
  { name: "揺らめく都市のmagic", position: 11252 },
  { name: "街明かりが渦巻く躓くmymind", position: 21284 },
  { name: "再起動theothernight", position: 25339 },
  { name: "(Don’tyouknow？)", position: 28160 },
  { name: "Ah強引にgoin'on", position: 28833 },
  { name: "好きも得意も", position: 30939 },
  { name: "もう全部奏でたいんだ", position: 33000 },
  { name: "(Yeahdoit！)", position: 35860 },
  { name: "めくるめくこの雑踏をかき分けていく", position: 37410 },
  { name: "光差す道を目指して", position: 41415 },
  { name: "空回る今だって僕らの祈り毎秒更新", position: 45618 },
  { name: "不安感だって攫っていく未来にrideon", position: 49120 },
  { name: "c1-Yeah！", position: 53820 },
  { name: "c1-終わりなんて", position: 54577 },
  { name: "c1-ない", position: 55600 },
  { name: "c1-この手掴めば", position: 56611 },
  { name: "c1-また始まるんだ", position: 58600 },
  { name: "c1-グシャグシャのまま描いた", position: 59965 },
  { name: "c1-“アイ”", position: 62000 },
  { name: "c1-It'sallright！", position: 63554 },
  { name: "c1-灯した歌は", position: 64860 },
  { name: "c1-君に届く", position: 67000 },
  { name: "c1-躊躇いはない", position: 68420 },
  { name: "c1-そう、一人じゃないから", position: 69713 },
  { name: "c1-(鼓動)", position: 72575 },
  { name: "c1-(心)", position: 73700 },
  { name: "c1-(不可能を超えてゆけ)", position: 74550 },
  { name: "c1-曖昧な夢さえも抱いて", position: 76631 },
  { name: "c1-(踊る)", position: 80820 },
  { name: "c1-(震える)", position: 81945 },
  { name: "c1-(重なる想いだけ)", position: 82795 },
  { name: "c1-あふれるストーリーに乗せて", position: 84895 },
  { name: "立ち尽くす街角", position: 88930 },
  { name: "どれほど間違っても", position: 90520 },
  { name: "この灯火は何度だって輝く", position: 92540 },
  { name: "(宿すagainstgravity)", position: 95075 },
  { name: "ここからはノンストップ", position: 97140 },
  { name: "宵闇の中でも", position: 98640 },
  { name: "消えない星を繋いでいたい", position: 100600 },
  { name: "止め処なくbluff,bluff", position: 105090 },
  { name: "言葉の飾り毎秒更新", position: 106323 },
  { name: "揺らぐ主役舞台は未知の最前線", position: 108691 },
  { name: "c2-Yeah！", position: 113309 },
  { name: "c2-もう正解なんてない", position: 114050 },
  { name: "c2-奏でた今日が", position: 116090 },
  { name: "c2-僕らの道だ", position: 118079 },
  { name: "c2-ずっと手放したくないんだ", position: 119508 },
  { name: "c2-“アイ”", position: 122643 },
  { name: "c2-いつだって", position: 123014 },
  { name: "c2-願いを歌えば", position: 124320 },
  { name: "c2-君に会える", position: 125154 },
  { name: "c2-最高のステージ", position: 127910 },
  { name: "c2-夢はもう譲れないんじゃない？", position: 129195 },
  { name: "零れたメモリを誘って", position: 135810 },
  { name: "Twilighttotellus", position: 140298 },
  { name: "Starlighttotellus", position: 142224 },
  { name: "lc-終わりなんて", position: 146862 },
  { name: "lc-ない", position: 147885 },
  { name: "lc-この手掴めば", position: 148920 },
  { name: "lc-また始まるんだ", position: 150909 },
  { name: "lc-グシャグシャのまま描いた", position: 152278 },
  { name: "lc-“アイ”", position: 154313 },
  { name: "lc-It'sallright！", position: 155969 },
  { name: "lc-灯した歌は君に届く", position: 157140 },
  { name: "lc-躊躇いはない", position: 160747 },
  { name: "lc-そう、一人じゃないから", position: 162010 },
  { name: "lc-(鼓動)", position: 164769 },
  { name: "lc-(心)", position: 165894 },
  { name: "lc-(不可能を超えてゆけ)", position: 166744 },
  { name: "lc-曖昧な夢さえも抱いて", position: 168904 },
  { name: "lc-(踊る)", position: 173170 },
  { name: "lc-(震える)", position: 174295 },
  { name: "lc-(重なる想いだけ)", position: 175145 },
  { name: "lc-あふれるストーリーに乗せて", position: 177150 },
  { name: "咲かせた未来のその先へ", position: 181000 } // todo
];


// Array of key frames with their trigger positions
export const phraseFrames: KeyFrame[] = [
  { name: "Sotellusストリートライト", position: 3290 },
  { name: "揺らめく都市のmagic", position: 11252 },
  { name: "街明かりが渦巻く躓くmymind", position: 21284 },
  { name: "再起動theothernight", position: 25339 },
  { name: "(Don’tyouknow？)", position: 28160 },
  { name: "Ah強引にgoin'on", position: 28833 },
  { name: "好きも得意ももう全部奏でたいんだ", position: 30939 },
  { name: "(Yeahdoit！)", position: 35860 },
  { name: "めくるめくこの雑踏をかき分けていく", position: 37410 },
  { name: "光差す道を目指して", position: 41415 },
  { name: "空回る今だって僕らの祈り毎秒更新", position: 45618 },
  { name: "不安感だって攫っていく未来にrideon", position: 49120 },
  { name: "Yeah！", position: 53820 },
  { name: "終わりなんて", position: 54577 },
  { name: "ない", position: 55600 },
  { name: "この手掴めば", position: 56611 },
  { name: "また始まるんだ", position: 58600 },
  { name: "グシャグシャのまま描いた“アイ”", position: 59965 },
  { name: "It'sallright！", position: 63554 },
  { name: "灯した歌は", position: 64860 },
  { name: "君に届く", position: 67000 },
  { name: "躊躇いはない", position: 68420 },
  { name: "そう、一人じゃないから", position: 69713 },
  { name: "(鼓動、心、不可能を超えてゆけ)", position: 72575 },
  { name: "曖昧な夢さえも抱いて", position: 76631 },
  { name: "(踊る、震える、重なる想いだけ)", position: 80820 },
  { name: "あふれるストーリーに乗せて", position: 84895 },
  { name: "立ち尽くす街角", position: 88930 },
  { name: "どれほど間違っても", position: 90520 },
  { name: "この灯火は何度だって輝く", position: 92540 },
  { name: "(宿すagainstgravity)", position: 95075 },
  { name: "ここからはノンストップ", position: 97140 },
  { name: "宵闇の中でも消えない星を繋いでいたい", position: 98640 },
  { name: "止め処なくbluff,bluff", position: 105090 },
  { name: "言葉の飾り毎秒更新", position: 106323 },
  { name: "揺らぐ主役舞台は未知の最前線", position: 108691 },
  { name: "Yeah！", position: 113309 },
  { name: "もう正解なんてない", position: 114050 },
  { name: "奏でた今日が僕らの道だ", position: 116090 },
  { name: "ずっと手放したくないんだ“アイ”", position: 119508 },
  { name: "いつだって願いを歌えば君に会える", position: 123014 },
  { name: "最高のステージ", position: 127910 },
  { name: "夢はもう譲れないんじゃない？", position: 129195 },
  { name: "零れたメモリを誘って", position: 135810 },
  { name: "Twilighttotellus", position: 140298 },
  { name: "Starlighttotellus", position: 142224 },
  { name: "終わりなんてない", position: 146862 },
  { name: "この手掴めばまた始まるんだ", position: 148920 },
  { name: 'グシャグシャのまま描いた"アイ"', position: 152278 },
  { name: "It'sallright！", position: 155969 },
  { name: "灯した歌は君に届く", position: 157140 },
  { name: "躊躇いはない", position: 160747 },
  { name: "そう、一人じゃないから", position: 162010 },
  { name: "(鼓動、心、不可能を超えてゆけ)", position: 164769 },
  { name: "曖昧な夢さえも抱いて", position: 168904 },
  { name: "(踊る、震える、重なる想いだけ)", position: 173170 },
  { name: "あふれるストーリーに乗せて", position: 177150 }
];

export const updateKeyFrames = (lastPosition: number, currentPosition: number): void => {
  for (const key of keyFrames) {
    if (key.position >= lastPosition && key.position < currentPosition) {
      events.emit("onKeyFrame", { key, position: currentPosition });
    }
  }
};
