 
        let scene, camera, renderer, network = [];
        let mouseX = 0, mouseY = 0;
        let clock = new THREE.Clock();

        function init() {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x0a0c34, 30, 150);

            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 50);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            document.getElementById('canvas-container').appendChild(renderer.domElement);

            // Lighting
            setupLighting();
            
            // Create network visualization
            createNetworkVisualization();
            
            // Mouse interaction
            setupMouseInteraction();
            
            // Start animation
            animate();
        }

        function setupLighting() {
            const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0x56ffbc, 1.2);
            directionalLight.position.set(30, 30, 20);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            // Dynamic colored lights
            const pointLight1 = new THREE.PointLight(0x56ffbc, 1, 80);
            pointLight1.position.set(-40, 20, 20);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x0a0c34, 0.8, 60);
            pointLight2.position.set(40, -20, 20);
            scene.add(pointLight2);

            // Animate lights
            setInterval(() => {
                pointLight1.position.x = Math.sin(Date.now() * 0.001) * 40;
                pointLight1.position.y = Math.cos(Date.now() * 0.0015) * 20 + 10;
                
                pointLight2.position.x = Math.cos(Date.now() * 0.001) * 40;
                pointLight2.position.y = Math.sin(Date.now() * 0.0012) * 20 - 10;
            }, 50);
        }

        function createNetworkVisualization() {
            // Create nodes
            const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const nodeMaterials = [
                new THREE.MeshPhysicalMaterial({
                    color: 0x56ffbc,
                    metalness: 0.8,
                    roughness: 0.2,
                    emissive: 0x56ffbc,
                    emissiveIntensity: 0.1
                }),
                new THREE.MeshPhysicalMaterial({
                    color: 0x0a0c34,
                    metalness: 0.6,
                    roughness: 0.3,
                    emissive: 0x0a0c34,
                    emissiveIntensity: 0.05
                })
            ];

            // Create network nodes
            for (let i = 0; i < 20; i++) {
                const material = nodeMaterials[Math.floor(Math.random() * nodeMaterials.length)];
                const node = new THREE.Mesh(nodeGeometry, material);
                
                node.position.set(
                    (Math.random() - 0.5) * 80,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 40
                );

                node.castShadow = true;
                node.receiveShadow = true;

                network.push({
                    mesh: node,
                    originalPosition: node.position.clone(),
                    connections: []
                });

                scene.add(node);
            }

            // Create connections between nodes
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0x56ffbc, 
                transparent: true, 
                opacity: 0.3 
            });

            for (let i = 0; i < network.length; i++) {
                for (let j = i + 1; j < network.length; j++) {
                    const distance = network[i].mesh.position.distanceTo(network[j].mesh.position);
                    if (distance < 30 && Math.random() > 0.7) {
                        const points = [
                            network[i].mesh.position,
                            network[j].mesh.position
                        ];
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geometry, lineMaterial);
                        scene.add(line);
                        
                        network[i].connections.push(line);
                    }
                }
            }
        }

        function setupMouseInteraction() {
            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            });

            window.addEventListener('resize', onWindowResize);
        }

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Animate network nodes
            network.forEach((node, index) => {
                // Floating animation
                node.mesh.position.y = node.originalPosition.y + Math.sin(time * 0.5 + index) * 2;
                node.mesh.position.x = node.originalPosition.x + Math.cos(time * 0.3 + index) * 1;
                
                // Rotation
                node.mesh.rotation.x += 0.005;
                node.mesh.rotation.y += 0.007;
                
                // Scale pulsing
                const scale = 1 + Math.sin(time * 2 + index) * 0.1;
                node.mesh.scale.setScalar(scale);

                // Update connection lines
                node.connections.forEach(line => {
                    line.geometry.setFromPoints([
                        line.geometry.attributes.position.array.slice(0, 3).map((v, i) => 
                            i === 0 ? node.mesh.position.x : 
                            i === 1 ? node.mesh.position.y : node.mesh.position.z
                        ),
                        line.geometry.attributes.position.array.slice(3, 6)
                    ]);
                    line.geometry.attributes.position.needsUpdate = true;
                });
            });

            // Mouse interaction with camera
            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
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
   