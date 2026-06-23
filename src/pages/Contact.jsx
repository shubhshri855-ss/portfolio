import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#contact",
            start: "top 70%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="contact"
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
        padding: '50px 20px',
      }}
    >
      <div
        style={{
          zIndex: 10,
          background: 'rgba(5, 8, 22, 0.4)',
          padding: '50px',
          borderRadius: '24px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%',
        }}
      >
        <h2
          style={{
            fontSize: '3.5rem',
            marginBottom: '10px',
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
          }}
        >
          Get In Touch
        </h2>
        <p
          style={{
            color: '#00f0ff',
            fontSize: '1.2rem',
            marginBottom: '40px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          Let's Build Something Amazing
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <a
            href="https://www.linkedin.com/in/shubh-shrivastava-049262320/"
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >
            <div className="contact-icon">🔗</div>
            <div className="contact-info">
              <h3>LinkedIn</h3>
              <p>shubh-shrivastava-049262320</p>
            </div>
          </a>

          <a
            href="https://github.com/shubhshri855-ss"
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >
            <div className="contact-icon">💻</div>
            <div className="contact-info">
              <h3>GitHub</h3>
              <p>shubhshri855-ss</p>
            </div>
          </a>

          <a
            href="mailto:shubhshri855@gmail.com"
            className="contact-card"
          >
            <div className="contact-icon">✉️</div>
            <div className="contact-info">
              <h3>Email</h3>
              <p>shubhshri855@gmail.com</p>
            </div>
          </a>

          <div className="contact-card">
            <div className="contact-icon">📱</div>
            <div className="contact-info">
              <h3>Phone</h3>
              <p>+91 9302410770</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
