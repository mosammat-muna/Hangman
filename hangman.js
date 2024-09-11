/*This script manages game logic such as updating categories, processing letter guesses, tracking the scoreboard, and updating the hangman image based on incorrect guesses to provide a smooth and interactive gaming experience.*/ 

/* Movies by Category */
const moviesByCategory = {
    'Action': [
        'Die Hard',
        'Mad Max',
        'The Dark Knight',
        'Gladiator',
        'Terminator',
        'John Wick',
        'The Avengers',
        'Mission Impossible',
        'Lethal Weapon',
        'Casino Royale'
    ],
    'Comedy': [
        'The Hangover',
        'Superbad',
        'Step Brothers',
        'Anchorman',
        'Bridesmaids',
        'Mean Girls',
        'Ghostbusters',
        'Dumb and Dumber',
        'Hot Fuzz',
        'Zoolander'
    ],
    'Horror': [
        'The Conjuring',
        'Get Out',
        'A Nightmare on Elm Street',
        'Halloween',
        'It',
        'The Exorcist',
        'Hereditary',
        'Scream',
        'The Shining',
        'Insidious'
    ],
    'Drama': [
        'The Shawshank Redemption',
        'Forrest Gump',
        'The Godfather',
        'Fight Club',
        'The Green Mile',
        'Good Will Hunting',
        'Schindler\'s List',
        'The Social Network',
        'A Beautiful Mind',
        '12 Years a Slave'
    ],
    'Sci-Fi': [
        'Inception',
        'Interstellar',
        'The Matrix',
        'Blade Runner',
        'Star Wars',
        'Back to the Future',
        'The Terminator',
        'Avatar',
        'E.T. the Extra-Terrestrial',
        'Alien'
    ]
    // Add more categories and movies as needed
};

/* Scoreboard Object */
let scoreboard = {
    wins: 0,
    losses: 0,
    // Update the scoreboard display
    update: function() {
        document.getElementById('wins').innerText = this.wins;
        document.getElementById('losses').innerText = this.losses;
    },
    // Increment the win count and update display
    incrementWin: function() {
        this.wins++;
        this.update();
    },
    // Increment the loss count and update display
    incrementLoss: function() {
        this.losses++;
        this.update();
    }
};

/* Game Constants */
const youWon = "You Won!";
const youLost = "You Lost!";

/* Game Function Constructor */
function Game(selectedCategory) {
    let word = selectWord(selectedCategory); // Select a random word from the chosen category
    word = word.toUpperCase(); // Convert the word to uppercase
    let guessedLetters = []; // Array to keep track of guessed letters
    let maskedWord = ""; // String to display the current state of the word
    let incorrectGuesses = 0; // Number of incorrect guesses made
    let possibleGuesses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Letters that can still be guessed
    let won = false; // Flag to check if the player has won
    let lost = false; // Flag to check if the player has lost
    const maxGuesses = 7; // Maximum number of incorrect guesses allowed

    // Initialize maskedWord with underscores or spaces for each letter in the word
    for (let i = 0; i < word.length; i++) {
        let space = " ";
        let nextCharacter = word.charAt(i) === space ? space : "_";
        maskedWord += nextCharacter;
    }

    // Function to handle guessing the entire word
    let guessWord = function(guessedWord) {
        guessedWord = guessedWord.toUpperCase();
        if (guessedWord === word) {
            guessAllLetters(); // Reveal all letters if the entire word is guessed correctly
        } else {
            handleIncorrectGuess(); // Handle incorrect guess
        }
    };

    // Function to reveal all letters in the word
    let guessAllLetters = function() {
        for (let i = 0; i < word.length; i++) {
            guess(word.charAt(i));
        }
    };

    // Function to handle guessing a single letter
    let guess = function(letter) {
        letter = letter.toUpperCase();
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter); // Add the letter to guessed letters
            possibleGuesses = possibleGuesses.replace(letter, ""); // Remove the letter from possible guesses
            if (word.includes(letter)) {
                let matchingIndexes = [];
                // Find all indexes of the guessed letter in the word
                for (let i = 0; i < word.length; i++) {
                    if (word.charAt(i) === letter) {
                        matchingIndexes.push(i);
                    }
                }
                // Update maskedWord with the guessed letter
                matchingIndexes.forEach(function(index) {
                    maskedWord = replace(maskedWord, index, letter);
                });

                if (!lost) {
                    won = maskedWord === word; // Check if the player has won
                }
            } else {
                handleIncorrectGuess(); // Handle incorrect guess
            }
        }
    };

    // Function to handle incorrect guesses
    let handleIncorrectGuess = function() {
        incorrectGuesses++;
        updateLives(); // Update the number of remaining lives
        lost = incorrectGuesses >= maxGuesses; // Check if the game is lost
        if (lost) {
            guessAllLetters(); // Reveal all letters if the game is lost
            scoreboard.incrementLoss(); // Update the loss count
        }
    };

    // Function to update the display of remaining lives and hangman image
    let updateLives = function() {
        let remainingLives = maxGuesses - incorrectGuesses;
        document.getElementById("lives").innerHTML = `<p>Lives: ${remainingLives}</p>`;
        document.getElementById("hangmanImage").src = `hangman${incorrectGuesses}.png`;
    };

    return {
        "getWord": function() { return word; },
        "getMaskedWord": function() { return maskedWord; },
        "guess": guess,
        "getPossibleGuesses": function() { return [...possibleGuesses]; },
        "getIncorrectGuesses": function() { return incorrectGuesses; },
        "guessWord": guessWord,
        "isWon": function() { return won; },
        "isLost": function() { return lost; },
        "getHintLetter": function() { return word.charAt(0); } // Provide a hint letter
    };
}

/* Utility Functions */
/* Function to select a random word from the given category */
function selectWord(category) {
    const movies = moviesByCategory[category];
    if (!movies || movies.length === 0) {
        alert("No movies available in this category. Please select another category.");
        return "";
    }
    return movies[Math.floor(Math.random() * movies.length)];
}

/* Function to replace a character at a specific index in a string */
function replace(value, index, replacement) {
    return value.substr(0, index) + replacement + value.substr(index + replacement.length);
}

/* Input Listener Function */
function listenForInput(game) {
    /* Function to handle guessing a letter */
    let guessLetter = function(letter) {
        if (letter) {
            let gameStillGoing = !game.isWon() && !game.isLost();
            if (gameStillGoing) {
                game.guess(letter); // Make a guess with the letter
                render(game); // Update the display
                if (game.isWon()) {
                    scoreboard.incrementWin(); // Update the win count
                }
            }
        }
    };

    /* Event handler for click events on guessed letters */
    let handleClick = function(event) {
        if (event.target.classList.contains('guess')) {
            guessLetter(event.target.innerHTML);
        }
    };

    /* Event handler for key press events */
    let handleKeyPress = function(event) {
        let letter = null;
        const A = 65;
        const Z = 90;
        const ENTER = 13;
        let isLetter = event.keyCode >= A && event.keyCode <= Z;
        let guessWordButton = document.getElementById("guessWordButton");
        let newGameButton = document.getElementById("newGameButton");
        let guessBox = document.getElementById("guessBox");
        let gameOver = guessBox.value === youWon || guessBox.value === youLost;

        if (event.target.id !== "guessBox" && isLetter) {
            letter = String.fromCharCode(event.keyCode); // Convert key code to letter
        } else if (event.keyCode === ENTER && gameOver) {
            newGameButton.click(); // Start a new game if ENTER is pressed after game over
        } else if (event.keyCode === ENTER && guessBox.value !== "") {
            guessWordButton.click(); // Guess the word if ENTER is pressed
        }
        guessLetter(letter); // Handle the guessed letter
    };

    document.addEventListener('keydown', handleKeyPress); // Listen for key presses
    document.body.addEventListener('click', handleClick); // Listen for click events
}

/* Guess Word Function */
function guessWord(game) {
    let gameStillGoing = !game.isWon() && !game.isLost();
    let guessedWord = document.getElementById('guessBox').value.trim();
    if (guessedWord !== "") {
        if (gameStillGoing) {
            game.guessWord(guessedWord); // Guess the entire word
            render(game); // Update the display
            if (game.isWon()) {
                scoreboard.incrementWin(); // Update the win count
            } else if (game.isLost()) {
                scoreboard.incrementLoss(); // Update the loss count
            }
        }
    }
}

/* Hint Function */
function getHint(game) {
    let hintLetter = game.getHintLetter();
    alert("Hint: The first letter of the movie is " + hintLetter); // Provide a hint to the player
}

/* Render Function */
function render(game) {
    document.getElementById("word").innerHTML = game.getMaskedWord(); // Display the masked word
    document.getElementById("guesses").innerHTML = "";
    game.getPossibleGuesses().forEach(function(guess) {
        let innerHtml = "<span class='guess'>" + guess + "</span>";
        document.getElementById("guesses").innerHTML += innerHtml; // Display possible guesses
    });
    document.getElementById("hangmanImage").src = `hangman${game.getIncorrectGuesses()}.png`; // Update the hangman image

    let guessBox = document.getElementById('guessBox');
    if (game.isWon()) {
        guessBox.value = youWon;
        guessBox.classList = "win"; // Style the guess box as a win
    } else if (game.isLost()) {
        guessBox.value = youLost;
        guessBox.classList = "loss"; // Style the guess box as a loss
        document.getElementById("losschange").style.backgroundColor = "red";
    } else {
        guessBox.value = "";
        guessBox.classList = "";
    }
}

/* Start Game Function */
function startGame() {
    let categorySelect = document.getElementById('category');
    let selectedCategory = categorySelect.value;
    if (!selectedCategory) {
        alert("Please select a category to start the game.");
        return;
    }

    // Hide category selection and show controls
    document.getElementById('category-selection').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    document.getElementById('guessBox').focus();

    // Initialize lives display
    document.getElementById("lives").innerHTML = `<p>Lives: 7</p>`;
    document.getElementById("hangmanImage").src = `hangman0.png`;

    // Initialize game
    window.game = new Game(selectedCategory);
    render(window.game);
    listenForInput(window.game);
}

/* New Game Function */
function newGame() {
    // Reset category selection and controls
    document.getElementById('category-selection').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('guessBox').value = "";
    document.getElementById('guessBox').classList = "";
    document.getElementById("word").innerHTML = "";
    document.getElementById("guesses").innerHTML = "";
    document.getElementById("losschange").style.backgroundColor = "";
}

/* Initialize Scoreboard */
scoreboard.update(); // Update the initial scoreboard display
