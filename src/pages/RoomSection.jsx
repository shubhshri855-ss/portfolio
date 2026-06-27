// RoomSection.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function RoomSection() {
  const canvasRef = useRef();

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();

    // Camera (Isometric starting angle)
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(12, 10, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ==========================================
    // 🏠 LOW-POLY ROOM CREATION
    // ==========================================
    const roomWrapper = new THREE.Group();
    scene.add(roomWrapper);
    
    const roomGroup = new THREE.Group();
    roomWrapper.add(roomGroup);

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x8da3b5, roughness: 0.8 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2d45, roughness: 0.9 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.7 });
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2, transparent: true });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, transparent: true });
    
    // 🎨 Canvas Texture for Laptop Screen
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 731;
    const ctx2d = canvas.getContext('2d');
    
    // Background
    ctx2d.fillStyle = '#050816';
    ctx2d.fillRect(0, 0, 1024, 731);
    
    // Neon Cyan Border
    ctx2d.strokeStyle = '#00f0ff';
    ctx2d.lineWidth = 20;
    ctx2d.strokeRect(10, 10, 1004, 711);
    
    // Heading
    ctx2d.fillStyle = '#ffffff';
    ctx2d.font = 'bold 80px sans-serif';
    ctx2d.textAlign = 'center';
    ctx2d.fillText('CONNECT WITH ME', 512, 200);
    
    // GitHub Button (Pink)
    ctx2d.fillStyle = '#ec4899';
    ctx2d.beginPath();
    ctx2d.roundRect(162, 350, 300, 150, 20);
    ctx2d.fill();
    ctx2d.fillStyle = '#ffffff';
    ctx2d.font = 'bold 60px sans-serif';
    ctx2d.fillText('GITHUB', 312, 450);

    // LinkedIn Button (Blue)
    ctx2d.fillStyle = '#0ea5e9';
    ctx2d.beginPath();
    ctx2d.roundRect(562, 350, 300, 150, 20);
    ctx2d.fill();
    ctx2d.fillStyle = '#ffffff';
    ctx2d.fillText('LINKEDIN', 712, 450);

    const screenTexture = new THREE.CanvasTexture(canvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture, transparent: true }); 
    const tvScreenMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true });

    const interactables = [];

    // 1. Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 10), floorMat);
    floor.position.set(0, -0.25, 0);
    roomGroup.add(floor);

    // 2. Walls (Left and Back)
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 10), wallMat);
    wallLeft.position.set(-5.25, 3, 0);
    roomGroup.add(wallLeft);

    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 0.5), wallMat);
    wallBack.position.set(0, 3, -5.25);
    roomGroup.add(wallBack);

    // 3. Bed
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-2.5, 0, -2);
    roomGroup.add(bedGroup);
    
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 5), bedMat);
    bedFrame.position.set(0, 0.4, 0);
    bedGroup.add(bedFrame);
    
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.4, 4.8), mattressMat);
    mattress.position.set(0, 1.0, 0);
    bedGroup.add(mattress);
    
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 1), pillowMat);
    pillow.position.set(0, 1.3, -1.5);
    bedGroup.add(pillow);
    
    bedGroup.userData = { name: "Bed", originalScale: 1 };
    interactables.push(bedGroup);

    // 4. Almirah (Wardrobe)
    const wardrobeGroup = new THREE.Group();
    wardrobeGroup.position.set(-4, 0, 3);
    roomGroup.add(wardrobeGroup);
    
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2), woodMat);
    wardrobe.position.set(0, 2.5, 0);
    wardrobeGroup.add(wardrobe);
    
    // Wardrobe line
    const wLine = new THREE.Mesh(new THREE.BoxGeometry(0.05, 4.8, 2.05), blackMat);
    wLine.position.set(0, 2.5, 0);
    wardrobeGroup.add(wLine);

    wardrobeGroup.userData = { name: "Almirah", originalScale: 1 };
    interactables.push(wardrobeGroup);

    // 5. TV on the wall
    const tvGroup = new THREE.Group();
    tvGroup.position.set(-5, 3.5, 0);
    roomGroup.add(tvGroup);
    
    const tvBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 3.5), blackMat);
    tvGroup.add(tvBase);
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.8, 3.3), tvScreenMat);
    tvGroup.add(tvScreen);

    tvGroup.userData = { name: "TV", originalScale: 1 };
    interactables.push(tvGroup);

    // 6. Fridge
    const fridgeGroup = new THREE.Group();
    fridgeGroup.position.set(3, 0, -4);
    roomGroup.add(fridgeGroup);
    
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(2, 4.5, 2), metalMat);
    fridge.position.set(0, 2.25, 0);
    fridgeGroup.add(fridge);
    // Fridge Handle
    const fHandle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.1), blackMat);
    fHandle.position.set(-0.8, 2.5, 1.05);
    fridgeGroup.add(fHandle);

    fridgeGroup.userData = { name: "Fridge", originalScale: 1 };
    interactables.push(fridgeGroup);

    // 7. Table & Laptop
    const deskGroup = new THREE.Group();
    deskGroup.position.set(3, 0, 2);
    roomGroup.add(deskGroup);
    
    // Table Top
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 2), woodMat);
    tableTop.position.set(0, 1.5, 0);
    deskGroup.add(tableTop);
    
    // Legs
    for(let i=0; i<4; i++) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.2), woodMat);
      leg.position.set(i%2===0 ? -1.3 : 1.3, 0.75, i<2 ? -0.8 : 0.8);
      deskGroup.add(leg);
    }
    
    // Laptop
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 1.6, 0);
    laptopGroup.rotation.y = -Math.PI / 4; // Angled slightly towards camera
    deskGroup.add(laptopGroup);
    
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.6), metalMat);
    laptopGroup.add(laptopBase);
    
    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.05), blackMat);
    laptopScreen.position.set(0, 0.3, -0.3);
    laptopGroup.add(laptopScreen);
    
    // The screen display that shows "CONTACT" placeholder
    const laptopDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.06), screenMat);
    laptopDisplay.position.set(0, 0.3, -0.28);
    laptopGroup.add(laptopDisplay);
    
    // Target for Camera to zoom into
    const cameraFront = new THREE.Object3D();
    cameraFront.position.set(0, 0.3, 2.5); // Position nicely in front of laptop
    laptopGroup.add(cameraFront);

    deskGroup.userData = { name: "Table", originalScale: 1 };
    interactables.push(deskGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Click Interaction Logic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactables, true);

      if (intersects.length > 0) {
        // Find the root group of the clicked object
        let object = intersects[0].object;
        while (object.parent && !interactables.includes(object)) {
          object = object.parent;
        }
        
        if (interactables.includes(object)) {
          // Bounce animation
          gsap.to(object.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
          });
        }
      }
    };

    window.addEventListener("click", onMouseClick);

    // Animation Loop
    let animationFrameId;
    const lookProxy = new THREE.Vector3(0, 0, 0); // Initially look at center of room
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      camera.lookAt(lookProxy);
      renderer.render(scene, camera);
    };
    animate();

    // GSAP Scroll Animation
    let ctx = gsap.context(() => {
      // Intro Hint
      gsap.fromTo(".room-hint",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 0.5,
          scrollTrigger: { trigger: ".room-section", start: "top 50%" }
        }
      );

      // ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".room-section",
          start: "top top",
          end: "+=4500", // Adjusted for a completely seamless flow without pauses
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const roomEl = document.getElementById("room-section");
            const contactEl = document.getElementById("contact");
            if (roomEl && contactEl) {
              if (self.progress > 0.95) { // Only reveal Contact page at the absolute end
                roomEl.style.pointerEvents = "none";
                contactEl.style.zIndex = "20"; 
              } else {
                roomEl.style.pointerEvents = "auto";
                contactEl.style.zIndex = "5"; 
              }
            }
          }
        }
      });

      // Phase 1: Rotate room & bring camera in front of laptop (0s to 4s)
      tl.to(".room-hint", { opacity: 0, duration: 0.5 }, 0);
      
      const finalLookAt = new THREE.Vector3();
      laptopDisplay.getWorldPosition(finalLookAt);
      
      const frontPos = new THREE.Vector3();
      cameraFront.getWorldPosition(frontPos);

      // Rotate room 360 degrees
      tl.to(roomGroup.rotation, { y: Math.PI * 2, duration: 4, ease: "power1.inOut" }, 0);
      
      // Move camera to front of laptop
      tl.to(camera.position, {
        x: frontPos.x,
        y: frontPos.y,
        z: frontPos.z,
        duration: 4,
        ease: "power2.inOut"
      }, 0);
      
      // Shift camera focus smoothly to the laptop screen
      tl.to(lookProxy, {
        x: finalLookAt.x,
        y: finalLookAt.y,
        z: finalLookAt.z,
        duration: 4,
        ease: "power2.inOut"
      }, 0);

      // Phase 2: Massive Zoom directly into the laptop screen (Seamlessly from 4s to 8s)
      tl.to(camera.position, {
        x: finalLookAt.x,
        y: finalLookAt.y,
        z: finalLookAt.z + 0.1, // Zoom until practically touching the screen
        duration: 4,
        ease: "power3.in"
      }, 4);

      // Phase 3: Fade to Contact Page only at the very end of the full zoom (7s to 8s)
      tl.to(".room-bg", { opacity: 0, duration: 1 }, 7);
      tl.to([floorMat, wallMat, woodMat, bedMat, mattressMat, pillowMat, metalMat, blackMat, screenMat, tvScreenMat], {
        opacity: 0, transparent: true, duration: 1
      }, 7);
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("click", onMouseClick);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      
      // Dispose materials to prevent memory leaks
      floorMat.dispose(); wallMat.dispose(); woodMat.dispose();
      bedMat.dispose(); mattressMat.dispose(); pillowMat.dispose();
      metalMat.dispose(); blackMat.dispose(); screenMat.dispose();
      tvScreenMat.dispose(); screenTexture.dispose();
    };
  }, []);

  return (
    <div id="room-section" className="room-section" style={{ position: 'relative', zIndex: 10, width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div className="room-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050816', zIndex: -1 }}></div>
      
      {/* Interaction Hint */}
      <div className="room-hint" style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '1rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: 0,
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '50px',
        backdropFilter: 'blur(5px)'
      }}>
        👆 Click on the furniture! Scroll down to zoom into the Laptop.
      </div>

      <canvas ref={canvasRef} className="webgl" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></canvas>
    </div>
  );
}
