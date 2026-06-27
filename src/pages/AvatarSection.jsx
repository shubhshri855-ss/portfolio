// AvatarSection.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function AvatarSection() {
  const canvasRef = useRef();

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

    // ==========================================
    // 🧑 3D AVATAR (Stylized Head)
    // ==========================================
    const avatarWrapper = new THREE.Group();
    scene.add(avatarWrapper);
    
    const avatarGroup = new THREE.Group();
    avatarWrapper.add(avatarGroup);
    
    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdcb1, roughness: 0.4 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });

    // Head Base (Sphere)
    const headGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    avatarGroup.add(headMesh);

    // Hair (Stylized Box)
    const hairGeo = new THREE.BoxGeometry(3.2, 0.8, 3.2);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.y = 1.3;
    avatarGroup.add(hairMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.3, 16, 16);
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.6, 0.2, 1.35);
    avatarGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.6, 0.2, 1.35);
    avatarGroup.add(rightEye);

    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.12, 16, 16);
    
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.6, 0.2, 1.6);
    avatarGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.6, 0.2, 1.6);
    avatarGroup.add(rightPupil);
    
    // Nose
    const noseGeo = new THREE.ConeGeometry(0.2, 0.5, 16);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xeebb99 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, -0.2, 1.5);
    nose.rotation.x = Math.PI / 2;
    avatarGroup.add(nose);
    
    // Mouth (Small curve or box)
    const mouthGeo = new THREE.BoxGeometry(0.6, 0.05, 0.1);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x552222 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, -0.6, 1.45);
    avatarGroup.add(mouth);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.5, 32);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = -1.8;
    avatarWrapper.add(neck); 

    // Shoulders
    const shoulderGeo = new THREE.CapsuleGeometry(1.5, 2, 4, 16);
    const shoulders = new THREE.Mesh(shoulderGeo, shirtMat);
    shoulders.position.y = -3.5;
    shoulders.rotation.z = Math.PI / 2;
    avatarWrapper.add(shoulders);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x8b5cf6, 2); 
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Initial position
    avatarWrapper.position.set(0, -0.5, 0);

    // Mouse Tracking for Head
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth Head Tracking
      const targetRotationY = mouseX * 0.8;
      const targetRotationX = -mouseY * 0.5;
      
      avatarGroup.rotation.y += (targetRotationY - avatarGroup.rotation.y) * 0.1;
      avatarGroup.rotation.x += (targetRotationX - avatarGroup.rotation.x) * 0.1;

      // Slight breathing effect on the whole wrapper
      avatarWrapper.position.y = (Math.sin(Date.now() * 0.002) * 0.05) - 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // GSAP Scroll Animation
    let ctx = gsap.context(() => {

      // Hint Animation (Fade in when section enters)
      gsap.fromTo(".avatar-hint",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 0.5,
          scrollTrigger: {
            trigger: ".avatar-section",
            start: "top 50%", 
          }
        }
      );

      // Pulse animation for the SVG icon
      gsap.to(".avatar-hint svg", {
        x: -5,
        yoyo: true,
        repeat: -1,
        duration: 0.8,
        ease: "power1.inOut"
      });

      // ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".avatar-section",
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const homeEl = document.getElementById("avatar-section");
            const contactEl = document.getElementById("contact");
            if (homeEl && contactEl) {
              if (self.progress > 0.85) {
                homeEl.style.pointerEvents = "none";
                contactEl.style.zIndex = "20"; 
              } else {
                homeEl.style.pointerEvents = "auto";
                contactEl.style.zIndex = "5"; 
              }
            }
          }
        }
      });

      // 1. Avatar zooms/scales up (Scroll transition to next page)
      tl.to(".avatar-hint", { opacity: 0, duration: 1, ease: "power1.inOut" }, 0);
      tl.to(avatarWrapper.scale, { x: 50, y: 50, z: 50, duration: 6, ease: "power3.in" }, 0);
      tl.to(avatarWrapper.position, { y: -25, duration: 6, ease: "power3.in" }, 0);
      
      // 2. Fade everything out to reveal the next page
      tl.to(".avatar-bg", { opacity: 0, duration: 2, ease: "none" }, 4);
      tl.to(skinMat, { opacity: 0, transparent: true, duration: 2, ease: "none" }, 4);
      tl.to(hairMat, { opacity: 0, transparent: true, duration: 2, ease: "none" }, 4);
      tl.to(shirtMat, { opacity: 0, transparent: true, duration: 2, ease: "none" }, 4);
    });

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      
      // Dispose materials/geometries to prevent memory leaks
      headGeo.dispose(); skinMat.dispose();
      hairGeo.dispose(); hairMat.dispose();
      eyeGeo.dispose(); eyeMat.dispose();
      pupilGeo.dispose(); pupilMat.dispose();
      noseGeo.dispose(); noseMat.dispose();
      mouthGeo.dispose(); mouthMat.dispose();
      neckGeo.dispose(); shoulderGeo.dispose(); shirtMat.dispose();
    };
  }, []);

  return (
    <div id="avatar-section" className="avatar-section" style={{ position: 'relative', zIndex: 10, width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div className="avatar-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050816', zIndex: -1 }}></div>
      
      {/* Interaction Hint */}
      <div className="avatar-hint" style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 15,
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.9rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: 0, // GSAP will fade it in
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 9l4 4-4 4"/>
          <path d="M19 9l-4 4 4 4"/>
          <circle cx="12" cy="13" r="2"/>
        </svg>
        Move or tap anywhere to interact
      </div>

      {/* Three Canvas ONLY - No extra text */}
      <canvas ref={canvasRef} className="webgl" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}></canvas>
    </div>
  );
}