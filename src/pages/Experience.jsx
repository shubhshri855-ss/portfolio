import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Experience() {
  const canvasRef = useRef();

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouseGroup = new THREE.Group();
    scene.add(mouseGroup);

    // ==========================================
    // 🌌 UNIVERSE STARFIELD
    // ==========================================
    const starCount = 12000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorPalette = [
      new THREE.Color("#4f46e5"), new THREE.Color("#ec4899"), new THREE.Color("#0ea5e9"),
      new THREE.Color("#ffffff"), new THREE.Color("#8b5cf6"),
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 30 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = randomColor.r; colors[i3 + 1] = randomColor.g; colors[i3 + 2] = randomColor.b;
      sizes[i] = Math.random() * 2.5 + 0.5;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize; varying vec3 vColor;
        void main() { vColor = color; vec4 mvPos = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * (50.0 / -mvPos.z); gl_Position = projectionMatrix * mvPos; }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() { float dist = distance(gl_PointCoord, vec2(0.5)); float strength = 0.05 / dist - 0.1; if(strength < 0.0) discard; gl_FragColor = vec4(vColor, strength); }
      `,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true,
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
      color: 0xec4899, // Pinkish to distinguish from home
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    planetGroup.add(wireMesh);

    // Floating Particles around the planet
    const pGeo = new THREE.IcosahedronGeometry(1.7, 4);
    const pMat = new THREE.PointsMaterial({
      color: 0x0ea5e9, // Sky Blue
      size: 0.03,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    planetGroup.add(pMesh);

    // Mouse Tracking & Drag Interaction
    let mouseX = 0, mouseY = 0;
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
      
      universe.rotation.y += 0.0005; 
      universe.rotation.x += 0.0002;

      // Planet rotation
      coreMesh.rotation.y += 0.002;
      coreMesh.rotation.x += 0.001;
      wireMesh.rotation.y -= 0.0015;
      wireMesh.rotation.x += 0.001;
      pMesh.rotation.y += 0.001;
      pMesh.rotation.z += 0.0005;

      // Drag Rotation with Damping
      // Drag Rotation with Damping (Only happens on click & drag)
      planetGroup.rotation.x += (planetTargetRotationX - planetGroup.rotation.x) * 0.1;
      planetGroup.rotation.y += (planetTargetRotationY - planetGroup.rotation.y) * 0.1;
      
      mouseGroup.position.x += (mouseX * 2 - mouseGroup.position.x) * 0.02;
      mouseGroup.position.y += (mouseY * 2 - mouseGroup.position.y) * 0.02;
      mouseGroup.rotation.x += (-mouseY * 0.1 - mouseGroup.rotation.x) * 0.02;
      mouseGroup.rotation.y += (mouseX * 0.1 - mouseGroup.rotation.y) * 0.02;
      
      renderer.render(scene, camera);
    };
    animate();

    // GSAP Intro & Scroll Animation
    let ctx = gsap.context(() => {
      // Intro Animation (Happens when scrolled into view)
      gsap.fromTo(".experience-content", 
        { opacity: 0, scale: 0.5 }, 
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.5, 
          ease: "power4.out",
          scrollTrigger: { trigger: "#experience", start: "top 70%" }
        }
      );

      // ScrollTrigger Timeline (For zooming into Contact)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#experience",
          start: "top top",
          end: "+=5000",
          scrub: 1,
          pin: true
        }
      });

      // Add a small pause at the beginning so the user can read the Experience text
      // 1. Fade out side details and push them left (Starts at 2 instead of 0)
      tl.to(".experience-content", { opacity: 0, x: -100, duration: 2, ease: "none" }, 2);

      // 2. Move planetWrapper to center of the screen (Starts at 2)
      tl.to(planetWrapper.position, { x: 0, duration: 4, ease: "power1.inOut" }, 2);

      // 3. Scale up planet hugely (entering the sphere)
      tl.to(planetWrapper.scale, { x: 50, y: 50, z: 50, duration: 10, ease: "power3.in" }, 4);

      // 4. Fade out core to reveal the inside (Contact section)
      tl.to(coreMat, { opacity: 0, transparent: true, duration: 4, ease: "none" }, 10);
      tl.to(wireMat, { opacity: 0, duration: 4, ease: "none" }, 10);
      tl.to(".exp-bg", { opacity: 0, duration: 4, ease: "none" }, 10); // Fade background to reveal Contact
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
    <div id="experience" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 8%', overflow: 'hidden', zIndex: 10 }}>
      {/* Solid Background to hide next section until zoomed in */}
      <div className="exp-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050816', zIndex: -1 }}></div>

      <div className="experience-content" style={{ zIndex: 10, width: '50%', background: 'rgba(5, 8, 22, 0.4)', padding: '50px', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '10px', textShadow: '0 0 20px rgba(255,255,255,0.3)', lineHeight: '1.1' }}>Projects & Experience</h1>
        <p style={{ color: '#ec4899', fontSize: '1.2rem', marginBottom: '30px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>ZUP Examination Platform</p>
        
        <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>
          Developed a full-stack online examination platform with real-time communication, secure user workflows, and a responsive user interface. Built using React.js, Node.js, Express.js, and Socket.io, the project demonstrates expertise in scalable web application development, frontend-backend integration, and modern UI/UX design.
        </p>

        <div style={{ marginBottom: '25px' }}>
          <strong style={{ color: '#00f0ff', fontSize: '1.1rem', display: 'block', marginBottom: '10px' }}>Tech Stack:</strong>
          <p style={{ color: '#8b5cf6', fontSize: '1rem', lineHeight: '1.6', fontWeight: 'bold' }}>
            React.js, Node.js, Express.js, Socket.io, JavaScript, HTML, CSS, Vercel, GitHub
          </p>
        </div>

        <div className="exp-links" style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          <a href="https://zup-examination.vercel.app" target="_blank" rel="noreferrer" style={{ padding: '10px 25px', background: '#8b5cf6', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 'bold', border: '1px solid #8b5cf6', transition: '0.3s', boxShadow: '0 5px 15px rgba(139, 92, 246, 0.4)' }}>
            🔗 Live Demo
          </a>
          <a href="https://github.com/shubhshri855-ss/zup_examination" target="_blank" rel="noreferrer" style={{ padding: '10px 25px', background: 'transparent', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 'bold', border: '1px solid #00f0ff', transition: '0.3s', boxShadow: '0 5px 15px rgba(0, 240, 255, 0.2)' }}>
            🔗 GitHub
          </a>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}></canvas>
    </div>
  );
}