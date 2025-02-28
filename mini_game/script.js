const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'red',
    border: 'black',
    speed: 7,
    targetX: null,
    targetY: null
};

const bullets = [];
const targets = [
    { x: 200, y: 200, width: 40, height: 60, color: 'orange', dx: 1, dy: 2 },
    { x: 600, y: 300, width: 40, height: 60, color: 'green', dx: -2, dy: 1 },
    { x: 400, y: 500, width: 40, height: 60, color: 'purple', dx: 1, dy: -2 },
    { x: 100, y: 500, width: 40, height: 60, color: 'pink', dx: 2, dy: 2 },
    { x: 200, y: 100, width: 40, height: 60, color: 'brown', dx: -2, dy: -1 },
    { x: 300, y: 400, width: 40, height: 60, color: 'blue', dx: -1, dy: -2 }
];
context.arc(5, 5, 3, 0, Math.PI * 2)
function drawCircle() {
    // Draw the red circle
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    context.fillStyle = circle.color;
    context.fill();

    // Add a thin black border
    context.lineWidth = 2; // Adjust the thickness of the border
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
}

function drawBullets() {
    bullets.forEach(bullet => {
        context.beginPath();
        context.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        context.fillStyle = bullet.color;
        context.fill();
        context.closePath();
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
    });
}

function drawTargets() {
    targets.forEach(target => {
        context.fillStyle = target.color;
        context.fillRect(target.x, target.y, target.width, target.height);
        // Add a thin black border
        context.lineWidth = 2; // Adjust the border thickness if needed
        context.strokeStyle = 'black';
        context.strokeRect(target.x, target.y, target.width, target.height)
    });
}

function updateTargets() {
    targets.forEach(target => {
        // Update position
        target.x += target.dx;
        target.y += target.dy;

        // Bounce off walls
        if (target.x <= 0 || target.x + target.width >= canvas.width) {
            target.dx *= -1; // Reverse direction
        }
        if (target.y <= 0 || target.y + target.height >= canvas.height) {
            target.dy *= -1; // Reverse direction
        }
    });
}
document.addEventListener('contextmenu', (e) => {
    if (e.target.id !== 'gameCanvas') {
        e.preventDefault(); // Disable right-click everywhere except the canvas
    }
});
function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTargets();
    drawBullets();
    drawCircle(); // Draw the circle last to ensure it appears on top
    updateTargets();
    moveTowardsTarget();
    detectCollisions();
}

function moveTowardsTarget() {
    if (circle.targetX !== null && circle.targetY !== null) {
        const dx = circle.targetX - circle.x;
        const dy = circle.targetY - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > circle.speed) {
            circle.x += (dx / distance) * circle.speed;
            circle.y += (dy / distance) * circle.speed;
        } else {
            circle.x = circle.targetX;
            circle.y = circle.targetY;
            circle.targetX = null;
            circle.targetY = null;
        }
    }
}

function setCircleTarget(e) {
    if (e.button === 2) { // Right-click
        const rect = canvas.getBoundingClientRect();
        circle.targetX = e.clientX - rect.left;
        circle.targetY = e.clientY - rect.top;
    }
}

// Load the audio file
const pewSound = new Audio('pew-pew-lame-sound-effect.mp3');
pewSound.volume = 0.4
function shootBullet(e) {
    if (e.button === 0) { // Left-click
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const angle = Math.atan2(mouseY - circle.y, mouseX - circle.x);
        const speed = 30;

        // Play the sound effect
        pewSound.currentTime = 0; // Reset the sound to allow rapid firing
        pewSound.play();

        bullets.push({
            x: circle.x,
            y: circle.y,
            radius: 5,
            color: 'blue',
            dx: speed * Math.cos(angle),
            dy: speed * Math.sin(angle),
        });
    }
}



const backgroundSound = new Audio('quiz-game-music-loop-bpm-90-61070.mp3');
backgroundSound.loop = true;
backgroundSound.volume = 0.5; // Adjust the volume as needed
backgroundSound.pause(); // Start the game muted

const backgroundButton = document.getElementById('backgroundButton');
let isMuted = true; // Start muted by default

// Toggle the background sound on button click
backgroundButton.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        backgroundSound.pause();
        backgroundButton.textContent = 'Play Background Music';
    } else {
        backgroundSound.play();
        backgroundButton.textContent = 'Mute Background Music';
    }
});


const eliminatedSound = new Audio('achievement-video-game-type-1-230515.mp3')
eliminatedSound.volume = 0.8
function detectCollisions() {
    bullets.forEach(bullet => {
        targets.forEach((target, index) => {
            if (bullet.x > target.x && bullet.x < target.x + target.width &&
                bullet.y > target.y && bullet.y < target.y + target.height) {
                targets.splice(index, 1); // Remove the target if hit
                eliminatedSound.currentTime = 0
                eliminatedSound.play()
            }
        });
    });
}

document.addEventListener('mousedown', setCircleTarget);
canvas.addEventListener('mousedown', shootBullet);

// Prevent the context menu from appearing on right-click
document.addEventListener('contextmenu', e => e.preventDefault());

setInterval(update, 1000 / 60);
