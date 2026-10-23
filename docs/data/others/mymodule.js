//
//
function disp_centertext(disptxt){
    $(".center-container").remove();
    const strhtml=`
    <div class="center-container">
    ${disptxt}
    </div>
    `;
    $(".1_fore").append(strhtml);
}

function disp_insertcoin(){
    const strhtml=`
    <p><span class="floating-arrow">▼</span> INSERT COIN</p>
    `;
    disp_centertext(strhtml);
}

//function disp_entername(){
//    const strhtml=`
//    なまえをいれてください：【ああああ】
//    `;
//    disp_centertext(strhtml);
//}


function disp_card(){
    const strhtml=`
  <div class="card-container">
    <!-- 薄い下地枠線 -->
    <div class="border-base"></div>
    
    <!-- 枠線上を周回する彗星点（1つ目） -->
    <div class="comet-dot"></div>

    <!-- 枠線上を周回する彗星点（2つ目） -->
    <div class="comet-dot comet-dot-2"></div>
    
    <!-- ガラスカード本文 -->
    <div class="glass-card">
      <h2>Glassmorphism Card</h2>
      <p>Comet border animation effect</p>
    </div>
  </div>
  `;
    $("#glassbox").remove();
    $(".1_fore").append(`<div id="glassbox" style="position:absolute;top:100px;left:700px;width:500px;"></div>`);
    $("#glassbox").append(strhtml);
    $("#glassbox").append(strhtml);
    $("#glassbox").append(strhtml);

}