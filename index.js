
        let scene, camera, renderer, headphones, mixer, clock;
        let isLoading = true;
        let rotationSpeed = 0.005;
        let currentColor = '#ff6b6b';

        function init() {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x0a0c34, 10, 50);

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(5, 2, 5);

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;

            document.getElementById('canvas-container').appendChild(renderer.domElement);

            // Clock for animations
            clock = new THREE.Clock();

            // Lighting setup
            setupLighting();

            // Create headphones
            createHeadphones();

            // Setup controls
            setupControls();

            // Start animation
            animate();

            // Hide loading after delay
            setTimeout(() => {
                document.getElementById('loading').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loading').style.display = 'none';
                    isLoading = false;
                }, 500);
            }, 2000);
        }

        function setupLighting() {
            // Ambient light
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);

            // Key light
            const keyLight = new THREE.DirectionalLight(0x56ffbc, 1.2);
            keyLight.position.set(10, 10, 5);
            keyLight.castShadow = true;
            keyLight.shadow.camera.near = 0.1;
            keyLight.shadow.camera.far = 50;
            keyLight.shadow.camera.left = -10;
            keyLight.shadow.camera.right = 10;
            keyLight.shadow.camera.top = 10;
            keyLight.shadow.camera.bottom = -10;
            keyLight.shadow.mapSize.width = 2048;
            keyLight.shadow.mapSize.height = 2048;
            scene.add(keyLight);

            // Fill light
            const fillLight = new THREE.DirectionalLight(0x0a0c34, 0.8);
            fillLight.position.set(-5, 3, -5);
            scene.add(fillLight);

            // Rim light
            const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
            rimLight.position.set(0, 0, -10);
            scene.add(rimLight);

            // Point lights for extra glow
            const pointLight1 = new THREE.PointLight(0x56ffbc, 0.8, 20);
            pointLight1.position.set(5, 5, 5);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x0a0c34, 0.6, 15);
            pointLight2.position.set(-3, -2, 3);
            scene.add(pointLight2);
        }

        function createHeadphones() {
            headphones = new THREE.Group();

            // Create headband
            const headbandGeometry = new THREE.TorusGeometry(2.5, 0.2, 8, 20, Math.PI);
            const headbandMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x2c3e50,
                metalness: 0.8,
                roughness: 0.2,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            });
            const headband = new THREE.Mesh(headbandGeometry, headbandMaterial);
            headband.rotation.x = Math.PI;
            headband.position.y = 1.5;
            headband.castShadow = true;
            headband.receiveShadow = true;
            headphones.add(headband);

            // Create ear cups
            const cupGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 32);
            const cupMaterial = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(currentColor),
                metalness: 0.1,
                roughness: 0.3,
                clearcoat: 0.8,
                clearcoatRoughness: 0.2
            });

            // Left ear cup
            const leftCup = new THREE.Mesh(cupGeometry, cupMaterial.clone());
            leftCup.position.set(-2.2, 0, 0);
            leftCup.rotation.z = Math.PI / 2;
            leftCup.castShadow = true;
            leftCup.receiveShadow = true;
            headphones.add(leftCup);

            // Right ear cup
            const rightCup = new THREE.Mesh(cupGeometry, cupMaterial.clone());
            rightCup.position.set(2.2, 0, 0);
            rightCup.rotation.z = Math.PI / 2;
            rightCup.castShadow = true;
            rightCup.receiveShadow = true;
            headphones.add(rightCup);

            // Create padding
            const paddingGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.3, 32);
            const paddingMaterial = new THREE.MeshLambertMaterial({
                color: 0x1a1a1a
            });

            const leftPadding = new THREE.Mesh(paddingGeometry, paddingMaterial);
            leftPadding.position.set(-2.2, 0, 0);
            leftPadding.rotation.z = Math.PI / 2;
            headphones.add(leftPadding);

            const rightPadding = new THREE.Mesh(paddingGeometry, paddingMaterial);
            rightPadding.position.set(2.2, 0, 0);
            rightPadding.rotation.z = Math.PI / 2;
            headphones.add(rightPadding);

            // Create connecting arms
            const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
            const armMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x34495e,
                metalness: 0.9,
                roughness: 0.1
            });

            const leftArm = new THREE.Mesh(armGeometry, armMaterial);
            leftArm.position.set(-2.2, 0.8, 0);
            leftArm.rotation.z = 0.3;
            headphones.add(leftArm);

            const rightArm = new THREE.Mesh(armGeometry, armMaterial);
            rightArm.position.set(2.2, 0.8, 0);
            rightArm.rotation.z = -0.3;
            headphones.add(rightArm);

            // Add brand logo (simple geometric shape)
            const logoGeometry = new THREE.RingGeometry(0.3, 0.4, 8);
            const logoMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x56ffbc,
                metalness: 0.8,
                roughness: 0.1,
                emissive: 0x56ffbc,
                emissiveIntensity: 0.2
            });

            const leftLogo = new THREE.Mesh(logoGeometry, logoMaterial);
            leftLogo.position.set(-2.2, 0, 0.31);
            headphones.add(leftLogo);

            const rightLogo = new THREE.Mesh(logoGeometry, logoMaterial);
            rightLogo.position.set(2.2, 0, 0.31);
            headphones.add(rightLogo);

            // Store references to color-changeable parts
            headphones.colorParts = [leftCup, rightCup];

            scene.add(headphones);
            headphones.position.y = 0;
            headphones.scale.set(0.8, 0.8, 0.8);
        }

        function setupControls() {
            // Color picker functionality
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    colorOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    const newColor = this.dataset.color;
                    changeHeadphonesColor(newColor);
                    currentColor = newColor;
                });
            });

            // Mouse interaction
            let mouseX = 0;
            let mouseY = 0;
            let targetRotationX = 0;
            let targetRotationY = 0;

            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                
                targetRotationY = mouseX * 0.5;
                targetRotationX = mouseY * 0.3;
            });

            // Update rotation smoothly
            function updateRotation() {
                if (headphones) {
                    headphones.rotation.y += (targetRotationY - headphones.rotation.y) * 0.05;
                    headphones.rotation.x += (targetRotationX - headphones.rotation.x) * 0.05;
                }
                requestAnimationFrame(updateRotation);
            }
            updateRotation();

            // Window resize
            window.addEventListener('resize', onWindowResize);
        }

        function changeHeadphonesColor(color) {
            if (headphones && headphones.colorParts) {
                headphones.colorParts.forEach(part => {
                    part.material.color.setStyle(color);
                });
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            if (headphones && !isLoading) {
                // Gentle floating animation
                headphones.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
                
                // Auto rotation
                headphones.rotation.y += rotationSpeed;
            }

            // Render
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            
            // Update renderer size based on canvas container
            const container = document.getElementById('canvas-container');
            const rect = container.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
        }

        // Button functions
        function addToCart() {
            // Animate button
            const btn = event.target;
            btn.style.transform = 'scale(0.95)';
            btn.innerHTML = 'Added!';
            btn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
            
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
                btn.innerHTML = 'Add to Cart';
                btn.style.background = 'linear-gradient(45deg, #56FFBC, #0A0C34)';
            }, 1000);

            // Add some visual feedback to the 3D model
            if (headphones) {
                const originalScale = headphones.scale.clone();
                headphones.scale.multiplyScalar(1.1);
                setTimeout(() => {
                    headphones.scale.copy(originalScale);
                }, 200);
            }
        }

        function viewDetails() {
            alert('Product details would open in a modal or new page in a real application!');
        }

        // Initialize when page loads
        window.addEventListener('load', init);
    