const circle = document.getElementById("circle");
const player1ScoreElem = document.getElementById("player1-score");
const player2ScoreElem = document.getElementById("player2-score");
const player1Bar = document.getElementById("player1-bar");
const player2Bar = document.getElementById("player2-bar");
const player1NameElem = document.getElementById("player1-name");
const player2NameElem = document.getElementById("player2-name");
const maxScore = 10; // max puntuación

let player1Score = 0;
let player2Score = 0;
let player1Name = "Jugador 1";
let player2Name = "Jugador 2";
let gameRunning = false;
let circleTimeout = null; 

const gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];

// configuracion y actualizacion
function loadScores() {
  const savedScores = localStorage.getItem("gameScores");
  if (savedScores) {
    const scores = JSON.parse(savedScores);
    player1Score = scores.player1 || 0;
    player2Score = scores.player2 || 0;
  }
}

function saveScores() {
  const scores = {
    player1: player1Score,
    player2: player2Score,
  };
  localStorage.setItem("gameScores", JSON.stringify(scores));
}

function getRandomPosition() {
  const gameArea = document.querySelector(".game-area");
  const maxX = gameArea.offsetWidth - 50;
  const maxY = gameArea.offsetHeight - 50;
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY,
  };
}

function showCircle() {
  const { x, y } = getRandomPosition();
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.display = "block";
}

function hideCircle() {
  circle.style.display = "none";
}

function updateBars() {
  player1Bar.style.width = `${(player1Score / maxScore) * 100}%`;
  player2Bar.style.width = `${(player2Score / maxScore) * 100}%`;
}

function updateScores() {
  player1ScoreElem.textContent = player1Score;
  player2ScoreElem.textContent = player2Score;
  updateBars();
}

function saveGameResult() {
  const gameResult = {
    player1: { name: player1Name, score: player1Score },
    player2: { name: player2Name, score: player2Score },
  };
  gameHistory.push(gameResult);
  localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  renderHistory();
}

function checkForWinner() {
  if (player1Score >= maxScore || player2Score >= maxScore) {
    const winner = player1Score >= maxScore ? player1Name : player2Name;
    alert(`¡${winner} ganó!`);
    saveGameResult();
    resetGame();
  }
}

// reiniciar el juego
function resetGame() {
  player1Score = 0;
  player2Score = 0;
  updateScores();
  gameRunning = false; 
  clearTimeout(circleTimeout); 
  hideCircle(); 
  startGame(); 
}

// puntos
document.addEventListener("keydown", (event) => {
  if (!gameRunning || circle.style.display !== "block") return;

  if (event.key.toLowerCase() === "a") {
    player1Score++;
    updateScores();
    saveScores();
    hideCircle();
    checkForWinner();
  } else if (event.key.toLowerCase() === "l") {
    player2Score++;
    updateScores();
    saveScores();
    hideCircle();
    checkForWinner();
  }
});

// actualizar nombres
document.getElementById("formulario-jugadores").addEventListener("submit", (event) => {
  event.preventDefault();
  player1Name = document.getElementById("jugador1").value.trim() || "Jugador 1";
  player2Name = document.getElementById("jugador2").value.trim() || "Jugador 2";

  player1NameElem.textContent = player1Name;
  player2NameElem.textContent = player2Name;

  alert("Nombres actualizados. Si tenés reflejos, ganás.");
});

// historial
function renderHistory() {
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";
  gameHistory.forEach((game, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Partida ${index + 1}: ${game.player1.name} (${game.player1.score}) - ${game.player2.name} (${game.player2.score})`;
    historyList.appendChild(listItem);
  });
}

// func iniciar
function startGame() {
  if (gameRunning) return; 
  gameRunning = true;

  function gameLoop() {
    showCircle();
    circleTimeout = setTimeout(() => {
      hideCircle();
      if (gameRunning) gameLoop();
    }, Math.random() * 2000 + 1000);
  }

  gameLoop();
}

// cargar datos e iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadScores();
  updateScores();
  renderHistory();
  startGame();
});
