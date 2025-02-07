"use strict";

let diceNumber = 5;
let score = [0, 0];
let current = [0, 0];
let player = 0;
let number = 0;
let probAtaque = 60;

function breath(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hand() {
  if ((current[1] > 10 && current[1] < 30) || probAtaque >= 100) {
    probAtaque -= 5;
  } else if (current[1] >= 30) {
    probAtaque -= 20;
  }
}

function brain() {
  if (score[0] - score[1] >= 20) {
    probAtaque += probAtaque / 3 + 20;
  } else if (score[1] - score[0] >= 20 && score[1] >= 40) {
    probAtaque -= probAtaque / 3 + 20;
  }
}

async function pushButton() {
  if (player == 1) {
    number = Math.round(Math.random() * 100);

    hand();

    console.log(probAtaque, number);

    await breath(1000);

    rollDice();
    if (diceNumber <= 1) {
      return 5;
    } else {
      if (number > probAtaque) {
        if (diceNumber != 1) {
          await breath(1000);
          holdNumber();
        }
      } else {
        if (diceNumber != 1) {
          pushButton();
        }
      }
    }
  }
}

function hideButton() {
  document.querySelector(".btn--roll").style.visibility = "hidden";
  document.querySelector(".btn--hold").style.visibility = "hidden";
}

function showButton() {
  document.querySelector(".btn--roll").style.visibility = "visible";
  document.querySelector(".btn--hold").style.visibility = "visible";
}

function checkWinner() {
  document.querySelector(".btn--new").addEventListener("click", newGame);
  hideButton();
  if (score[0] >= 100) {
    document.querySelector(".player--0").classList.add("player--winner");
  } else {
    document.querySelector(".player--1").classList.add("player--winner");
  }
}

function choosePlayer() {
  document
    .querySelector(`.player--${player}`)
    .classList.remove("player--active");
  if (score[0] >= 100 || score[1] >= 100) {
    checkWinner();
  } else if (player === 1) {
    player = 0;
    showButton();
  } else if (player === 0) {
    player = 1;
    probAtaque = 60;
    brain();
    hideButton();
    pushButton();
  }
  document.querySelector(`.player--${player}`).classList.add("player--active");
}

function newGame() {
  player = 0;
  score = [0, 0];
  current = [0, 0];
  probAtaque = 60;
  var score_0 = document.querySelector("#score--0");

  score_0.textContent = `${score[0]}`;
  document.querySelector("#score--1").textContent = `${score[1]}`;
  document.querySelector("#current--0").textContent = `${current[0]}`;
  document.querySelector("#current--1").textContent = `${current[1]}`;
  document.querySelector(".player--0").classList.remove("player--winner");
  document.querySelector(".player--1").classList.remove("player--winner");
  document.querySelector(".btn--new").addEventListener("click", newGame);
  document.querySelector(".btn--roll").addEventListener("click", rollDice);
  document.querySelector(".btn--hold").addEventListener("click", holdNumber);
  showButton();
}

function rollDice() {
  diceNumber = Math.round(Math.random() * (6 - 1) + 1);
  document.querySelector(".dice").src = `dice-${diceNumber}.png`;
  current[player] += diceNumber;
  document.querySelector(`#current--${player}`).textContent = current[player];
  if (diceNumber === 1) {
    hideButton();
    current[player] = 0;
    document.querySelector(`#current--${player}`).textContent = 0;
    choosePlayer();
  }
}

function holdNumber() {
  score[player] += current[player];
  document.querySelector(`#score--${player}`).textContent = score[player];
  current[player] = 0;
  // diceNumber = 0;
  document.querySelector(`#current--${player}`).textContent = 0;
  choosePlayer();
}

document.querySelector(".btn--new").addEventListener("click", newGame);
document.querySelector(".btn--roll").addEventListener("click", rollDice);
document.querySelector(".btn--hold").addEventListener("click", holdNumber);
