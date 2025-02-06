const oGameData = {
  pokemonNumbers : [],
  nmbrOfCaughtPokemons : 0,
  startTime : 0,
  endTime : 0,
  timerId : null,
  trainerName : '',
  trainerAge : 0,
  trainerGender : '',
  // Metod som nollställer datan i oGameData
  init: function () {
      this.pokemonNumbers = [];
      this.nmbrOfCaughtPokemons = 0;
      this.startTime = 0;
      this.endTime = 0;
      this.timerId = null;
      this.nmbrOfSeconds = 0;
      this.trainerName = '';
      this.trainerAge = 0;
      this.trainerGender = '';
  },
  // Metod som slumpar fram ett tal som förhåller sig mellan 0 och webbläsarens bredd minus bildens bredd
  getLeftPosition : () => {
      let nmbr = Math.round(Math.random() * ( window.innerWidth - 300)) + 1;
      return nmbr;
  },
  // Metod som slumpar fram ett tal som förhåller sig mellan 0 och webbläsarens höjd minus bildens höjd
  getTopPosition : () => {
      let nmbr = Math.round(Math.random() * ( window.innerHeight - 300)) + 1;
      return nmbr;
  },
  // Metod som hämtar antalet millisekunder sedan 1 januari 1970 och placerar värdet i beginning attributet
  startTimeInMilliseconds : function() {
      this.startTime =  Date.now();
  },

  // Metod som hämtar antalet millisekunder sedan 1 januari 1970 och placerar värdet i ending attributet
  endTimeInMilliseconds : function() {
      this.endTime = Date.now();
  },

  // Metod som räknar ut och returnerar antalet millisekunder det tog att fånga alla 10 pokemons
  nmbrOfMilliseconds: function() {
      return this.endTime - this.startTime;
  }
}