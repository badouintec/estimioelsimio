// ESTIMIO - MISIÓN FRUGAL
// Sistema de estados: INTRO → MENU → PLAY

// ===== ESTADOS =====
const ST = { 
  INTRO: 'INTRO', 
  MENU: 'MENU', 
  PLAY: 'PLAY' 
};

// ===== VARIABLES GLOBALES =====
let state = ST.INTRO;
let mission = null;

// Variables de INTRO
let typeIdx = 0;
let typingTimer = 0;
const TYPING_SPEED = 3; // caracteres por segundo
const lines = [
  "En un laboratorio de Hermosillo llamado CiTIAM Labs, vive un simio inventor.",
  "Su nombre es Estimio y cree que la basura es… potencial.",
  "El calor aprieta. La sombra escasea. Pero con piezas recicladas…",
  "…Estimio construirá máquinas que sanen la ciudad.",
  "Tu misión: reunir piezas, fabricar Eco-Bots y desplegarlos donde más se necesiten."
];

// Variables de PLAY
let player = {};
let world = {};
let collectibles = [];
let inventory = {};

// Constantes de física
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const FRICTION = 0.85;
const COYOTE_TIME = 100; // ms
const JUMP_BUFFER = 100; // ms

// ===== SETUP =====
function setup() {
  createCanvas(960, 540);
  noSmooth(); // pixel-perfect para arte pixel
  textFont('Courier New');
  console.log('✅ Estimio - Misión Frugal iniciado');
  console.log('📦 PROWS disponible:', typeof PROWS !== 'undefined');
  console.log('📦 drawEstimio disponible:', typeof drawEstimio !== 'undefined');
}

// ===== DRAW LOOP =====
function draw() {
  background(26, 26, 46);
  
  // DEBUG - mostrar estado actual y framerate
  fill(255, 255, 0);
  textSize(16);
  textAlign(LEFT);
  text('Estado: ' + state, 10, 20);
  text('FPS: ' + floor(frameRate()), 10, 40);
  
  switch(state) {
    case ST.INTRO:
      drawIntro();
      break;
    case ST.MENU:
      drawMenu();
      break;
    case ST.PLAY:
      drawGame();
      break;
  }
}

// ===== INPUT =====
function keyPressed() {
  if (state === ST.INTRO) {
    if (keyCode === ENTER || key === 'z' || key === 'Z') {
      nextLine();
    }
    if (key === ' ' || keyCode === ESCAPE) {
      state = ST.MENU;
      typeIdx = 0;
      typingTimer = 0;
    }
  } 
  else if (state === ST.MENU) {
    if (key === '1') {
      startMission('ARBot-HMO');
    }
    if (key === '2') {
      startMission('Recicla-Planta');
    }
  }
  else if (state === ST.PLAY) {
    // Salto con buffer
    if (key === ' ') {
      if (player.onGround || player.coyoteTimer > 0) {
        player.vy = JUMP_FORCE;
        player.coyoteTimer = 0;
      } else {
        player.jumpBufferTimer = JUMP_BUFFER;
      }
    }
    
    // Volver al menú
    if (keyCode === ESCAPE) {
      state = ST.MENU;
      mission = null;
    }
  }
}

// ===== PANTALLA INTRO =====
function drawIntro() {
  const boxW = width * 0.8;
  const boxH = 180;
  const x = (width - boxW) / 2;
  const y = height * 0.65 - boxH / 2;
  
  // Efecto máquina de escribir
  typingTimer += deltaTime / 1000; // convertir ms a segundos
  const chars = floor(typingTimer * TYPING_SPEED);
  const currentLine = lines[typeIdx];
  const toShow = currentLine.slice(0, chars);
  
  // DEBUG - más visible
  fill(255, 0, 0);
  textSize(20);
  textAlign(CENTER);
  text('Chars: ' + chars + ' / Timer: ' + floor(typingTimer * 10) / 10, width/2, 60);
  text('Text: "' + toShow.substring(0, 20) + '..."', width/2, 90);
  text('drawEstimio existe: ' + (typeof drawEstimio === 'function'), width/2, 120);
  
  drawTextBox(x, y, boxW, boxH, toShow);
  drawHint("Enter/Z: continuar · Espacio/Esc: saltar");
  
  // Dibujar sprite de Estimio grande en el centro (AL FINAL para que no tape nada)
  if (typeof drawEstimio === 'function') {
    drawEstimio(width * 0.5, height * 0.25, 0.4, false); // sprite más arriba y pequeño
  } else {
    // Fallback con emoji
    push();
    fill(139, 69, 19);
    rect(width * 0.5 - 60, height * 0.25 - 60, 120, 120, 10);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text('🐵', width * 0.5, height * 0.25);
    pop();
  }
}

function nextLine() {
  typingTimer = 0;
  typeIdx++;
  if (typeIdx >= lines.length) {
    state = ST.MENU;
    typeIdx = 0;
  }
}

// ===== PANTALLA MENU =====
function drawMenu() {
  // Título
  push();
  fill(76, 154, 42); // verde nativo
  textSize(48);
  textAlign(CENTER);
  text("Estimio — Misión Frugal", width/2, 80);
  pop();
  
  // Subtítulo
  push();
  fill(217, 201, 163); // arena
  textSize(18);
  textAlign(CENTER);
  text("Selecciona tu misión:", width/2, 140);
  pop();
  
  // Tarjetas de misión
  drawMissionCard(
    1, 
    "ARBot-HMO", 
    "Plantar árboles nativos en Parque Madero.\nObjetivo: 8 plántulas, 2 riegos por planta.", 
    "Presiona 1"
  );
  
  drawMissionCard(
    2, 
    "Recicla-Planta", 
    "Clasificar residuos en Centro Histórico.\nObjetivo: 3 checkpoints, 85% precisión.", 
    "Presiona 2"
  );
}

function drawMissionCard(idx, name, desc, hint) {
  const w = 360;
  const h = 160;
  const gap = 40;
  const x = width/2 + (idx === 1 ? -w - gap/2 : gap/2);
  const y = 200;
  
  push();
  
  // Fondo de tarjeta
  noStroke();
  fill(0, 0, 0, 180);
  rect(x, y, w, h, 16);
  
  // Borde
  stroke(idx === 1 ? color(76, 154, 42) : color(138, 183, 255));
  strokeWeight(3);
  noFill();
  rect(x, y, w, h, 16);
  
  // Contenido
  noStroke();
  fill(255);
  textSize(24);
  textAlign(LEFT);
  text(name, x + 16, y + 32);
  
  textSize(14);
  text(desc, x + 16, y + 54, w - 32);
  
  fill(200);
  textSize(12);
  text(hint, x + 16, y + h - 24);
  
  pop();
}

// ===== PANTALLA JUEGO =====
function drawGame() {
  // Fondo
  background(217, 201, 163); // arena del desierto
  
  // Suelo
  fill(139, 69, 19);
  rect(0, height - 60, width, 60);
  
  // Zonas de sombra
  fill(0, 0, 0, 60);
  rect(200, height - 200, 150, 200); // sombra de árbol
  rect(600, height - 180, 120, 180); // sombra de estructura
  
  // Actualizar jugador
  updatePlayer();
  
  // Dibujar collectibles
  for (let item of collectibles) {
    if (!item.collected) {
      drawCollectible(item);
    }
  }
  
  // Dibujar jugador
  push();
  translate(player.x, player.y);
  
  // Verificar si drawEstimio existe
  if (typeof drawEstimio === 'function') {
    drawEstimio(0, 0, 0.15, player.vx < 0);
  } else {
    // Fallback simple
    fill(139, 69, 19);
    rect(0, 0, 48, 48, 4);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('🐵', 24, 24);
  }
  
  pop();
  
  // HUD
  drawHUD();
  
  // Hint
  push();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text("A/D: mover · Espacio: saltar · E: recoger · ESC: menú", width/2, 20);
  pop();
}

function initPlayer() {
  player = {
    x: 100,
    y: height - 120,
    vx: 0,
    vy: 0,
    width: 48,
    height: 48,
    onGround: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0
  };
  
  world = {
    heat: 0,
    water: 100,
    groundY: height - 60
  };
  
  inventory = {
    chatarra: 0,
    plastico: 0,
    electronica: 0,
    bateria: 0,
    semillas: 0
  };
  
  // Generar collectibles
  collectibles = [];
  const types = ['chatarra', 'plastico', 'electronica'];
  for (let i = 0; i < 15; i++) {
    collectibles.push({
      type: random(types),
      x: random(50, width - 50),
      y: world.groundY - 30,
      collected: false,
      bobOffset: random(TWO_PI)
    });
  }
}

function updatePlayer() {
  // Movimiento horizontal
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A
    player.vx = -MOVE_SPEED;
  } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D
    player.vx = MOVE_SPEED;
  } else {
    player.vx *= FRICTION;
  }
  
  // Gravedad
  player.vy += GRAVITY;
  
  // Aplicar velocidades
  player.x += player.vx;
  player.y += player.vy;
  
  // Límites horizontales
  player.x = constrain(player.x, 0, width - player.width);
  
  // Colisión con suelo
  if (player.y + player.height >= world.groundY) {
    player.y = world.groundY - player.height;
    player.vy = 0;
    player.onGround = true;
    player.coyoteTimer = COYOTE_TIME;
  } else {
    player.onGround = false;
  }
  
  // Coyote time
  if (player.coyoteTimer > 0) {
    player.coyoteTimer -= deltaTime;
  }
  
  // Jump buffer
  if (player.jumpBufferTimer > 0) {
    player.jumpBufferTimer -= deltaTime;
    if (player.onGround || player.coyoteTimer > 0) {
      player.vy = JUMP_FORCE;
      player.jumpBufferTimer = 0;
      player.coyoteTimer = 0;
    }
  }
  
  // Sistema de calor
  updateHeat();
  
  // Recolección
  if (keyIsPressed && key === 'e' || key === 'E') {
    checkPickup();
  }
}

function updateHeat() {
  // Detectar si está en sombra
  let inShadow = false;
  if (player.x > 200 && player.x < 350) inShadow = true;
  if (player.x > 600 && player.x < 720) inShadow = true;
  
  if (inShadow) {
    world.heat = max(0, world.heat - 0.3);
  } else {
    world.heat = min(100, world.heat + 0.1);
  }
}

function checkPickup() {
  for (let item of collectibles) {
    if (!item.collected) {
      let d = dist(player.x + player.width/2, player.y + player.height/2, 
                   item.x, item.y);
      if (d < 40) {
        item.collected = true;
        inventory[item.type]++;
        console.log(`✅ Recogido: ${item.type} (total: ${inventory[item.type]})`);
      }
    }
  }
}

function drawCollectible(item) {
  push();
  
  // Animación flotante
  let bob = sin(frameCount * 0.05 + item.bobOffset) * 3;
  
  // Color según tipo
  switch(item.type) {
    case 'chatarra':
      fill(120, 120, 120);
      break;
    case 'plastico':
      fill(138, 183, 255);
      break;
    case 'electronica':
      fill(76, 154, 42);
      break;
  }
  
  rect(item.x - 8, item.y - 8 + bob, 16, 16, 2);
  
  // Brillo
  fill(255, 255, 255, 100);
  rect(item.x - 6, item.y - 6 + bob, 4, 4);
  
  pop();
}

function drawHUD() {
  push();
  
  // Panel HUD
  fill(0, 0, 0, 180);
  rect(10, height - 90, 200, 80, 8);
  
  // Barra de calor
  fill(255, 107, 53);
  rect(20, height - 80, world.heat * 1.8, 12);
  noFill();
  stroke(255);
  strokeWeight(1);
  rect(20, height - 80, 180, 12);
  
  // Barra de agua
  fill(138, 183, 255);
  rect(20, height - 60, world.water * 1.8, 12);
  noFill();
  stroke(255);
  strokeWeight(1);
  rect(20, height - 60, 180, 12);
  
  // Textos
  noStroke();
  fill(255);
  textSize(10);
  textAlign(LEFT);
  text('Calor', 20, height - 82);
  text('Agua', 20, height - 62);
  
  // Inventario
  textSize(9);
  text(`Chatarra: ${inventory.chatarra}`, 20, height - 38);
  text(`Plástico: ${inventory.plastico}`, 20, height - 28);
  text(`Electrónica: ${inventory.electronica}`, 20, height - 18);
  
  pop();
}

function startMission(id) {
  mission = id;
  state = ST.PLAY;
  initPlayer(); // Inicializar jugador y mundo
  console.log(`🎮 Iniciando misión: ${id}`);
}

// ===== UTILIDADES UI =====
function drawTextBox(x, y, w, h, txt) {
  push();
  
  // Fondo
  noStroke();
  fill(0, 0, 0, 200);
  rect(x, y, w, h, 12);
  
  // Borde
  stroke(76, 154, 42);
  strokeWeight(2);
  noFill();
  rect(x, y, w, h, 12);
  
  // Texto
  noStroke();
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(txt, x + 24, y + 24, w - 48, h - 48);
  
  pop();
}

function drawHint(t) {
  push();
  fill(255, 220);
  textSize(14);
  textAlign(CENTER);
  text(t, width/2, height - 24);
  pop();
}

console.log('✅ main.js cargado correctamente');
