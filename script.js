const scoreBoard = JSON.parse(localStorage.getItem('score-board') || null);

const ruleBtnElement = document.querySelector('.rule-btn');
const gameRulesElement = document.querySelector('.game-rules');
const closeRulesBtnElement = document.querySelector('.close-btn');

const traingleShapeElement = document.querySelector('.traingle-shape');

const computerChoice = document.getElementById('computer-choice');

const gameResult = document.querySelector('.game-result-sectn')

const playAgainBtn = document.querySelector('.play-again-btn');

const borderShade = document.querySelectorAll('.border-shade');

const againstPcElem = document.querySelector('.against-pc-text');

const computerScoreElem = document.getElementById('computer-score');
const playerScoreElem =  document.getElementById('player-score');

const MAPPING = {
    0: 'rock',
    1: 'paper',
    2: 'scissors'
}

const getScore = () => {
    const {pcScore, playerScore} = JSON.parse(localStorage.getItem('score-board') || null) || {};

    if(pcScore == 0 && playerScore == 0) return;

    computerScoreElem.innerText = pcScore;
    playerScoreElem.innerText = playerScore;
}

const getUpdatedScore = (status) => {
    const { playerScore = 0, pcScore = 0 } = JSON.parse(localStorage.getItem('score-board') || '');
    return { 
        playerScore: status === 'WIN' ? +playerScore + 1 : +playerScore,
        pcScore: status === 'LOST' ? +pcScore + 1 : +pcScore
    }
}

const storeResultInLocalStorage = (playerScore, pcScore) => { 
    localStorage.setItem('score-board', JSON.stringify({
        playerScore,
        pcScore 
    }))
}

function randomOption() {
    return MAPPING[Math.floor(Math.random() * 3)];
}

const getResult = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) {
        return 'TIE'
    } else if (playerChoice === 'rock') {
        if (computerChoice === 'paper') return 'LOST'
        return 'WIN'
    } else if (playerChoice === 'paper') {
        if (computerChoice === 'scissors') return 'LOST'
        return 'WIN';
    } else if (playerChoice === 'scissors') {
        if (computerChoice === 'rock') return 'LOST'
        return 'WIN'
    }
}

const resetFields = () => {
    playAgainBtn.innerText = '';
    againstPcElem.classList.remove('hide');
    borderShade.forEach((el) => {
        el.classList.remove('win');
    })
}

function showRGameesult({ playerChoice, computerChoice }) {
    const showResElem = document.getElementById('show-result');

    resetFields();

    const result = getResult(playerChoice, computerChoice);

    if(result === 'TIE'){
        showResElem.innerText = `TIE UP`;
        playAgainBtn.innerText = 'REPLAY'
        return againstPcElem.classList.add('hide');
    }

    if(result === 'WIN') {
        borderShade[0].classList.add('win');
    } else {
        borderShade[1].classList.add('win');
    }

    playAgainBtn.innerText = 'PLAY AGAIN'
    showResElem.innerText = `YOU ${result}`

    const { pcScore, playerScore } = getUpdatedScore(result);

    storeResultInLocalStorage(playerScore, pcScore);
    computerScoreElem.innerText = +pcScore;
    playerScoreElem.innerText = +playerScore;
}

ruleBtnElement.addEventListener('click', () => {
    if (!gameRulesElement.classList.contains('show')) {
        gameRulesElement.classList.add('show');
    }
})

closeRulesBtnElement.addEventListener('click', () => {
    gameRulesElement.classList.remove('show');
})

traingleShapeElement.addEventListener('click', (event) => {
    if (!event.target.closest('.icon')) return;

    const randomChoice = randomOption();

    const selectedIcon = event.target.closest('.icon').getAttribute('data-icon');
    const playerChoice = document.getElementById('player-choice');
    playerChoice.className = 'user-choice'; //clear previous class
    playerChoice.setAttribute('data-choice-icon', selectedIcon);
    playerChoice.classList.add(`${selectedIcon}-icon`);

    playerChoice.innerHTML = '';
    const userImg = document.createElement('img');
    userImg.src = `./Images/${selectedIcon}.png`;
    playerChoice.appendChild(userImg)

    const computerChoice = document.getElementById('computer-choice');
    computerChoice.className = 'pc-choice'; //clear previous class
    computerChoice.setAttribute('data-choice-icon', randomChoice)
    computerChoice.classList.add(`${randomChoice}-icon`);

    computerChoice.innerHTML = '';
    const pcImg = document.createElement('img');
    pcImg.src = `./Images/${randomChoice}.png`;
    computerChoice.appendChild(pcImg);

    traingleShapeElement.style.display = 'none';
    gameResult.classList.add('show');

    showRGameesult({ playerChoice: selectedIcon, computerChoice: randomChoice });
})

//PLAY AGAIN BUTTON
playAgainBtn.addEventListener('click', () => {
    traingleShapeElement.style.display = 'block';
    gameResult.classList.remove('show');
})

getScore();