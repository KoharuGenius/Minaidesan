;ティラノスクリプトサンプルゲーム

*start

[cm  ]
[clearfix]
[start_keyconfig]


[bg storage="black.jpg" time="100"]

;メニューボタンの表示
@showmenubutton

;メッセージウィンドウの設定
[position layer="message0" left=160 top=500 width=1000 height=200 page=fore visible=true]

;文字が表示される領域を調整
[position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]


;メッセージウィンドウの表示
@layopt layer=message0 visible=true

;キャラクターの名前が表示される文字領域
[ptext name="chara_name_area" layer="message0" color="white" size=28 bold=true x=180 y=510]

;上記で定義した領域がキャラクターの名前表示であることを宣言（これがないと#の部分でエラーになります）
[chara_config ptext="chara_name_area"]

;このゲームで登場するキャラクターを宣言
;akane
;[chara_new  name="akane" storage="chara/akane/normal.png" jname="あかね"  ]
;キャラクターの表情登録
;[chara_face name="akane" face="angry" storage="chara/akane/angry.png"]
;[chara_face name="akane" face="doki" storage="chara/akane/doki.png"]
;[chara_face name="akane" face="happy" storage="chara/akane/happy.png"]
;[chara_face name="akane" face="sad" storage="chara/akane/sad.png"]

;---
[iscript]
// 1. スタイル定義をheadに1回だけ追加
if ($('#floating-arrow-style').length === 0) {
  $('head').append(`
    <style id="floating-arrow-style">
      @keyframes float {
        0% { transform: translateY(0); }
        100% { transform: translateY(8px); }
      }
    </style>
  `);
}

// 2. 要素自体を追加
$("#insertcoin").remove();
$(".1_fore").append('<div id="insertcoin" style="color:white;"><div style="display: inline-block; font-size: 24px; color:white; animation: float 1s ease-in-out infinite alternate;">▼</div> INSERTCOIN</div>');
[endscript]
@layopt layer="1" visible="true"

#
（ふらっと立ち寄ったお店の一角に古びたゲーム台が置かれていた）[p]
へぇ、あまり見たことが無いゲームだな[p]
……………[p]
「コインを入れろ」としか出てこないけど？[p]
……
@wait time=700
ちょっとやってみるか[p]

;@playse storage=".mp3"
チャリン。[p]

;
;なまえをいれてください【ああああ】[OK]
;
[iscript]
$("#insertcoin").remove();
$("#name_aaa").remove();
const strhtml=`
<div id="name_aaa" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
  <p style="color:white;">なまえをいれてください【ああああ】</p>
</div>
`;
$(".1_fore").append(strhtml);
[endscript]
;@layopt layer="1" visible="true"

名前？[r]
「OK」ボタンしか無いぞ？

[s]

@chara_show name="minami"
#みなみ
[dekamoji]ようこそ！ああああ君！[resetfont][p]

わたし、【皆井出（みないで）みなみ】！[p]
趣味は読書！[r]
スリーサイズは…[p]

#俺
あれ…？[r]
み、皆井出さん…！？[p]

#みなみ:boxodrk
あれ？[r]
ああああ君じゃなくて…[p]

#俺
なんでこんなところに？[p]

#みなみ
こっちが聞きたい！[p]

#俺
じゃあ、スリーサイズ教えて[r]
前から知りたかったんだ♪[p]

;SE
@playse storage=""
@chara_hide name="minami" time=100

;▼INSERT COIN
#俺
[dekamoji]おいっ！[resetfont][p]

なんで皆井出さんが…[r]
気になるじゃないか…[p]

;@playse storage=".mp3"
チャリン。[p]

@chara_show name="minami"
#みなみ
[dekamoji]ああああ君、勝負しましょ！[resetfont][p]

#俺
だから俺の名前は…[r]
あ、あとスリーサイズ！[p]

#みなみ
…勝負[p]

#俺
わかったよ！[p]

#みなみ
それでは、衣装を購入してください♪[p]

#俺
買うのかよッ

[]











[s]