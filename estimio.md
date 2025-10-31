
⸻

1) Resumen (pantalla inicial que verá el jugador)

Género: Plataformas/aventura 2D con recolección y fabricación.
Propuesta: Explora Hermosillo, recolecta piezas, crea Eco-Bots y mejora el entorno con sombra, árboles y reciclaje.
Objetivo educativo: Innovación frugal, reciclaje y especies nativas.

Intro narrativa (texto secuenciado, saltable)
	•	Pantalla 1
“En un laboratorio de Hermosillo llamado CiTIAM Labs, vive un simio inventor.”
“Su nombre es Estimio y cree que la basura es… potencial.”
	•	Pantalla 2
“El calor aprieta. La sombra escasea. Pero con piezas recicladas…”
“…Estimio construirá máquinas que sanen la ciudad.”
	•	Pantalla 3
“Tu misión: reunir piezas, fabricar Eco-Bots y desplegarlos donde más se necesiten.”

Interacción: efecto “máquina de escribir”. Enter/Z → siguiente, Espacio/Esc → saltar.
Tras la intro: Menú de Misiones (elige una de las dos).

⸻

2) Bucle principal

Explorar barrio → Recolectar piezas → Volver al Hub (CiTIAM Labs) → Fabricar (mini-juego) → Desplegar Eco-Bot → Ver impacto → Desbloquear mejoras → Repetir.

⸻

3) Misiones del MVP (elegibles desde el inicio)

M1. ARBot-HMO (plantador de árboles nativos)
	•	Mapa: Parque Madero (horizontal; charcos que reducen calor).
	•	Objetivo: construir 1 ARBot-HMO y plantar 8 plántulas (mezquite/palo verde), regarlas 2 veces.
	•	Receta base: 12 chatarra (B+), 6 electrónica (B+), 8 plástico (C+), 1 batería (A+), 10 semillas.
	•	Victoria: se crea un corredor de sombra; se abre un atajo.
	•	Fracaso: barra de calor al máximo o no cumplir en el tiempo diurno (se reinicia la jornada).

M2. Recicla-Planta Móvil (clasificación en ruta)
	•	Mapa: Centro Histórico/Mercado (urbano denso).
	•	Objetivo: fabricar 1 Recicla-Planta y escoltarla por 3 puntos de control, clasificando residuos (orgánico, reciclable, inerte).
	•	Receta base: 10 chatarra (B), 10 plástico (B), 8 electrónica (B), 1 celda solar (A).
	•	Victoria: índice de limpieza ≥ 85% en la ruta; sube “Impacto HMO”.
	•	Fracaso: sobrecalentamiento o clasificación incorrecta reiterada.

⸻

4) Mecánicas (para replicar fácil con Copilot)

Movimiento
	•	Caminar (A/D o ←/→), salto (Espacio: corto/alto según duración), escalera simple.
	•	“Coyote time” 100 ms y buffer de salto 100 ms.

Calor y agua
	•	Barra de calor: sube al sol, baja en sombra/charcos/fuentes. Calor al tope = ralentización + desaturación de color.
	•	Agua: se consume al regar plántulas o enfriar al ARBot.

Escáner (goggles)
	•	Tecla Q: resalta piezas y “manchas de calor”. Enfría levemente al usarse bajo sombra.

Inventario y calidades
	•	Categorías: chatarra, plástico, electrónica, energía/semillas.
	•	Calidades C/B/A/S (mejor calidad = mayor eficiencia/durabilidad del Eco-Bot).

Fabricación (en el Hub)
	•	Panel de plano seleccionado → verifica cantidades/calidad mínima.
	•	Mini-juego de 3 pasos: alinear (timing), apretar (barra de fuerza) y soldar (patrón simple).
	•	Resultado otorga bonos (+durabilidad, +rango o −consumo).

Despliegue y IA de bots
	•	Selecciona punto válido en el mapa.
	•	ARBot-HMO: patrulla puntos de siembra, planta, riega, y entra en pausa si supera temperatura; reanuda en sombra o al recargarse.
	•	Recicla-Planta: sigue waypoints; en cada estación, el jugador separa con teclas 1/2/3 antes de que la cinta “rebose”.

Reputación e Impacto
	•	Misiones y despliegue aumentan Reputación y Impacto HMO (árboles, kg reciclados, °C estimados de enfriamiento).
	•	Umbrales abren rutas y mejoras cosméticas.

Guardado
	•	localStorage: progreso, inventario, reputación, opciones (accesibilidad).

⸻

5) Arte por código (pixel art SNES con p5.js)

Resoluciones y escalado
	•	Baldosa (tile): 32×32 px.
	•	Estimio: 32×48 px (idle 4f@6fps, caminar 8f@10fps, salto 2f@8fps, recolectar 4f@8fps, herramienta 4f, celebrar 3f).
	•	Escalado: múltiplos enteros (×4 o ×5) con imageSmoothingDisabled para mantener “pixel-perfect”.

Paleta base
	•	Arena #D9C9A3 · Carbón #2B2B2B · Cobre #B87333 · Verde nativo #4C9A2A · Azul vidrio #8AB7FF · Blanco bata #F0F0F0.

Técnica
	•	“Sellos” de píxeles: funciones que pintan rectángulos de 1×1 en un buffer y luego lo escalan.
	•	Sombreado 2-3 tonos y dithering simple para transiciones.
	•	Funciones clave (ejemplos):
	•	drawEstimioIdle(px, py)
	•	drawEstimioWalk(px, py, frame)
	•	drawBotArbol(px, py, state)
	•	drawReciclaPlanta(px, py, state)
	•	drawTile(id, x, y)

⸻

6) Audio
	•	Librería: p5.sound o Tone.js.
	•	Música: bucle chiptune suave (80–95 BPM).
	•	Efectos: recoger (Sine corto), soldar (Noise filtrado), plantar (Short square), enfriar (Triangle descendente).
	•	Mapa de eventos: onPickup, onCraftStep, onPlant, onCoolDown, onMissionSuccess.

⸻

7) Interfaz
	•	HUD: barra de calor (izq.), agua (gota), energía (rayo), inventario con iconos, mini-mapa.
	•	Menú de misiones: tarjetas “ARBot-HMO” y “Recicla-Planta” con requisitos y botón Iniciar.
	•	Panel de fabricación: requisitos, calidades, botón Construir → mini-juego.
	•	Pausar: P. Accesibilidad: alto contraste, reducir efectos, remapear teclas.

⸻

8) PWA (estructura mínima)
	•	index.html (p5.js + módulos), manifest.json, service-worker.js (estrategia cache-first para código y network-first para datos JSON).
	•	Iconos en 192/512 px.
	•	Habilitar instalación y uso offline del MVP.

⸻

9) Arquitectura técnica

/src
  main.js              // bucle p5, estados: INTRO, MENU, PLAY
  states/intro.js      // texto progresivo, saltar
  states/menu.js       // selector de misión
  states/play.js       // carga de nivel, HUD, bots
  ecs/                 // entidad-componente-sistema ligero
  render/              // draw* pixel art (buffers escalados)
  audio/               // initSound, sfx, music
  data/
    missions.json      // definiciones de M1 y M2
    plans.json         // recetas de Eco-Bots
    items.json         // piezas y calidades
    levels/            // tilemaps
manifest.json
service-worker.js

Esquemas de datos (JSON)

plans.json

{
  "ARBot-HMO": {"req": {"chatarra":{"qty":12,"min":"B"}, "electronica":{"qty":6,"min":"B"}, "plastico":{"qty":8,"min":"C"}, "bateria":{"qty":1,"min":"A"}, "semillas":{"qty":10,"min":"C"}}, "bonos":["durabilidad","eficiencia"]},
  "Recicla-Planta": {"req": {"chatarra":{"qty":10,"min":"B"}, "plastico":{"qty":10,"min":"B"}, "electronica":{"qty":8,"min":"B"}, "celda_solar":{"qty":1,"min":"A"}}, "bonos":["rango","ahorro_energia"]}
}

missions.json

{
  "ARBot-HMO": {"map":"parque_madero","goals":{"plantas":8,"riegos":2},"timer":480},
  "Recicla-Planta": {"map":"centro_hist","goals":{"checkpoints":3,"precision":0.85},"timer":600}
}


⸻

10) Controles

Mover A/D o ←/→ · Saltar Espacio · Acción E · Escáner Q · Taller C · Pausa P · Saltar intro Espacio/Esc.

⸻

11) Balance y telemetría
	•	Conversión: 10 piezas comunes = 1 punto de fabricación; calidad A/S = +25/50% eficiencia.
	•	Telemetría (local): % separación correcta, árboles plantados, °C estimados enfriados, tiempo en sombra vs sol.

⸻

12) Criterios de “hecho” del MVP
	•	2 misiones completas y rejugables.
	•	Fabricación funcional con mini-juego.
	•	HUD claro, intro saltable, audio básico, PWA instalable.

⸻

13) Plantilla de implementación (p5.js + estados) — lista para Copilot

Resumen de funciones y flujo; puedes pegarlo en tu main.js y completar los TODO.

// index.html debe cargar p5.js y este archivo.
// Estados
const ST = { INTRO:'INTRO', MENU:'MENU', PLAY:'PLAY' };
let state = ST.INTRO, mission = null, typeIdx = 0, typingTimer = 0;
let lines = [
  "En un laboratorio de Hermosillo llamado CiTIAM Labs, vive un simio inventor.",
  "Su nombre es Estimio y cree que la basura es… potencial.",
  "El calor aprieta. La sombra escasea. Pero con piezas recicladas…",
  "…Estimio construirá máquinas que sanen la ciudad.",
  "Tu misión: reunir piezas, fabricar Eco-Bots y desplegarlos donde más se necesiten."
];

function setup(){
  createCanvas(960, 540);
  noSmooth(); // pixel-perfect al escalar buffers
  initAudio(); // TODO: implementar con p5.sound o Tone.js
}

function draw(){
  background(26,26,46);
  if(state===ST.INTRO) drawIntro();
  else if(state===ST.MENU) drawMenu();
  else if(state===ST.PLAY) drawGame();
}

function keyPressed(){
  if(state===ST.INTRO){
    if(keyCode===ENTER || key==='z' || key==='Z'){ nextLine(); }
    if(key===' ' || keyCode===ESCAPE){ state=ST.MENU; }
  }else if(state===ST.MENU){
    if(key==='1'){ startMission('ARBot-HMO'); }
    if(key==='2'){ startMission('Recicla-Planta'); }
  }else if(state===ST.PLAY){
    // TODO: input de juego (mover, saltar, acción, escáner)
  }
}

function drawIntro(){
  const boxW = width*0.8, boxH = 180;
  const x = (width-boxW)/2, y = height*0.65 - boxH/2;
  drawEstimioLarge(width*0.5-160, height*0.45); // TODO: sprite por código
  // Texto con “máquina de escribir”
  typingTimer += deltaTime;
  const chars = floor(typingTimer*0.05);
  const toShow = lines[typeIdx].slice(0, chars);
  drawTextBox(x, y, boxW, boxH, toShow);
  drawHint("Enter/Z: continuar · Espacio/Esc: saltar");
}

function nextLine(){
  typingTimer = 0;
  typeIdx++;
  if(typeIdx>=lines.length){ state=ST.MENU; }
}

function drawMenu(){
  drawTitle("Estimio — Misión Frugal");
  drawMissionCard(1, "ARBot-HMO", "Plantar y regar árboles nativos.", "Presiona 1");
  drawMissionCard(2, "Recicla-Planta", "Clasifica residuos escoltando la unidad.", "Presiona 2");
}

function startMission(id){
  mission = id;
  loadLevelFor(id);   // TODO: cargar tilemap, puntos, HUD
  state = ST.PLAY;
}

function drawGame(){
  // TODO: física, calor, recolectables, mini-juego de fabricación en Hub, despliegue del bot
  // HUD con calor/agua/energía/inventario/minimapa
}

/* --------- Utilidades de UI y Render (placeholder) ---------- */
function drawTextBox(x,y,w,h,txt){
  push();
  noStroke(); fill(0,0,0,180); rect(x,y,w,h,12);
  fill(255); textSize(20); textWrap(WORD); textAlign(LEFT,TOP);
  text(txt, x+24, y+24, w-48, h-48);
  pop();
}
function drawHint(t){ push(); fill(255,220); textSize(14); textAlign(CENTER); text(t, width/2, height-24); pop(); }
function drawTitle(t){ push(); fill(255); textSize(36); textAlign(CENTER); text(t, width/2, 80); pop(); }
function drawMissionCard(idx, name, desc, hint){
  const w=360,h=140, gap=40, x = width/2 + (idx===1? -w-gap/2 : gap/2), y=180;
  push(); noStroke(); fill(0,0,0,160); rect(x,y,w,h,16);
  fill(255); textSize(24); text(name, x+16, y+32);
  textSize(16); textWrap(WORD); text(desc, x+16, y+64, w-32);
  textSize(14); fill(200); text(hint, x+16, y+h-24);
  pop();
}
function drawEstimioLarge(px,py){ /* TODO: dibujar sprite por código (pixel buffers) */ }

/* --------- Audio (placeholder) ---------- */
function initAudio(){ /* TODO: música en bucle + sfx con p5.sound o Tone.js */ }


⸻
