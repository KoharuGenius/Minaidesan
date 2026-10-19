
function disp_gameboard(){
const strhtml=`
  <div id="game-container">
    <header>
      <div class="title-group">
        <h1>SYMBOL MATCH</h1>
        <span class="sub-tag">vs CPU</span>
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
      <div id="overlay-title" class="overlay-title">PLAYER 1 WIN</div>
      <div id="overlay-desc" class="overlay-desc">三枚の図柄が揃いました！</div>
      <!-- <button class="btn-main" onclick="initGame()">NEXT GAME</button> -->
    </div>

    <!-- リーチカットイン演出用要素 -->
    <div id="reach-cutin" class="reach-cutin">
      <div class="reach-bg-lines"></div>
      <div class="reach-banner">⚡ REACH! ⚡</div>
      <div class="reach-subtext">ONE MOVE TO WIN</div>
    </div>
  </div>
  `;
  $("#game-container").remove();
  $(".1_fore").append(strhtml);
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
let isCpuThinking = false;

function initGame() {
  gameOver = false;
  isCpuThinking = false;
  graveyard = [];
  selectedHandIndex = null;
  document.getElementById('overlay').classList.add('hidden');

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
  const startName = currentPlayer === 1 ? "P1" : "CPU";

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
      if (gameOver || isCpuThinking || currentPlayer === cpuPlayer) return;

      const card = hands[currentPlayer][index];

      // スキップ(S)カードの即時処理
      if (card === 'S') {
        hands[currentPlayer].splice(index, 1);
        graveyard.push('S');
        selectedHandIndex = null;
        setMessage(`P${currentPlayer} は スキップ(S) を出しました`);
        endTurn();
        return;
      }

      // トグル選択
      selectedHandIndex = (selectedHandIndex === index) ? null : index;
      if (selectedHandIndex !== null) {
        setMessage("カードを配置・更新する場の枠をクリックしてください");
      } else {
        setMessage("手札のカードを選んでください");
      }
      render();
    }

    function playToField(slotIndex) {
      if (gameOver || isCpuThinking || selectedHandIndex === null || currentPlayer === cpuPlayer) return;

      executeMove(selectedHandIndex, slotIndex);
    }

    function executeMove(handIndex, slotIndex) {
      const playedCard = hands[currentPlayer][handIndex];
      const targetCard = field[slotIndex];

      // ルール判定: 空き枠(null)でなく、かつ同じ図柄の上には置けない（☆は任意）
      if (targetCard !== null && playedCard !== '☆' && playedCard === targetCard) {
        setMessage("【ルール違反】同じ図柄の上には置けません");
        return false;
      }

      // カード配置処理
      hands[currentPlayer].splice(handIndex, 1);
      if (targetCard !== null) {
        graveyard.push(targetCard);
      }
      field[slotIndex] = playedCard;
      selectedHandIndex = null;

      // 勝利判定
      if (checkWin(field)) {
        render();
        const winnerName = (currentPlayer === cpuPlayer) ? "CPU" : `PLAYER ${currentPlayer}`;
        showEndGame(`${winnerName} WIN`, `三枚の図柄が揃いました！ ${winnerName} の勝利`,"*gameplayerwin");
        gameOver = true;
        return true;
      }

      // リーチ検出時のカットイン演出発動
      if (isReachState(field)) {
        triggerReachCutin();
      }

      endTurn();
      return true;
    }

    function triggerReachCutin() {
      const cutin = document.getElementById('reach-cutin');
      if (!cutin) return;

      cutin.classList.remove('active');
      void cutin.offsetWidth; // リフロー発生によるアニメーション再トリガー
      cutin.classList.add('active');
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
      const pName = (currentPlayer === cpuPlayer) ? "CPU" : `P${currentPlayer}`;
      setMessage(`${pName} のターンです`);
      render();

      checkCpuTurn();
    }

    function checkCpuTurn() {
      if (!gameOver && currentPlayer === cpuPlayer) {
        isCpuThinking = true;
        setMessage("CPUが思考中...");
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
        isCpuThinking = false;
        return;
      }

      const bestMove = getBestMove(hands[cpuPlayer], field, graveyard);

      if (bestMove) {
        if (bestMove.type === 'SKIP') {
          isCpuThinking = false;
          hands[cpuPlayer].splice(bestMove.handIndex, 1);
          graveyard.push('S');
          selectedHandIndex = null;
          setMessage("CPU は スキップ(S) を出しました");
          endTurn();
        } else if (bestMove.type === 'PLAY') {
          const success = executeMoveWithoutEndTurn(bestMove.handIndex, bestMove.slotIndex);
          if (success) {
            highlightCpuSlot(bestMove.slotIndex, () => {
              isCpuThinking = false;
              afterMoveExecuted();
            });
          } else {
            isCpuThinking = false;
          }
        }
      } else {
        isCpuThinking = false;
        endTurn();
      }
    }

    function executeMoveWithoutEndTurn(handIndex, slotIndex) {
      const playedCard = hands[currentPlayer][handIndex];
      const targetCard = field[slotIndex];

      if (targetCard !== null && playedCard !== '☆' && playedCard === targetCard) {
        return false;
      }

      hands[currentPlayer].splice(handIndex, 1);
      if (targetCard !== null) {
        graveyard.push(targetCard);
      }
      field[slotIndex] = playedCard;
      selectedHandIndex = null;

      render();
      return true;
    }

    function afterMoveExecuted() {
      if (checkWin(field)) {
        render();
        const winnerName = (currentPlayer === cpuPlayer) ? "CPU" : `PLAYER ${currentPlayer}`;
        showEndGame(`${winnerName} WIN`, `三枚の図柄が揃いました！ ${winnerName} の勝利`,"*gamecpuwin");
        gameOver = true;
        return;
      }

      if (isReachState(field)) {
        triggerReachCutin();
      }

      endTurn();
    }

    function highlightCpuSlot(slotIndex, callback) {
      const slots = document.querySelectorAll('#field-slots .card');
      const targetSlot = slots[slotIndex];

      if (!targetSlot) {
        callback();
        return;
      }

      targetSlot.classList.add('cpu-highlight');

      setTimeout(() => {
        targetSlot.classList.remove('cpu-highlight');
        callback();
      }, 1050);
    }

    function setMessage(msg) {
      document.getElementById('message-bar').textContent = msg;
    }

    function showEndGame(title, desc, target) {
      document.getElementById('overlay-title').textContent = title;
      document.getElementById('overlay-desc').textContent = desc;
      document.getElementById('overlay').classList.remove('hidden');
      //ティラノスクリプトを動かす！
      TYRANO.kag.ftag.startTag("jump",{target:target});
    }

    function render() {
      const badge = document.getElementById('turn-badge');
      const pName = (currentPlayer === cpuPlayer) ? "CPU" : `P${currentPlayer}`;
      badge.textContent = `${pName} TURN`;

      document.getElementById('deck-count').textContent = deck.length;

      const handLabel = (currentPlayer === cpuPlayer) ? "CPU HAND" : `PLAYER ${currentPlayer} HAND`;
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

