// Estimio (idle) — 100% generado por código con p5.js
// Sin imágenes ni arrays externos. Menos detalle, pero limpio y con buen look.
// Clases en minúsculas como prefieres.

let game, est;

function setup() {
  createCanvas(480, 480);
  pixelDensity(1);
  noSmooth();
  game = new juego();
  est  = new estimio();
}

function draw() {
  game.update();
  game.render();
}

/* ========================= juego ========================= */
class juego {
  constructor() {
    this.t = 0;
    this.bg = color('#d9d9d9');
  }
  update() { this.t += deltaTime / 1000; }
  render() {
    background(this.bg);
    push();
    translate(width/2, height*0.62);
    est.update(this.t);
    est.draw();
    pop();
  }
}

/* ======================== estimio ======================== */
class estimio {
  constructor() {
    this.u = 4;                  // tamaño de “pixel” base
    this.bob_amp = 2.0;          // amplitud de respiración
    this.bob_hz  = 0.85;         // frecuencia de respiración
    this.sway    = 0;            // vaivén de la llave
    this.blink_t = 0;            // temporizador de parpadeo
    this.is_blink = false;

    // paleta (suave, estilo pixel-art)
    this.c = {
      line:  color('#2a2a2a'),
      fur:   color('#6b4b3a'),
      furD:  color('#3f2d23'),
      furL:  color('#a27857'),
      coat:  color('#f4f4f4'),
      coatS: color('#d7d7d7'),
      belt:  color('#9da3ad'),
      pocket:color('#caa57a'),
      steel: color('#b9c0c7'),
      steelD:color('#8f969e'),
      glass: color('#7fc4d6'),
      glassHL: color('#cfe9f0')
    };
  }

  update(t) {
    this.bob = sin(TAU * this.bob_hz * t) * this.bob_amp;
    this.sway = sin(TAU * 1.2 * t) * 6; // grados

    // parpadeo simple
    this.blink_t += deltaTime;
    if (!this.is_blink && this.blink_t > 1600 && random() < 0.04) {
      this.is_blink = true; this.blink_t = 0;
    }
    if (this.is_blink && this.blink_t > 120) {
      this.is_blink = false; this.blink_t = 0;
    }
  }

  draw() {
    const u = this.u;

    // Sombra
    noStroke(); fill(0,0,0,35);
    this.ellipsePix(0, 15*u, 18*u, 3*u);

    push();
    translate(0, this.bob);

    // Pies
    this.rectPix(-10*u, 12*u, 8*u, 2*u, this.c.furD);
    this.rectPix(  2*u, 12*u, 8*u, 2*u, this.c.furD);

    // Bata (cuerpo)
    this.rectPix(-12*u, -2*u, 24*u, 16*u, this.c.coat);
    this.rectPix(-12*u,  6*u, 24*u,  2*u, this.c.belt);
    // sombreado lateral
    this.rectPix(-12*u, -2*u, 5*u, 16*u, this.c.coatS);

    // Bolsas
    this.rectPix(-12*u,  8*u,  7*u, 5*u, this.c.pocket);
    this.rectPix(  5*u,  8*u,  7*u, 5*u, this.c.pocket);

    // Brazo izquierdo + llave fija
    this.rectPix(-15*u,  0*u, 4*u, 7*u, this.c.coat);
    this.hand(-12.5*u, 8.5*u, 1.5*u);
    this.wrench(-17*u, 10.3*u, radians(-12) + radians(this.sway*0.1));

    // Brazo derecho (mano al mentón)
    this.rectPix(10*u, 0*u, 4*u, 7*u, this.c.coat);
    this.hand(7.8*u, -1.5*u, 1.5*u);

    // Cabeza + orejas
    this.head(0, -9*u);

    pop();
  }

  /* ---------- partes ---------- */
  head(x, y) {
    const u = this.u;
    push();
    translate(x, y);

    // orejas
    this.circlePix(-9*u, -2*u, 6*u, this.c.fur);
    this.circlePix( 9*u, -2*u, 6*u, this.c.fur);
    this.circlePix(-9*u, -2*u, 3.6*u, this.c.furL);
    this.circlePix( 9*u, -2*u, 3.6*u, this.c.furL);

    // cabeza
    this.circlePix(0, 0, 16*u, this.c.fur);
    this.circlePix(0, 0.5*u, 15.2*u, this.c.fur); // borde más lleno

    // cara clara
    this.ellipsePix(0, 2.2*u, 12*u, 9*u, this.c.furL);

    // hocico
    this.ellipsePix(0, 4.2*u, 8.5*u, 5.5*u, this.c.furL);
    this.rectPix(-1*u, 3.5*u, 2*u, 1.5*u, this.c.furD); // nariz
    this.rectPix(-2.2*u, 5.5*u, 4.4*u, 1*u, this.c.furD); // boca

    // ojos / parpadeo
    if (this.is_blink) {
      this.rectPix(-3.5*u, -1*u, 3*u, 1*u, this.c.furD);
      this.rectPix( 0.5*u, -1*u, 3*u, 1*u, this.c.furD);
    } else {
      this.rectPix(-3.5*u, -2*u, 3*u, 2*u, color(20)); // negro
      this.rectPix( 0.5*u, -2*u, 3*u, 2*u, color(20));
      this.rectPix(-2.7*u, -1.6*u, 1*u, 1*u, color(240)); // brillo
      this.rectPix( 1.3*u, -1.6*u, 1*u, 1*u, color(240));
    }

    // googles
    this.rectPix(-10*u, -7.5*u, 20*u, 3*u, this.c.steelD); // banda
    this.goggles(-4.8*u, -7.5*u);
    this.goggles( 4.8*u, -7.5*u);

    pop();
  }

  goggles(cx, cy) {
    const u = this.u;
    // aro
    this.rectPix(cx-4*u, cy-3*u, 8*u, 6*u, this.c.steel);
    // vidrio
    this.rectPix(cx-3*u, cy-2*u, 6*u, 4*u, this.c.glass);
    // reflejo
    this.rectPix(cx-2.2*u, cy-1.2*u, 3.4*u, 0.8*u, this.c.glassHL);
    this.rectPix(cx-1.4*u, cy, 2.6*u, 0.6*u, this.c.glassHL);
  }

  hand(x, y, r) {
    fill(this.c.furL); noStroke();
    this.circlePix(x, y, 2.6*r, this.c.furL);
    this.rectPix(x - 1.2*r, y - 0.2*r, 2.4*r, 0.9*r, this.c.furL);
  }

  wrench(x, y, ang) {
    const u = this.u;
    push();
    translate(x, y);
    rotate(ang);
    noStroke();

    // mango
    this.rectPix(-6*u, -0.8*u, 12*u, 1.6*u, this.c.steel);

    // cabeza abierta (llave fija)
    fill(this.c.steel);
    beginShape();
    vertex(6*u, -2*u);
    vertex(8.5*u, -3*u);
    vertex(10*u, -1.4*u);
    vertex(8.5*u, 0.2*u);
    vertex(6.2*u, -0.6*u);
    endShape(CLOSE);

    // detalles
    this.rectPix(-1.5*u, -0.35*u, 3*u, 0.7*u, this.c.steelD);
    pop();
  }

  /* ---------- utilidades “pixeladas” ---------- */
  rectPix(x,y,w,h,c) { noStroke(); fill(c); rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  circlePix(x,y,d,c){ noStroke(); fill(c); circle(Math.round(x), Math.round(y), Math.round(d)); }
  ellipsePix(x,y,w,h,c){ noStroke(); fill(c||0,0,0,36); ellipse(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
}