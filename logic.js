"use strict";

const menu = document.querySelector(".menu");
const startButton = document.querySelector(".start");
const gameBox = document.querySelector(".box");
const player = document.querySelector(".player");
const enemy = document.querySelector(".enemy");

// Keep the game hidden until Start btn is clicked.
gameBox.classList.add("hidden");

let playerX = 0;
let playerY = 0;
let enemyX = 0;
let enemyY = 0;
let gameRunning = false;

const playerSpeed = 1.7;
const enemySpeed = 1.65;
const keysPressed = {};

startButton.addEventListener("click", function () {
  menu.classList.add("hidden");
  gameBox.classList.remove("hidden");

  // Rset both characters for a frsh game.
  playerX = 0;
  playerY = 0;
  enemyX = gameBox.clientWidth - enemy.offsetWidth;
  enemyY = gameBox.clientHeight - enemy.offsetHeight;

  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;
  enemy.style.left = `${enemyX}px`;
  enemy.style.top = `${enemyY}px`;

  for (const key in keysPressed) {
    keysPressed[key] = false;
  }

  gameRunning = true;
});

document.addEventListener("keydown", function (e) {
  if (e.key.startsWith("Arrow")) {
    e.preventDefault();
    keysPressed[e.key] = true;
  }
});

document.addEventListener("keyup", function (e) {
  keysPressed[e.key] = false;
});

window.addEventListener("blur", function () {
  for (const key in keysPressed) {
    keysPressed[key] = false;
  }
});

function movePlayer() {
  if (gameRunning) {
    let dx = 0;
    let dy = 0;

    if (keysPressed["ArrowUp"]) dy -= 1;
    if (keysPressed["ArrowDown"]) dy += 1;
    if (keysPressed["ArrowLeft"]) dx -= 1;
    if (keysPressed["ArrowRight"]) dx += 1;

    // Keep diangl mvmnt at the same speed as straight mvmnt.
    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }

    playerX += dx * playerSpeed;
    playerY += dy * playerSpeed;

    // Keep the plyr inside the green game area.
    playerX = Math.max(
      0,
      Math.min(playerX, gameBox.clientWidth - player.offsetWidth),
    );
    playerY = Math.max(
      0,
      Math.min(playerY, gameBox.clientHeight - player.offsetHeight),
    );

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

    // Move the enemy toward the plyrs current position.
    const differenceX = playerX - enemyX;
    const differenceY = playerY - enemyY;
    const distance = Math.hypot(differenceX, differenceY);

    if (distance > 0) {
      enemyX += (differenceX / distance) * enemySpeed;
      enemyY += (differenceY / distance) * enemySpeed;
    }

    // Keep the enemy box inside the game area.
    enemyX = Math.max(
      0,
      Math.min(enemyX, gameBox.clientWidth - enemy.offsetWidth),
    );
    enemyY = Math.max(
      0,
      Math.min(enemyY, gameBox.clientHeight - enemy.offsetHeight),
    );

    enemy.style.left = `${enemyX}px`;
    enemy.style.top = `${enemyY}px`;

    // collide
    const touching =
      playerX < enemyX + enemy.offsetWidth &&
      playerX + player.offsetWidth > enemyX &&
      playerY < enemyY + enemy.offsetHeight &&
      playerY + player.offsetHeight > enemyY;

    if (touching) {
      gameRunning = false;
      for (const key in keysPressed) {
        keysPressed[key] = false;
      }
      alert("Caught! Game over!");
    }
  }

  requestAnimationFrame(movePlayer);
}

movePlayer();
