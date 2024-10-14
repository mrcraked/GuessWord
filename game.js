// game.js
const API_URL = 'https://noryouhost.online/Api/GuesssApi';
let currentWord = '';
let timer;
let timeLeft = 60;
let guessesLeft = 3;
let score = 0;
let incorrect = 0;

const startButton = document.getElementById('startButton');
const playAudioButton = document.getElementById('playAudio');
const guessInput = document.getElementById('guessInput');
const submitGuessButton = document.getElementById('submitGuess');
const hintButton = document.getElementById('hintButton');
const timerDisplay = document.getElementById('timer');
const correctGuessesDisplay = document.getElementById('correctGuesses');
const incorrectGuessesDisplay = document.getElementById('incorrectGuesses');
const guessesLeftDisplay = document.getElementById('guessesLeft');

startButton.addEventListener('click', startGame);
playAudioButton.addEventListener('click', playAudio);
submitGuessButton.addEventListener('click', submitGuess);
hintButton.addEventListener('click', showHintPopup);



async function startGame() {
    startButton.classList.add('hidden');
    playAudioButton.classList.remove('hidden');
    guessInput.classList.remove('hidden');
    submitGuessButton.classList.remove('hidden');
    hintButton.classList.remove('hidden');

    guessesLeft = 3;
    updateGuessesLeftDisplay();

    await fetchNewWord();
    startTimer();
}

async function fetchNewWord() {
    try {
        const response = await fetch(`${API_URL}/RandomWords/`);
        const data = await response.json();
        currentWord = data.Words.toLowerCase();
        AudioFile = data.Words;
        Def = data.Definition;
        Synonyms = data.Synonyms
    } catch (error) {
        console.error('Error fetching word:', error);
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏱ ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endRound(false);
        }
    }, 1000);
}

async function playAudio() {
    try {
        const audio = new Audio(`${API_URL}/Audio/${AudioFile}`);
        await audio.play();
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}

function submitGuess() {
    const guess = guessInput.value.toLowerCase();
    if (guess === currentWord) {
        endRound(true);
    } else {
        updateGuessesLeftDisplay()
        guessesLeft--;
        if (guessesLeft === 0) {
            endRound(false);
        }
    }
    guessInput.value = '';
    updateGuessesLeftDisplay();
}

function endRound(isCorrect) {
    clearInterval(timer);
    if (isCorrect) {
        score++;
        correctGuessesDisplay.textContent = `✓ ${score}`;
        showAlertIcon('Correct!', 'success', '✓');
    } else {
        incorrect++;
        incorrectGuessesDisplay.textContent = `✗ ${incorrect}`;
        showAlertIcon('Incorrect!', 'error', currentWord);
    }
    setTimeout(showNextWordPopup, 5000);
}

function showAlertIcon(message, type, word) {
    Swal.fire({
        title: message,
        text: `Your word is ${currentWord}`,
        icon: type,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false
    });
}

function showNextWordPopup() {
    Swal.fire({
        title: 'Get ready for the Next Word!',
        text: 'Do you want to continue?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Stop',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            resetGame();
        } else {
            freezeGame();
        }
    });
}

function resetGame() {
    timeLeft = 60;
    guessesLeft = 3;
    updateGuessesLeftDisplay();
    fetchNewWord();
    startTimer();
}

function freezeGame() {
    guessInput.disabled = true;
    submitGuessButton.disabled = true;
}

function showHintPopup() {
    clearInterval(timer);
    Swal.fire({
        title: 'HINT',
        text: 'Choose the hint you want ',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Show Definition',
        cancelButtonText: 'Show Synonyms',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#2778c4'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Definition', Def, 'info');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Synonyms', Synonyms, 'info');
        }
        startTimer();
    });
}

function updateGuessesLeftDisplay() {
    guessesLeftDisplay.textContent = `${guessesLeft}/3`;
}

function showAlert(message, type) {
    Swal.fire({
        title: message,
        icon: type,
        timer: 1500,
        showConfirmButton: false
    });
}
