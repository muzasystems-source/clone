// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
});

document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ===== THREE.JS – FUNDO ESTRELAR =====
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const count = 2500;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 30;
    positions[i*3+1] = (Math.random() - 0.5) * 30;
    positions[i*3+2] = (Math.random() - 0.5) * 15;
    const color = new THREE.Color().setHSL(0.6 + Math.random()*0.25, 0.8, 0.5 + Math.random()*0.3);
    colors[i*3] = color.r;
    colors[i*3+1] = color.g;
    colors[i*3+2] = color.b;
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const texture = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16,16,0,16,16,16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,32,32);
    return new THREE.CanvasTexture(canvas);
})();

const material = new THREE.PointsMaterial({
    size: 0.12,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
});
const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 10;

let mouseX = 0, mouseY = 0;

// Mouse (desktop)
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Toque (mobile/tablet)
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) {
        mouseX = (touch.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (touch.clientY / window.innerHeight - 0.5) * 2;
    }
}, { passive: true });

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0004;
    particles.rotation.x += 0.0002;
    particles.rotation.y += (mouseX * 0.3 - particles.rotation.y) * 0.02;
    particles.rotation.x += (-mouseY * 0.3 - particles.rotation.x) * 0.02;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== CUBO 3D COM TEXTO "STARTEC" – TEXTO GRANDE E VISÍVEL =====
const cubeContainer = document.getElementById('cube-container');
if (cubeContainer) {
    const sceneCube = new THREE.Scene();
    const cameraCube = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const rendererCube = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    function resizeCubeRenderer() {
        const width = cubeContainer.clientWidth || 200;
        const height = cubeContainer.clientHeight || 200;
        rendererCube.setSize(width, height);
        cameraCube.aspect = width / height;
        cameraCube.updateProjectionMatrix();
        const size = Math.min(width, height);
        cameraCube.position.z = size / 30 + 3.8;
    }
    
    cubeContainer.appendChild(rendererCube.domElement);
    resizeCubeRenderer();
    window.addEventListener('resize', resizeCubeRenderer);

    function createTextTexture(text, fontSize = 160, bgColor = '#0a1628') {
        const size = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.lineWidth = 3;
        ctx.strokeRect(15, 15, size - 30, size - 30);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 6;
        ctx.font = `bold ${fontSize}px 'Inter', Arial, sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(text, size/2, size/2);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.lineWidth = 18;
        ctx.strokeText(text, size/2, size/2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        ctx.strokeText(text, size/2, size/2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(text, size/2, size/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 4;
        texture.needsUpdate = true;
        return texture;
    }

    const texture = createTextTexture('STARTEC', 160, '#0a1628');
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.05,
        side: THREE.DoubleSide
    });
    const materials = [material, material, material, material, material, material];

    const cubeSize = 3.0;
    const cube = new THREE.Mesh(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), materials);
    sceneCube.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneCube.add(ambientLight);
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(2, 3, 4);
    sceneCube.add(light1);
    const light2 = new THREE.DirectionalLight(0x00E5FF, 0.3);
    light2.position.set(-2, -1, 3);
    sceneCube.add(light2);

    function animateCube() {
        requestAnimationFrame(animateCube);
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.015;
        cube.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        rendererCube.render(sceneCube, cameraCube);
    }
    animateCube();
}

// ===== GSAP + SCROLLTRIGGER =====
gsap.registerPlugin(ScrollTrigger);

// Hero
gsap.from('.hero-logo', { duration: 1.2, y: 80, opacity: 0, ease: 'power4.out' });
gsap.from('.hero-title', { duration: 1.2, y: 60, opacity: 0, delay: 0.2, ease: 'power4.out' });
gsap.from('.hero-sub', { duration: 1.2, y: 40, opacity: 0, delay: 0.4, ease: 'power4.out' });
gsap.from('.hero-cta', { duration: 1.2, y: 30, opacity: 0, delay: 0.6, ease: 'power4.out' });
gsap.from('.hero-badge', { duration: 1, scale: 0.8, opacity: 0, delay: 0.1, ease: 'back.out(1.7)' });
gsap.from('#cube-container', { duration: 1.2, scale: 0.5, opacity: 0, delay: 0.3, ease: 'back.out(1.7)' });

// Cards 3D
gsap.utils.toArray('.card-3d').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        duration: 0.9,
        y: 70,
        opacity: 0,
        delay: i * 0.15,
        ease: 'power3.out'
    });
});

// Serviços
gsap.utils.toArray('.service-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 88%' },
        duration: 0.8,
        y: 50,
        opacity: 0,
        delay: i * 0.08,
        ease: 'power3.out'
    });
});

// Engenhocas
gsap.from('.engenhocas-text', {
    scrollTrigger: { trigger: '.engenhocas', start: 'top 80%' },
    duration: 1,
    x: -60,
    opacity: 0,
    ease: 'power3.out'
});
gsap.from('.gallery-grid img', {
    scrollTrigger: {
        trigger: '.engenhocas',
        start: 'top bottom',
        toggleActions: 'play none none none'
    },
    duration: 0.8,
    scale: 0.9,
    opacity: 0,
    stagger: 0.15,
    ease: 'power3.out'
});

// Contacto
gsap.from('.contact-info', {
    scrollTrigger: { trigger: '#contacto', start: 'top 85%' },
    duration: 1,
    x: -50,
    opacity: 0,
    ease: 'power3.out'
});
gsap.from('.contact-form', {
    scrollTrigger: { trigger: '#contacto', start: 'top 85%' },
    duration: 1,
    x: 50,
    opacity: 0,
    ease: 'power3.out'
});

// ===== CARROSSEL =====
const slidesData = [
    { src: 'assets/images/promoces/7anos-1.jpg', caption: '...7anos STARTEC – celebrando conquistas!' },
    { src: 'assets/images/promoces/smartid-2.jpg', caption: '...SmartID Mobile – gestão de identidade' },
    { src: 'assets/images/promoces/Smartid-3.jpg', caption: '...Dicas de utilização do SmartID' }
];

let currentSlide = 0;
const slideContainer = document.getElementById('carouselSlide');
const dotsContainer = document.getElementById('dotsContainer');

function buildCarousel() {
    slidesData.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'carousel-item' + (index === 0 ? ' active' : '');
        slideDiv.innerHTML = `
            <img src="${slide.src}" alt="${slide.caption}" />
            <div class="carousel-caption">${slide.caption}</div>
        `;
        slideContainer.appendChild(slideDiv);

        const dot = document.createElement('span');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.dataset.index = index;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    updateCarousel();
}

function updateCarousel() {
    const offset = -currentSlide * 100;
    slideContainer.style.transform = `translateX(${offset}%)`;
    document.querySelectorAll('.carousel-item').forEach((item, i) => {
        item.classList.toggle('active', i === currentSlide);
    });
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slidesData.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
    updateCarousel();
}

document.getElementById('nextBtn').addEventListener('click', nextSlide);
document.getElementById('prevBtn').addEventListener('click', prevSlide);

let autoPlay = setInterval(nextSlide, 5000);
const carouselEl = document.querySelector('.carousel');
carouselEl.addEventListener('mouseenter', () => clearInterval(autoPlay));
carouselEl.addEventListener('mouseleave', () => {
    autoPlay = setInterval(nextSlide, 5000);
});

buildCarousel();

// ===== RIPPLE EFFECT =====
document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.4);
            width: 60px;
            height: 60px;
            left: ${x - 30}px;
            top: ${y - 30}px;
            transform: scale(0);
            animation: rippleAnim 0.6s linear;
            pointer-events: none;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
});

console.log('🚀 STARTEC – Site tecnológico e serviços!');