const log = (msg) => console.log(msg);

setUpGame();

// Vi sätter bakgrundsbilden och lägger till eventlistener
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

// Validerar formet - retunerar true om alla parametrar uppnås
function validateForm() {
  oGameData.trainerName = document.getElementById('nick');
  oGameData.trainerAge = document.getElementById('age');

  const playerBoy = document.getElementById('boy');
  const playerGirl = document.getElementById('girl');

  try {
    if (
      oGameData.trainerName.value.length < 5) {
      throw { message: 'Nickname must be at least 5 characters', target: oGameData.trainerName };
    } else if( oGameData.trainerName.value.length > 10) {
      throw { message: "Nickname can't be longer than 15 characters", target: oGameData.trainerName };
    } else if (isNaN(oGameData.trainerAge.value) || oGameData.trainerAge.value === '') {
      throw { message: 'Age must be a number', target: oGameData.trainerAge };
    } else if (
      oGameData.trainerAge.value < 10) {
      throw { message: 'Trainer must be at least 10 years old', target: oGameData.trainerAge };
    } else if(oGameData.trainerAge.value > 15)  {
      throw { message: "Trainer can't be older than 15 years", target: oGameData.trainerAge };
    } else if (playerBoy.checked === false && playerGirl.checked === false) {
      // playerBoy.classList.add('red-border');
      // playerGirl.classList.add('red-border');
      throw { message: 'You must select a gender', target: playerBoy};
    }
    return true;
  } catch (error) {
    document.querySelector('#errorMsg').textContent = error.message;
    error.target.focus();
    return false;
  }
}


// Om valideringen lyckas => Startar musiken, timern, byter bakgrund, och börjar generera pokemons
function startGame() {
  if (validateForm()) {
    oGameData.audio = document.querySelector('audio');
    oGameData.audio.volume = 0.05;
    oGameData.audio.play();
    oGameData.startTimeInMilliseconds();
    oGameData.formBtn.classList.add('hidden');
    oGameData.highScoreView.classList.add('hidden');
    document.body.style.backgroundImage = 'url(./assets/arena-background.png)';
    generatePokemon();
  }
}

// tar in de 10 slumpade numren och gör bilder av dem, och när man hovrar så ändras det till pokeball, vid 10 st fångde stoppar vi spelet
function generatePokemon() {
  const gameField = document.getElementById('gameField');
  
  oGameData.pokemonNumbers = getRandomPokemonNum();

  for (const pokemonNumber of oGameData.pokemonNumbers) {
    const pokemon = createPokemonElement(pokemonNumber);
    gameField.appendChild(pokemon);
    updatePokemonPosition(pokemon);
    startPokemonMovement(pokemon);

    pokemon.addEventListener('mouseover', () => {
      if (!pokemon.classList.contains('caught')) {
        pokemon.dataset.originalSrc = pokemon.src; 
        pokemon.src = './assets/ball.webp';
        pokemon.classList.add('caught');
        oGameData.nmbrOfCaughtPokemons++; 

        if (oGameData.nmbrOfCaughtPokemons === 10) {
          stopGame();
        }
        
      } else if (pokemon.classList.contains('caught')) {
        pokemon.src = pokemon.dataset.originalSrc;
        pokemon.classList.remove('caught');
        oGameData.nmbrOfCaughtPokemons--;
      }
    });
  }
}

// Returnerar en lista med 10 random nummer mellan 1 och 151
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

// Vi skapar en pokemon med en bild beroende på numret och returnerar den 
function createPokemonElement(pokemonNumber) {
  const pokemon = document.createElement('img');

  pokemon.src = `./assets/pokemons/${pokemonNumber}.png`;
  pokemon.style.position = 'absolute';
  pokemon.classList.add('individualPokemon');
  return pokemon;
}

// Slumpa fram en random position var 3 sekunder, och ge varje individuell pokemon en egen position
function updatePokemonPosition(pokemon) {
  pokemon.style.left = `${oGameData.getLeftPosition()}px`;
  pokemon.style.top = `${oGameData.getTopPosition()}px`;
}

// Kör updatePokemonPosition() var tredje sekund
function startPokemonMovement(pokemon) {
  setInterval(() => {
    updatePokemonPosition(pokemon);
  }, 3000);
}

// Tiden stoppas och vi räknar ut totala tiden, vi döljer alla bilder, stoppar ljudet och återställer det
// Vi skapar ett objekt för spelaren,
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

// Visar highscore-sektionen, skapar upp li-element för de 10 bästa resultaten
// Lägger till eventlistener på spela-igen-knappen, återställer spelet

function displayHighScore(highScoresList) {
  document.querySelector('#highScore').classList.remove('hidden');

  let timeInSec = oGameData.totalTime / 1000;
  oGameData.highScoresRef = document.querySelector('#highscoreList');
  let winMsgRef = document.querySelector('#winMsg');
  winMsgRef.textContent = `Player: ${oGameData.trainerName.value}, Time: ${timeInSec} s`;

  highScoresList.forEach(() =>  {})
  for (let i = 0; i < highScoresList.length; i++) {
    if (i < 10) {
      let timeInSec = highScoresList[i].time / 1000;
      let individualPlayer = document.createElement('li');
      individualPlayer.textContent = `Player: ${highScoresList[i].name}, Time: ${timeInSec} seconds`;
      oGameData.highScoresRef.appendChild(individualPlayer);
    } 
  }

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    let images = document.querySelectorAll('img');
    images.forEach((image) => image.classList.remove('caught'));
    oGameData.formBtn.classList.remove('hidden');
    oGameData.highScoreView.classList.add('hidden');
    oGameData.init();
    oGameData.highScoresRef.innerText = '';
    document.body.style.backgroundImage = 'url(./assets/background.png)';
  });
}



