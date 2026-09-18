"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const faceLayers = [
  ["eye-whites.png", "eye-whites"],
  ["pupils.png", "pupils"],
  ["eye-glare.png", "eye-glare"],
  ["head.webp", "head"],
  ["hair.png", "hair"],
  ["hat.webp", "hat"],
  ["beard.png", "beard"],
  ["mustache.png", "mustache"],
  ["blink.png", "blink"],
  ["brows.png", "brows"],
] as const;

export default function AnimatedPortrait() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const pupilsX = gsap.quickTo(".portrait-pupils", "x", { duration: 0.35, ease: "power3.out" });
      const pupilsY = gsap.quickTo(".portrait-pupils", "y", { duration: 0.35, ease: "power3.out" });
      const faceX = gsap.quickTo(".portrait-face", "x", { duration: 0.9, ease: "power3.out" });
      const faceY = gsap.quickTo(".portrait-face", "y", { duration: 0.9, ease: "power3.out" });
      const portraitRotate = gsap.quickTo(".portrait-character", "rotation", { duration: 1.2, ease: "power3.out" });
      const xrayOpacity = gsap.quickTo(".portrait-xray", "opacity", { duration: 0.18, ease: "power2.out" });
      const lensOpacity = gsap.quickTo(".xray-lens", "opacity", { duration: 0.18, ease: "power2.out" });

      const onPointerMove = (event: PointerEvent) => {
        if (!root.current) return;
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        pupilsX(nx * 18);
        pupilsY(ny * 10);
        faceX(nx * 7);
        faceY(ny * 5);
        portraitRotate(nx * 1.2);

        const bounds = root.current.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const rx = x / bounds.width;
        const ry = y / bounds.height;
        const inside = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
        const overCharacter = inside && rx <= 0.54 && ry >= 0.12;
        const overWordmark = inside && rx >= 0.54 && rx <= 0.97 && ry >= 0.22 && ry <= 0.72;
        const active = overCharacter || overWordmark;

        root.current.style.setProperty("--xray-x", `${x}px`);
        root.current.style.setProperty("--xray-y", `${y}px`);
        root.current.dataset.xrayTarget = overCharacter ? "character" : overWordmark ? "wordmark" : "none";
        xrayOpacity(active ? 1 : 0);
        lensOpacity(active ? 1 : 0);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });

      gsap.timeline({ repeat: -1, yoyo: true })
        .to(".portrait-body", { scaleY: 1.012, scaleX: 1.004, y: -3, duration: 2.8, ease: "sine.inOut", transformOrigin: "50% 90%" });

      gsap.to(".portrait-face", { y: -2, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".portrait-clouds-back", { xPercent: 1.7, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".portrait-clouds-front", { xPercent: -2.2, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut" });

      const blink = gsap.timeline({ repeat: -1, repeatDelay: 3.8 });
      blink.set(".portrait-blink", { opacity: 0 })
        .to(".portrait-blink", { opacity: 1, duration: 0.07, ease: "none" }, 0.8)
        .to(".portrait-blink", { opacity: 0, duration: 0.1, ease: "none" }, 0.91)
        .to(".portrait-blink", { opacity: 1, duration: 0.06, ease: "none" }, 1.04)
        .to(".portrait-blink", { opacity: 0, duration: 0.11, ease: "none" }, 1.13);

      return () => window.removeEventListener("pointermove", onPointerMove);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="portrait" ref={root} aria-hidden="true">
      <div className="portrait-inner">
        <img className="portrait-layer portrait-sky" src="/hero-scene-final/sky.webp" alt="" />
        <img className="portrait-layer portrait-clouds-back" src="/hero-scene-final/clouds-2.webp" alt="" />
        <img className="portrait-layer portrait-clouds-front" src="/hero-scene-final/clouds-1.webp" alt="" />
        <img className="portrait-layer portrait-city" src="/hero-scene-final/city.webp" alt="" />
        <div className="portrait-character portrait-group">
          <div className="portrait-body portrait-group">
            <img src="/hero-scene-final/body-jacket-shirt.webp" alt="" />
            <img src="/hero-scene-final/jacket-collar.webp" alt="" />
          </div>
          <div className="portrait-face portrait-group">
            {faceLayers.map(([file, className]) => (
              <img
                key={file}
                className={`portrait-layer portrait-${className}`}
                src={`/hero-scene-final/${file}`}
                alt=""
              />
            ))}
          </div>
        </div>
        <img className="portrait-layer portrait-wordmark" src="/hero-scene-final/wordmark-solid.png" alt="" />
        <div className="portrait-xray">
          <img className="portrait-layer" src="/hero-scene-final/bones.webp" alt="" />
          <img className="portrait-layer" src="/hero-scene-final/wordmark-bones.webp" alt="" />
          <img className="portrait-layer" src="/hero-scene-final/hover-outline.webp" alt="" />
        </div>
        <div className="xray-lens" />
      </div>
    </div>
  );
}
