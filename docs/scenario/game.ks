[cm]
[clearfix]
[start_keyconfig]

;--- [S]For Debug
@bg storage="black.jpg" time=100
;メニューボタンの表示
@showmenubutton

@layopt layer="message0" visible="true"

@eval exp="disp_gameboard();"
@layopt layer="1" visible="true"

@chara_show_minami

; 勝利数初期化
[eval exp="f.pwin=0;"]
[eval exp="f.plose=0;"]
;--- [E]For Debug

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
[dekamoji]っしゃあ！！[resetfont][p]

#みなみ
あーあ負けちゃった…[p]

;この先は勝利数に応じてイベントが発生する
[iscript]
f.pwin++;
heart = "EVENT<br/>";
for(i=0; i < 5; i++){
    if(i < f.pwin){heart += "♥";}
    else{heart += "♡";}
}
disp_gamemenu(heart);
tf.target = "*gamepwin" + String(f.pwin);  
[endscript]

@jump target = &tf.target

;---
; プレイヤー負け
*gamecpuwin
;---
[cm]
#みなみ
わーい勝ったー[p]

[iscript]
tf.messages = ["ざぁこ、ざぁこ♪","手加減してくれた？…あ、違うの？",
"私に勝とうなんて100年早いわっ♪",
"もっと努力したら～？…無駄だけどね♪",
"わたしって、天才かも！",
"100円玉積んでこようか、ヒジの高さまで…！"];
tf.selected = tf.messages[Math.floor(Math.random() * tf.messages.length)];
[endscript]
[emb exp="tf.selected"][p]

#
皆井出さんって、そういうキャラだったんだ…[p]

#みなみ
【シナリオ】に書いてあるだけだから…っ！[p]

#
よぉし[r]
俺が勝っても【シナリオ】どおりにしてくれよ[p]

#みなみ
そ…それは…[p]

;敗戦数をカウントします
[iscript]
f.plose++;
coin = "";
if(f.plose > 1){coin = " X" + String(f.plose);}
disp_insertcoin(coin);
[endscript]

#
[emb exp="f.plose"]敗か…[r]
続行だ…！[p]
[charin]
@jump target="*gameend"

;---
; 引き分け
*gamedraw
;---
[cm]
#みなみ
引き分けだね[p]
@jump target="*gameend"

;---
; ゲーム終了時共通処理
; 次のゲームへ
*gameend
;---
次のゲームを始めるよ
@jump target="*initgame"

;---
;対戦中リアクション

;[Reach]
*gamecallreach
;---
[cm]
[iscript]
tf.messages = ["これはどうかな？","大丈夫かな？","ドキドキ…"];
tf.selected = tf.messages[Math.floor(Math.random() * tf.messages.length)];
[endscript]

#みなみ
リーチ！[emb exp="tf.selected"]
@jump target="*resumegame"


;---
; 勝利時のイベント
;---
;１勝目
*gamepwin1
;---
#
さあ、どんなお楽しみイベントを見せてくれるのかな♡[p]

#みなみ
あのっ…[p]

#
うんうん[p]

#みなみ
ああああ君と遊ぶの意外と楽しいかも！[p]

#
えっ…？[p]
っていうか、俺の名前は…[p]

#みなみ
これ…【台本】だから！[p]

#
そのセリフだけ？[p]

#みなみ
言わされてるだけだしっ！[p]

#
ホラ、なんていうか[r]
もっと…こう、あるだろうが！[p]

@chara_hide_minami
@eval exp="disp_insertcoin('');"

#
あっ…もしかしたら、あの♡を埋めるとイベントが…[p]

@jump target="*gamepwin_end"

;---
;２勝目
*gamepwin2
;---
#
さあ、今度こそ…[p]

#みなみ
あっ、あのさ…[p]
[dekamoji]私、ああああ君のこと…[resetfont][p]

#
ヨシ！ああああ君でもいいぞ[p]
俺のことだな？[p]

#みなみ
あのっ、そのっ…[p]
やだぁ…
@wait time=500
なにこの【台本】…[p]

#
いいから、いいから♪[p]
くるしゅうない！続けて続けて♡[p]

@chara_hide_minami
@eval exp="disp_insertcoin('');"

#
そんなのありかよっ…[p]
@jump target="*gamepwin_end"

;---
;３勝目
*gamepwin3
;---
#
よぉし、BGMも始まったぞ[p]
どーなるのかなっ♡[p]

#みなみ
そっ、そんなに見つめないで…[p]

#
そんなこと言われてもムリだよ[p]

#みなみ
でも…今度は目を閉じていてほしいの[p]

#
そんなことしなくても同じじゃないのか？[p]

#みなみ
だめぇ…！見ないで…[p]

#
わかったわかった[p]

#みなみ
いい？[r]
ちゃんと閉じた？

[choice text="閉じるわけない" taget="*gamepwin3_a"]
[choice text="閉じるわけない" taget="*gamepwin3_a"]
[choice text="閉じるわけない" taget="*gamepwin3_a"]
[s]

*gamepwin3_a
#
（こんなの一択だろが！）[p]

#みなみ
えーと【台本】には…[p]

#
おぅ、あくしろよ！[p]

#みなみ
[dekamoji]す・[l]き♡[resetfont]
@wait time=500
[p]

#
………[p]

#みなみ
だっ、【台本】だからねっ！[r]
あくまでも…[p]

#
それだけ…？[p]

あのさぁ[p]
【好き】だったら、[r]
ホラ、もっとやることが…[p]

#みなみ
は…恥ずかしいっ！[p]

@chara_hide_minami
@eval exp="disp_insertcoin('');"

#
おいっ！[p]
COIN を INSERT するんじゃなくってな…[p]
@jump target="*gamepwin_end"











;---
;ゲーム勝利時共通
*gamepwin_end
;---
[charin]
@chara_show_minami

#みなみ
もぅやめようよぉ…[p]

#
さあ、続行だ！[p]
震えるがいい…[r]
…っていうか、皆井出さん寒くない？[p]

#みなみ
だから、見ないでぇ…[p]

@jump target="*gameend"
[s]


