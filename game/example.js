
const cards = document.querySelectorAll('.card');
const timer = document.querySelector('.timer');
const start = document.querySelector('button');
let scoreValue = document.getElementById("score-value");
let moves = document.getElementById("counter-value");

let cardOne, cardTwo;
let disableDeck = false;
let matchedCard = 0;
let elapsedTime = 0;

const state = {
    gameStarted: false,
    loop: null
}

let gameWon = false; // add a flag to keep track of whether the game has been won or not

function flipCard(e) {
  let clickedCard = e.target;

  if (clickedCard !== cardOne && !disableDeck) {
    clickedCard.classList.add('flip');

    if (!cardOne) {
      return cardOne = clickedCard;
    }
    cardTwo = clickedCard;

    disableDeck = true;

    let cardOneImg = cardOne.querySelector('img').src,
      cardTwoImg = cardTwo.querySelector('img').src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  let count = parseInt(moves.textContent) - 1;
  moves.textContent = count;
  if(count<0) {
    setTimeout(() => {
      alert("You lost the game");
      scoreValue.textContent = 0;
      moves.textContent = 20;
      elapsedTime = 0; // reset the timer
      timer.innerText = `Time: ${elapsedTime} sec`;
      gameWon = false; // reset the gameWon flag
      return startGame();
    }, 1200);
  }
  
  if (count == 0 &&  scoreValue.textContent +1< 8) {
    setTimeout(() => {
      alert("You lost the game");
      scoreValue.textContent = 0;
      moves.textContent = 20;
      elapsedTime = 0; // reset the timer
      timer.innerText = `Time: ${elapsedTime} sec`;
      gameWon = false; // reset the gameWon flag

      return startGame();
    }, 1200);
  }
  if (img1 === img2) {
    matchedCard++;
    scoreValue.textContent = matchedCard;
    if (matchedCard == 8) {
      gameWon = true; // set the gameWon flag to true
      const score = matchedCard; // replace with your actual score value
fetch('/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ score: score })
})
.then(response => {
  console.log(response);
})
.catch(error => {
  console.error(error);
});

      setTimeout(() => {
        document.querySelector('.audio-win').play();
        scoreValue.textContent = 0;
        moves.textContent = 20;
        elapsedTime = 0; // reset the timer
        timer.innerText = `Time: ${elapsedTime} sec`;
        start.disabled = false;
         if(gameWon)
           alert("You won the game!!");
 
        return startGame();
      }, 1200);
    }
    document.querySelector(`.audio-3`).play();

    cardOne.removeEventListener('click', flipCard);
    cardTwo.removeEventListener('click', flipCard);
    cardOne = cardTwo = '';
    return disableDeck = false;
  } else {

    setTimeout(() => {
      cardOne.classList.add('shake');
      cardTwo.classList.add('shake');
      document.querySelector(`.audio-1`).play();
    }, 400);

    setTimeout(() => {
      cardOne.classList.remove('shake', 'flip');
      cardTwo.classList.remove('shake', 'flip');
      cardOne = cardTwo = '';

      disableDeck = false;

    }, 1200);
  }
 
}

function shuffleCard() {
  matchedCard = 0;
  cardOne = cardTwo = "";

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);

  cards.forEach((card, index) => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);

    let imgTag = card.querySelector('img');
    imgTag.src = `images/img-${arr[index]}.png`;
  });
}

function updateTimer() {
  // only update the timer if the game is not yet won
    elapsedTime++;
    timer.innerText = `Time: ${elapsedTime} sec`;
}

function startGame() {
  shuffleCard();
  start.disabled = true;
  setInterval(updateTimer, 1000);
}

start.addEventListener('click', startGame);

cards.forEach((card) => {
  card.addEventListener('click', flipCard);

});


