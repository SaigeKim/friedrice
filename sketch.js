let sizzle; // Declare variable for the sizzle sound
let riceParticles = [];
let settledParticles = [];
let bottomPadding = 50;
let gravity = 0.1;

function preload() {
  sizzle = loadSound("Fried Rice.mp3"); // Load the sizzle sound file
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Create a p5.js canvas
}

function draw() {
  background(255, 220, 125); // Background color

  // Display and update each rice particle
  for (let rice of riceParticles) {
    rice.update();
    rice.display();
  }
  // Display and update the settled rice particles
  for (let settledRice of settledParticles) {
    settledRice.display();
  }
}

function mouseClicked() {
  sizzle.play(); // Play the sizzle sound every time the mouse is clicked
  // Generate new rice particles
  for (let i = 0; i < 50; i++) {
    // Add more particles each time the mouse is clicked
    let x = randomGaussian(width / 2, width / 6); // Gaussian distribution for x-coordinate
    let y = randomGaussian(height / 2, height / 6); // Gaussian distribution for y-coordinate
    let riceColor;
    let shape = random(["oval", "circle", "rectangle"]); // Shape of fried rice
    if (shape === "oval") {
      riceColor = color(255); // White color for oval-shaped particles
    } else {
      riceColor = color(random(100, 255), random(50, 150), random(0, 50)); // Color of other particles
    }
    riceParticles.push(new RiceParticle(x, y, riceColor, shape));
  }
}

class RiceParticle {
  constructor(x, y, riceColor, shape) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-2, 0));
    this.acceleration = createVector(0, gravity); // Apply gravity
    this.baseSize = random(20, 40);
    this.size = this.baseSize;
    this.color = riceColor;
    this.shape = shape;
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.1, 0.1); // Rotation speed
    this.reachedBottom = false; // Flag to indicate if the particle has reached the bottom
  }

  update() {
    if (!this.reachedBottom) {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.rotation += this.rotationSpeed;

      for (let settledRice of settledParticles) {
        if (
          this.position.y + this.size / 2 >=
            settledRice.position.y - settledRice.size / 2 &&
          this.position.y - this.size / 2 <=
            settledRice.position.y + settledRice.size / 2 &&
          this.position.x + this.size / 2 >=
            settledRice.position.x - settledRice.size / 2 &&
          this.position.x - this.size / 2 <=
            settledRice.position.x + settledRice.size / 2
        ) {
          let deltaY = ((this.size + settledRice.size) / 2) * 0.8; // Stagger distance
          this.position.y = settledRice.position.y - deltaY;

          // Check if the particle needs to overlap
          if (this.position.x > settledRice.position.x) {
            this.position.x -= 0.5; // Adjust x-position to allow overlapping
          } else {
            this.position.x += 0.5; // Adjust x-position to allow overlapping
          }

          settledParticles.push(this); // Add the particle to the settled particles array
          this.reachedBottom = true; // Mark the particle as reached the bottom
          return; // Exit the function early since the particle has settled
        }
      }

      // Check if the particle has reached the bottom of the canvas
      if (this.position.y + this.size / 2 >= height - bottomPadding) {
        // Adjust the y-position to prevent overlapping with other settled particles
        this.adjustPosition();
        settledParticles.push(this); // Add the particle to the settled particles array
        this.reachedBottom = true; // Mark the particle as reached the bottom
      }
    }
  }

  adjustPosition() {
    for (let settledRice of settledParticles) {
      // Check for collision with settled particles
      if (
        this.position.dist(settledRice.position) <
        (this.size + settledRice.size) / 2
      ) {
        let deltaY = ((this.size + settledRice.size) / 2) * 0.8; // Stagger distance
        this.position.y = settledRice.position.y - deltaY;

        // Check if the particle needs to overlap
        if (this.position.x > settledRice.position.x) {
          this.position.x -= 5;
        } else {
          this.position.x += 5;
        }
      }
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);

    noStroke();
    fill(this.color);
    if (this.shape === "oval") {
      ellipse(0, 0, this.size * 0.5, this.size);
    } else if (this.shape === "circle") {
      ellipse(0, 0, this.size, this.size);
    } else if (this.shape === "rectangle") {
      rectMode(CENTER);
      rect(0, 0, this.size * 0.5, this.size);
    }
    pop();
  }
}
