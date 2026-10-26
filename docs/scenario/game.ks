[cm]
[clearfix]
[start_keyconfig]

;@bg storage="board.jpg" time=500
@bg storage="black.jpg" time=100
;メニューボタンの表示
@showmenubutton

@layopt layer="message0" visible="true"

@eval exp="disp_gameboard();"
@layopt layer="1" visible="true"

@chara_show_minami

*gamestart
@eval exp="f.gamebusy = false"
#みなみ
さあ、はじめましょう
*initgame
;[cm]
[iscript]
disp_menufloating("READY?");
disp_button();
[endscript]
*resumegame
[s]

;ゲーム中ロード時
*gameload
@eval exp="disp_insertcoin('');"
[cm]
#
あれ？[p]

#みなみ
対戦中のゲームはリセットされるの[p]

#
ロードしたときも百円入れるのかよ…[p]
[charin]

#みなみ
じゃあ再開ね！
@jump target="*initgame"


; プレイヤー勝利
*gameplayerwin
[cm]
#
[dekamoji]おっしゃあ！[resetfont][p]

#みなみ
あーあ負けちゃった…[p]
@jump target="*gameend"


; プレイヤー負け
*gamecpuwin
[cm]
#みなみ
わーい勝ったー[p]
@jump target="*gameend"

; 引き分け
*gamedraw
[cm]
#みなみ
引き分けだね[p]
@jump target="*gameend"

; ゲーム終了時共通処理
; 次のゲームへ
*gameend
次のゲームを始めるよ
@jump target="*initgame"

;対戦中リアクション
*gamecallreach
[cm]
#みなみ
リーチ！これはどうかな？
@jump target="*resumegame"



[s]


