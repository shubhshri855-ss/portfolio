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
    // 🌌 UNIVERSE STARFIELD (Custom Shader)
    // ==========================================
    const starCount = 12000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    // Beautiful space color palette
    const colorPalette = [
      new THREE.Color("#4f46e5"), // Indigo
      new THREE.Color("#ec4899"), // Pink
      new THREE.Color("#0ea5e9"), // Sky Blue
      new THREE.Color("#ffffff"), // Bright White
      new THREE.Color("#8b5cf6"), // Violet
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;

      // Random spherical distribution
      const radius = 30 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random Colors from palette
      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = randomColor.r;
      colors[i3 + 1] = randomColor.g;
      colors[i3 + 2] = randomColor.b;

      // Random Sizes
      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    // Custom GLSL Shader Material for glowing stars
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (50.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Create a glowing circle instead of a square
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          if(strength < 0.0) discard;
          gl_FragColor = vec4(vColor, strength);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const universe = new THREE.Points(geometry, material);
    mouseGroup.add(universe);

    // ==========================================
    // 🌍 FOREGROUND PLANET (Right Side)
    // ==========================================
    const planetWrapper = new THREE.Group();
    // Position it further right on mobile so it doesn't peek out
    const initialPlanetX = window.innerWidth <= 900 ? 5 : 2.5;
    planetWrapper.position.set(initialPlanetX, 0, 0);
    scene.add(planetWrapper);

    const planetGroup = new THREE.Group();
    planetWrapper.add(planetGroup);

    // Inner Core (Dark)
    const coreGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x050816 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    planetGroup.add(coreMesh);

    // Outer Glowing Wireframe
    const wireGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    planetGroup.add(wireMesh);

    // Floating Particles around the planet
    const pGeo = new THREE.IcosahedronGeometry(1.7, 4);
    const pMat = new THREE.PointsMaterial({
      color: 0x8b5cf6, // Purple
      size: 0.03,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    planetGroup.add(pMesh);

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

      pMesh.rotation.y += 0.001;
      pMesh.rotation.z += 0.0005;

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
          end: "+=5000", // Increased distance for much slower, smoother scrolling
          scrub: 1,
          pin: true
        }
      });

      // 1. Fade out side details and push them left
      tl.to(".hero-content", { opacity: 0, x: -100, duration: 2, ease: "none" }, 0);

      // 2. Move planetWrapper to center of the screen
      tl.to(planetWrapper.position, { x: 0, duration: 4, ease: "power1.inOut" }, 0);

      // 3. Scale up planet hugely (entering the sphere)
      // Using power3.in makes it grow VERY slowly at first, and rapidly at the very end (perfect 3D zoom effect)
      tl.to(planetWrapper.scale, { x: 50, y: 50, z: 50, duration: 10, ease: "power3.in" }, 2);

      // 4. Fade out core to reveal the inside
      tl.to(coreMat, { opacity: 0, transparent: true, duration: 4, ease: "none" }, 7);
      tl.to(wireMat, { opacity: 0, duration: 4, ease: "none" }, 7);
      tl.to(".home-bg", { opacity: 0, duration: 4, ease: "none" }, 7); // Fade background to reveal About
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
      wireGeo.dispose();
      wireMat.dispose();
      pGeo.dispose();
      pMat.dispose();
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
      </section>
    </div>
  );
}