const scoreEl = document.querySelector("#scoreEl");
const canvas = document.querySelector("canvas");
const startButton = document.querySelector("#startButton");
const gameOverEl = document.querySelector("#gameOver");

const c = canvas.getContext("2d");

let projectileAudio = new Audio("../Audio/laser.wav");
projectileAudio.volume = 0.1;

let invaderProjectileAudio = new Audio("../Audio/laser2.wav");
invaderProjectileAudio.volume = 0.1;

let playerExplosionAudio = new Audio("../Audio/laser3.wav");
playerExplosionAudio.volume = 0.5;

let bombExplosionAudio = new Audio("../Audio/laser4.wav");

let invaderExplosionAudio = new Audio("./Audio/explosion.wav");
invaderExplosionAudio.volume = 0.1;

canvas.width = 1000;
canvas.height = 1000;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
    this.opacity = 1;

    const image = new Image();
    image.src = "./img/spaceship.png";

    image.onload = () => {
      const scale = 0.25;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    // c.fillStyle = 'red';
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.save();
    c.globalAlpha = this.opacity; // Use the corrected "opacity"
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );

    c.rotate(this.rotation);
    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

// class Projectile
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 6;
    this.width = 13;
    this.height = 20;
  }

  draw() {
    // Draw the rocket
    c.fillStyle = "red";
    c.beginPath();
    c.moveTo(this.position.x, this.position.y); // Top point of the triangle
    c.lineTo(this.position.x - this.width / 2, this.position.y + this.height); // Bottom-left point
    c.lineTo(this.position.x + this.width / 2, this.position.y + this.height); // Bottom-right point
    c.closePath();
    c.fill();

    // Draw the flame
    c.fillStyle = "orange";
    c.beginPath();
    c.moveTo(this.position.x, this.position.y + this.height); // Top of the flame
    c.lineTo(
      this.position.x - this.width / 4,
      this.position.y + this.height + 10
    ); // Bottom-left of the flame
    c.lineTo(
      this.position.x + this.width / 4,
      this.position.y + this.height + 10
    ); // Bottom-right of the flame
    c.closePath();
    c.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// class Particle
class Particle {
  constructor({ position, velocity, radius, color, fades, glow }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1; // Fixed typo from "opactity" to "opacity"
    this.fades = fades;
    this.glow = glow || false;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity; // Use the corrected "opacity"
    if (this.glow) {
      c.shadowColor = this.color;
      c.shadowBlur = 25;
    }
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades) this.opacity -= 0.01; // Gradually reduce opacity for smooth fading
  }
}

// IvaderProjectile

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 9;
    this.height = 15;
  }

  draw() {
    c.fillStyle = "yellow";
    c.beginPath();
    c.moveTo(this.position.x, this.position.y + this.height); // Top point of the triangle
    c.lineTo(this.position.x - this.width / 2, this.position.y); // Bottom-left point
    c.lineTo(this.position.x + this.width / 2, this.position.y); // Bottom-right point
    c.closePath();
    c.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// class Invader
class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./img/invader.png";

    image.onload = () => {
      const scale = 1.3;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    // c.fillStyle = 'red';
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(InvaderProjectiles) {
    // Play invader projectile audio
    invaderProjectileAudio.currentTime = 0; // Reset audio to start
    invaderProjectileAudio.play();

    InvaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 1,
        },
      })
    );
  }
}

// Bomb class
class Bomb {
  constructor({ position, velocity, radius = 31, color = "orange" }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    // Draw main bomb body
    c.save();
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    // Draw bomb fuse
    c.beginPath();
    c.moveTo(this.position.x, this.position.y - this.radius);
    c.lineTo(this.position.x, this.position.y - this.radius - 10);
    c.strokeStyle = "white";
    c.lineWidth = 3;
    c.stroke();
    c.closePath();
    // Draw fuse spark
    c.beginPath();
    c.arc(
      this.position.x,
      this.position.y - this.radius - 12,
      3,
      0,
      Math.PI * 2
    );
    c.fillStyle = "red";
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

//  class Grid for the invaders
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 2,
      y: 0,
    };
    this.invaders = [];
    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 30;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          })
        );
      }
    }
    console.log(this.invaders);
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}

const player = new Player();
const projectiles = [];
const grids = [];
const InvaderProjectiles = [];
const particles = [];
const backgroundParticles = [];
const bombs = []; // Bombs array to hold all active bombs

let level = 1;
let levelUpMessage = "";
let levelUpTimer = 0;

// Initialize background particles
for (let i = 0; i < 100; i++) {
  backgroundParticles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.5,
      },
      radius: Math.random() * 2,
      color: "white",
    })
  );
}

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0;

let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
  over: false,
  active: false, // Set to false initially
};
// score
let score = 0;

// function createParticles

function createParticles({
  object,
  color,
  fades,
  glow,
  count = 15,
  maxRadius = 3,
}) {
  let x, y;
  if (object.width && object.height) {
    x = object.position.x + object.width / 2;
    y = object.position.y + object.height / 2;
  } else if (object.radius) {
    x = object.position.x;
    y = object.position.y;
  } else {
    x = object.position.x;
    y = object.position.y;
  }
  for (let i = 0; i < count; i++) {
    particles.push(
      new Particle({
        position: { x, y },
        velocity: {
          x: (Math.random() - 0.5) * 2.5,
          y: (Math.random() - 0.5) * 2.5,
        },
        radius: Math.random() * maxRadius + 2,
        color: color || "#BAA0DE",
        fades: fades,
        glow: glow || false,
      })
    );
  }
}

// function createBigExplosion

function createBigExplosion({ object, color }) {
  console.log("Creating big explosion at:", object.position);
  for (let i = 0; i < 50; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        },
        radius: Math.random() * 8 + 2, // Larger particles for a big explosion
        color: color || "orange",
        fades: true,
      })
    );
  }
}

function showLevelUp(newLevel) {
  levelUpMessage = `Level ${newLevel}`;
  levelUpTimer = 120; // Show for 2 seconds (assuming 60fps)
}

function animate() {
  if (!game.active) return;
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Level up logic
  if (level === 1 && score >= 10000) {
    level = 2;
    showLevelUp(2);
  } else if (level === 2 && score >= 20000) {
    level = 3;
    showLevelUp(3);
  }

  // Show level up message
  if (levelUpTimer > 0) {
    c.save();
    c.font = "bold 3rem Arial";
    c.fillStyle = "yellow";
    c.textAlign = "center";
    c.fillText(levelUpMessage, canvas.width / 2, canvas.height / 2);
    c.restore();
    levelUpTimer--;
  }

  // Update and draw background particles
  backgroundParticles.forEach((particle) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
    particle.update();
  });

  player.update();

  particles.forEach((particle, index) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(index, 1); // Use "index" to remove the correct particle
      }, 0);
    } else {
      particle.update();
    }
  });

  console.log(particles);

  InvaderProjectiles.forEach((InvaderProjectile) => {
    InvaderProjectile.update();
  });

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= canvas.height) {
      projectile.update();
    } else {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  InvaderProjectiles.forEach((invaderProjectile, index) => {
    invaderProjectile.update();

    // Accurate collision detection for player and invaderProjectile
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.y <= player.position.y + player.height &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      console.log("Player hit by invader projectile");
      setTimeout(() => {
        // Remove the projectile
        InvaderProjectiles.splice(index, 1);

        // Trigger big explosion
        createBigExplosion({
          object: player,
          color: "red",
        });

        // Make the player disappear
        player.opacity = 0;

        // Mark the game as over

        // **!here was the problem the player did not disapeare**
        // game.over = true;
        // game.active = false;

        // Play explosion sound
        playerExplosionAudio.currentTime = 0;
        playerExplosionAudio.play();

        // Display game over and start button after delay
        setTimeout(() => {
          endGame();
        }, 2000);
      }, 0);
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();

    // spawning invader projectiles
    if (frames % 500 === 0 && grid.invaders.length > 0) {
      let invaderProjectileSpeed = 1;
      if (level === 2) invaderProjectileSpeed = 2;
      if (level === 3) invaderProjectileSpeed = 3;
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot =
        function (InvaderProjectiles) {
          invaderProjectileAudio.currentTime = 0;
          invaderProjectileAudio.play();
          InvaderProjectiles.push(
            new InvaderProjectile({
              position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height,
              },
              velocity: {
                x: 0,
                y: invaderProjectileSpeed,
              },
            })
          );
        };
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        InvaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      // Projectiles hit enemy
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );
            // remove invader and projectile
            if (invaderFound && projectileFound) {
              // score
              score += 100;
              scoreEl.innerHTML = score;

              // Play invader explosion audio
              invaderExplosionAudio.currentTime = 0;
              invaderExplosionAudio.play();

              // create particles
              createParticles({
                object: invader,
                fades: true,
              });
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  // Update and draw bombs
  bombs.forEach((bomb, bombIndex) => {
    bomb.update();
    // Remove bomb if it goes off screen
    if (
      bomb.position.x + bomb.radius < 0 ||
      bomb.position.y - bomb.radius > canvas.height
    ) {
      bombs.splice(bombIndex, 1);
      return;
    }

    // Check collision with player projectiles
    projectiles.forEach((projectile, projIndex) => {
      const dx = bomb.position.x - projectile.position.x;
      const dy = bomb.position.y - projectile.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bomb.radius + projectile.radius) {
        // Bomb hit by projectile: big invader-like explosion with glow
        createParticles({
          object: bomb,
          color: "orange",
          fades: true,
          glow: true,
          count: 40,
          maxRadius: 10,
        });
        bombExplosionAudio.currentTime = 0;
        bombExplosionAudio.play();
        // Add 500 points to score
        score += 500;
        scoreEl.innerHTML = score;
        bombs.splice(bombIndex, 1);
        projectiles.splice(projIndex, 1);
      }
    });

    // Check collision with player
    if (
      player.opacity > 0 &&
      player.position &&
      player.width &&
      player.height
    ) {
      const px = player.position.x + player.width / 2;
      const py = player.position.y + player.height / 2;
      const dx = bomb.position.x - px;
      const dy = bomb.position.y - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bomb.radius + Math.max(player.width, player.height) / 2) {
        // Bomb hit player: player explodes and loses
        createBigExplosion({ object: player, color: "red" });
        player.opacity = 0;
        playerExplosionAudio.currentTime = 0;
        playerExplosionAudio.play();
        setTimeout(() => {
          endGame();
        }, 1000);
      }
    }
  });

  if (keys.left.pressed && player.position.x >= 0) {
    player.velocity.x = -9;
    player.rotation = -0.3;
  } else if (
    keys.right.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 9;
    player.rotation = 0.3;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  //  spawning enemies

  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;
    console.log(randomInterval);
  }

  // Spawn a new bomb every 300 frames (adjust as needed)
  if (frames % 300 === 0) {
    let bombSpeed = 3;
    let bombRadius = 30;
    let bombColor = "yellow";
    if (level === 2) {
      bombSpeed = 6;
      bombRadius = 40;
      bombColor = "orange";
    }
    if (level === 3) {
      bombSpeed = 9;
      bombRadius = 50;
      bombColor = "red";
    }
    bombs.push(
      new Bomb({
        position: { x: Math.random() * (canvas.width - 60) + 30, y: 0 }, // random x, top of canvas
        velocity: { x: (Math.random() - 0.5) * 2, y: bombSpeed }, // mostly down, slight x variation
        radius: bombRadius,
        color: bombColor,
      })
    );
  }

  frames++;
}
animate();

// Function to start the game
function startGame() {
  if (game.over) {
    // Reset game state
    game.over = false;
    game.active = false;
    player.opacity = 1; // Reset player opacity
    grids.length = 0;
    projectiles.length = 0;
    InvaderProjectiles.length = 0;
    particles.length = 0; // Clear particles only when restarting
    level = 1;
    levelUpMessage = "";
    levelUpTimer = 0;

    // Display start button and hide game over message
    gameOverEl.style.display = "none";
    startButton.style.display = "block";
  } else {
    // Start the game
    game.active = true;
    score = 0;
    scoreEl.innerHTML = score;
    player.opacity = 1;
    grids.length = 0;
    projectiles.length = 0;
    InvaderProjectiles.length = 0;
    level = 1;
    levelUpMessage = "";
    levelUpTimer = 0;

    // Hide start button and game over display
    startButton.style.display = "none";
    gameOverEl.style.display = "none";

    animate();
  }
}

function endGame() {
  game.active = false;
  game.over = true; // Ensure the game is marked as over

  // Delay the display of Game Over message and Start button
  setTimeout(() => {
    gameOverEl.style.display = "block";
    startButton.style.display = "block";
  }, 2000); // 2-second delay
}

// Event Listeners to move the player

let shootingInterval;
let isShooting = false; // Flag to track if space key is being held

addEventListener("keydown", ({ key }) => {
  if (game.over) return;
  switch (key) {
    case "ArrowLeft":
      keys.left.pressed = true;
      break;
    case "ArrowRight":
      keys.right.pressed = true;
      break;
    case " ":
      if (!isShooting) {
        isShooting = true; // Set the flag to true

        // Single shot when space is pressed
        projectileAudio.currentTime = 0; // Reset audio to start
        projectileAudio.play();

        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
          })
        );

        // Start shooting continuously
        if (!shootingInterval) {
          shootingInterval = setInterval(() => {
            projectileAudio.currentTime = 0; // Reset audio to start
            projectileAudio.play();

            projectiles.push(
              new Projectile({
                position: {
                  x: player.position.x + player.width / 2,
                  y: player.position.y,
                },
                velocity: {
                  x: 0,
                  y: -10,
                },
              })
            );
          }, 200); // Adjust the interval as needed
        }
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;
    case " ":
      // Stop shooting when space is released
      clearInterval(shootingInterval);
      shootingInterval = null;
      isShooting = false; // Reset the flag
      break;
  }
});

// Add event listener to start button
startButton.addEventListener("click", startGame);
