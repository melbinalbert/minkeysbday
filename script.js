// Carousel scroll logic
function scrollCarousel(galleryId, direction) {
    const carousel = document.getElementById(galleryId);
    if (!carousel) return;
    const scrollAmount = Math.max(carousel.offsetWidth * 0.7, 200) * direction;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Gallery upload & preview logic (currently not used)
const monthUpload = document.getElementById('month-photos-upload');
const extraUpload = document.getElementById('extra-photos-upload');
const monthGallery = document.getElementById('month-gallery');
const extraGallery = document.getElementById('extra-gallery');

if (monthUpload && monthGallery) {
    monthUpload.addEventListener('change', (e) => {
        monthGallery.innerHTML = '';
        const files = Array.from(e.target.files).slice(0, 12);
        files.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="${ev.target.result}" alt="Month ${idx+1}"><div class="month-label">Month ${idx+1}</div>`;
                monthGallery.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    });
}
if (extraUpload && extraGallery) {
    extraUpload.addEventListener('change', (e) => {
        extraGallery.innerHTML = '';
        Array.from(e.target.files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="${ev.target.result}" alt="Family Photo">`;
                extraGallery.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    });
}

// Butterfly animation and interactive logic


    const butterflyCanvas = document.getElementById('butterfly-canvas');
    if (!butterflyCanvas) {
        document.body.insertAdjacentHTML('afterbegin', '<div style="background: #fff3cd; color: #721c24; padding: 1em; border: 2px solid #ffeeba; font-size: 1.2em; z-index: 9999; position: fixed; top: 0; left: 0; right: 0;">Error: #butterfly-canvas not found in DOM. Butterflies cannot be shown.</div>');
        throw new Error('#butterfly-canvas not found in DOM');
    }

    // --- BEGIN: Butterfly logic previously here ---

const BUTTERFLY_SVGS = [
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#ffb3e6" fill-opacity=".7"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#b39ddb" fill-opacity=".7"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fffde7" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#7b1fa2" fill-opacity=".8"/>
    </svg>`,
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#ffecb3" fill-opacity=".7"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#80cbc4" fill-opacity=".7"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fffde7" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#ff7043" fill-opacity=".8"/>
    </svg>`,
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#c5e1a5" fill-opacity=".7"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#f48fb1" fill-opacity=".7"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fffde7" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#43a047" fill-opacity=".8"/>
    </svg>`,
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#f8bbd0" fill-opacity=".7"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#b2ebf2" fill-opacity=".7"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fff9c4" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#ff4081" fill-opacity=".8"/>
    </svg>`,
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#ffd180" fill-opacity=".7"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#ce93d8" fill-opacity=".7"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fffde7" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#ff6f00" fill-opacity=".8"/>
    </svg>`,
    // Blue & orange butterfly, different wing shape
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fw3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#b2ebf2"/>
          <stop offset="100%" stop-color="#ffd180"/>
        </linearGradient>
        <radialGradient id="hw3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity=".7"/>
          <stop offset="100%" stop-color="#ce93d8"/>
        </radialGradient>
      </defs>
      <path d="M30,20 Q8,7 24,25 Q28,32 30,20 Q32,32 36,25 Q52,7 30,20" fill="url(#fw3)"/>
      <path d="M30,24 Q18,38 28,27 Q30,29 32,27 Q42,38 30,24" fill="url(#hw3)"/>
      <ellipse cx="30" cy="21" rx="2.2" ry="7.5" fill="#ff6f00"/>
      <ellipse cx="30" cy="13" rx="1.1" ry="2" fill="#fffde7"/>
      <path d="M29,13 Q27,7 25,11" stroke="#ff6f00" stroke-width="1" fill="none"/>
      <path d="M31,13 Q33,7 35,11" stroke="#ff6f00" stroke-width="1" fill="none"/>
      <circle cx="22" cy="14" r="0.9" fill="#fff" fill-opacity=".6"/>
      <circle cx="38" cy="14" r="0.9" fill="#fff" fill-opacity=".6"/>
    </svg>`,
    // Green & pink butterfly, more rounded wings
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fw4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f8bbd0"/>
          <stop offset="100%" stop-color="#c5e1a5"/>
        </radialGradient>
        <radialGradient id="hw4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity=".7"/>
          <stop offset="100%" stop-color="#f48fb1"/>
        </radialGradient>
      </defs>
      <path d="M30,20 Q10,10 22,27 Q28,35 30,20 Q32,35 38,27 Q50,10 30,20" fill="url(#fw4)"/>
      <path d="M30,25 Q17,37 28,29 Q30,31 32,29 Q43,37 30,25" fill="url(#hw4)"/>
      <ellipse cx="30" cy="22" rx="2.1" ry="7" fill="#43a047"/>
      <ellipse cx="30" cy="14" rx="1.1" ry="2" fill="#fffde7"/>
      <path d="M29,14 Q27,8 25,12" stroke="#43a047" stroke-width="1" fill="none"/>
      <path d="M31,14 Q33,8 35,12" stroke="#43a047" stroke-width="1" fill="none"/>
      <circle cx="21" cy="15" r="0.8" fill="#fff" fill-opacity=".13"/>
      <circle cx="39" cy="15" r="0.8" fill="#fff" fill-opacity=".13"/>
    </svg>`,
    // Rainbow pastel butterfly, more fantasy
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fw5" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffe0f7"/>
          <stop offset="100%" stop-color="#b2ebf2"/>
        </linearGradient>
        <radialGradient id="hw5" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity=".7"/>
          <stop offset="100%" stop-color="#ffd180"/>
        </radialGradient>
      </defs>
      <path d="M30,20 Q12,5 25,28 Q29,34 30,20 Q31,34 35,28 Q48,5 30,20" fill="url(#fw5)"/>
      <path d="M30,25 Q16,38 28,30 Q30,32 32,30 Q44,38 30,25" fill="url(#hw5)"/>
      <ellipse cx="30" cy="22" rx="2" ry="7" fill="#7b2ff2"/>
      <ellipse cx="30" cy="14" rx="1" ry="1.9" fill="#fffde7"/>
      <path d="M29,14 Q27,7 25,11" stroke="#7b2ff2" stroke-width="1" fill="none"/>
      <path d="M31,14 Q33,7 35,11" stroke="#7b2ff2" stroke-width="1" fill="none"/>
      <circle cx="23" cy="13" r="0.9" fill="#fff" fill-opacity=".7"/>
      <circle cx="37" cy="13" r="0.9" fill="#fff" fill-opacity=".7"/>
    </svg>`,
    // Blue & orange butterfly with whimsical sparkle
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="wing3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#b2ebf2"/>
                <stop offset="100%" stop-color="#ffd180"/>
            </linearGradient>
        </defs>
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="url(#wing3)" fill-opacity=".8"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#ce93d8" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fffde7" fill-opacity=".85"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#ff6f00" fill-opacity=".8"/>
        <circle cx="18" cy="27" r="1.2" fill="#fff" fill-opacity=".6"/>
        <circle cx="42" cy="27" r="1.2" fill="#fff" fill-opacity=".6"/>
    </svg>`,
    // Green & pink butterfly with extra wing detail
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#c5e1a5" fill-opacity=".75"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#f48fb1" fill-opacity=".75"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fffde7" fill-opacity=".85"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#43a047" fill-opacity=".8"/>
        <ellipse cx="15" cy="20" rx="7" ry="8" fill="#fff" fill-opacity=".13"/>
        <ellipse cx="45" cy="20" rx="7" ry="8" fill="#fff" fill-opacity=".13"/>
    </svg>`,
    // Magenta & teal butterfly
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#f8bbd0" fill-opacity=".8"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#b2ebf2" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fff9c4" fill-opacity=".85"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#ff4081" fill-opacity=".8"/>
        <circle cx="30" cy="12" r="1.4" fill="#fff" fill-opacity=".7"/>
    </svg>`,
    // Pastel rainbow butterfly
    `<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="13" ry="18" fill="#ffd180" fill-opacity=".7"/>
        <ellipse cx="45" cy="20" rx="13" ry="18" fill="#ce93d8" fill-opacity=".7"/>
        <ellipse cx="30" cy="20" rx="7" ry="16" fill="#fffde7" fill-opacity=".8"/>
        <ellipse cx="30" cy="20" rx="3" ry="8" fill="#ff6f00" fill-opacity=".8"/>
    </svg>`
];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function spawnButterfly(x = null, y = null) {
    console.log('Spawning butterfly at', x, y);
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    // Random size and opacity
    const size = randomBetween(38, 110);
    const opacity = randomBetween(0.26, 0.6);
    butterfly.style.width = `${size}px`;
    butterfly.style.height = `${size * 0.66}px`;
    butterfly.style.opacity = opacity;
    // Pick random SVG
    butterfly.innerHTML = BUTTERFLY_SVGS[Math.floor(Math.random() * BUTTERFLY_SVGS.length)];

    // Initial position
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startX = x !== null ? x : randomBetween(0, vw - size);
    const startY = y !== null ? y : randomBetween(0, vh - size * 0.66);
    butterfly.style.left = `${startX}px`;
    butterfly.style.top = `${startY}px`;

    butterflyCanvas.appendChild(butterfly);

    // Animate butterfly
    let t = 0;
    const duration = randomBetween(13, 22); // seconds
    const amplitude = randomBetween(50, 110);
    const direction = Math.random() > 0.5 ? 1 : -1;
    const speedX = randomBetween(18, 38) * (Math.random() > 0.5 ? 1 : -1);
    const speedY = randomBetween(-8, 13);
    const flapSpeed = randomBetween(1.5, 2.4);
    const flapAmplitude = randomBetween(6, 13);

    function animate() {
        t += 0.016;
        // Butterfly path: sinusoidal + drift
        const dx = speedX * t + amplitude * Math.sin(t * 2 * Math.PI / 3) * direction;
        const dy = speedY * t + amplitude * Math.sin(t * 2 * Math.PI / 2.5);
        const flap = Math.sin(t * flapSpeed * 2 * Math.PI) * flapAmplitude;
        // Add gentle rotation and rare twirl
        let rotate = Math.sin(t * flapSpeed * 1.1) * 16;
        if (Math.random() < 0.003) rotate += Math.sin(t * 4) * 50;
        butterfly.style.transform = `translate(${dx}px, ${dy + flap}px) scale(${1 + flap/60}) rotate(${rotate}deg)`;
        if (t < duration && butterfly.parentElement === butterflyCanvas) {
            requestAnimationFrame(animate);
        } else {
            // Fade out and remove
            butterfly.style.opacity = 0;
            setTimeout(() => butterfly.remove(), 1000);
        }
    }
    animate();
}

// Spawn butterflies on load
for (let i = 0; i < 10; i++) {
    setTimeout(() => spawnButterfly(), i * 600);
}

// On click, spawn a new butterfly at click position
window.addEventListener('click', (e) => {
    spawnButterfly(e.clientX, e.clientY);
});



// Map integration (placeholder, replace coordinates below)
function initMap() {
    // Example: using OpenStreetMap with Leaflet.js
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;
    mapDiv.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        setTimeout(() => {
            const map = L.map('map').setView([10.003972, 76.233278], 14); // Replace with your coordinates
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);
            L.marker([10.003972, 76.233278]).addTo(map)
                .bindPopup('Birthday Celebration Location')
                .openPopup();
        }, 200);
    };
    document.body.appendChild(script);
}
window.addEventListener('DOMContentLoaded', initMap);

// Disable right-click everywhere
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Extra: block drag events (another way of downloading images)
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && 
        (e.key === 'u' || e.key === 's' || e.key === 'c' || e.key === 'p')) {
        e.preventDefault();
    }
});