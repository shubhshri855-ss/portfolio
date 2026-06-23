import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Fade in the whole section
      gsap.fromTo(
        ".about-content",
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 75%",
          },
        }
      );

      // Stagger paragraph animations
      gsap.fromTo(
        ".about-text p",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 65%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="about"
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        marginTop: '-100vh', // Pull up behind previous section
        zIndex: 5,           // Ensure it stays behind
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050816',
        padding: '100px 8%',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-content"
        style={{
          zIndex: 10,
          background: 'rgba(5, 8, 22, 0.6)',
          padding: '60px',
          borderRadius: '24px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          maxWidth: '1000px',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '4rem',
              color: '#fff',
              textShadow: '0 0 20px rgba(255,255,255,0.3)',
              marginBottom: '10px',
            }}
          >
            About Me
          </h2>
          <span
            style={{
              display: 'inline-block',
              color: '#00f0ff',
              fontSize: '1.2rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: '700',
              textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
              background: 'rgba(0, 240, 255, 0.1)',
              padding: '10px 20px',
              borderRadius: '50px',
              border: '1px solid rgba(0, 240, 255, 0.3)',
            }}
          >
            Creative Developer
          </span>
        </div>

        <div className="about-text" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#ccc', fontSize: '1.2rem', lineHeight: '1.8' }}>
            Hi, I'm <strong>Shubh Shrivastava</strong>, an Artificial Intelligence and Machine Learning (AIML) student at Bansal Institute of Science and Technology, Bhopal, affiliated with Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV). Currently in my 4th semester (2nd year), I am passionate about building innovative, responsive web applications and AI-powered solutions that solve real-world problems.
          </p>
          
          <p style={{ color: '#ccc', fontSize: '1.2rem', lineHeight: '1.8' }}>
            As a MERN Stack Developer and aspiring Creative Developer, I enjoy crafting modern digital experiences that combine functionality, performance, and engaging user experiences. My technical expertise includes <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>HTML, CSS, JavaScript, React.js, Node.js, Express.js, Socket.io, WebRTC, GSAP, WebGL, GLSL Shaders, Three.js</span>, and the development of animated, responsive, and interactive websites. I am particularly interested in advanced web animations, real-time applications, immersive 3D experiences, creative development, and AI-driven products.
          </p>

          <p style={{ color: '#ccc', fontSize: '1.2rem', lineHeight: '1.8' }}>
            Throughout my academic journey, I have actively participated in innovation-driven events, hackathons, and collaborative projects. I was a <strong>Finalist in Samadhan 2.0 Hackathon</strong> at SISTec Bhopal, participated in the <strong>Far Away Hackathon</strong>, organized through a collaboration between Zuup and a Japanese university, and have been recognized as a <strong>Google Student Ambassador (GSA'25)</strong>. These experiences have strengthened my problem-solving abilities, teamwork, leadership, and passion for technology.
          </p>

          <p style={{ color: '#ccc', fontSize: '1.2rem', lineHeight: '1.8' }}>
            My goal is to establish myself as a professional Creative Developer and Freelancer, creating impactful web and AI-powered applications. I strive to combine creativity, problem-solving, and modern technologies to build solutions that deliver meaningful value to users and businesses.
          </p>
        </div>
      </div>

      {/* Decorative background blobs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>
    </div>
  );
}
