*gamestart

[cm]
[clearfix]
[start_keyconfig]

;@bg storage="board.jpg" time=500
@bg storage="black.jpg" time=100
;メニューボタンの表示
@showmenubutton

@layopt layer="message0" visible="true"

@chara_show_minami

@eval exp="f.gamebusy = false"
@eval exp="disp_gameboard();"

@layopt layer="1" visible="true"

#みなみ
さあ、はじめましょう
*initgame
;[cm]
[iscript]
disp_insertcoin('Ready?');
disp_button();
[endscript]
*resumegame
[s]

;ゲーム中ロード時
*gameload
@eval exp="disp_insertcoin('');"
#
あれ？[p]

#みなみ
対戦中のゲームはリセットされるの

#
ロードしたときも百円入れるのかよ…[p]

チャリン。[p]

#みなみ
じゃあ再開ね！
@jump target="*initgame"

*gamecpuwin
[cm]
わーい勝ったー[p]
@jump target="*gameend"

*gameplayerwin
[cm]
あーあ負けちゃった…[p]
@jump target="*gameend"

*gamedraw
[cm]
引き分けだね[p]
@jump target="*gameend"

*gameend
次のゲームを始めるよ
[iscript]
disp_insertcoin('');
document.getElementById('insertcoin').classList.remove('hidden');
[endscript]
@jump target="*initgame"
[s]


