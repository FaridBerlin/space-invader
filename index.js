const scoreEl = document.querySelector('#scoreEl');
const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

let projectileAudio = new Audio('../Audio/laser.wav');

let invaderProjectileAudio = new Audio('../Audio/laser2.wav');

let playerExplosionAudio = new Audio('../Audio/laser3.wav');

canvas.width = 1000;
canvas.height = 1000;

// class Player

class Player {

    constructor() {
        
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;
        this.opacity = 1;


        const image = new Image();
        image.src = './img/spaceship.png';

        image.onload = () => {
            const scale = 0.3;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height -20
            
            }
        }


    }

    draw() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.save();
        c.globalAlpha = this.opacity; // Use the corrected "opacity"
        c.translate(player.position.x + player.width / 2,
                    player.position.y + player.height / 2);


        c.rotate(this.rotation);
        c.translate(-player.position.x - player.width / 2,
                    -player.position.y - player.height / 2);

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height);
        c.restore();
    }

    update(){
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }

    }

}

// calss Projectile

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = 6;
        this.width = 13;
        this.height = 20;
    }

// draw() {
    //     c.beginPath();
    //     c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    //     c.fillStyle = 'red';
    //     c.fill();
    //     c.closePath();
    // }
    draw() {
        // Draw the rocket
        c.fillStyle = 'red';
        c.beginPath();
        c.moveTo(this.position.x, this.position.y); // Top point of the triangle
        c.lineTo(this.position.x - this.width / 2, this.position.y + this.height); // Bottom-left point
        c.lineTo(this.position.x + this.width / 2, this.position.y + this.height); // Bottom-right point
        c.closePath();
        c.fill();

        // Draw the flame
        c.fillStyle = 'orange';
        c.beginPath();
        c.moveTo(this.position.x, this.position.y + this.height); // Top of the flame
        c.lineTo(this.position.x - this.width / 4, this.position.y + this.height + 10); // Bottom-left of the flame
        c.lineTo(this.position.x + this.width / 4, this.position.y + this.height + 10); // Bottom-right of the flame
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
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1; // Fixed typo from "opactity" to "opacity"
        this.fades = fades;

    
    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity; // Use the corrected "opacity"
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
        c.fillStyle = 'yellow';
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

    constructor({position}) {
        
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image();
        image.src = './img/invader.png';

        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            
            }
        }


    }

    draw() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);

      
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height);
    
    }

    update({velocity}){
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

        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }));
    }

}

//  class Grid for the invaders
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = [];
        const columns = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 30;
        
        for (let x= 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {

            this.invaders.push(new Invader({position: {
                x: x * 30,
                y: y * 30
            }})); 
        }
        }
        console.log(this.invaders);
    }
    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;
       
       if (this.position.x + this.width >= canvas.width ||
            this.position.x <= 0) {
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




const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    space: {
        pressed: false
    }
    
}

let frames = 0;
 
let randomInterval = Math.floor(Math.random() * 1000 + 1000);
let game = {
    over: false,
    active: true
}
// score
let score = 0;


// create a Background with particles (stars)

for (let i = 0; i < 100; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
            
        },
        velocity: {
            x: 0,
            y: 0.5
        },
        radius: Math.random() * 2,
        color:'white'
    }))
}




// function createParticles

function createParticles({object, color, fades}) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color:color || '#BAA0DE',
            fades: fades 
        }))
    }
    
}

function animate() {

    if (!game.active) return;
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
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
    })

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= canvas.height) {
            projectile.update();
        } else {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    // InvaderProjectiles.forEach((InvaderProjectile) => {
    //     InvaderProjectile.update();
    // })

    // projectiles.forEach((projectile, index) => {
    //     if (projectile.position.y + projectile.radius <= canvas.height) {
    //         projectile.update();
    //     } else {
    //         setTimeout(() => {
    //             projectiles.splice(index, 1);
    //         }, 0);
    //     }
    // });

    InvaderProjectiles.forEach((invaderProjectile, index) => {
        invaderProjectile.update();

        // Accurate collision detection for player and invaderProjectile
        if (
            invaderProjectile.position.y + invaderProjectile.height >= player.position.y && // Bottom of projectile touches top of player
            invaderProjectile.position.y <= player.position.y + player.height && // Top of projectile touches bottom of player
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x && // Right of projectile touches left of player
            invaderProjectile.position.x <= player.position.x + player.width // Left of projectile touches right of player
        ) {
            setTimeout(() => {
                InvaderProjectiles.splice(index, 1);
                player.opacity = 0;
                game.over = true;
            }, 0);

            setTimeout(() => {
                game.active = false;
            }, 2000);

            // Play player explosion audio
            playerExplosionAudio.currentTime = 0; // Reset audio to start
            playerExplosionAudio.play();

            // Create particles for player explosion
            createParticles({
                object: player,
                color: 'white',
                fades: true
            });
        }
    });

    grids.forEach((grid, gridIndex) => {
        grid.update()

    // spawning invader projectiles
        if (frames % 100 === 0 && grid.invaders.length > 0){
          grid.invaders[Math.floor(Math.random() * 
            grid.invaders.length)].shoot(InvaderProjectiles);  
        }



    grid.invaders.forEach((invader, i) => {
        invader.update({velocity: grid.velocity})

// Projectiles hit enemy 
        projectiles.forEach((projectile,j) => {
            if (projectile.position.y - projectile.radius <= 
                invader.position.y + invader.height &&
                projectile.position.x + projectile.radius >=
                invader.position.x &&
                projectile.position.x - projectile.radius <=
                invader.position.x + invader.width && 
                projectile.position.y + projectile.radius >= 
                invader.position.y
                ){

                    


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

                            // create particles
                          createParticles({
                            object: invader,
                            fades: true
                        });
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            } else {
                                grids.splice(gridIndex, 1);
                            }


                        }
                    }
                    , 0)



                      
            }
         })
      })
    
    });

    if (keys.left.pressed && player.position.x >= 0){
        player.velocity.x = -9;
        player.rotation = -0.3;
    }

    else if (keys.right.pressed && 
            player.position.x + player.width <= canvas.width)
            {player.velocity.x = 9;
            player.rotation = 0.3;
        }

    else {player.velocity.x = 0;
        player.rotation = 0;
    }

    //  spawning enemies

    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 1000 + 1000)
        frames = 0;
        console.log(randomInterval);
    }


    frames++;
}
animate();


// Event Listeners to move the player

addEventListener('keydown', ({ key }) => {

    if (game.over) return;
    switch (key) {
        case 'ArrowLeft': 
            keys.left.pressed = true;
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        case ' ':
            // Play projectile audio
            projectileAudio.currentTime = 0; // Reset audio to start
            projectileAudio.play();

            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }));
            break;
    }
});
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft': 
            keys.left.pressed = false;
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
        case ' ':
            console.log('space');
            break;
    }
});



