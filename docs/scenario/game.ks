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
[eval exp="f.pwin=2;"]
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
【台本】に書いてあるだけだから…っ！[p]

#
よぉし[r]
俺が勝っても【台本】どおりにしてくれよ[p]

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
さぁて、どんなお楽しみイベントを見せてくれるのかな♡[p]

#みなみ
あのっ…[p]

#
うんうん[p]

#みなみ
ああああ君と遊ぶの意外と楽しいかも！[p]

#
そうなの…？[p]
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
あっ…[p]
でも、あの♡を埋めるとイベントが…[p]

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
うんうん、ああああ君でもいいぞ[p]
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
アッー[p]
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
そんなことしなくても【同じ】じゃないのか？[p]

#みなみ
ちがうの！[r]
とにかく見ないで…[p]

#
わかったわかった[p]

#みなみ
いい？[r]
ちゃんと閉じた？

[choice text="閉じるわけない" target="*gamepwin3_a"]
[choice text="閉じるわけない" target="*gamepwin3_a"]
[choice text="閉じるわけない" target="*gamepwin3_a"]
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

#みなみ
………[p]

#
あのさぁ[p]
【好き】だったら、[r]
ホラ、もっとやることが…[p]

#みなみ
は…恥ずかしいっ！[p]

@chara_hide_minami
@eval exp="disp_insertcoin('');"

#
おいっ！[p]
INSERT したいのは COIN じゃなくってな…[p]
@jump target="*gamepwin_end"


;---
;4勝目
*gamepwin4
;---
#
ねえ、俺のこと好きなんだよね？[p]
だったらさ…[p]

#みなみ
うん、もっと一緒にいたいな…[p]

#
だよね？[p]

#みなみ
…【台本】読んでるだけだから！[p]

#
俺もセリフを【聞く】だけじゃなくって…[p]
もっと皆井出さんを…【見たい】[p]

#みなみ
見ないで…[p]

;
;@playse storage=""
@eval exp="disp_gamemenu('イベントモードに入りました');"

#
おっ♡[p]
どんなイベントかな～[p]

#みなみ
そんな…やめてっ！[r]
押さないで！
[choice text="ジャンプさせる" target="*gamepwin4_a"]
見ないでぇ…
[s]

*gamepwin4_a
#
そんなこと言われても押しちゃうよ～ん♪[p]
ポチっとな[p]
@eval exp="f.jumpn=0;"

*gamepwin4_a1
[cm]
ジャンプしてみろよ、おらっ！
;@playse storage=""
@quake count=1 vmax=150 time=1200
@eval exp="f.jumpn++";
#
@wait time=1000
[cm]
………[p]
画面ごとジャンプしなくてもいいんだけど…
[choice text="ジャンプ！" target="*gamepwin4_a1"]
[choice text="もうやめる" target="*gamepwin4_b"]
[s]

*gamepwin4_b

@chara_hide_minami
[iscript]
coin = "";
if(f.jumpn > 1){coin = " X" + String(f.jumpn);}
disp_insertcoin(coin);
[endscript]

#
あっ…[r]
後払いだったのかよ！[p]
いいだろう…払ってやる！[p]

@jump target="*gamepwin_end"


;---
;5勝目
*gamepwin5
;---
#
♡をコンプしたぞ！[p]
遂に【特別イベント】発動！[r]
…だよな？[p]

#みなみ
み、見ないで…[p]

#
ククク…それは【台本】の方に言うんだな[p]

#みなみ
ええっと…【台本】によると…[p]
………[p]
今晩は親が帰ってこないから…[p]

[dekamoji]も…もう、好きにしていいよ…[resetfont]
@wait time=500
[p]

#
…と言われても？[p]

#みなみ
男優がいないので、これ以上イベントシーンが進まないみたい…[p]

#
つまり、それって…[p]

#みなみ
そもそもR-18のゲームじゃないので【禁則事項】です[p]

#
これでおしまい！？[p]
どんだけ【100円玉】突っ込んだと思ってるんだよッ！[p]


;@playse storage=""
@quake count=4 vmax=120 time=800 wait=false
[dekamoji]バンッ！！！！[resetfont][p]
@wait time=1500

（思わず拳を振り上げて、殴りつけた）[p]

;peep peep!
;playse storage=""
@eval exp="disp_gamemenu('エラーを検知しました');"

！？！？[p]

@eval exp="disp_gamemenu('キャラクターとの契約を解除します');"

え？どういうこと？[p]

;
;ゲーム終了
;
@mask
#
[cm]
@laypot layer="1" visible="false"
@chara_hide name="minami"
@maskoff

#みなみ
あれ？[p]

#
皆井出さん！？[p]
どうしてここに？[p]

#みなみ
こっちが聞きたい！[p]

#
…目のやり場に困るんだが[p]

#みなみ
ちょ…ちょっと…[p]
やだぁ…[p]

#
ええっと…[p]
じゃ…じゃあ、また明日ね！[p]

#みなみ
だっ…だめぇっ！！[p]
[dekamoji]見ないでぇ！！[resetfont]
;@playse storage=""
;@bg storage="black.jpg" time=5000
[cm]
おしまい[r]
【戦績】&f.pwin 勝 &f.plose 敗
[glink text="メニューにもどる" target=""]
[s]




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


