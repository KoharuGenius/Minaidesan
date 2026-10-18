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
    <span class="floating-arrow">▼</span> INSERT COIN
    `;
    disp_centertext(strhtml);
}

function disp_entername(){
    const strhtml=`
    なまえをいれてください：【ああああ】
    `;
    disp_centertext(strhtml);
}