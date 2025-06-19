document.addEventListener('DOMContentLoaded', function() {
    const threeJsContainer = document.getElementById('three-js-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const languageSelect = document.getElementById('language-select');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const htmlElement = document.documentElement; // Get the <html> element for dark mode class

    // Debug Info Elements
    const debugZoomLevel = document.getElementById('debug-zoom-level');
    const debugMouseCoords = document.getElementById('debug-mouse-coords');

    // Set up scene, camera, renderer
    let scene, camera, renderer;
    let meshPlane, meshBorder, parkingLots = [];
    let axesHelper; // Declare axesHelper here

    // Mouse control variables for Three.js
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    let currentRotationX = 0;
    let currentRotationY = 0;
    let mouseX = 0, mouseY = 0; // Global mouse coordinates

    // Translations object
    const translations = {
        en: {
            features: "Features",
            howItWorks: "How it Works",
            getStarted: "Get Started",
            heroTitle: "Effortless Parking with Epark",
            heroDescription: "Revolutionizing urban parking with seamless wireless payments and real-time availability. Say goodbye to queues and hello to convenience.",
            preRegisterButton: "Pre-Register Now!",
            caracasMapTitle: "Caracas Parking Network",
            mapInteractionHint: "Explore fictional Epark enabled lots in Caracas. (Drag to rotate, scroll to zoom)",
            whyParkPayTitle: "Why Epark?",
            advSpeedTitle: "Speed & Efficiency:",
            advSpeedDesc: "Tap and go! No more fumbling for cash or waiting at payment machines.",
            advSecureTitle: "Secure Payments:",
            advSecureDesc: "Your financial data is encrypted and protected with cutting-edge NFC technology.",
            advRealtimeTitle: "Real-time Availability:",
            advRealtimeDesc: "Check parking spot availability directly from your phone before you even leave.",
            advRecordsTitle: "Detailed Records:",
            advRecordsDesc: "Access your complete parking history, receipts, and manage your account effortlessly.",
            advEcoTitle: "Eco-Friendly:",
            advEcoDesc: "Reduce paper waste and contribute to a smarter, greener city.",
            howItWorksTitle: "How Epark Works",
            step1Title: "Create Your Account",
            step1Desc: "Sign up on our secure mobile app. Link your preferred payment method (credit card, digital wallet) in minutes. It's fast, easy, and secure.",
            step2Title: "Order Your NFC Tag",
            step2Desc: "Receive your sleek, durable Epark NFC tag in the mail. Simply attach it to your car's windshield or dashboard.",
            step3Title: "Drive Into a Lot",
            step3Desc: "When you enter a Epark-enabled parking lot, our sensors detect your NFC tag. The barrier lifts automatically.",
            step4Title: "Park & Pay Automatically",
            step4Desc: "Park your car. When you exit, your NFC tag is scanned again, and the parking fee is automatically charged to your linked payment method.",
            step5Title: "View History & Manage",
            step5Desc: "Access your complete parking history, receipts, and manage your account settings anytime through the Epark app.",
            step6Title: "Future Enhancements",
            step6Desc: "Look forward to features like pre-booking, reserved spots, and loyalty rewards coming soon!",
            footerCopy: "&copy; 2025 Epark. All rights reserved.",
            privacyPolicy: "Privacy Policy",
            termsOfService: "Terms of Service",
            contactUs: "Contact Us",
            debugZoom: "Zoom: ",
            debugMouse: "Mouse: X: , Y: ",
            universityProjectTitle: "Universidad Santa Maria",
            universityProjectDesc: "This project is developed for the Faculty of Engineering, Systems Engineering undergraduate program at Santa María University."
        },
        es: {
            features: "Características",
            howItWorks: "Cómo Funciona",
            getStarted: "Empezar",
            heroTitle: "Estacionamiento Sin Esfuerzo con Epark",
            heroDescription: "Revolucionando el estacionamiento urbano con pagos inalámbricos sin interrupciones y disponibilidad en tiempo real. ¡Dile adiós a las colas y hola a la comodidad!",
            preRegisterButton: "¡Pre-Regístrate Ahora!",
            caracasMapTitle: "Red de Estacionamiento en Caracas",
            mapInteractionHint: "Explora estacionamientos ficticios habilitados con Epark en Caracas. (Arrastra para rotar, rueda para hacer zoom)",
            whyParkPayTitle: "¿Por qué Epark?",
            advSpeedTitle: "Velocidad y Eficiencia:",
            advSpeedDesc: "¡Toca y listo! Se acabaron las búsquedas de efectivo o las esperas en las máquinas de pago.",
            advSecureTitle: "Pagos Seguros:",
            advSecureDesc: "Tus datos financieros están cifrados y protegidos con tecnología NFC de vanguardia.",
            advRealtimeTitle: "Disponibilidad en Tiempo Real:",
            advRealtimeDesc: "Verifica la disponibilidad de estacionamiento directamente desde tu teléfono antes de salir.",
            advRecordsTitle: "Registros Detallados:",
            advRecordsDesc: "Accede a tu historial de estacionamiento completo, recibos y administra tu cuenta sin esfuerzo.",
            advEcoTitle: "Respetuoso con el Medio Ambiente:",
            advEcoDesc: "Reduce el desperdicio de papel y contribuye a una ciudad más inteligente y ecológica.",
            howItWorksTitle: "¿Cómo Funciona Epark?",
            step1Title: "Crea Tu Cuenta",
            step1Desc: "Regístrate en nuestra aplicación móvil segura. Vincula tu método de pago preferido (tarjeta de crédito, billetera digital) en minutos. Es rápido, fácil y seguro.",
            step2Title: "Solicita Tu Etiqueta NFC",
            step2Desc: "Recibe tu elegante y duradera etiqueta NFC Epark por correo. Simplemente fíjalo al parabrisas o salpicadero de tu coche.",
            step3Title: "Entra a un Estacionamiento",
            step3Desc: "Cuando ingresas a un estacionamiento habilitado con Epark, nuestros sensores detectan tu etiqueta NFC. La barrera se levanta automáticamente.",
            step4Title: "Estaciona y Paga Automáticamente",
            step4Desc: "Estaciona tu coche. Al salir, tu etiqueta NFC se escanea de nuevo y la tarifa de estacionamiento se carga automáticamente a tu método de pago vinculado.",
            step5Title: "Ver Historial y Administrar",
            step5Desc: "Accede a tu historial de estacionamiento completo, recibos y administra la configuración de tu cuenta en cualquier momento a través de la aplicación Epark.",
            step6Title: "Mejoras Futuras",
            step6Desc: "¡Próximamente, funciones como reserva previa, lugares reservados y recompensas por lealtad!",
            footerCopy: "&copy; 2025 Epark. Todos los derechos reservados.",
            privacyPolicy: "Política de Privacidad",
            termsOfService: "Términos de Servicio",
            contactUs: "Contáctanos",
            debugZoom: "Zoom: ",
            debugMouse: "Ratón: X: , Y: ",
            universityProjectTitle: "Universidad Santa Maria",
            universityProjectDesc: "Este proyecto ha sido desarrollado para la Facultad de Ingeniería, carrera de pregrado de Ingeniería en Sistemas de la Universidad Santa María."
        }
    };

    // Function to apply translations
    function applyLanguage(lang) {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            // Special handling for debug info where we append values
            if (key === 'debugZoom') {
                const zoomValue = camera ? camera.position.distanceTo(new THREE.Vector3(0,0,0)).toFixed(2) : 'N/A';
                element.textContent = translations[lang][key] + zoomValue;
            } else if (key === 'debugMouse') {
                element.textContent = translations[lang][key] + `X: ${mouseX}, Y: ${mouseY}`;
            } else {
                if (translations[lang] && translations[lang][key]) {
                    element.innerHTML = translations[lang][key]; // Use innerHTML for cases with strong/span tags inside
                }
            }
        });
        // Update specific elements that need special handling (e.g., placeholder text or title)
        document.title = translations[lang] && translations[lang].heroTitle ? translations[lang].heroTitle.replace(/<.*?>/g, '') + " - Your Wireless Parking Solution" : "Epark - Your Wireless Parking Solution";
    }

    // Function to set the theme
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            darkModeToggle.checked = true;
        } else {
            htmlElement.classList.remove('dark');
            darkModeToggle.checked = false;
        }
        localStorage.setItem('theme', theme);
    }

    // Initialize Three.js scene
    function initThreeJS() {
        // Remove loading indicator
        loadingIndicator.style.display = 'none';

        scene = new THREE.Scene();
        // Scene background color will adapt to light/dark mode via CSS.
        // For Three.js objects, we'll use specific materials.

        // Camera
        camera = new THREE.PerspectiveCamera(75, threeJsContainer.clientWidth / threeJsContainer.clientHeight, 0.1, 1000);
        camera.position.set(0, 10, 20); // Slightly elevated view
        camera.lookAt(0, 0, 0);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering quality on high-DPI screens
        threeJsContainer.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 10, 7); // Position of the light source
        directionalLight.castShadow = true; // Enable shadow casting
        scene.add(directionalLight);

        // Caracas "Map" Plane
        const planeGeometry = new THREE.PlaneGeometry(30, 30); // Represents the city area
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x82b7c4 }); // Greenish-blue for "Caracas"
        meshPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        meshPlane.rotation.x = -Math.PI / 2; // Rotate to be flat
        meshPlane.receiveShadow = true; // Enable receiving shadows
        scene.add(meshPlane);

        // "City Border" (a slightly raised border around the plane)
        const borderGeometry = new THREE.BoxGeometry(32, 0.5, 32);
        const borderMaterial = new THREE.MeshLambertMaterial({ color: 0x6a9ba8 });
        meshBorder = new THREE.Mesh(borderGeometry, borderMaterial);
        meshBorder.position.y = -0.25; // Sit slightly below the plane
        scene.add(meshBorder);

        // Fictional Parking Lots (simple red boxes)
        const parkingLotGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
        const parkingLotMaterial = new THREE.MeshLambertMaterial({ color: 0xe53e3e }); // Red for parking lots

        const parkingLotPositions = [
            { x: 5, z: 5 },
            { x: -7, z: 3 },
            { x: 0, z: -8 },
            { x: 8, z: -2 },
            { x: -4, z: -6 },
            { x: 2, z: 9 }
        ];

        parkingLotPositions.forEach(pos => {
            const lot = new THREE.Mesh(parkingLotGeometry, parkingLotMaterial);
            lot.position.set(pos.x, 0.5, pos.z); // Slightly above the plane
            lot.castShadow = true; // Enable casting shadows
            scene.add(lot);
            parkingLots.push(lot);

            // Add a small cylinder beacon on top of each lot
            const beaconGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
            const beaconMaterial = new THREE.MeshBasicMaterial({ color: 0x4299e1 }); // Blue for beacon
            const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
            beacon.position.set(pos.x, 1.5, pos.z); // Above the lot
            scene.add(beacon);
            parkingLots.push(beacon); // Add beacon to array to be animated
        });

        // Add Axes Helper for debugging (X=red, Y=green, Z=blue)
        axesHelper = new THREE.AxesHelper(10); // Size of the axes
        scene.add(axesHelper);
        axesHelper.position.set(-14, 0.1, -14); // Position it at a corner of the map

        // Add event listeners for mouse interaction
        threeJsContainer.addEventListener('mousedown', onMouseDown, false);
        threeJsContainer.addEventListener('mouseup', onMouseUp, false);
        threeJsContainer.addEventListener('mousemove', onMouseMove, false);
        threeJsContainer.addEventListener('wheel', onMouseWheel, false); // For zooming
        threeJsContainer.addEventListener('mousemove', onThreeJsMouseMove, false); // For mouse coords debug

        // Handle window resizing
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        // Update camera aspect ratio and renderer size
        camera.aspect = threeJsContainer.clientWidth / threeJsContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
    }

    function onMouseDown(event) {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseUp() {
        isDragging = false;
    }

    function onMouseMove(event) {
        if (!isDragging) return;

        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Rotate around Y-axis for horizontal drag
        currentRotationY += deltaX * 0.005;
        // Rotate around X-axis for vertical drag, clamping to avoid flipping
        currentRotationX += deltaY * 0.005;
        currentRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, currentRotationX)); // Clamp rotation

        // Apply rotation to the entire scene (or a group containing all objects)
        // For simplicity, we'll rotate the camera around the origin.
        const radius = camera.position.distanceTo(new THREE.Vector3(0, 0, 0)); // Distance from camera to origin
        camera.position.x = radius * Math.sin(currentRotationY) * Math.cos(currentRotationX);
        camera.position.y = radius * Math.sin(currentRotationX);
        camera.position.z = radius * Math.cos(currentRotationY) * Math.cos(currentRotationX);
        camera.lookAt(0, 0, 0); // Always look at the center of the "map"

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseWheel(event) {
        event.preventDefault(); // Prevent page scrolling

        const zoomSpeed = 0.1;
        // Zoom in/out based on scroll direction
        camera.position.addScaledVector(camera.position.clone().normalize(), -event.deltaY * zoomSpeed * 0.01);

        // Clamp zoom to prevent going too far or too close
        const minZoom = 5;
        const maxZoom = 50;
        const currentDistance = camera.position.distanceTo(new THREE.Vector3(0,0,0));
        if (currentDistance < minZoom) {
            camera.position.setLength(minZoom);
        } else if (currentDistance > maxZoom) {
            camera.position.setLength(maxZoom);
        }
        camera.lookAt(0, 0, 0);
    }

    function onThreeJsMouseMove(event) {
        // Get mouse position relative to the threeJsContainer
        const rect = threeJsContainer.getBoundingClientRect();
        mouseX = Math.floor(event.clientX - rect.left);
        mouseY = Math.floor(event.clientY - rect.top);
    }


    function animate() {
        requestAnimationFrame(animate);

        // Animate parking lot beacons to pulse slightly
        const time = Date.now() * 0.001;
        parkingLots.forEach(lot => {
            // Only pulse the beacons (cylinders)
            if (lot.geometry.type === 'CylinderGeometry') {
                lot.scale.y = 1 + Math.sin(time * 5) * 0.1; // Pulsing scale
                lot.position.y = 1.5 + Math.sin(time * 5) * 0.1; // Slight bobbing
            }
        });

        // Update debug info
        if (camera) {
            const zoomValue = camera.position.distanceTo(new THREE.Vector3(0,0,0)).toFixed(2);
            debugZoomLevel.textContent = (translations[localStorage.getItem('language') || 'en']['debugZoom'] || "Zoom: ") + zoomValue;
        }
        debugMouseCoords.textContent = (translations[localStorage.getItem('language') || 'en']['debugMouse'] || "Mouse: X: , Y: ") + `X: ${mouseX}, Y: ${mouseY}`;


        renderer.render(scene, camera);
    }

    // Event Listeners for Language and Dark Mode
    languageSelect.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        applyLanguage(selectedLang);
        localStorage.setItem('language', selectedLang); // Save preference
    });

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });

    // Initialize language preference on page load (theme is handled by inline script in head)
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default to English
    languageSelect.value = savedLanguage; // Set dropdown
    applyLanguage(savedLanguage); // Apply initial language

    // Update the dark mode toggle state based on the initial theme
    if (htmlElement.classList.contains('dark')) {
        darkModeToggle.checked = true;
    } else {
        darkModeToggle.checked = false;
    }


    // Start the Three.js scene only after the window has fully loaded
    window.onload = function() {
        initThreeJS();
        animate();
    };
});
