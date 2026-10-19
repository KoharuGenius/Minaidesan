*start

[cm]
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


;---
[eval exp="disp_insertcoin();"]
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
[eval exp="disp_entername();"]
;@layopt layer="1" visible="true"

名前？[r]
「OK」ボタンしか無いぞ？

[glink color="btn_07_white" text="OK" width=100 target="*enter_game" y=400 size=20]

[s]

*enter_game
@layopt layer="1" visible="false"
@chara_show name="minami"
#みなみ
[dekamoji]よ…ようこそ！ああああ君！[resetfont][p]

わたしは【皆井出（みないで）みなみ】です[p]
趣味は読書で、[r]
スリーサイズは…[p]

#俺
あれ…？[r]
み、【皆井出さん】…！？[p]

;#みなみ:boxodrk
#みなみ
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
;@playse storage=""
@chara_hide name="minami" time=100

;▼INSERT COIN
[eval exp="disp_insertcoin();"]
@layopt layer="1" visible="true"
#俺
[dekamoji]おいっ！[resetfont][p]

なんで【皆井出さん】がゲームの中に…[r]
気になるじゃないか…[p]

;@playse storage=".mp3"
チャリン。[p]

@layopt layer="1" visible="false"
@chara_show name="minami"
#みなみ
[dekamoji]【ああああ君】、勝負しましょ！[resetfont][p]

#俺
だから俺の名前は…[r]
あ、あとスリーサイズ！[p]

#みなみ
そんなこと勝負に関係あるの？[p]

#俺
……………[r]
自分で言いかけてなかったっけ？[p]

#みなみ
【台本】にはあるけど[r]
【ああああ君】には言わない！[p]

#俺
だから俺は、[r]
【ああああ君】じゃなくって…[p]

#みなみ
それでは、衣装を購入してください[p]

#俺
それは勝負に関係あるのか！[p]
……………えっと、[p]
そういえば、【皆井出さん】[r]
今、何着てるの？[p]

;照れ怒り
#みなみ
@quake count=3 time="800" vmax=120 wait=false
[dekamoji]いいから、買って！[resetfont]



[s]











[s]