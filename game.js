// ESTIMIO - VERSIÓN LIMPIA Y FUNCIONAL

// Estados
const ST = { INTRO: 'INTRO', MENU: 'MENU', PLAY: 'PLAY' };
let state = ST.INTRO;
let mission = null;

// Intro
let typeIdx = 0;
let typingTimer = 0;
const lines = [
  "En un laboratorio de Hermosillo llamado CiTIAM Labs, vive un simio inventor.",
  "Su nombre es Estimio y cree que la basura es… potencial.",
  "El calor aprieta. La sombra escasea. Pero con piezas recicladas…",
  "…Estimio construirá máquinas que sanen la ciudad.",
  "Tu misión: reunir piezas, fabricar Eco-Bots y desplegarlos donde más se necesiten."
];

// Setup
function setup() {
  createCanvas(960, 540);
  textFont('Courier New');
  console.log('✅ JUEGO INICIADO');
}

// Loop principal
function draw() {
  background(26, 26, 46);
  
  if (state === ST.INTRO) {
    drawIntro();
  } else if (state === ST.MENU) {
    drawMenu();
  } else if (state === ST.PLAY) {
    drawGame();
  }
}

// Input
function keyPressed() {
  if (state === ST.INTRO) {
    if (keyCode === ENTER || key === 'z' || key === 'Z') {
      nextLine();
    }
    if (key === ' ' || keyCode === ESCAPE) {
      state = ST.MENU;
    }
  } else if (state === ST.MENU) {
    if (key === '1') startMission('ARBot-HMO');
    if (key === '2') startMission('Recicla-Planta');
  } else if (state === ST.PLAY) {
    if (keyCode === ESCAPE) {
      state = ST.MENU;
    }
  }
}

// INTRO
function drawIntro() {
  // Sprite grande
  push();
  fill(139, 69, 19);
  rect(width/2 - 80, 100, 160, 160, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text('🐵', width/2, 180);
  pop();
  
  // Máquina de escribir
  typingTimer += deltaTime / 1000;
  const chars = floor(typingTimer * 30);
  const toShow = lines[typeIdx].substring(0, chars);
  
  // Caja de texto
  push();
  const boxW = width * 0.8;
  const boxH = 120;
  const x = width * 0.1;
  const y = height - 180;
  
  fill(0, 0, 0, 200);
  noStroke();
  rect(x, y, boxW, boxH, 12);
  
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text(toShow, x + 20, y + 20, boxW - 40);
  pop();
  
  // Hint
  push();
  fill(255, 200);
  textSize(14);
  textAlign(CENTER);
  text("Enter/Z: continuar · Espacio/Esc: saltar", width/2, height - 30);
  pop();
}

function nextLine() {
  typingTimer = 0;
  typeIdx++;
  if (typeIdx >= lines.length) {
    state = ST.MENU;
    typeIdx = 0;
  }
}

// MENU
function drawMenu() {
  push();
  fill(76, 154, 42);
  textSize(48);
  textAlign(CENTER);
  text("Estimio — Misión Frugal", width/2, 80);
  
  fill(217, 201, 163);
  textSize(18);
  text("Selecciona tu misión:", width/2, 140);
  pop();
  
  // Tarjetas
  drawCard(200, 200, "1. ARBot-HMO", "Plantar árboles nativos");
  drawCard(200, 360, "2. Recicla-Planta", "Clasificar residuos");
}

function drawCard(x, y, title, desc) {
  push();
  fill(0, 0, 0, 180);
  rect(x, y, 560, 100, 12);
  
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text(title, x + 20, y + 20);
  
  textSize(16);
  fill(200);
  text(desc, x + 20, y + 55);
  pop();
}

// Variables de juego
let player = { x: 100, y: 400, vx: 0, vy: 0, w: 32, h: 48, onGround: false };
let collectibles = [];
let inventory = { chatarra: 0, plastico: 0, electronica: 0 };
let heat = 0;
let water = 100;

const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const GROUND_Y = 450;

function startMission(id) {
  mission = id;
  state = ST.PLAY;
  console.log('🎮 Misión:', id);
  
  // Resetear jugador
  player = { x: 100, y: 400, vx: 0, vy: 0, w: 32, h: 48, onGround: false };
  heat = 0;
  water = 100;
  
  // Crear recolectables
  collectibles = [];
  for (let i = 0; i < 15; i++) {
    collectibles.push({
      x: random(100, width - 100),
      y: GROUND_Y - 20,
      type: random(['chatarra', 'plastico', 'electronica']),
      collected: false
    });
  }
}

// JUEGO
function drawGame() {
  // Fondo (cielo)
  background(135, 206, 235);
  
  // Suelo
  fill(139, 69, 19);
  rect(0, GROUND_Y, width, height - GROUND_Y);
  
  // Actualizar física
  updatePlayer();
  
  // Dibujar recolectables
  for (let item of collectibles) {
    if (!item.collected) {
      drawCollectible(item);
      
      // Colisión con jugador
      if (dist(player.x, player.y, item.x, item.y) < 40) {
        item.collected = true;
        inventory[item.type]++;
      }
    }
  }
  
  // Dibujar jugador
  drawPlayer();
  
  // HUD
  drawHUD();
}

function updatePlayer() {
  // Input horizontal
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A o ←
    player.vx = -MOVE_SPEED;
  } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D o →
    player.vx = MOVE_SPEED;
  } else {
    player.vx *= 0.8;
  }
  
  // Gravedad
  player.vy += GRAVITY;
  
  // Actualizar posición
  player.x += player.vx;
  player.y += player.vy;
  
  // Límites
  player.x = constrain(player.x, player.w/2, width - player.w/2);
  
  // Suelo
  if (player.y >= GROUND_Y - player.h/2) {
    player.y = GROUND_Y - player.h/2;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }
  
  // Salto (manejado en keyPressed)
  
  // Calor (aumenta con el tiempo)
  heat += 0.1;
  heat = constrain(heat, 0, 100);
}

function drawPlayer() {
  push();
  // Cuerpo
  fill(139, 69, 19);
  rect(player.x - 16, player.y - 24, 32, 48, 8);
  
  // Cara
  fill(184, 115, 51);
  ellipse(player.x, player.y - 12, 28, 24);
  
  // Ojos
  fill(255);
  ellipse(player.x - 6, player.y - 14, 8, 8);
  ellipse(player.x + 6, player.y - 14, 8, 8);
  
  fill(0);
  ellipse(player.x - 6, player.y - 14, 4, 4);
  ellipse(player.x + 6, player.y - 14, 4, 4);
  pop();
}

function drawCollectible(item) {
  push();
  // Color según tipo
  if (item.type === 'chatarra') fill(120, 120, 120);
  else if (item.type === 'plastico') fill(76, 154, 42);
  else fill(255, 200, 0);
  
  ellipse(item.x, item.y, 16, 16);
  pop();
}

function drawHUD() {
  push();
  // Panel negro semitransparente
  fill(0, 0, 0, 180);
  rect(10, 10, 250, 120, 8);
  
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text('MISIÓN: ' + mission, 20, 30);
  text('Calor: ' + floor(heat) + '%', 20, 50);
  text('Agua: ' + floor(water) + '%', 20, 70);
  text('Chatarra: ' + inventory.chatarra, 20, 90);
  text('Plástico: ' + inventory.plastico, 20, 105);
  text('Electrónica: ' + inventory.electronica, 20, 120);
  
  // Hint
  fill(255, 200);
  textSize(12);
  textAlign(CENTER);
  text('A/D: mover · Espacio: saltar · ESC: menú', width/2, height - 10);
  pop();
}

// Override keyPressed para salto
function keyPressed() {
  if (state === ST.INTRO) {
    if (keyCode === ENTER || key === 'z' || key === 'Z') {
      nextLine();
    }
    if (key === ' ' || keyCode === ESCAPE) {
      state = ST.MENU;
    }
  } else if (state === ST.MENU) {
    if (key === '1') startMission('ARBot-HMO');
    if (key === '2') startMission('Recicla-Planta');
  } else if (state === ST.PLAY) {
    if (key === ' ' && player.onGround) {
      player.vy = JUMP_FORCE;
    }
    if (keyCode === ESCAPE) {
      state = ST.MENU;
    }
  }
}
