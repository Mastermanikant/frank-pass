/**
 * FrankPass Particle Background System
 * Creates a dynamic, interactive particle canvas behind all pages.
 * Lightweight, performant, zero-dependency.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };
    let animId;

    const CONFIG = {
        count: 80,
        color: '108, 92, 231',       // --accent-primary RGB
        lineColor: '108, 92, 231',
        maxSpeed: 0.4,
        size: { min: 1, max: 3 },
        linkDistance: 150,
        mouseRepel: true,
        pulseSpeed: 0.02
    };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * CONFIG.maxSpeed;
            this.vy = (Math.random() - 0.5) * CONFIG.maxSpeed;
            this.baseRadius = Math.random() * (CONFIG.size.max - CONFIG.size.min) + CONFIG.size.min;
            this.radius = this.baseRadius;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update(time) {
            // Pulse effect
            this.radius = this.baseRadius + Math.sin(time * CONFIG.pulseSpeed + this.pulseOffset) * 0.5;

            // Mouse repulsion
            if (CONFIG.mouseRepel && mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.vx += (dx / dist) * force * 0.3;
                    this.vy += (dy / dist) * force * 0.3;
                }
            }

            // Damping
            this.vx *= 0.99;
            this.vy *= 0.99;

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${CONFIG.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        // Adjust count for mobile
        const count = window.innerWidth < 768 ? Math.floor(CONFIG.count * 0.5) : CONFIG.count;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawLinks() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.linkDistance) {
                    const opacity = (1 - dist / CONFIG.linkDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${CONFIG.lineColor}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update(time);
            p.draw();
        });
        drawLinks();
        animId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resize();
        init();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Start
    resize();
    init();
    animate(0);
})();
