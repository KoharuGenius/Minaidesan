function disp_game2(){
const strhtml=`
<div id="game-container">
    <div class="fm-toast-banner" id="toast-banner">あなたが先手です！</div>

    <div class="fm-reach-cutin-overlay" id="reach-cutin">
        <div class="fm-reach-cutin-text">
            <span id="reach-cutin-who">PLAYER</span>
            <span class="fm-reach-cutin-subtext">REACH!</span>
        </div>
    </div>

    <div class="fm-header-bar">
        <div class="fm-score-board">
            <div class="fm-score-item" id="score-p1-label">PLAYER: <span id="player-wins">0</span></div>
            <div class="fm-score-item" id="score-p2-label">CPU: <span id="score-cpu-wins">0</span></div>
        </div>
        <div id="turn-indicator" style="font-size: 0.75rem; color: #555; font-weight: bold;">
            READY
        </div>
    </div>

    <div class="fm-area" id="area-cpu">
        <div style="font-size: 0.65rem; margin-bottom: 2px; color: #666; display: flex; align-items: center;">
            CPU <span id="cpu-reach-badge" class="fm-reach-badge" style="display:none;">REACH</span>
        </div>
        <div class="fm-hand-container" id="cpu-hand"></div>
    </div>

    <div class="fm-table-center" id="area-center">
        <div class="fm-deck-area">
            <div class="fm-deck-stack" id="deck-stack">
                <div class="fm-card fm-card-back"></div>
            </div>
            <div class="fm-deck-count">残: <span id="deck-count">28</span></div>
        </div>

        <div class="fm-discard-board">
            <div>
                <div class="fm-discard-zone-title" id="discard-title-cpu">CPU 捨て札</div>
                <div class="fm-discard-zone" id="cpu-discards"></div>
            </div>
            <div>
                <div class="fm-discard-zone-title" id="discard-title-player">PLAYER 捨て札</div>
                <div class="fm-discard-zone" id="player-discards"></div>
            </div>
        </div>
    </div>

    <div class="fm-log-box" id="game-log">
        <div class="fm-log-entry">ゲーム開始</div>
    </div>

    <div class="fm-controls" id="area-controls">
        <button class="fm-btn fm-btn-tsumo" id="btn-tsumo" disabled>ツモ</button>
        <button class="fm-btn fm-btn-ron" id="btn-ron" disabled>ロン</button>
        <button class="fm-btn fm-btn-reach" id="btn-reach" disabled>リーチ</button>
        <button class="fm-btn" id="btn-discard" disabled>カードを捨てる</button>
    </div>

    <div class="fm-area" id="area-player">
        <div style="font-size: 0.65rem; margin-bottom: 2px; color: #666; display: flex; align-items: center;">
            YOU <span id="player-reach-badge" class="fm-reach-badge" style="display:none;">REACH</span>
        </div>
        <div class="fm-hand-container" id="player-hand"></div>
    </div>
</div>

<div class="fm-modal-overlay" id="result-modal">
    <div class="fm-modal-content">
        <div class="fm-modal-title" id="modal-winner-text">WIN</div>
        <div class="fm-modal-yaku" id="modal-yaku-text">役：フルハウス</div>
        <div class="fm-modal-cards" id="modal-winning-cards"></div>
        <!-- <button class="fm-btn" id="btn-next-round">NEXT ROUND</button> -->
    </div>
</div>`;
$("#fm-game-board").remove();
//$("#gameboard_root").append(strhtml);
document.getElementById('gameboard_root').innerHTML = strhtml;
}

function disp_button2(){
    const strhtml=`<div>
    <button class="fm-btn" id="btn-next-round" onclick="initGame2()";>START</button>
    </div>`;
    $("#btn-next-round").remove();
    $("#gamemenu").append(strhtml);
}

/**
     * Refactored Card Game Engine Logic
     */
    const NUM_COPIES = 4;
    const MAX_NUM = 9;

    let deck = [], playerHand = [], cpuHand = [];
    let playerDiscards = [], cpuDiscards = [];
    let isPlayerReach = false, isCpuReach = false;
    let isReachPending = false;

    let currentTurn = 'player'; // 'player' | 'cpu'
    let phase = 'draw'; // 'draw' | 'discard' | 'ended'
    let lastDiscardedCard = null, lastDiscarder = null;

    let playerWins = 0, cpuWins = 0;
    let selectedCardIndex = null;

    let DOM = {};

    function initDOMReferences() {
        DOM = {
            toast: document.getElementById('toast-banner'),
            cutin: document.getElementById('reach-cutin'),
            cutinWho: document.getElementById('reach-cutin-who'),
            turnIndicator: document.getElementById('turn-indicator'),
            deckCount: document.getElementById('deck-count'),
            logBox: document.getElementById('game-log'),
            hand: {
                player: document.getElementById('player-hand'),
                cpu: document.getElementById('cpu-hand')
            },
            discards: {
                player: document.getElementById('player-discards'),
                cpu: document.getElementById('cpu-discards')
            },
            score: {
                playerWins: document.getElementById('player-wins'),
                cpuWins: document.getElementById('score-cpu-wins')
            },
            reachBadge: {
                player: document.getElementById('player-reach-badge'),
                cpu: document.getElementById('cpu-reach-badge')
            },
            btn: {
                tsumo: document.getElementById('btn-tsumo'),
                ron: document.getElementById('btn-ron'),
                reach: document.getElementById('btn-reach'),
                discard: document.getElementById('btn-discard'),
                nextRound: document.getElementById('btn-next-round')
            },
            modal: {
                root: document.getElementById('result-modal'),
                winner: document.getElementById('modal-winner-text'),
                yaku: document.getElementById('modal-yaku-text'),
                winningCards: document.getElementById('modal-winning-cards')
            }
        };
    }

    // --- Helper Component Functions ---
    function createCardElement(num, extraClass = '', isMini = false) {
        const el = document.createElement('div');
        el.className = `fm-card ${extraClass}`.trim();
        el.innerHTML = isMini ? 
            `<div class="fm-card-corner">${num}</div><div class="fm-card-center">${num}</div>` :
            `<div class="fm-card-corner">${num}</div><div class="fm-card-center">${num}</div><div class="fm-card-corner" style="text-align:right;">${num}</div>`;
        return el;
    }

    function showToast(msg) {
        DOM.toast.textContent = msg;
        DOM.toast.classList.add('fm-show');
        setTimeout(() => DOM.toast.classList.remove('fm-show'), 2000);
    }

    function triggerReachCutin(whoText, callback) {
        DOM.cutinWho.textContent = whoText;
        DOM.cutin.classList.add('fm-active');
        setTimeout(() => {
            DOM.cutin.classList.remove('fm-active');
            if (callback) callback();
        }, 1200);
    }

    function createDeck() {
        const newDeck = Array.from({ length: MAX_NUM * NUM_COPIES }, (_, i) => Math.floor(i / NUM_COPIES) + 1);
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
    }

    // --- Evaluators ---
    function evaluateYaku(cards, isReach = false) {
        if (cards.length !== 5) return null;
        
        const counts = {};
        cards.forEach(c => counts[c] = (counts[c] || 0) + 1);
        const valCounts = Object.values(counts);

        if (valCounts.includes(4)) return { name: 'フォーカード', score: 4 };
        if (valCounts.includes(3) && valCounts.includes(2)) return { name: 'フルハウス', score: 3 };

        const sortedUnique = [...new Set(cards)].sort((a, b) => a - b);
        if (sortedUnique.length === 5 && sortedUnique[4] - sortedUnique[0] === 4) {
            return { name: 'ストレート', score: 2 };
        }

        if (isReach && checkRunAndPair(cards)) {
            return { name: 'Run & Pair', score: 1 };
        }

        return null;
    }

    function checkRunAndPair(cards) {
        if (cards.length !== 5) return false;
        const sorted = [...cards].sort((a, b) => a - b);
        
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i] === sorted[i+1]) {
                const rem = sorted.filter((_, idx) => idx !== i && idx !== i + 1);
                if (rem[0] + 1 === rem[1] && rem[1] + 1 === rem[2]) return true;
            }
        }
        return false;
    }

    function checkTenpai(hand) {
        const outs = [];
        for (let tile = 1; tile <= MAX_NUM; tile++) {
            if (evaluateYaku([...hand, tile], true)) outs.push(tile);
        }
        return { isTenpai: outs.length > 0, outs };
    }

    function checkRunAndPairTenpai(hand) {
        if (hand.length < 4) return false;
        const base4 = hand.slice(0, 4);
        for (let tile = 1; tile <= MAX_NUM; tile++) {
            if (checkRunAndPair([...base4, tile])) return true;
        }
        return false;
    }

    // --- CPU AI ---
    function evaluateHandOutsAndScore(hand, knownDiscards, isReach) {
        let bestScore = -1, totalWinningOuts = 0;
        const visibleCounts = {};
        for (let i = 1; i <= MAX_NUM; i++) visibleCounts[i] = 0;
        knownDiscards.forEach(c => visibleCounts[c.val]++);
        hand.forEach(c => visibleCounts[c]++);

        for (let tile = 1; tile <= MAX_NUM; tile++) {
            const yaku = evaluateYaku([...hand, tile], isReach);
            if (yaku) {
                const rem = Math.max(0, NUM_COPIES - visibleCounts[tile]);
                totalWinningOuts += rem;
                const handValue = yaku.score * 1000 + rem * 50;
                if (handValue > bestScore) bestScore = handValue;
            }
        }

        if (totalWinningOuts > 0) return 700 + totalWinningOuts * 30 + (bestScore > 0 ? bestScore / 100 : 0);

        let ishantenAcceptance = 0;
        for (let drawTile = 1; drawTile <= MAX_NUM; drawTile++) {
            const temp4Hand = [...hand, drawTile];
            for (let winTile = 1; winTile <= MAX_NUM; winTile++) {
                if (evaluateYaku([...temp4Hand, winTile], true)) {
                    ishantenAcceptance += Math.max(0, NUM_COPIES - visibleCounts[drawTile]);
                    break;
                }
            }
        }
        return ishantenAcceptance * 5;
    }

    function selectCpuDiscardIndex(hand, knownDiscards, isReach) {
        if (hand.length !== 5) return 0;
        if (isReach) return 4;

        let bestIndex = 0, maxScore = -99999;
        for (let i = 0; i < hand.length; i++) {
            const candidateHand = hand.filter((_, idx) => idx !== i);
            const score = evaluateHandOutsAndScore(candidateHand, knownDiscards, isReach);
            if (score > maxScore) {
                maxScore = score;
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    // --- Logic Utilities ---
    function canPlayerReach() {
        if (currentTurn !== 'player' || phase !== 'discard' || isPlayerReach) return false;
        if (selectedCardIndex !== null && playerHand.length === 5) {
            return checkRunAndPairTenpai(playerHand.filter((_, idx) => idx !== selectedCardIndex));
        }
        return playerHand.some((_, i) => checkRunAndPairTenpai(playerHand.filter((_, idx) => idx !== i)));
    }

    // --- Game Logic Flow ---
    function startNewGame() {
        deck = createDeck();
        playerHand = []; cpuHand = [];
        playerDiscards = []; cpuDiscards = [];
        isPlayerReach = false; isCpuReach = false; isReachPending = false;
        selectedCardIndex = null; lastDiscardedCard = null; lastDiscarder = null;

        for (let i = 0; i < 4; i++) {
            playerHand.push(deck.pop());
            cpuHand.push(deck.pop());
        }

        currentTurn = Math.random() < 0.5 ? 'player' : 'cpu';
        phase = 'draw';

        DOM.reachBadge.player.style.display = 'none';
        DOM.reachBadge.cpu.style.display = 'none';
        DOM.btn.reach.classList.remove('fm-active');
        DOM.modal.root.classList.remove('fm-active');

        showLog("======================");
        showLog("新しい対局を開始します");
        showToast(currentTurn === 'player' ? "あなたが先手です！" : "CPUが先手です！");

        updateUI();

        if (currentTurn === 'cpu') setTimeout(executeCpuTurn, 800);
        else checkAutoDraw();
    }

    function checkAutoDraw() {
        if (phase !== 'draw' || currentTurn !== 'player') return;
        const canRon = lastDiscardedCard !== null && lastDiscarder === 'cpu' && evaluateYaku([...playerHand, lastDiscardedCard], isPlayerReach);

        if (!canRon && deck.length > 0) {
            setTimeout(() => {
                if (phase === 'draw' && currentTurn === 'player') playerDrawCard();
            }, 400);
        }
    }

    function playerDrawCard() {
        if (deck.length === 0) return handleDrawGame();

        const drawn = deck.pop();
        playerHand.push(drawn);
        phase = 'discard';
        showLog(`ツモ: [${drawn}]`);

        const tsumoYaku = evaluateYaku(playerHand, isPlayerReach);
        if (tsumoYaku) showLog(`ツモあがり可能！ 役: ${tsumoYaku.name}`);

        if (isPlayerReach && !tsumoYaku) {
            selectedCardIndex = 4;
            setTimeout(playerDiscardCard, 500);
        }

        updateUI();
    }

    function playerDiscardCard() {
        if (selectedCardIndex === null || selectedCardIndex >= playerHand.length) return;

        const discarded = playerHand.splice(selectedCardIndex, 1)[0];
        const isReachTile = isReachPending;
        
        playerDiscards.push({ val: discarded, isReachTile });
        lastDiscardedCard = discarded;
        lastDiscarder = 'player';
        selectedCardIndex = null;

        if (isReachPending) {
            isPlayerReach = true;
            isReachPending = false;
            DOM.reachBadge.player.style.display = 'inline-block';
            DOM.btn.reach.classList.remove('fm-active');
            showLog(`YOUがリーチを宣言！ 捨て札: [${discarded}]`, true);

            triggerReachCutin("PLAYER", () => processAfterPlayerDiscard(discarded));
        } else {
            showLog(`YOU 捨て札: [${discarded}]`);
            processAfterPlayerDiscard(discarded);
        }
    }

    function processAfterPlayerDiscard(discarded) {
        const cpuRonYaku = evaluateYaku([...cpuHand, discarded], isCpuReach);
        if (cpuRonYaku) {
            showLog(`CPUがロンを宣言！ 役: ${cpuRonYaku.name}`);
            endGame('cpu', cpuRonYaku, [...cpuHand, discarded], 'ロン');
            return;
        }

        if (deck.length === 0) return handleDrawGame();

        currentTurn = 'cpu';
        phase = 'draw';
        updateUI();

        setTimeout(executeCpuTurn, 600);
    }

    function executeCpuTurn() {
        if (phase === 'ended') return;

        const knownDiscards = [...playerDiscards, ...cpuDiscards];
        
        if (lastDiscardedCard !== null && lastDiscarder === 'player') {
            const ronYaku = evaluateYaku([...cpuHand, lastDiscardedCard], isCpuReach);
            if (ronYaku) {
                showLog(`CPUがロンを宣言！ 役: ${ronYaku.name}`);
                endGame('cpu', ronYaku, [...cpuHand, lastDiscardedCard], 'ロン');
                return;
            }
        }

        if (deck.length === 0) return handleDrawGame();
        
        cpuHand.push(deck.pop());

        const tsumoYaku = evaluateYaku(cpuHand, isCpuReach);
        if (tsumoYaku) {
            showLog(`CPUがツモあがり！ 役: ${tsumoYaku.name}`);
            endGame('cpu', tsumoYaku, cpuHand, 'ツモ');
            return;
        }

        let cpuWillReachNow = false;
        if (!isCpuReach && checkTenpai(cpuHand).isTenpai && checkRunAndPairTenpai(cpuHand)) {
            isCpuReach = true;
            cpuWillReachNow = true;
            DOM.reachBadge.cpu.style.display = 'inline-block';
            showLog("CPUがリーチを宣言！", true);
        }

        const discardIndex = selectCpuDiscardIndex(cpuHand, knownDiscards, isCpuReach);
        const discarded = cpuHand.splice(discardIndex, 1)[0];
        
        cpuDiscards.push({ val: discarded, isReachTile: cpuWillReachNow });
        lastDiscardedCard = discarded;
        lastDiscarder = 'cpu';

        if (cpuWillReachNow) {
            triggerReachCutin("CPU", () => processAfterCpuDiscard(discarded));
        } else {
            showLog(`CPU 捨て札: [${discarded}]`);
            processAfterCpuDiscard(discarded);
        }
    }

    function processAfterCpuDiscard(discarded) {
        if (deck.length === 0) return handleDrawGame();

        currentTurn = 'player';
        phase = 'draw';
        updateUI();
        checkAutoDraw();
    }

    function handleDrawGame() {
        phase = 'ended';
        showLog("流局（山札切れ・引き分け）");
        DOM.modal.winner.textContent = "DRAW";
        DOM.modal.yaku.textContent = "山札がなくなりました";
        DOM.modal.winningCards.innerHTML = '';
        DOM.modal.root.classList.add('fm-active');
        updateUI();
    }

    function endGame(winner, yaku, winningCards, type) {
        phase = 'ended';
        const isPlayer = winner === 'player';
        if (isPlayer) playerWins++; else cpuWins++;
        
        DOM.score.playerWins.textContent = playerWins;
        DOM.score.cpuWins.textContent = cpuWins;
        DOM.modal.winner.textContent = `${isPlayer ? 'YOU' : 'CPU'} WIN! (${type})`;
        DOM.modal.yaku.textContent = `役: ${yaku.name}`;
        
        DOM.modal.winningCards.innerHTML = '';
        [...winningCards].sort((a,b)=>a-b).forEach(num => {
            DOM.modal.winningCards.appendChild(createCardElement(num));
        });

        DOM.modal.root.classList.add('fm-active');
        updateUI();
    }

    // --- Render ---
    function updateUI() {
        DOM.deckCount.textContent = deck.length;

        renderDiscardZone(DOM.discards.player, playerDiscards, lastDiscarder === 'player');
        renderDiscardZone(DOM.discards.cpu, cpuDiscards, lastDiscarder === 'cpu');

        // Render Player Hand
        DOM.hand.player.innerHTML = '';
        const sortedHand = playerHand.slice(0, 4).map((num, idx) => ({ num, origIdx: idx })).sort((a, b) => a.num - b.num);
        
        sortedHand.forEach(item => {
            const cardEl = createCardElement(item.num, item.origIdx === selectedCardIndex ? 'fm-selected' : '');
            cardEl.addEventListener('click', () => handleCardClick(item.origIdx));
            DOM.hand.player.appendChild(cardEl);
        });

        if (playerHand.length === 5) {
            const drawnEl = createCardElement(playerHand[4], `fm-drawn ${selectedCardIndex === 4 ? 'fm-selected' : ''}`);
            drawnEl.addEventListener('click', () => handleCardClick(4));
            DOM.hand.player.appendChild(drawnEl);
        }

        // Render CPU Hand
        DOM.hand.cpu.innerHTML = '';
        cpuHand.forEach((_, idx) => {
            const cEl = document.createElement('div');
            cEl.className = `fm-card fm-card-back ${idx === 4 ? 'fm-drawn' : ''}`.trim();
            DOM.hand.cpu.appendChild(cEl);
        });

        // Controls & Status Update
        if (phase === 'ended') {
            DOM.turnIndicator.textContent = "GAME OVER";
            ['tsumo', 'ron', 'reach', 'discard'].forEach(b => DOM.btn[b].disabled = true);
            return;
        }

        DOM.turnIndicator.textContent = currentTurn === 'player' ? 
            (phase === 'draw' ? "YOUR TURN (DRAW)" : "YOUR TURN (DISCARD)") : "CPU TURN";

        const tsumoYaku = playerHand.length === 5 ? evaluateYaku(playerHand, isPlayerReach) : null;
        const ronYaku = (currentTurn === 'player' && phase === 'draw' && lastDiscardedCard !== null && lastDiscarder === 'cpu') ?
            evaluateYaku([...playerHand, lastDiscardedCard], isPlayerReach) : null;

        DOM.btn.tsumo.disabled = !(currentTurn === 'player' && phase === 'discard' && tsumoYaku);
        DOM.btn.ron.disabled = !ronYaku;
        DOM.btn.reach.disabled = !canPlayerReach();
        DOM.btn.discard.disabled = !(currentTurn === 'player' && phase === 'discard' && selectedCardIndex !== null);
    }

    function renderDiscardZone(element, discards, isLastDiscarder) {
        element.innerHTML = '';
        discards.forEach((item, idx) => {
            const isLast = isLastDiscarder && idx === discards.length - 1;
            let classNames = '';
            if (isLast) classNames += ' fm-last-discard';
            if (item.isReachTile) classNames += ' fm-reach-discard';
            
            element.appendChild(createCardElement(item.val, classNames, true));
        });
    }

    function handleCardClick(index) {
        if (currentTurn !== 'player' || phase !== 'discard' || isPlayerReach) return;
        
        // すでに選択中のカードをクリックした場合はそのまま捨てる
        if (selectedCardIndex === index) {
            playerDiscardCard();
        } else {
            selectedCardIndex = index;
            updateUI();
        }
    }

    function showLog(msg, highlight = false) {
        const div = document.createElement('div');
        div.className = `fm-log-entry ${highlight ? 'fm-highlight' : ''}`;
        div.textContent = msg;
        DOM.logBox.appendChild(div);
        DOM.logBox.scrollTop = DOM.logBox.scrollHeight;
    }

    function bindEvents() {
        DOM.btn.tsumo.addEventListener('click', () => {
            if (currentTurn !== 'player' || phase !== 'discard') return;
            const yaku = evaluateYaku(playerHand, isPlayerReach);
            if (yaku) {
                showLog(`YOU ツモあがり！ 役: ${yaku.name}`, true);
                endGame('player', yaku, playerHand, 'ツモ');
            }
        });

        DOM.btn.ron.addEventListener('click', () => {
            if (lastDiscardedCard === null || lastDiscarder !== 'cpu') return;
            const yaku = evaluateYaku([...playerHand, lastDiscardedCard], isPlayerReach);
            if (yaku) {
                showLog(`YOU ロンあがり！ 役: ${yaku.name}`, true);
                endGame('player', yaku, [...playerHand, lastDiscardedCard], 'ロン');
            }
        });

        DOM.btn.reach.addEventListener('click', () => {
            if (isPlayerReach) return;
            isReachPending = !isReachPending;
            DOM.btn.reach.classList.toggle('fm-active', isReachPending);
            if (isReachPending) showToast("リーチ宣言！捨てるカードを選択してください");
        });

        DOM.btn.discard.addEventListener('click', playerDiscardCard);
        DOM.btn.nextRound.addEventListener('click', startNewGame);
    }

    function initGame2() {
        document.getElementById('gamemenu').classList.add('hidden');
        initDOMReferences();
        bindEvents();
        startNewGame();
    };
