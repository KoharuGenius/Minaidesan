;一番最初に呼び出されるファイル

[title name="ティラノスクリプト解説"]

[stop_keyconfig]


;ティラノスクリプトが標準で用意している便利なライブラリ群
;コンフィグ、CG、回想モードを使う場合は必須
@call storage="tyrano.ks"

;ゲームで必ず必要な初期化処理はこのファイルに記述するのがオススメ
[loadjs storage="mymodule.js"]
[loadcss file="./data/others/custom.css"]

;for charactor
[chara_new name="minami" storage="./chara/box_normal.png" jname="みなみ"]

;[chara_face name="nozomi" face="eee" storage="./chara/nzmeee.png"]

; popopo設定　少しポップで明るい印象（三角波）
[popopo type="none"]
[popopo type="triangle" frequency="E" octave="1" noplaychars="…、。！？" chara="のぞみ"]

;****Macro Define
[macro name="choice"]
    [glink color="btn_06_yellow" size="24" width="600" text=%text target=%target]
[endmacro]

[macro name="dekamoji"]
    [font size="40" bold="true"]
[endmacro]

;メッセージボックスは非表示
@layopt layer="message" visible=false

;最初は右下のメニューボタンを非表示にする
[hidemenubutton]

;タイトル画面へ移動
@jump storage="title.ks"

[s]


