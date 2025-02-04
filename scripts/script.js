const log = (msg) => console.log(msg);

// Globala variabler
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
const startTime = oGameData.beginning;
const endTime = oGameData.ending;
const totalTime = oGameData.nmbrOfMilliseconds();
const highScoreRef = document.querySelector("#highscoreList");


// Background image

document.body.style.backgroundImage = "url(./assets/background.png)";
highScoreView.classList.add("hidden")

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
    formBtn.classList.add("hidden");
    highScoreView.classList.add("hidden");
    document.body.style.backgroundImage = "url(./assets/arena-background.png)";
    generatePokemon();

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
          pokemon.classList.remove('caught')
          stopGame(); // Avsluta spelet
        }
      } else if (pokemon.classList.contains("caught")) {
        pokemon.src = pokemon.dataset.originalSrc;
        pokemon.classList.remove("caught");
        oGameData.nmbrOfCaughtPokemons--;
      }
    });
  }
}

let pokemonNumbers = oGameData.pokemonNumbers;

function stopGame() {
  oGameData.endTimeInMilliseconds();
  let totalTime = oGameData.nmbrOfMilliseconds();
  let pokemonList = document.querySelectorAll("img");
  pokemonList.forEach((pokemon) => (pokemon.classList = "hidden"));
  audio.pause()
  audio.currentTime = 0;
  oGameData.trainerName = playerName.value
  

  let player = {
    name: oGameData.trainerName,
    time: totalTime,
  };
  const highScore = JSON.parse(localStorage.getItem("highScore")) || [];
  if (!localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", JSON.stringify(highScore));
  } 
  if (typeof totalTime === "number") {
    if (highScore.length === 0) {
      highScore.push(player);
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


    displayHighScore();
  } 
}

// Visa HighScore-vyn och ha en knapp som anropar init()
function displayHighScore() {
  document.querySelector("#highScore").classList.remove("d-none");

  if (localStorage.getItem("highScore") === null) {
    localStorage.setItem("highScore", "[]");
  }

  let highScore = JSON.parse(localStorage.getItem("highScore"));
  let totalTime = oGameData.nmbrOfMilliseconds();
  let timeInSec = totalTime / 1000;

  highScoreView.classList.remove("hidden");
  let winMsgRef = document.querySelector("#winMsg");
  winMsgRef.textContent = `Good job ${oGameData.trainerName}, you caught all pokemons in ${timeInSec} seconds!`;

  
  for (let i = 0; i < highScore.length; i++) {
    if(i < 10) {
      let timeInSec = highScore[i].time / 1000
      let individualPlayer = document.createElement("li");
      individualPlayer.textContent = `${highScore[i].name} finished the game in ${timeInSec} seconds`
      highScoreRef.appendChild(individualPlayer); 
    }  else{
      break
    }
  }
}

// Startar om spelet

playAgainBtn.addEventListener('click', () =>  {
  let images = document.querySelectorAll("img")
  images.forEach((element) => element.classList.remove("caught"))
  formBtn.classList.remove("hidden")
  highScoreView.classList.add("hidden")
  oGameData.init();
  highScoreRef.innerText = ""
  document.body.style.backgroundImage = "url(./assets/background.png)";
})


