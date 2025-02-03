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

    return true;
  } catch (error) {
    console.log(error.message);
    error.target.focus();
    return false;
  }
}

function startGame(event) {
  if (validateForm()) {
    log("de e true");
    audio.volume = 0.005;
    audio.play();
    oGameData.startTimeInMilliseconds();
    log(oGameData.beginning);
    generatePokemon();
  } else {
    log("de e false");
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

    log(randomNumber);
    tenPokemonNumbers.push(randomNumber);
  }
  return tenPokemonNumbers;
}

//Skapar ett pokemon element som en img tag

function createPokemonElement(pokemonNumber) {
  const pokemon = document.createElement("img");
  pokemon.src = `./assets/pokemons/${pokemonNumber}.png`;
  pokemon.style.position = "absolute";
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

    startPokemonMovement(pokemon);

    // Hover-event: Byt till pokéboll, markera som fångad och stoppa rörelsen
    pokemon.addEventListener("mouseover", () => {
      if (!pokemon.classList.contains("caught")) {
        pokemon.dataset.originalSrc = pokemon.src; // Spara originalbilden
        pokemon.src = "./assets/ball.webp"; // Byt till pokéboll
        pokemon.classList.add("caught"); // Markera som fångad
        oGameData.nmbrOfCaughtPokemons++; // Räkna fångade Pokémon

        // Kolla om alla Pokémon är fångade

        log(pokemon);
        console.log(oGameData.nmbrOfCaughtPokemons);
        if (oGameData.nmbrOfCaughtPokemons === 10) {
          stopGame(); // Avsluta spelet
        } else {
          log("spelet fortsätter");
        }
      }
    });
  }
}

let pokemonNumbers = oGameData.pokemonNumbers;
console.log(typeof pokemonNumbers);

function stopGame() {
  log("hej");
  oGameData.endTime = oGameData.endTimeInMilliseconds();
  let totalTime = oGameData.nmbrOfMilliseconds();
  const highScore = JSON.parse(localStorage.getItem("highScore")) || [];

  if (!localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", JSON.stringify(highScore));
    log("Array stored in LS");
  } else {
    log("Array already exists in LS");
  }

  if (typeof totalTime === "number") {
    if (highScore.length === 0) {
      highScore.push(totalTime);
      log("First score added:", highScore);
    } else {
      let inserted = false;
      for (let i = 0; i < highScore.length; i++) {
        if (totalTime < highScore[i]) {
          highScore.splice(i, 0, totalTime);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        highScore.push(totalTime);
      }
    }
    localStorage.setItem("highScore", JSON.stringify(highScore));

    log("Updated LocalStorage:", highScore);
  } else {
    log("TotalTime is not a number");
  }
}

/* function checkForGameOver() {
  let pokemonRefs = document.querySelectorAll(".pokemon");
  let ballRefs = document.querySelectorAll(".ball");

  let isWinner = [...pokemonRefs].every((pokemon) => {
    return pokemon.className.includes("d-none");
  });
  if (isWinner === true) {
    ballRefs.forEach((ball) => {
      ball.classList.add("d-none");
    });
    oGameData.endTime = oGameData.endTimeInMilliseconds();
    displayHighScore();
  }
}
 */

// Visa HighScore-vyn och ha en knapp som anropar init()
