*gamestart

[cm]
[clearfix]
[start_keyconfig]

;メッセージウィンドウの設定
[position layer="message1" left=20 top=550 width=600 height=150 page="fore" visible="true"]

;文字が表示される領域を調整
[position layer="message1" page="fore" margint="45" marginl="50" marginr="70" marginb="60"]


@bg storage="board.jpg" time=500
@layopt layer="message1" visible="true"
@current layer="message1"

@chara_show name="minami" left=700 time=500

[eval exp="disp_gameboard();"]
[eval exp="disp_card();"]
@layopt layer="1" visible="true"

*initgame
さあ、はじめましょ♪
[eval exp="initGame();"]
*resumegame
[s]

*gamecpuwin
[cm]
わーい勝ったー
@jump target="*gameend"

*gameplayerwin
[cm]
あーあ負けちゃった…
@jump target="*gameend"

*gamedraw
[cm]
引き分けだね
@jump target="*gameend"

*gameend
[glink color="btn_07_white" text="NEXT GAME" width=420 target="*initgame" x=40 y=400 size=20]
[s]


