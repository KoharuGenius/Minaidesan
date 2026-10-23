;このファイルは削除しないでください！
;
;make.ks はデータをロードした時に呼ばれる特別なKSファイルです。
;Fixレイヤーの初期化など、ロード時点で再構築したい処理をこちらに記述してください。
;
;

[if exp="f.gamebusy = false"]
@return
[endif]

@eval exp="disp_insertcoin('');"

#
あれ？[p]
ロードしたときも百円入れるのかよ！[p]
チャリン。[p]

#みなみ
じゃあ再開ね！

[iscript]
disp_insertcoin("READY?");
disp_button();
[endscript]

;make.ks はロード時にcallとして呼ばれるため、return必須です。
[return]

