*start

[cm]
[clearfix]
[start_keyconfig]


[bg storage="black.jpg" time="100"]
@layopt layer=message0 visible=true

;メニューボタンの表示
@showmenubutton

;---
;[eval exp="disp_insertcoin();"]
[eval exp="disp_gameboard();"]
[eval exp="disp_noise();"]
@layopt layer="0" visible="true"
@layopt layer="1" visible="true"

#
（ふらっと立ち寄ったお店の一角に古びたゲーム台が置かれていた）[p]
なんだこりゃ？[p]
……………[p]
「コインを入れろ」としか出てこないけど？[p]
ちょっとやってみるか[p]

;@playse storage=".mp3"
チャリン。[p]

;
;なまえをいれてください【ああああ】[OK]
;
@eval exp="disp_gamemenu('なまえをいれてください：【ああああ】');"
[glink color="btn_07_white" text="OK" width=100 target="*enter_game" x=260 y=320 size=20]
名前？[r]
「OK」ボタンしか無いぞ？
[s]

*enter_game
@chara_show_minami
#みなみ
[dekamoji]よ…ようこそ！ああああ君！[resetfont][p]

わたしは【皆井出（みないで）みなみ】です[p]
趣味は読書で…[p]

#
あれ…？[r]
み、皆井出さん…！？[p]

;#みなみ:boxodrk
#みなみ
あれ？[r]
ああああ君じゃなくて…[p]

#
なんでゲームの中に？[p]

#みなみ
こっちが聞きたい！[p]
……………[p]
何、ジロジロ見てるの？[p]

#
目のやり場に困るんだが…[p]

#みなみ
あっ………！[r]
[dekamoji]み、見ないでッ！[resetfont][p]

;SE
;@playse storage=""
@chara_hide_minami
@eval exp="disp_insertcoin('');"

#
[dekamoji]おいっ！[resetfont][p]

なんで皆井出さんが…[r]
気になるじゃないか！！[p]

;@playse storage=".mp3"
チャリン。[p]

@chara_show_minami
#みなみ
[dekamoji]ああああ君、勝負しましょ！[resetfont][p]

#
【ああああ君】って誰だよっ！[p]
知ってるだろ！俺の名前は…[p]

#みなみ
そんなこと勝負に関係あるの？[p]

#
……………[p]

#みなみ
【シナリオ】にそう書いてあるの[p]

#
へぇ【シナリオ】…[p]

俺が勝負に勝ったらどうなるの？[p]

#みなみ
ええっと【シナリオ】には……[p]

#みなみ
……………！！[p]

#みなみ
嘘でしょ！？[p]
無理無理無理無理！！[p]

@chara_hide_minami
@eval exp="disp_insertcoin('');"

#
[dekamoji]おいっ！[resetfont][p]
余計に気になるじゃないか！！[p]

;@playse storage=".mp3"
チャリン。[p]

@chara_show_minami
#みなみ
それでは、衣装を購入してください[p]

#
それは勝負に関係あるのか！[p]
……………っていうかさ、[p]
皆井出さん、今何着てるの？[p]

;照れ怒り
#みなみ
@quake count=3 time="800" vmax=120 wait=false
[dekamoji]いいから、買って！[resetfont]

#
わかったわかった…[p]

[choice text="でんせつのよろい　10G" target="*buycloth"]
[choice text="ぼうけんふく　30G" target="*buycloth"]
[choice text="あぶないみずぎ 10000G" target="*buycloth"]

どうして装備が薄い方が高いんだよ？
[s]

*buycloth
;NGブザー
;@playse
[cm]
@chara_hide_minami
@eval exp="disp_gamemenu('鋭意制作中につき<br/>衣装は実装されていません');"
@wait time=1000
#
なんかおかしくないか…このゲーム[p]

@eval exp="disp_gamemenu('でも続けたいですよね？');"
@wait time=1000
なん…だと…[p]

@eval exp="disp_insertcoin(' X99');"

;コイン投入SE
;@playse storage=".mp3"
[dekamoji]うおおおおおおお！！[resetfont][p]
チャリンチャリンチャリンチャリン[p]
チャリンチャリンチャリン……[p]

@chara_show_minami
#みなみ
ひどい…[p]
もうヤダよ…こんなの…[p]

#
【シナリオ】どおりなら[r]
衣装買っても、俺が勝てば同じだろ？[p]
さぁて、ここからどうなるかな？[p]

#みなみ
[dekamoji]見ないで…[resetfont][p]

#
[dekamoji]デュエルしようぜ！[resetfont][p]

; 勝利数初期化
[eval exp="f.pwin=0;"]
[eval exp="f.plose=0;"]

*beforegame
[choice text="ルールを確認する" target="*explain_rule"]
[choice text="勝負する" target="*gamestart" storage="game.ks"]
[s]

; =======================================
; ルール解説シナリオ
*explain_rule
; =======================================
[cm]
#みなみ
ルールを解説するね[p]

#みなみ
勝利条件はとてもシンプル[p]
場の３つの枠に、同じマークを３枚揃えた方の勝ち！[p]

#みなみ
デッキは全部で23枚、[r]
【〇・×・△・□】の基本マークが各5枚ずつ[p]
それに特殊カードが混ざってるよ[p]

#みなみ
【☆】が一枚、これは万能カード[p]
どのマークの代わりにもなっちゃう最強のカードなんだ[p]

#みなみ
【S】スキップカードは２枚[p]
場を変えずに自分の番をやり過ごせる、駆け引き用のカードだよ[p]

#みなみ
手札は基本的に２枚ずつ[p]
一枚場に置いたら、山札から一枚補充して交替[p]

カードの置き方には、たった1つだけ大切なルールがあるの[p]
それは……【すでに置いてあるマークと同じマークは重ねられない】こと！[p]
例えば、【△の上に△は置けない】の。覚えておいてね[p]

#みなみ
画面の下には、今まで出たカードの枚数が表示されてるよ[p]

#みなみ
山札や相手の手札に何が残ってるか……[p]
しっかりカウントしながらプレイするのが勝利のコツなんだ！[p]

#みなみ
ルールはこれだけ！準備はいい？[p]
@jump target="*beforegame"

[s]