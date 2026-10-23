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
[iscript]
disp_gameboard();
disp_insertcoin('Ready?');
disp_button();
[endscript]

@layopt layer="1" visible="true"

*initgame
[cm]
さあ、はじめましょう[r]
*resumegame
[s]

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


