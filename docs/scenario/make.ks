;このファイルは削除しないでください！
;
;make.ks はデータをロードした時に呼ばれる特別なKSファイルです。
;Fixレイヤーの初期化など、ロード時点で再構築したい処理をこちらに記述してください。
;
;

;ゲーム中データのロードか？
[if exp="f.gamebusy"]
[iscript]
disp_gamemenu("ゲーム中のデータが<br/>ロードされました");
[endscript]
[glink color="btn_07_white" text="OK" width=100 target="*gameload" storage="game.ks" x=350 y=330 size=20]
@eval exp="f.gamebusy = false"
[endif]
;make.ks はロード時にcallとして呼ばれるため、return必須です。
[return]

