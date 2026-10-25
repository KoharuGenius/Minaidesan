;一番最初に呼び出されるファイル

[title name="Minaide"]

[stop_keyconfig]


;ティラノスクリプトが標準で用意している便利なライブラリ群
;コンフィグ、CG、回想モードを使う場合は必須
@call storage="tyrano.ks"

;ゲームで必ず必要な初期化処理はこのファイルに記述するのがオススメ
;[loadjs storage="mymodule.js"]
[loadcss file="./data/others/custom.css"]
[loadjs storage="game.js"]
[loadcss file="./data/others/game.css"]

;for charactor
[chara_new name="minami" storage="./chara/mnmnormal.png" jname="みなみ"]

;[chara_face name="nozomi" face="eee" storage="./chara/nzmeee.png"]

; popopo設定　少しポップで明るい印象（三角波）
[popopo type="none"]
[popopo type="triangle" frequency="E" octave="1" noplaychars="…、。！？" chara="みなみ"]

;メッセージウィンドウの設定
[position layer="message0" left=0 top=550 width=800 height=150 page=fore visible=true]

;文字が表示される領域を調整
[position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]


;メッセージウィンドウの表示
;@layopt layer=message0 visible=true

;キャラクターの名前が表示される文字領域
[ptext name="chara_name_area" layer="message0" color="white" size=28 bold=true x=20 y=560]

;上記で定義した領域がキャラクターの名前表示であることを宣言（これがないと#の部分でエラーになります）
[chara_config ptext="chara_name_area"]


;****Macro Define
[macro name="choice"]
    [glink color="btn_06_yellow" size="24" width="600" text=%text target=%target]
[endmacro]

[macro name="dekamoji"]
    [font size="40" bold="true"]
[endmacro]

[macro name="chara_hide_minami"]
@chara_hide name="minami" time=100
@eval exp="disp_noise();"
@eval exp="disp_insertcoin('');"
[endmacro]

[macro name="chara_show_minami"]
@eval exp="$('.noise-container').remove();"
@chara_show name="minami" left=820 width=400 height=720 time=500
[endmacro]

;メッセージボックスは非表示
@layopt layer="message" visible=false

;最初は右下のメニューボタンを非表示にする
[hidemenubutton]

;タイトル画面へ移動
@jump storage="title.ks"

[s]
