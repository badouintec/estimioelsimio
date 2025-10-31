// SISTEMA DE RENDER DE SPRITES
// Utiliza los datos RLE de estimio_rle_p5.js

/**
 * Dibuja el sprite de Estimio usando los datos RLE originales
 * @param {number} px - Posición X
 * @param {number} py - Posición Y  
 * @param {number} scale - Escala del sprite (default 0.15 para ~48px)
 * @param {boolean} flipX - Voltear horizontalmente
 */
function drawEstimio(px, py, scale = 0.15, flipX = false) {
  if (typeof PROWS === 'undefined') {
    // Fallback si no hay datos del sprite
    drawEstimioFallback(px, py, scale * 320);
    return;
  }
  
  push();
  translate(px, py);
  
  if (flipX) {
    scale(-scale, scale);
    translate(-PW, 0);
  } else {
    scale(scale, scale);
  }
  
  noStroke();
  
  let y = 0;
  for (const row of PROWS) {
    let x = 0;
    for (let i = 0; i < row.length; i += 2) {
      const len = row[i];
      const col = row[i + 1];
      
      // Saltar el color de fondo
      if (col !== '#d5d5d5ff') {
        fill(col);
        rect(x, y, len, 1);
      }
      x += len;
    }
    y++;
  }
  
  pop();
}

/**
 * Dibuja Estimio grande para la intro
 */
function drawEstimioLarge(px, py) {
  drawEstimio(px, py, 0.5, false); // 160x160
}

/**
 * Fallback simple si no hay datos RLE
 */
function drawEstimioFallback(px, py, size) {
  push();
  
  // Cuerpo café
  fill(139, 69, 19);
  rect(px, py, size, size * 1.5, size * 0.1);
  
  // Cara
  fill(184, 115, 51);
  ellipse(px + size/2, py + size * 0.4, size * 0.8, size * 0.7);
  
  // Ojos
  fill(255);
  ellipse(px + size * 0.35, py + size * 0.35, size * 0.15, size * 0.15);
  ellipse(px + size * 0.65, py + size * 0.35, size * 0.15, size * 0.15);
  
  fill(0);
  ellipse(px + size * 0.35, py + size * 0.35, size * 0.08, size * 0.08);
  ellipse(px + size * 0.65, py + size * 0.35, size * 0.08, size * 0.08);
  
  pop();
}

console.log('✅ sprite.js cargado');
