import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Contact from './pages/Contact'
import RoomSection from './pages/RoomSection'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './App.css'

gsap.registerPlugin(ScrollToPlugin);

const App = () => {
  const scrollToSection = (target) => {
    gsap.to(window, {
      scrollTo: target,
      duration: 3,
      ease: "power2.inOut"
    });
  };

  return (
   <>
      {/* Global Navbar */}
      <nav className="navbar">
        <h2 className="logo">Shubh Shrivastava</h2>
        <ul>
          <li onClick={() => scrollToSection(0)}>Home</li>
          <li onClick={() => scrollToSection("#about")}>About</li>
          <li onClick={() => scrollToSection("#experience")}>Experience</li>
          <li onClick={() => scrollToSection("#contact")}>Contact</li>
        </ul>
      </nav>

     <Home />
     <About />
     <Experience />
     <RoomSection />
     <Contact />
   </>
  )
}

export default App;