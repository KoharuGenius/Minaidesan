function appendCustomlayer(){
  const strhtml=`<div id="custumlayer"></div>`;

  $("#custumlayer").remove();
  $(".1_fore").append(strhtml);
}

function disp_gameboard(){
const strhtml=`
  <div id="game-container">
    <header>
      <div class="title-group">
        <h1>LEAD REACH!</h1>
        <!-- <span class="sub-tag">vs CPU</span> -->
      </div>
      <div class="header-controls">
        <div id="turn-badge" class="turn-badge">P1 TURN</div>
        <button id="btn-reset-game" class="btn-reset" onclick="initGame()">RESET</button>
      </div>
    </header>

    <!-- 通常対戦ビュー -->
    <div id="play-view" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; margin-top: 8px;">
      <!-- メッセージバー -->
      <div id="message-bar" class="message-bar">手札のカードを選んでください</div>

      <!-- 場 (3枠) -->
      <div class="field-area">
        <div class="section-label">
          <span>FIELD (2 - 3 CARDS)</span>
          <span>DECK: <span id="deck-count">0</span></span>
        </div>
        <div class="card-slot-group" id="field-slots"></div>
      </div>

      <!-- 手札 -->
      <div class="hand-area">
        <div class="section-label">
          <span id="hand-label">PLAYER 1 HAND</span>
          <span>SELECT & PLAY</span>
        </div>
        <div class="card-slot-group" id="hand-slots"></div>
      </div>

      <!-- 出現カードカウンター (公開情報) -->
      <div class="tracker-area">
        <div class="section-label">EXPOSED CARDS COUNTER</div>
        <div class="tracker-grid" id="tracker-grid"></div>
      </div>
    </div>

    <!-- ゲーム終了時のオーバーレイ -->
    <div id="overlay" class="overlay hidden">
      <div id="overlay-title" class="overlay-title">ああああ Win!</div>
    </div>

    <!-- リーチカットイン演出用要素 -->
    <div id="reach-cutin" class="reach-cutin hidden">
      <!-- <div class="reach-bg-lines"></div> -->
      <div class="reach-banner">⚡ REACH! ⚡</div>
    </div>

    <!-- INSERT COIN -->
    <div id="gamemenu" class="gamemenu">
    <p class="gamemenu-title"><span class="floating-arrow">▼</span> INSERT COIN</p>
    </div>
  </div>
  `;
  $("#game-container").remove();
  $("#custumlayer").append(strhtml);
  //$(".fix").append(strhtml);
}

function disp_gamemenu(strtxt){
  const strhtml = `<p class="gamemenu-title">${strtxt}</p>`;
  document.getElementById('gamemenu').innerHTML = strhtml;
  document.getElementById('gamemenu').classList.remove('hidden');
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


function disp_button(){
    const strhtml=`
    <div><button class="btn-main" onclick="initGame();">START!</button></div>
    `;
    $(".btn-main").remove();
    $("#gamemenu").append(strhtml);
}

const SYMBOLS = ['〇', '×', '△', '□'];
const TOTAL_COUNTS = { '〇': 5, '×': 5, '△': 5, '□': 5, '☆': 1, 'S': 2 };

let deck = [];
let graveyard = [];
let field = [null, null, null];
let hands = { 1: [], 2: [] };
let currentPlayer = 1;
let selectedHandIndex = null;
let gameOver = false;
    
const cpuPlayer = 2; // CPUは常にP2
let isActionInProgress = false;

function initGame() {
  TYRANO.kag.stat.f.gamebusy = true;
  gameOver = false;
  isActionInProgress = false;
  graveyard = [];
  selectedHandIndex = null;
  document.getElementById('gamemenu').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');

  //const cutin = document.getElementById('reach-cutin');
  //if (cutin) cutin.classList.add('hidden');
  
  // 先手後手ランダム決定
  currentPlayer = Math.random() < 0.5 ? 1 : 2;

  // デッキ生成 (23枚)
  deck = [];
  SYMBOLS.forEach(s => { for (let i = 0; i < 5; i++) deck.push(s); });
  deck.push('☆');
  deck.push('S', 'S');
  shuffle(deck);

  // 初期状態：場に異なる2枚の図柄をセット（3枠目は null）
  field = [null, null, null];
  let initialPool = [...SYMBOLS];
  shuffle(initialPool);
  
  for (let i = 0; i < 2; i++) {
    const symbol = initialPool[i];
    field[i] = symbol;
    const idx = deck.indexOf(symbol);
    if (idx !== -1) deck.splice(idx, 1);
  }

  // 手札を各2枚配る
  hands[1] = [drawCard(), drawCard()].filter(Boolean);
  hands[2] = [drawCard(), drawCard()].filter(Boolean);
  const startName = currentPlayer === 1 ? "ああああ" : "みなみ";

  setMessage(`ゲーム開始。${startName} のターンです`);
  render();

  checkCpuTurn();
}

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    function drawCard() {
      return deck.length > 0 ? deck.pop() : null;
    }

    function selectHandCard(index) {
      if (gameOver || isActionInProgress || currentPlayer === cpuPlayer) return;

      selectedHandIndex = (selectedHandIndex === index) ? null : index;
      if (selectedHandIndex !== null) {
        const card = hands[currentPlayer][selectedHandIndex];
        if (card === 'S') {
          setMessage("場の任意の枠をクリックして スキップ(S) を使用してください");
        } else {
          setMessage("カードを配置・更新する場の枠をクリックしてください");
        }
      } else {
        setMessage("手札のカードを選んでください");
      }
      render();
    }

    function playToField(slotIndex) {
      if (gameOver || isActionInProgress || selectedHandIndex === null || currentPlayer === cpuPlayer) return;

      const playedCard = hands[currentPlayer][selectedHandIndex];

      if (playedCard === 'S') {
        executeSkipMove(selectedHandIndex, true);
        return;
      }

      executeMove(selectedHandIndex, slotIndex);
    }

    function executeSkipMove(handIndex, isPlayer) {
      isActionInProgress = true;
      hands[currentPlayer].splice(handIndex, 1);
      graveyard.push('S');
      selectedHandIndex = null;
      
      const pName = isPlayer ? "ああああ" : "みなみ";
      setMessage(`${pName} は スキップ(S) を出しました`);

      animateSkip(isPlayer, () => {
        isActionInProgress = false;
        endTurn();
      });
    }

    function animateSkip(isPlayer, callback) {
      const slots = document.querySelectorAll('#field-slots .card');
      const targetSlot = slots[1];

      if (!targetSlot) {
        callback();
        return;
      }

      const originalText = targetSlot.textContent;
      const originalClass = targetSlot.className;
      const highlightClass = isPlayer ? 'highlight-player' : 'highlight-cpu';

      targetSlot.textContent = 'S';
      targetSlot.className = `card field-card ${highlightClass}`;

      setTimeout(() => {
        targetSlot.textContent = originalText;
        targetSlot.className = originalClass;
        callback();
      }, 800);
    }

    function executeMove(handIndex, slotIndex) {
      const playedCard = hands[currentPlayer][handIndex];
      const targetCard = field[slotIndex];

      if (targetCard !== null && playedCard !== '☆' && playedCard === targetCard) {
        setMessage("【ルール違反】同じ図柄の上には置けません");
        return false;
      }

      isActionInProgress = true;

      hands[currentPlayer].splice(handIndex, 1);
      if (targetCard !== null) {
        graveyard.push(targetCard);
      }
      field[slotIndex] = playedCard;
      selectedHandIndex = null;

      render();

      const isPlayer = (currentPlayer !== cpuPlayer);
      highlightSlot(slotIndex, isPlayer, () => {
        isActionInProgress = false;

        if (checkWin(field)) {
          render();
          const winnerName = isPlayer ? "ああああ" : "みなみ";
          const target = (winnerName=="ああああ")? "*gameplayerwin":"*gamecpuwin";
          showEndGame(`${winnerName} WIN`, `三枚の図柄が揃いました！`,target);
          gameOver = true;
          return;
        }

        if (isReachState(field)) {
          triggerReachCutin();
          //ティラノスクリプトの演出
          if(!isPlayer){
            TYRANO.kag.ftag.startTag("jump",{target:"*gamecallreach"});
          }
        }

        endTurn();
      });

      return true;
    }

    function highlightSlot(slotIndex, isPlayer, callback) {
      const slots = document.querySelectorAll('#field-slots .card');
      const targetSlot = slots[slotIndex];

      if (!targetSlot) {
        callback();
        return;
      }

      const highlightClass = isPlayer ? 'highlight-player' : 'highlight-cpu';
      targetSlot.classList.add(highlightClass);

      setTimeout(() => {
        targetSlot.classList.remove(highlightClass);
        callback();
      }, 800);
    }

    function triggerReachCutin() {
      const cutin = document.getElementById('reach-cutin');
      if (!cutin) return;

      // hidden を外して表示
      cutin.classList.remove('hidden');

      // 一定時間（900ms）後に hidden を付与して隠す
      setTimeout(() => {
        cutin.classList.add('hidden');
      }, 900);
    }

    function checkWin(targetField) {
      if (targetField.some(s => s === null)) return false;

      const nonWilds = targetField.filter(s => s !== '☆');
      if (nonWilds.length === 0) return true;
      const first = nonWilds[0];
      return nonWilds.every(s => s === first);
    }

    function isReachState(targetField) {
      const filledCards = targetField.filter(s => s !== null);
      if (filledCards.length < 2) return false;

      if (filledCards.length === 3) {
        const nonWilds = targetField.filter(s => s !== '☆');
        if (nonWilds.length <= 1) return true;
        return nonWilds[0] === nonWilds[1] || nonWilds[1] === nonWilds[2] || nonWilds[0] === nonWilds[2];
      }

      if (filledCards.length === 2) {
        const nonWilds = filledCards.filter(s => s !== '☆');
        if (nonWilds.length <= 1) return true;
        return nonWilds[0] === nonWilds[1];
      }

      return false;
    }

    function endTurn() {
      if (deck.length > 0) {
        const drawn = drawCard();
        if (drawn) hands[currentPlayer].push(drawn);
      }

      if (deck.length === 0 && hands[1].length === 0 && hands[2].length === 0) {
        render();
        showEndGame("DRAW GAME", "山札と手札が無くなりました。引き分けです","*gamedraw");
        gameOver = true;
        return;
      }

      currentPlayer = currentPlayer === 1 ? 2 : 1;
      const pName = (currentPlayer === cpuPlayer) ? "みなみ" : "ああああ";
      setMessage(`${pName} のターンです`);
      render();

      checkCpuTurn();
    }

    function checkCpuTurn() {
      if (!gameOver && currentPlayer === cpuPlayer) {
        isActionInProgress = true;
        setMessage("みなみ考え中…");
        render();
        setTimeout(playCpuTurn, 600);
      }
    }

    function getBestMove(pHand, pField, pGraveyard) {
      let candidateMoves = [];

      for (let hIdx = 0; hIdx < pHand.length; hIdx++) {
        const card = pHand[hIdx];

        if (card === 'S') {
          candidateMoves.push({ type: 'SKIP', handIndex: hIdx, score: 0 });
          continue;
        }

        for (let slot = 0; slot < 3; slot++) {
          const targetCard = pField[slot];
          
          if (targetCard !== null && card !== '☆' && card === targetCard) continue;

          const simField = [...pField];
          simField[slot] = card;

          let score = 0;

          if (checkWin(simField)) {
            score = 10000;
          } else {
            const exposed = [...simField.filter(Boolean), ...pGraveyard, ...pHand];
            const wasEmpty = pField[slot] === null;

            if (isReachState(simField)) {
              let remainingWinningCards = 0;
              const nonWilds = simField.filter(s => s !== null && s !== '☆');
              const neededSymbol = nonWilds.length > 0 ? nonWilds[0] : null;

              if (neededSymbol) {
                const exposedCount = exposed.filter(c => c === neededSymbol).length;
                remainingWinningCards += Math.max(0, TOTAL_COUNTS[neededSymbol] - exposedCount);
              }
              const starExposed = exposed.filter(c => c === '☆').length;
              remainingWinningCards += Math.max(0, TOTAL_COUNTS['☆'] - starExposed);

              score -= (250 + remainingWinningCards * 80);
            }

            if (card === '☆') {
              score -= 800;
            }

            if (!isReachState(simField) && card !== '☆') {
              score += 100;
              if (wasEmpty) score += 50;
            }
          }

          candidateMoves.push({ type: 'PLAY', handIndex: hIdx, slotIndex: slot, score: score });
        }
      }

      const skipMove = candidateMoves.find(m => m.type === 'SKIP');
      if (skipMove) {
        const playMoves = candidateMoves.filter(m => m.type === 'PLAY');
        const hasSafePlay = playMoves.some(m => m.score >= 0);
        if (!hasSafePlay) {
          skipMove.score = 150;
        } else {
          skipMove.score = -100;
        }
      }

      if (candidateMoves.length === 0) return null;

      candidateMoves.sort((a, b) => b.score - a.score);
      const topScore = candidateMoves[0].score;
      const topMoves = candidateMoves.filter(m => m.score === topScore);
      return topMoves[Math.floor(Math.random() * topMoves.length)];
    }

    function playCpuTurn() {
      if (gameOver) {
        isActionInProgress = false;
        return;
      }

      const bestMove = getBestMove(hands[cpuPlayer], field, graveyard);

      if (bestMove) {
        if (bestMove.type === 'SKIP') {
          executeSkipMove(bestMove.handIndex, false);
        } else if (bestMove.type === 'PLAY') {
          executeMove(bestMove.handIndex, bestMove.slotIndex);
        }
      } else {
        isActionInProgress = false;
        endTurn();
      }
    }

    function setMessage(msg) {
      document.getElementById('message-bar').textContent = msg;
    }

    function showEndGame(title, desc, target) {
      document.getElementById('overlay-title').textContent = title;
      //document.getElementById('overlay-desc').textContent = desc; 
      document.getElementById('overlay').classList.remove('hidden');
      //ティラノスクリプトを動かす！
      TYRANO.kag.stat.f.gamebusy = false;
      TYRANO.kag.ftag.startTag("jump",{target:target});
    }

    function render() {
      const badge = document.getElementById('turn-badge');
      const pName = (currentPlayer === cpuPlayer) ? "みなみ" : "ああああ";
      badge.textContent = `${pName} TURN`;

      document.getElementById('deck-count').textContent = deck.length;

      const handLabel = (currentPlayer === cpuPlayer) ? "みなみ HAND" : "ああああ HAND";
      document.getElementById('hand-label').textContent = handLabel;

      // 場の描画
      const fieldSlots = document.getElementById('field-slots');
      fieldSlots.innerHTML = '';
      const isReach = isReachState(field);

      field.forEach((symbol, idx) => {
        const card = document.createElement('div');
        if (symbol === null) {
          card.className = `card slot-empty ${isReach ? 'reach-pulse' : ''}`;
          card.textContent = '+';
        } else {
          card.className = `card field-card ${isReach ? 'reach-pulse' : ''}`;
          card.textContent = symbol;
        }
        card.onclick = () => playToField(idx);
        fieldSlots.appendChild(card);
      });

      // 手札の描画
      const handSlots = document.getElementById('hand-slots');
      handSlots.innerHTML = '';
      hands[currentPlayer].forEach((symbol, idx) => {
        const card = document.createElement('div');
        const isSelected = selectedHandIndex === idx;
        card.className = `card hand-card ${isSelected ? 'selected' : ''}`;
        
        if (currentPlayer === cpuPlayer) {
          card.textContent = '・';
          card.style.opacity = '0.7';
        } else {
          card.textContent = symbol;
        }

        card.onclick = () => selectHandCard(idx);
        handSlots.appendChild(card);
      });

      // 出現カードカウンター
      const exposedCards = [...field.filter(Boolean), ...graveyard];
      const trackerGrid = document.getElementById('tracker-grid');
      trackerGrid.innerHTML = '';

      const allSymbols = [...SYMBOLS, '☆', 'S'];
      allSymbols.forEach(type => {
        const count = exposedCards.filter(c => c === type).length;
        const total = TOTAL_COUNTS[type];
        const item = document.createElement('div');
        item.className = 'tracker-item';
        item.innerHTML = `<span class="tracker-symbol">${type}</span>${count}/${total}`;
        trackerGrid.appendChild(item);
      });
    }

function disp_noise(){
  const strhtml=`
  <div class="noise-container">
    <div class="noise-layer"></div>
    <div class="noise-overlay"></div>
  </div>
  `;
  $(".noise-container").remove();
  $(".0_fore").append(strhtml);
}

function disp_gamingrect(){
  const strhtml=`
  <div style="position:absolute; left:820px; top:300px;">
  <div id="gamingrect" class="rainbow-box-wrapper">
    <div class="rainbow-box"></div>
  </div>
  </div>
  `;
  $("#gamingrect").remove();
  $("#custumlayer").append(strhtml);
}