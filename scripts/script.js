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

let totalTimeM = oGameData.nmbrOfMilliseconds();
// Validering av formulär, age, gender, name
// Om validering misslyckas, meddela och visa vart det gick fel.
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

// Vid lyckad validering, Starta musik som börjar vid spel start, starta även timer
formBtn.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateForm()) {
    log("de e true");
    audio.volume = 0.005;
    audio.play();
    oGameData.startTimeInMilliseconds();
    log(oGameData.beginning);
  } else {
    log("de e false");
  }
});

playAgainBtn.addEventListener("click", () => {
  oGameData.endTimeInMilliseconds();
  log(oGameData.ending);

  log(parseInt(totalTimeM));
});

// Slumpa fram 10 stycken pokemon från assets och visa de på skärmen, pokemon har bredd och höjd 300px

// Slumpa fram en random position var 3 sekunder, och ge varje individuell pokemon en egen position.

// vid hover event på pokemon, byt bilden från pokemon till pokeboll

// vid hover event på pokeball, återställ bilden till den originala pokemon

// Om alla bilder är pokeballs, sluta spelet. Stoppa timern.

// Spara tiden som spelet hade med key HighScore i localStorage, och jämför med HighScore array, och ta in den i arrayen om tiden är mindre än de första 10.

// vänd på arrayen, så att första värdet är [9], och loopa igenom tills tiden som sparades i spelet, inte är mindre än nästa värde.

// Visa HighScore-vyn och ha en knapp som anropar init()
