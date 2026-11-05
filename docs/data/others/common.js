function appendCustomlayer(){
  const strhtml=`<div id="custumlayer">
  <div id="gameboard_root"></div>
  </div>`;

  $("#custumlayer").remove();
  $(".1_fore").append(strhtml);
}

function disp_gamemenu(strtxt){
  const strhtml = `<p id="gamemenu-title">${strtxt}</p>`;
  if (document.getElementById('gamemenu') === null) {
    const newel = document.createElement('div');
    newel.id = "gamemenu";
    document.getElementById('game-container').append(newel);  
  }
  const gamemenu = document.getElementById('gamemenu');
  gamemenu.innerHTML = strhtml;
  gamemenu.classList.remove('hidden');
}

function disp_insertcoin(strtxt){
    const strhtml=`
    <span class="floating-arrow">▼</span> INSERT COIN${strtxt}
    `;
  disp_gamemenu(strhtml);
}

function disp_menufloating(strtxt){
  const strhtml=`
    <span class="floating-arrow">${strtxt}</span>
    `;
  disp_gamemenu(strhtml);
}

// ノイズ表示
// レイヤー1に表示される    
function disp_noise(){
  const strhtml=`
  <div id="noise-container" style="position:absolute; top:30px; left:830px;">
  <div class="noise-container">
    <div class="noise-layer"></div>
    <div class="noise-overlay"></div>
  </div>
  </div>
  `;
  $("#gamingrect").remove();
  $("#noise-container").remove();
  $("#custumlayer").append(strhtml);
}

// 虹色矩形表示
// レイヤー1に表示される
function disp_gamingrect(){
  const strhtml=`
  <div id="gamingrect" style="position:absolute; left:870px; top:385px;">
  <div class="rainbow-box-wrapper">
    <div class="rainbow-box"></div>
    <div class="rainbow-box-bokashi"></div>
  </div>
  </div>
  `;
  $("#noise-container").remove();
  $("#gamingrect").remove();
  $("#custumlayer").append(strhtml);
}

// キャラクター背景表示
// レイヤー0    
function disp_charawindow(){
  const strhtml=`
  <div id="chara-box" style="position:absolute; top:20px; left:820px;">
  <div id="chara-window" class="chara-window">
    <div class="particle-bg"></div>
  </div>
  </div>
  `;
  $("#chara-box").remove();
  $(".0_fore").append(strhtml);
}

// キャラクター勝利背景
// レイヤー0
function disp_minamiwin(){
  const strhtml=`
    <div class="victory-layer">
      <div class="sunburst-halo"></div>
      <div class="sunburst-rays"></div>
    </div>
  `;
  document.getElementById("chara-window").innerHTML = strhtml;
}