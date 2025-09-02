
        let scene, camera, renderer, geometries = [];
        let mouseX = 0, mouseY = 0;

        function init() {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x0a0c34, 20, 100);

            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 30);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            document.getElementById('canvas-container').appendChild(renderer.domElement);

            // Lighting
            setupLighting();
            
            // Create floating geometries
            createFloatingGeometries();
            
            // Mouse interaction
            setupMouseInteraction();
            
            // Start animation
            animate();
        }

        function setupLighting() {
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0x56ffbc, 1);
            directionalLight.position.set(10, 10, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            // Multiple colored lights
            const pointLight1 = new THREE.PointLight(0x56ffbc, 0.8, 50);
            pointLight1.position.set(-20, 10, 10);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x0a0c34, 0.6, 40);
            pointLight2.position.set(20, -10, 10);
            scene.add(pointLight2);
        }

        function createFloatingGeometries() {
            const shapes = [
                new THREE.BoxGeometry(2, 2, 2),
                new THREE.SphereGeometry(1.5, 32, 32),
                new THREE.ConeGeometry(1, 3, 8),
                new THREE.OctahedronGeometry(1.5),
                new THREE.TorusGeometry(1.5, 0.5, 16, 100)
            ];

            const materials = [
                new THREE.MeshPhysicalMaterial({
                    color: 0x56ffbc,
                    transparent: true,
                    opacity: 0.3,
                    metalness: 0.8,
                    roughness: 0.2
                }),
                new THREE.MeshPhysicalMaterial({
                    color: 0x0a0c34,
                    transparent: true,
                    opacity: 0.4,
                    metalness: 0.6,
                    roughness: 0.3
                })
            ];

            for (let i = 0; i < 15; i++) {
                const geometry = shapes[Math.floor(Math.random() * shapes.length)];
                const material = materials[Math.floor(Math.random() * materials.length)];
                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.set(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 60
                );

                mesh.rotation.set(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                );

                mesh.scale.setScalar(Math.random() * 0.5 + 0.5);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                geometries.push({
                    mesh: mesh,
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    },
                    floatSpeed: Math.random() * 0.01 + 0.005,
                    floatOffset: Math.random() * Math.PI * 2
                });

                scene.add(mesh);
            }
        }

        function setupMouseInteraction() {
            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            });

            // Category filtering
            const categoryBtns = document.querySelectorAll('.category-btn');
            const productCards = document.querySelectorAll('.product-card');

            categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.dataset.category;
                    
                    // Update active button
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Filter products
                    productCards.forEach(card => {
                        if (category === 'all' || card.dataset.category === category) {
                            card.style.display = 'block';
                            card.style.animation = 'fadeIn 0.5s ease-in-out';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });

            // Product button interactions
            const productButtons = document.querySelectorAll('.product-button');
            productButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    this.innerHTML = 'Added!';
                    this.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
                    
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                        this.innerHTML = 'Add to Cart';
                        this.style.background = 'linear-gradient(45deg, #56FFBC, #0A0C34)';
                    }, 1000);
                });
            });

            window.addEventListener('resize', onWindowResize);
        }

        function animate() {
            requestAnimationFrame(animate);

            // Animate geometries
            geometries.forEach((item, index) => {
                item.mesh.rotation.x += item.rotationSpeed.x;
                item.mesh.rotation.y += item.rotationSpeed.y;
                item.mesh.rotation.z += item.rotationSpeed.z;
                
                item.mesh.position.y += Math.sin(Date.now() * item.floatSpeed + item.floatOffset) * 0.05;
            });

            // Mouse interaction
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Add CSS animation for fade in
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        // Initialize
        window.addEventListener('load', init);
   