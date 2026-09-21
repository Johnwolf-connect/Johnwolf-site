"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Menu, Play, Search, X } from "lucide-react";
import AnimatedPortrait from "@/components/AnimatedPortrait";

const projects = [
  { code: "3LK", title: "3 Lowkee", type: "Animated", image: "/portfolio/3lowkee-full.jpg", color: "#ff4fd8", href: "https://lowkee-live.johnwolfvision14168.chatgpt.site" },
  { code: "FRD", title: "Froid", type: "Animated", image: "/portfolio/froid-fixed.jpg", color: "#7be7ff", href: "https://froid-clothing.johnwolfvision14168.chatgpt.site" },
  { code: "SHT", title: "ShayTax", type: "Service", image: "/portfolio/shaytax-fixed.jpg", color: "#ffb500", href: "https://shaytaxdemo.vercel.app" },
  { code: "RTB", title: "Rooted Beauty", type: "Service", image: "/portfolio/rooted-fixed.jpg", color: "#ff4f94", href: "https://rooted-beauty-hair-salon.vercel.app" },
  { code: "GSC", title: "GreenScape", type: "Service", image: "/portfolio/greenscape-fixed.jpg", color: "#9ecb53", href: "https://greenscape-gilt.vercel.app" },
  { code: "NFT", title: "Nightfall", type: "Playable", image: "/portfolio/nightfall-full.jpg", color: "#7b1827", href: "https://nightfall-unlocked-vercel-drop.vercel.app" },
];

const services = [
  ["01", "Brand Identity", "Logos / Visual systems / Guidelines / Packaging"],
  ["02", "Web Experiences", "Art direction / UI & UX / Interactive builds / Motion"],
  ["03", "Campaign Creative", "Advertising / Social / Launch graphics / Content"],
  ["04", "Creative Partnership", "Strategy / Direction / Design support / Execution"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theaterFilter, setTheaterFilter] = useState("All");
  const [theaterSearch, setTheaterSearch] = useState("");
  const [activeGuideline, setActiveGuideline] = useState<"chick" | "riches">("chick");
  const [activeGuidelinePage, setActiveGuidelinePage] = useState(1);
  const [guidelineTransition, setGuidelineTransition] = useState(false);
  const [siteNavVisible, setSiteNavVisible] = useState(true);
  const heroSection = useRef<HTMLElement>(null);
  const theaterSection = useRef<HTMLElement>(null);
  const theaterTrack = useRef<HTMLDivElement>(null);
  const theaterVideo = useRef<HTMLVideoElement>(null);
  const theaterProjects = useMemo(() => projects.filter((project) => {
    const matchesFilter = theaterFilter === "All" || project.type === theaterFilter;
    const matchesSearch = project.title.toLowerCase().includes(theaterSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [theaterFilter, theaterSearch]);

  const moveTheater = (direction: number) => theaterTrack.current?.scrollBy({ left: direction * 310, behavior: "smooth" });

  const selectGuideline = (guideline: "chick" | "riches") => {
    if (guideline === activeGuideline || guidelineTransition) return;
    setGuidelineTransition(true);
    window.setTimeout(() => setActiveGuideline(guideline), 520);
    window.setTimeout(() => setGuidelineTransition(false), 1120);
  };

  useEffect(() => {
    const updateSiteNav = () => {
      const heroHeight = heroSection.current?.offsetHeight ?? window.innerHeight;
      setSiteNavVisible(window.scrollY < heroHeight - 120);
    };

    updateSiteNav();
    window.addEventListener("scroll", updateSiteNav, { passive: true });
    window.addEventListener("resize", updateSiteNav);
    return () => {
      window.removeEventListener("scroll", updateSiteNav);
      window.removeEventListener("resize", updateSiteNav);
    };
  }, []);

  useEffect(() => {
    const section = theaterSection.current;
    const video = theaterVideo.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    }, { threshold: 0.35 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <header className={siteNavVisible ? "site-header" : "site-header is-hidden"}>
        <a className="monogram" href="#top" aria-label="John Wolf home"><span>J</span><span>W</span></a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          {[["Work", "#work"], ["Services", "#services"], ["About", "#about"], ["Contact", "#contact"]].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <a className="start-link" href="#contact">Start a project <ArrowUpRight size={18} /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <div className={siteNavVisible ? "expertise-bar" : "expertise-bar is-hidden"} aria-label="Design specialties">
        <span>Independent Graphic Designer</span>
        <span>Logo Creations</span>
        <span>Web Development</span>
      </div>

      <section className="hero" id="top" ref={heroSection}>
        <AnimatedPortrait />
        <div className="hero-copy">
          <div className="hero-bottom">
            <p>I build bold brands and digital worlds that make people stop, look, and remember.</p>
            <a href="#work" className="round-link" aria-label="Explore selected work"><ArrowDownRight size={42} /></a>
          </div>
        </div>
      </section>

      <section className="work-section" id="work" ref={theaterSection}>
        <img className="theater-curtains" src="/theater/curtains.webp" alt="" />
        <div className="theater-nav">
          <strong>Website Theater</strong>
          <div className="theater-filters" aria-label="Filter projects">
            {["All", "Service", "Animated", "Playable"].map((filter) => <button className={theaterFilter === filter ? "active" : ""} key={filter} onClick={() => setTheaterFilter(filter)}>{filter}</button>)}
          </div>
          <label className="theater-search"><Search size={18} /><input value={theaterSearch} onChange={(event) => setTheaterSearch(event.target.value)} placeholder="Search websites..." /></label>
          <img className="theater-logo" src="/brand/john-wolf-logo.png" alt="John Wolf" />
        </div>
        <p className="theater-instruction">Swipe and enjoy.</p>
        <button className="theater-arrow theater-arrow-left" onClick={() => moveTheater(-1)} aria-label="Previous projects"><ChevronLeft /></button>
        <button className="theater-arrow theater-arrow-right" onClick={() => moveTheater(1)} aria-label="Next projects"><ChevronRight /></button>
        <div className="theater-track" ref={theaterTrack}>
          {theaterProjects.map((project) => (
            <article className="theater-card" key={project.title} style={{ "--accent": project.color } as React.CSSProperties}>
              <a className="theater-poster" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} project`}>
                <img src={project.image} alt={`${project.title} project cover`} loading="lazy" decoding="async" />
              </a>
              <a className="watch-project" href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title}`}><Play size={15} fill="currentColor" /><span>View Project</span></a>
            </article>
          ))}
          {theaterProjects.length === 0 && <p className="theater-empty">No projects match this selection.</p>}
        </div>
        <video
          ref={theaterVideo}
          className="theater-character"
          src="/theater/section-2-theater-keyed.webm"
          preload="none"
          muted
          playsInline
          aria-label="Animated theater audience sequence"
        />
      </section>

      <section className="guidelines-section" id="guidelines">
        <div className="guidelines-heading">
          <span>Brand Guidelines</span>
          <h2>Brand Guideline Projects</h2>
        </div>

        <div className="guideline-selector" aria-label="Select a branding guideline">
          <button className={activeGuideline === "chick" ? "active" : ""} onClick={() => selectGuideline("chick")}>Chick Muy</button>
          <img src="/brand/john-wolf-logo.png" alt="John Wolf" />
          <button className={activeGuideline === "riches" ? "active" : ""} onClick={() => selectGuideline("riches")}>Riches</button>
        </div>

        <div className="guideline-viewer">
          <div className="guideline-stage">
            <iframe title={`${activeGuideline} guideline page ${activeGuidelinePage}`} src={`${activeGuideline === "chick" ? "/guidelines/chick-muy-caliente-brand-guidelines.pdf" : "/guidelines/riches-cosmetics-brand-guidelines.pdf"}#page=${activeGuidelinePage}&view=FitH&toolbar=0&navpanes=0`} loading="lazy" />
            <div className={`guideline-wipe ${guidelineTransition ? "is-animating" : ""}`} aria-hidden="true">
              <svg viewBox="0 0 1000 700" preserveAspectRatio="none">
                <path d="M-80 610 C 140 40, 390 40, 540 360 S 850 760, 1080 80" />
              </svg>
            </div>
          </div>
          <aside className="guideline-thumbnails" aria-label="Brand guideline page thumbnails">
            {Array.from({ length: activeGuideline === "chick" ? 17 : 20 }, (_, i) => i + 1).map((page) => (
              <button
                type="button"
                key={page}
                className={page === activeGuidelinePage ? "active" : ""}
                onClick={() => setActiveGuidelinePage(page)}
                aria-label={`Show guideline page ${page}`}
              >
                <span>{page}</span>
              </button>
            ))}
          </aside>
        </div>

        <div className="guideline-meta">
          <strong>{activeGuideline === "chick" ? "Chick Muy Caliente" : "Riches Cosmetics"}</strong>
          <span>{activeGuideline === "chick" ? "Food Brand Identity" : "Luxury Beauty Identity"}</span>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="services-intro"><p>What I do</p><h2>ONE MIND.<br/><span>MANY MODES.</span></h2><p>From the first rough idea to the polished final experience, I shape every piece around one clear goal: make the work impossible to ignore.</p></div>
        <div className="service-list">
          {services.map(([number, title, detail]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><ArrowUpRight /></article>)}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-label">About / John Wolf</div>
        <div className="about-statement">I DON’T DECORATE IDEAS.<br/><span>I GIVE THEM A WORLD</span><br/>TO LIVE IN.</div>
        <div className="about-grid"><p>Graphic designer, brand builder, and digital experience creator working across identity, campaigns, websites, and interactive concepts.</p><p>My approach combines sharp creative direction with hands-on execution—so the original idea survives all the way to the final detail.</p><div className="availability"><span></span>Available for select projects</div></div>
      </section>

      <section className="contact-section" id="contact">
        <p>Have a project with potential?</p>
        <a href="mailto:designbyjohnwolf@gmail.com">LET’S MAKE<br/>IT REAL <ArrowUpRight /></a>
        <div className="contact-footer"><span>John Wolf © 2026</span><span>Brand / Web / Campaign / Motion</span><a href="#top">Back to top ↑</a></div>
      </section>
    </main>
  );
}
