// Home.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const canvasRef = useRef();

  const handleVisitExperience = () => {
    // Smoothly scroll to the Experience section
    gsap.to(window, {
      scrollTo: "#experience",
      duration: 4,
      ease: "power2.inOut"
    });
  };

  const handleContactClick = () => {
    gsap.to(window, {
      scrollTo: "#contact",
      duration: 4,
      ease: "power2.inOut"
    });
  };

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Mouse Group for Parallax
    const mouseGroup = new THREE.Group();
    scene.add(mouseGroup);

    // ==========================================
    // 🛠️ RAW DATA PARTICLES (Manual / Developer Look)
    // ==========================================
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      // Raw Matrix-like Cyan/Green/Purple colors
      colors[i3] = Math.random() * 0.2; // R
      colors[i3 + 1] = Math.random() * 0.8 + 0.2; // G
      colors[i3 + 2] = Math.random() * 0.8 + 0.2; // B
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    const universe = new THREE.Points(geometry, material);
    mouseGroup.add(universe);

    // ==========================================
    // 🏗️ ABSTRACT WIREFRAME STRUCTURE (Manual Vibe)
    // ==========================================
    const planetWrapper = new THREE.Group();
    const isMobile = window.innerWidth <= 900;
    const initialPlanetX = isMobile ? 10 : 2.5; // Hidden on mobile, right side of box on desktop
    const initialPlanetY = 0; 
    planetWrapper.position.set(initialPlanetX, initialPlanetY, 0);
    scene.add(planetWrapper);

    const planetGroup = new THREE.Group();
    planetWrapper.add(planetGroup);

    // Inner Core Box
    const coreGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x050816, wireframe: false });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    
    // Core Wireframe edges to make it look distinct
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 });
    const coreLines = new THREE.LineSegments(coreEdges, lineMat);
    coreMesh.add(coreLines);
    planetGroup.add(coreMesh);

    // Outer wireframe Octahedron
    const wireGeo = new THREE.OctahedronGeometry(2, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    planetGroup.add(wireMesh);

    // Outer rotating rings (Torus) instead of particles
    const pGeo = new THREE.TorusGeometry(2.6, 0.01, 16, 100);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.5 });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.rotation.x = Math.PI / 2;
    planetGroup.add(pMesh);

    // Add a GridHelper to the mouseGroup for that "Blueprint" feel
    const gridHelper = new THREE.GridHelper(40, 40, 0x00f0ff, 0x002244);
    gridHelper.position.y = -3;
    mouseGroup.add(gridHelper);

    // Mouse Tracking & Drag Interaction
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    let planetTargetRotationX = 0;
    let planetTargetRotationY = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // Check if user clicked on the planet's core
      const intersects = raycaster.intersectObject(coreMesh);

      if (intersects.length > 0) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        planetTargetRotationY += deltaMove.x * 0.01;
        planetTargetRotationX += deltaMove.y * 0.01;

        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate entire universe slowly
      universe.rotation.y += 0.0005;
      universe.rotation.x += 0.0002;

      // 1. Automatic continuous slow rotation
      coreMesh.rotation.y += 0.002;
      coreMesh.rotation.x += 0.001;

      wireMesh.rotation.y -= 0.0015; // Counter rotation
      wireMesh.rotation.x += 0.001;

      pMesh.rotation.x += 0.002;
      pMesh.rotation.y -= 0.001;

      // 2. Drag Rotation with Damping
      planetGroup.rotation.x += (planetTargetRotationX - planetGroup.rotation.x) * 0.1;
      planetGroup.rotation.y += (planetTargetRotationY - planetGroup.rotation.y) * 0.1;

      // 3. Mouse Parallax (Position Shift)
      // Planet Group moves relative to its Wrapper (which is at x=2.5)
      const targetPlanetX = mouseX * 0.5;
      const targetPlanetY = mouseY * 0.5;
      planetGroup.position.x += (targetPlanetX - planetGroup.position.x) * 0.05;
      planetGroup.position.y += (targetPlanetY - planetGroup.position.y) * 0.05;

      // Mouse Parallax Effect for Universe
      mouseGroup.position.x += (mouseX * 2 - mouseGroup.position.x) * 0.02;
      mouseGroup.position.y += (mouseY * 2 - mouseGroup.position.y) * 0.02;

      mouseGroup.rotation.x += (-mouseY * 0.1 - mouseGroup.rotation.x) * 0.02;
      mouseGroup.rotation.y += (mouseX * 0.1 - mouseGroup.rotation.y) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // GSAP Intro & Scroll Animation
    let ctx = gsap.context(() => {
      // Intro Animations
      gsap.fromTo(".hero-content h1",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
      );

      gsap.fromTo(".hero-buttons button",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, delay: 0.3, duration: 1 }
      );

      // ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".home",
          start: "top top",
          end: "+=3500", // Reduced distance for faster, more engaging scrolling
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const homeEl = document.getElementById("home");
            const aboutEl = document.getElementById("about");
            if (homeEl && aboutEl) {
              if (self.progress > 0.85) {
                homeEl.style.pointerEvents = "none";
                aboutEl.style.zIndex = "20"; // Bring About to the very front so nothing can block it
              } else {
                homeEl.style.pointerEvents = "auto";
                aboutEl.style.zIndex = "5"; // Put it back behind Home
              }
            }
          }
        }
      });

      // 1. Box goes OUT
      tl.to(".hero-content", { 
        opacity: 0, 
        x: isMobile ? 0 : -150, 
        y: isMobile ? -300 : 0, 
        duration: 2, 
        ease: "power2.inOut" 
      }, 0);

      // 2. Model comes IN from the side to the center
      tl.to(planetWrapper.position, { 
        x: 0, 
        y: 0, 
        duration: 4, 
        ease: "power1.inOut" 
      }, 2);

      // NEW: Dynamic Scroll Animations
      tl.to(planetGroup.rotation, { y: Math.PI * 4, x: Math.PI * 2, duration: 15, ease: "power2.inOut" }, 0);
      tl.to(universe.position, { z: 5, duration: 15, ease: "power1.in" }, 0);
      tl.to(material, { size: 0.15, duration: 15, yoyo: true, ease: "none" }, 0);

      // PROFESSIONAL COLOR MORPHING (Scroll-based)
      tl.to(lineMat.color, { r: 1, g: 0, b: 0.5, duration: 15, ease: "none" }, 0);
      tl.to(wireMat.color, { r: 1, g: 0.3, b: 0, duration: 15, ease: "none" }, 0);
      tl.to(pMat.color, { r: 1, g: 0.9, b: 0.1, duration: 15, ease: "none" }, 0);
      
      tl.to(".hero-content span", { color: "#ff007f", borderColor: "rgba(255,0,127,0.4)", backgroundColor: "rgba(255,0,127,0.1)", textShadow: "0 0 10px rgba(255,0,127,0.6)", duration: 2 }, 0);
      tl.to(".primary-btn", { background: "#ff007f", boxShadow: "0 0 20px rgba(255,0,127,0.5)", duration: 2 }, 0);
      tl.to(".secondary-btn", { borderColor: "#ff7b00", color: "#ff7b00", boxShadow: "0 0 15px rgba(255,123,0,0.2)", duration: 2 }, 0);

      // 3. Model zooms/scales up (After it reaches center)
      tl.to(planetWrapper.scale, { x: 50, y: 50, z: 50, duration: 6, ease: "power3.in" }, 6);
      
      // 4. Motivational Quote fades in ONLY AFTER the model has zoomed up
      tl.to(".home-quote", { opacity: 1, y: -20, duration: 2, ease: "power1.out" }, 11);
      tl.to(".home-quote h2", { textShadow: "0 0 40px rgba(255,123,0,0.9)", duration: 2, ease: "none" }, 11);
      tl.to(".home-quote p", { color: "#ff7b00", duration: 2, ease: "none" }, 11);

      // 5. Fade everything out to reveal the next page
      tl.to(".home-quote", { opacity: 0, y: -40, duration: 2, ease: "power1.in" }, 14);
      tl.to(coreMat, { opacity: 0, transparent: true, duration: 2, ease: "none" }, 14);
      tl.to(lineMat, { opacity: 0, transparent: true, duration: 2, ease: "none" }, 14);
      tl.to(wireMat, { opacity: 0, duration: 2, ease: "none" }, 14);
      tl.to(pMat, { opacity: 0, duration: 2, ease: "none" }, 14);
      tl.to(".home-bg", { opacity: 0, duration: 2, ease: "none" }, 14);
    });

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert(); // Prevent React Strict Mode bugs
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      coreEdges.dispose();
      lineMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
    };
  }, []);

  return (
    <div id="home" className="home" style={{ position: 'relative', zIndex: 10 }}>
      {/* Solid Background to hide next section until zoomed in */}
      <div className="home-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050816', zIndex: -1 }}></div>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span>Creative Developer</span>

          <h1>
            Welcome <br />
            To My <br />Portfolio
          </h1>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleVisitExperience}>
              Visit Experience
            </button>

            <button className="secondary-btn" onClick={handleContactClick}>
              Contact Me
            </button>
          </div>
        </div>

        {/* Three Canvas */}
        <canvas ref={canvasRef} className="webgl"></canvas>

        {/* Scroll Quote (Initially hidden, shown during scroll) */}
        <div className="home-quote" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          opacity: 0,
          pointerEvents: 'none',
          textAlign: 'center',
          width: '90%'
        }}>
          <h2 style={{
            fontSize: '3rem',
            color: '#fff',
            textShadow: '0 0 20px rgba(0, 240, 255, 0.8)',
            fontStyle: 'italic',
            fontWeight: '600'
          }}>
            "Talk is cheap. Show me the code."
          </h2>
          <p style={{ color: '#00f0ff', marginTop: '10px', fontSize: '1.2rem', letterSpacing: '2px' }}>- Linus Torvalds</p>
        </div>
      </section>
    </div>
  );
}