// Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// Three.js Animation
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: '#2ecc71'
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Mouse
document.addEventListener('mousemove', animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
    mouseY = event.clientY;
    mouseX = event.clientX;
}

// Loading Bar
const loadingBar = document.querySelector('.loading-bar');
let loadingProgress = 0;
const loadingInterval = setInterval(() => {
    loadingProgress += 1;
    loadingBar.style.width = `${loadingProgress}%`;
    if(loadingProgress >= 100) {
        clearInterval(loadingInterval);
        setTimeout(() => {
            loadingBar.style.opacity = '0';
        }, 1500);
    }
}, 20);

// Animation Loop
const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update particles
    particlesMesh.rotation.y = -0.1 * elapsedTime;
    if(mouseX > 0) {
        particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
        particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);
    }

    // Render
    renderer.render(scene, camera);

    // Call animate again on the next frame
    window.requestAnimationFrame(animate);
};

animate();

// Handle Resize
window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', submitForm);

// Form submission handler
async function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            formMessage.textContent = 'Message sent successfully!';
            formMessage.className = 'form-message success';
            form.reset();
        } else {
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.className = 'form-message error';
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        
        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
    return false;
} 