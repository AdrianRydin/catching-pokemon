const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod
const playerName = document.getElementById("nick");
const playerAge = document.getElementById("age");
const playerBoy = document.getElementById("boy");
const playerGirl = document.getElementById("girl");
const music = document.getElementById("pokemonMusic");
const welcomeText = document.getElementById("welcomeText");
const playAgainBtn = document.getElementById("playAgainBtn");

const formBtn = document.getElementById("form");
const audio = document.querySelector("audio");
const highScoreView = document.getElementById("highScore");

const randomPokemonNumbers = [];

const startTime = oGameData.beginning;
const endTime = oGameData.ending;
const totalTime = oGameData.nmbrOfMilliseconds();

// Validering av formulär, age, gender, name
// Om validering misslyckas, meddela och visa vart det gick fel.

// document.body.style.backgroundImage = "url(./assets/arena-background.png)";

formBtn.addEventListener("submit", (event) => {
  event.preventDefault();
  startGame();
});

function validateForm() {
  try {
    if (playerName.value.length < 5 || playerName.value.length > 10) {
      throw { message: "Name wrong", target: playerName };
    } else if (isNaN(playerAge.value)) {
      throw { message: "Age must be a number", target: playerAge };
    } else if (playerAge.value < 10 || playerAge.value > 15) {
      throw { message: "Age wrong", target: playerAge };
    } else if (playerBoy.checked === false && playerGirl.checked === false) {
      playerBoy.classList.add("red-border");
      playerGirl.classList.add("red-border");
      throw { message: "Gender wrong", target: playerBoy, playerGirl };
    }
    oGameData.trainerName = playerName.value;
    return true;
  } catch (error) {
    console.log(error.message);
    error.target.focus();
    return false;
  }
}

function startGame(event) {
  if (validateForm()) {
    audio.volume = 0.005;
    audio.play();
    oGameData.startTimeInMilliseconds();
    generatePokemon();
    formBtn.classList.add("hidden");
    highScoreView.classList.add("hidden");
  }
}

// Vid lyckad validering, Starta musik som börjar vid spel start, starta även timer

function getRandomPokemonNum() {
  const tenPokemonNumbers = [];

  while (tenPokemonNumbers.length < 10) {
    let randomNumber = Math.floor(Math.random() * 151) + 1;

    randomNumber = randomNumber.toString();
    if (randomNumber.length === 1) {
      randomNumber = "00" + randomNumber;
    } else if (randomNumber.length === 2) {
      randomNumber = "0" + randomNumber;
    }

    tenPokemonNumbers.push(randomNumber);
  }
  return tenPokemonNumbers;
}

//Skapar ett pokemon element som en img tag

function createPokemonElement(pokemonNumber) {
  const pokemon = document.createElement("img");
  pokemon.src = `./assets/pokemons/${pokemonNumber}.png`;
  pokemon.style.position = "absolute";
  pokemon.classList.add("individualPokemon");
  return pokemon;
}

// Slumpa fram en random position var 3 sekunder, och ge varje individuell pokemon en egen position.

function updatePokemonPosition(pokemon) {
  pokemon.style.left = `${oGameData.getLeftPosition()}px`;
  pokemon.style.top = `${oGameData.getTopPosition()}px`;
}

// Sätter timer på rörelsen

function startPokemonMovement(pokemon) {
  const intervalId = setInterval(() => {
    updatePokemonPosition(pokemon);
  }, 3000);
  return intervalId;
}

function generatePokemon() {
  const gameField = document.getElementById("gameField");
  const randomPokemonNumbers = getRandomPokemonNum();
  oGameData.pokemonNumbers = randomPokemonNumbers;

  for (const pokemonNumber of randomPokemonNumbers) {
    const pokemon = createPokemonElement(pokemonNumber);
    gameField.appendChild(pokemon);
    updatePokemonPosition(pokemon);
    startPokemonMovement(pokemon);

    // Hover-event: Byt till pokéboll, markera som fångad och stoppa rörelsen
    pokemon.addEventListener("mouseover", () => {
      if (!pokemon.classList.contains("caught")) {
        pokemon.dataset.originalSrc = pokemon.src; // Spara originalbilden
        pokemon.src = "./assets/ball.webp"; // Byt till pokéboll
        pokemon.classList.add("caught"); // Markera som fångad
        oGameData.nmbrOfCaughtPokemons++; // Räkna fångade Pokémon

        // Kolla om alla Pokémon är fångade

        if (oGameData.nmbrOfCaughtPokemons === 10) {
          log(`Caught all ${oGameData.nmbrOfCaughtPokemons} pokemons!`);
          stopGame(); // Avsluta spelet
        }
      }
    });
  }
}

let pokemonNumbers = oGameData.pokemonNumbers;

function stopGame() {
  oGameData.endTime = oGameData.endTimeInMilliseconds();
  let totalTime = oGameData.nmbrOfMilliseconds();
  let pokemonList = document.querySelectorAll("img");
  log(pokemonList);
  pokemonList.forEach((pokemon) => (pokemon.classList = "hidden"));

  let player = {
    name: oGameData.trainerName,
    time: totalTime,
  };
  const highScore = JSON.parse(localStorage.getItem("highScore")) || [];
  if (!localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", JSON.stringify(highScore));
    log("Array stored in LS");
  } else {
    log("Array already exists in LS");
  }

  if (typeof totalTime === "number") {
    if (highScore.length === 0) {
      highScore.push(player);
      log("First score added:", player);
    } else {
      let inserted = false;
      for (let i = 0; i < highScore.length; i++) {
        if (totalTime < highScore[i].time) {
          highScore.splice(i, 0, player);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        JSON.stringify(player);
        highScore.push(player);
      }
    }
    localStorage.setItem("highScore", JSON.stringify(highScore));

    log("Updated LocalStorage:", player);
    displayHighScore();
  } else {
    log("TotalTime is not a number");
  }
}

// Visa HighScore-vyn och ha en knapp som anropar init()
function displayHighScore() {
  document.querySelector("#highScore").classList.remove("d-none");

  if (localStorage.getItem("highScore") === null) {
    localStorage.setItem("highScore", "[]");
  }

  oGameData.init();

  let highScore = JSON.parse(localStorage.getItem("highScore"));
  let totalTime = oGameData.nmbrOfMilliseconds();
  let timeInSec = totalTime / 1000;

  for (let i = 0; i < 10; i++) {
    log(highScore[i]);
  }
  highScoreView.classList.remove("hidden");
  let winMsgRef = document.querySelector("#winMsg");
  winMsgRef.textContent = `Good job ${oGameData.trainerName}, you caught all pokemons in ${timeInSec} seconds!`;

  let highScoreRef = document.querySelector("#highscoreList");
  highScoreRef.textContent = "";
  highScore.forEach(() => {
    let highScoreLi = document.createElement("li");
    let textStr = `Player: ${oGameData.trainerName}, Time: ${timeInSec}s`;
    highScoreLi.textContent = textStr;
  });
}
