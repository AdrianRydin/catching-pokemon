const log = (msg) => console.log(msg);

setUpGame();

function setUpGame() {
  document.body.style.backgroundImage = 'url(./assets/background.png)';
  // Klassen d-none finns redan i html, om vi vill ta bort dessa rader kod kan vi byta ut klassnamnet hidden mot d-none
  oGameData.highScoreView = document.getElementById('highScore');
  oGameData.highScoreView.classList.add('hidden');

  oGameData.formBtn = document.getElementById('form');
  oGameData.formBtn.addEventListener('submit', (event) => {
    event.preventDefault();
    startGame();
  });
}

// Background image

function validateForm() {
  oGameData.trainerName = document.getElementById('nick');
  oGameData.trainerAge = document.getElementById('age');

  const playerBoy = document.getElementById('boy');
  const playerGirl = document.getElementById('girl');

  // Vi behöver få upp detta på skärmen och skapa mer detaljerade felmeddelanden om exakt vad som gick fel
  try {
    if (
      oGameData.trainerName.value.length < 5 ||
      oGameData.trainerName.value.length > 10
    ) {
      throw { message: 'Name wrong', target: oGameData.trainerName };
    } else if (isNaN(oGameData.trainerAge.value)) {
      throw { message: 'Age must be a number', target: oGameData.trainerAge };
    } else if (
      oGameData.trainerAge.value < 10 ||
      oGameData.trainerAge.value > 15
    ) {
      throw { message: 'Age wrong', target: oGameData.trainerAge };
    } else if (playerBoy.checked === false && playerGirl.checked === false) {
      playerBoy.classList.add('red-border');
      playerGirl.classList.add('red-border');
      throw { message: 'Gender wrong', target: playerBoy, playerGirl };
    }
    oGameData.trainerName = oGameData.trainerName.value;
    return true;
  } catch (error) {
    console.log(error.message);
    error.target.focus();
    return false;
  }
}

function startGame(event) {
  if (validateForm()) {
    oGameData.audio = document.querySelector('audio');
    oGameData.audio.volume = 0.005;
    oGameData.audio.play();
    oGameData.startTimeInMilliseconds();
    oGameData.formBtn.classList.add('hidden');
    oGameData.highScoreView.classList.add('hidden');
    document.body.style.backgroundImage = 'url(./assets/arena-background.png)';
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
      randomNumber = '00' + randomNumber;
    } else if (randomNumber.length === 2) {
      randomNumber = '0' + randomNumber;
    }

    tenPokemonNumbers.push(randomNumber);
  }
  return tenPokemonNumbers;
}

//Skapar ett pokemon element som en img tag

function createPokemonElement(pokemonNumber) {
  const pokemon = document.createElement('img');

  pokemon.src = `./assets/pokemons/${pokemonNumber}.png`;
  pokemon.style.position = 'absolute';
  pokemon.classList.add('individualPokemon');
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
  const gameField = document.getElementById('gameField');
  
  oGameData.pokemonNumbers = getRandomPokemonNum();

  for (const pokemonNumber of oGameData.pokemonNumbers) {
    const pokemon = createPokemonElement(pokemonNumber);
    gameField.appendChild(pokemon);
    updatePokemonPosition(pokemon);
    startPokemonMovement(pokemon);

    // Hover-event: Byt till pokéboll, markera som fångad och stoppa rörelsen
    pokemon.addEventListener('mouseover', () => {
      if (!pokemon.classList.contains('caught')) {
        pokemon.dataset.originalSrc = pokemon.src; // Spara originalbilden
        pokemon.src = './assets/ball.webp'; // Byt till pokéboll
        pokemon.classList.add('caught'); // Markera som fångad
        oGameData.nmbrOfCaughtPokemons++; // Räkna fångade Pokémon

        // Kolla om alla Pokémon är fångade

        if (oGameData.nmbrOfCaughtPokemons === 10) {
          pokemon.classList.remove('caught');
          stopGame(); // Avsluta spelet
        }
      } else if (pokemon.classList.contains('caught')) {
        pokemon.src = pokemon.dataset.originalSrc;
        pokemon.classList.remove('caught');
        oGameData.nmbrOfCaughtPokemons--;
      }
    });
  }
}

function stopGame() {
  oGameData.endTimeInMilliseconds();
  oGameData.totalTime = oGameData.nmbrOfMilliseconds();
  let pokemonList = document.querySelectorAll('img');
  pokemonList.forEach((pokemon) => (pokemon.classList = 'hidden'));
  oGameData.audio.pause();
  oGameData.audio.currentTime = 0;

  let player = {
    name: oGameData.trainerName.value,
    time: oGameData.totalTime,
  };
  const highScore = JSON.parse(localStorage.getItem('highScore')) || [];
  if (!localStorage.getItem('highScore')) {
    localStorage.setItem('highScore', JSON.stringify(highScore));
  }
  if (typeof oGameData.totalTime === 'number') {
    if (highScore.length === 0) {
      highScore.push(player);
    } else {
      let inserted = false;
      for (let i = 0; i < highScore.length; i++) {
        if (oGameData.totalTime < highScore[i].time) {
          highScore.splice(i, 0, player);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        highScore.push(player);
      }
    }
    localStorage.setItem('highScore', JSON.stringify(highScore));

    displayHighScore(highScore);
  }
}

// Visa HighScore-vyn och ha en knapp som anropar init()
function displayHighScore(highScoresList) {
  document.querySelector('#highScore').classList.remove('hidden');

  let timeInSec = oGameData.totalTime / 1000;
  oGameData.highScoresRef = document.querySelector('#highscoreList');
  let winMsgRef = document.querySelector('#winMsg');
  winMsgRef.textContent = `Good job ${oGameData.trainerName}, you caught all pokemons in ${timeInSec} seconds!`;

  for (let i = 0; i < highScoresList.length; i++) {
    if (i < 10) {
      let timeInSec = highScoresList[i].time / 1000;
      let individualPlayer = document.createElement('li');
      individualPlayer.textContent = `${highScoresList[i].name} finished the game in ${timeInSec} seconds`;
      oGameData.highScoresRef.appendChild(individualPlayer);
    } 
  }
  document.getElementById('playAgainBtn').addEventListener('click', () => {
    let images = document.querySelectorAll('img');
    images.forEach((element) => element.classList.remove('caught'));
    oGameData.formBtn.classList.remove('hidden');
    oGameData.highScoreView.classList.add('hidden');
    oGameData.init();
    oGameData.highScoresRef.innerText = '';
    document.body.style.backgroundImage = 'url(./assets/background.png)';
  });
}

// Startar om spelet


