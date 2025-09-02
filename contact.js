
        let scene, camera, renderer, waves = [];
        let mouseX = 0, mouseY = 0;
        let clock = new THREE.Clock();

        function init() {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x0a0c34, 50, 200);

            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 20, 80);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            document.getElementById('canvas-container').appendChild(renderer.domElement);

            // Lighting
            setupLighting();
            
            // Create wave formations
            createWaveFormations();
            
            // Create floating particles
            createFloatingParticles();
            
            // Setup interactions
            setupInteractions();
            
            // Start animation
            animate();
        }

        function setupLighting() {
            const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0x56ffbc, 1.5);
            directionalLight.position.set(50, 50, 30);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            // Multiple dynamic lights
            for (let i = 0; i < 5; i++) {
                const pointLight = new THREE.PointLight(
                    i % 2 === 0 ? 0x56ffbc : 0x0a0c34, 
                    1, 
                    100
                );
                pointLight.position.set(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 50,
                    (Math.random() - 0.5) * 50
                );
                scene.add(pointLight);

                // Store lights for animation
                waves.push({
                    light: pointLight,
                    originalPosition: pointLight.position.clone(),
                    speed: 0.001 + Math.random() * 0.002,
                    radius: 20 + Math.random() * 30
                });
            }
        }

        function createWaveFormations() {
            // Create wave-like geometries
            const waveGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
            const waveMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x56ffbc,
                transparent: true,
                opacity: 0.1,
                metalness: 0.8,
                roughness: 0.2,
                side: THREE.DoubleSide
            });

            for (let i = 0; i < 3; i++) {
                const wave = new THREE.Mesh(waveGeometry, waveMaterial.clone());
                wave.rotation.x = -Math.PI / 2;
                wave.position.y = -20 - i * 10;
                wave.position.z = i * -20;
                
                waves.push({
                    mesh: wave,
                    speed: 0.01 + i * 0.005,
                    amplitude: 5 + i * 2
                });
                
                scene.add(wave);
            }

            // Create floating ring formations
            const ringGeometry = new THREE.TorusGeometry(15, 2, 16, 100);
            const ringMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x0a0c34,
                transparent: true,
                opacity: 0.3,
                metalness: 0.9,
                roughness: 0.1
            });

            for (let i = 0; i < 4; i++) {
                const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
                ring.position.set(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60
                );
                ring.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );

                waves.push({
                    mesh: ring,
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    }
                });

                scene.add(ring);
            }
        }

        function createFloatingParticles() {
            const particleCount = 100;
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 200;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

                // Alternating colors
                if (i % 2 === 0) {
                    colors[i * 3] = 0.34; // R
                    colors[i * 3 + 1] = 1.0; // G
                    colors[i * 3 + 2] = 0.74; // B
                } else {
                    colors[i * 3] = 0.04; // R
                    colors[i * 3 + 1] = 0.05; // G
                    colors[i * 3 + 2] = 0.2; // B
                }
            }

            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            });

            const particleSystem = new THREE.Points(particles, particleMaterial);
            scene.add(particleSystem);

            waves.push({
                particles: particleSystem,
                originalPositions: positions.slice()
            });
        }

        function setupInteractions() {
            // Form submission
            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const button = this.querySelector('.form-button');
                button.innerHTML = 'Sending...';
                button.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
                
                setTimeout(() => {
                    button.innerHTML = 'Message Sent!';
                    setTimeout(() => {
                        button.innerHTML = 'Send Message';
                        button.style.background = 'linear-gradient(45deg, #56FFBC, #0A0C34)';
                        this.reset();
                    }, 2000);
                }, 1500);
            });

            // FAQ interactions
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('active');
                    } else {
                        item.classList.add('active');
                    }
                });
            });

            // Mouse interaction
            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            });

            // Generate floating particles for background
            generateBackgroundParticles();

            window.addEventListener('resize', onWindowResize);
        }

        function generateBackgroundParticles() {
            const particlesContainer = document.querySelector('.floating-particles');
            
            setInterval(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 2 + 's';
                particle.style.animationDuration = (6 + Math.random() * 4) + 's';
                
                particlesContainer.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 10000);
            }, 300);
        }

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Animate waves and objects
            waves.forEach((item, index) => {
                if (item.mesh) {
                    if (item.mesh.geometry.type === 'PlaneGeometry') {
                        // Wave animation
                        const positions = item.mesh.geometry.attributes.position.array;
                        for (let i = 0; i < positions.length; i += 3) {
                            positions[i + 2] = Math.sin(positions[i] * 0.1 + time * item.speed) * item.amplitude;
                        }
                        item.mesh.geometry.attributes.position.needsUpdate = true;
                    } else if (item.rotationSpeed) {
                        // Ring rotation
                        item.mesh.rotation.x += item.rotationSpeed.x;
                        item.mesh.rotation.y += item.rotationSpeed.y;
                        item.mesh.rotation.z += item.rotationSpeed.z;
                    }
                }

                if (item.light) {
                    // Animate lights
                    item.light.position.x = item.originalPosition.x + Math.sin(time * item.speed) * item.radius;
                    item.light.position.z = item.originalPosition.z + Math.cos(time * item.speed) * item.radius;
                    item.light.position.y = item.originalPosition.y + Math.sin(time * item.speed * 0.5) * 10;
                }

                if (item.particles) {
                    // Animate particle system
                    const positions = item.particles.geometry.attributes.position.array;
                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i + 1] += Math.sin(time + i) * 0.01;
                        positions[i] += Math.cos(time + i) * 0.005;
                    }
                    item.particles.geometry.attributes.position.needsUpdate = true;
                }
            });

            // Mouse interaction with camera
            camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 10 + 20 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Initialize
        window.addEventListener('load', init);
    