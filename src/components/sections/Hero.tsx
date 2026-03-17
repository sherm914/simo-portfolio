'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useReel } from '@/hooks/useReel';

// inline typewriter/fade effect
function useTypewriter(words: string[], speed = 120, pauseAfter = 1200) {
  const [wordIndex, setWordIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // handle typing
  useEffect(() => {
    if (fade) return; // during fade, stop typing

    if (subIndex < words[wordIndex].length) {
      const t = setTimeout(() => setSubIndex((s) => s + 1), speed);
      return () => clearTimeout(t);
    }

    // full word typed, wait then start fade
    const p = setTimeout(() => setFade(true), pauseAfter);
    return () => clearTimeout(p);
  }, [subIndex, wordIndex, fade, words, speed, pauseAfter]);

  // after fade finish, move to next word
  useEffect(() => {
    if (!fade) return;
    const f = setTimeout(() => {
      setFade(false);
      setSubIndex(0);
      setWordIndex((w) => (w + 1) % words.length);
    }, 500); // fade duration matches tailwind transition
    return () => clearTimeout(f);
  }, [fade, words.length]);

  const text = words[wordIndex].substring(0, subIndex);
  return { text, fade };
}

export default function Hero() {
  const taglines = ['Story First. Always.', 'Director.', 'Editor.', 'VFX Generalist.', 'Producer.'];
  const { text: typed, fade } = useTypewriter(taglines, 60);
  const { reel } = useReel();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleStyle, setTitleStyle] = useState<React.CSSProperties>({});
  const [isMobile, setIsMobile] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Handle device orientation
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const beta = event.beta || 0;
    const gamma = event.gamma || 0;
    setDeviceOrientation({ beta, gamma });
  };

  // Request permission for iOS 13+
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined') {
      if ('requestPermission' in DeviceOrientationEvent) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            setPermissionGranted(true);
            console.log('Device orientation permission granted');
          }
        } catch (error) {
          console.log('Permission request error:', error);
        }
      } else {
        // Older iOS or Android
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        setPermissionGranted(true);
        console.log('Device orientation listener added (no permission needed)');
      }
    }
  };

  useEffect(() => {
    const mobile = /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);

    if (!mobile) return;

    // Try to add listener immediately (works on some Android and older iOS)
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    // For iOS 13+, also set up permission request on first touch
    const handleFirstInteraction = () => {
      requestPermission();
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  useEffect(() => {
    let lastTime = Date.now();
    
    const handleMouse = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTime;
      lastTime = now;
      const prev = prevPosRef.current;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dt > 0 ? dist / dt : 0;
      const norm = Math.min(speed * 0.05, 1);
      setVelocity(norm);
      prevPosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });

      // 3D tilt on title (desktop)
      if (titleRef.current && !isMobile) {
        const rect = titleRef.current.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const rotX = (relY / rect.height) * -10;
        const rotY = (relX / rect.width) * 10;
        setTitleStyle({ transform: `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)` });
      }
    };

    const handleScroll = () => setScrollY(window.scrollY);
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouse);
    }
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // decay velocity when cursor stops
  useEffect(() => {
    if (velocity > 0) {
      const id = requestAnimationFrame(() => setVelocity((v) => Math.max(0, v - 0.02)));
      return () => cancelAnimationFrame(id);
    }
  }, [velocity]);

  // Handle gyroscope rotation on mobile
  useEffect(() => {
    if (isMobile && titleRef.current) {
      // Convert device orientation to rotation
      // beta: tilt front/back (-180 to 180) -> rotateX
      // gamma: tilt left/right (-90 to 90) -> rotateY
      const rotX = (deviceOrientation.beta / 180) * -15; // max ±15 degrees
      const rotY = (deviceOrientation.gamma / 90) * 15; // max ±15 degrees

      setTitleStyle({ 
        transform: `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)` 
      });
    }
  }, [deviceOrientation, isMobile]);

  return (
    <section
      onMouseEnter={() => !isMobile && setHovering(true)}
      onMouseLeave={() => {
        if (!isMobile) {
          setHovering(false);
          setTitleStyle({});
        }
      }}
      className="relative pt-40 pb-8 px-6 bg-black min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Reel preview background video */}
      {reel && (
        <video
          src={reel}
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      {/* Cinematic background elements */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          style={{
            transform: `translate3d(${mousePos.x / 50}px,${mousePos.y / 50 + scrollY * 0.2}px,0)`
          }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          style={{
            transform: `translate3d(${mousePos.x / -50}px,${mousePos.y / -50 + scrollY * -0.15}px,0)`
          }}
        ></div>
      </div>

      {/* Film grain effect */}
      <div
        className="absolute inset-0 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" /%3E%3C/filter%3E%3Crect width=\"400\" height=\"400\" filter=\"url(%23noiseFilter)\" opacity=\"1\"/%3E%3C/svg%3E")',
        }}
      ></div>

      {/* Cinematic hover flare */}
      {hovering && (
        <div
          className="pointer-events-none absolute w-40 h-40 bg-gradient-to-r from-white/60 via-white/10 to-white/0 rounded-full blur-3xl animate-flare"
          style={{
            left: mousePos.x - 80,
            top: mousePos.y - 80,
            opacity: velocity,
            transform: `scale(${0.6 + velocity * 0.8})`
          }}
        />
      )}

      <div className="relative max-w-full mx-auto text-center z-10">

        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 leading-tight transition-transform duration-300 ease-out whitespace-nowrap"
          style={{ fontFamily: "'Axion Kong', sans-serif", letterSpacing: 'clamp(2px, 1vw, 5px)', ...titleStyle }}
        >
          SIMO MOTSA
        </h1>

        <p className={`text-xl md:text-2xl text-zinc-300 mb-12 max-w-3xl mx-auto leading-relaxed h-12 transition-opacity duration-500 ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}>
          {typed}
          <span className="animate-blink inline-block">|</span>
        </p>

        <div className="flex justify-center">
          <Link
            href="/site/selected-work"
            className="px-12 py-4 bg-white text-black font-bold hover:bg-zinc-300 transition-all duration-300 rounded-lg tracking-wide hover:scale-110"
          >
            ENTER
          </Link>
        </div>

      </div>

    </section>
  );
}
