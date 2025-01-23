document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const extraTurnBtn = document.getElementById('extra-turn-btn');
    const resetBtn = document.getElementById('reset-btn');
    const playerScoreElem = document.getElementById('player-score');
    const cpuScoreElem = document.getElementById('cpu-score');
    const historyElem = document.getElementById('history');

    const BOARD_SIZE = 4;
    const TOTAL_POKEMONS = 5;
    const WINNING_SCORE = 3;

    let playerScore = 0;
    let cpuScore = 0;
    let playerTurn = true;
    let pokemons = [];
    let revealedCells = [];
    let playerMoves = 0;
    let cpuMoves = 0;

    function initGame() {
        board.innerHTML = '';
        playerScore = 0;
        cpuScore = 0;
        playerTurn = true;
        pokemons = [];
        revealedCells = [];
        playerMoves = 0;
        cpuMoves = 0;
        playerScoreElem.textContent = playerScore;
        cpuScoreElem.textContent = cpuScore;
        generateBoard();
        placePokemons();
    }

    function generateBoard() {
        for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', onCellClick);
            board.appendChild(cell);
        }
    }

    function placePokemons() {
        const pokemonTypes = ['charm', 'squirt', 'pikachu'];
        while (pokemons.length < TOTAL_POKEMONS) {
            const randomIndex = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
            if (!pokemons.some(p => p.index === randomIndex)) {
                const pokemonType = pokemonTypes[pokemons.length % pokemonTypes.length];
                pokemons.push({ index: randomIndex, type: pokemonType });
            }
        }
    }

    function onCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.dataset.index);

        if (revealedCells.includes(index)) return;

        revealedCells.push(index);
        playerMoves++;

        const pokemon = pokemons.find(p => p.index === index);
        if (pokemon) {
            cell.classList.add(pokemon.type);
            playerScore++;
            playerScoreElem.textContent = playerScore;
            if (playerScore === WINNING_SCORE) {
                endGame('Jugador');
                return;
            }
        } else {
            cell.classList.add('empty');
            playerTurn = false;
            cpuTurn();
        }
    }

    function cpuTurn() {
        while (!playerTurn) {
            const randomIndex = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
            if (!revealedCells.includes(randomIndex)) {
                revealedCells.push(randomIndex);
                cpuMoves++;
                const cell = board.children[randomIndex];
                const pokemon = pokemons.find(p => p.index === randomIndex);
                if (pokemon) {
                    cell.classList.add(pokemon.type);
                    cpuScore++;
                    cpuScoreElem.textContent = cpuScore;
                    if (cpuScore === WINNING_SCORE) {
                        endGame('CPU');
                        return;
                    }
                } else {
                    cell.classList.add('empty');
                }
                playerTurn = true;
            }
        }
    }

    function endGame(winner) {
        alert(`${winner} ha ganado!`);
        const playerName = winner === 'Jugador' ? prompt('Introduce tu nombre:') : 'CPU';
        const moves = winner === 'Jugador' ? playerMoves : cpuMoves;
        const historyItem = document.createElement('li');
        historyItem.textContent = `${playerName} → ${moves} tiradas`;
        historyElem.appendChild(historyItem);
        disableBoard();
    }

    function disableBoard() {
        const cells = board.children;
        for (let cell of cells) {
            cell.removeEventListener('click', onCellClick);
        }
    }

    extraTurnBtn.addEventListener('click', () => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        if (diceRoll === 6) {
            alert('¡Has ganado un turno extra!');
            playerTurn = true;
        } else {
            alert('No has ganado un turno extra.');
            playerTurn = false;
            cpuTurn();
        }
    });

    resetBtn.addEventListener('click', initGame);

    initGame();
});