"use client";

import { useState, useEffect, useRef, type ReactNode, type MouseEvent, type FormEvent } from "react";

/* ================= DATA (edit freely) ================= */

const NAV: [string, string][] = [
  ["about", "About"],
  ["skills", "AI Stack"],
  ["playground", "AI Lab"],
  ["projects", "Projects"],
  ["timeline", "Journey"],
];

const ROLES = [
  "Media Studies Student",
  "AI Content Explorer",
  "Digital Journalism Enthusiast",
  "Prompt Engineering Learner",
];

const TOOLS = [
  "ChatGPT", "Claude", "Gemini", "Midjourney", "ElevenLabs",
  "Runway", "Premiere Pro", "DaVinci Resolve", "Canva",
  "Perplexity", "CapCut", "Notion AI",
];

// Editable portfolio placeholders. Replace with verified personal data.
const STATS = [
  { n: 3, s: "", l: "Areas of Focus" },
  { n: 12, s: "", l: "Tools to Explore" },
  { n: 3, s: "", l: "Concept Projects" },
  { n: 1, s: "", l: "Academic Journey" },
];

const SKILLS = [
  { name: "AI Prompt Engineering", desc: "Developing structured prompts and exploring AI-assisted content generation.", icon: "🤖", cat: "AI & Tech", lvl: 72 },
  { name: "Generative Media Workflows", desc: "Exploring AI-generated visuals, text and multimedia workflows.", icon: "✨", cat: "AI & Tech", lvl: 68 },
  { name: "AI-Assisted Research", desc: "Using AI tools to explore topics, organize information and support research.", icon: "📊", cat: "AI & Tech", lvl: 70 },
  { name: "Digital Journalism", desc: "Learning news writing, source evaluation and responsible digital reporting.", icon: "📰", cat: "Media & Core", lvl: 74 },
  { name: "Video & Audio Production", desc: "Exploring broadcast editing, audio, and visual storytelling.", icon: "🎬", cat: "Media & Core", lvl: 65 },
  { name: "Strategic PR", desc: "Learning campaign planning, audience communication and public relations.", icon: "📈", cat: "Media & Core", lvl: 62 },
  { name: "Public Speaking & Hosting", desc: "Developing presentation, interviewing and communication skills.", icon: "🎙️", cat: "Media & Core", lvl: 66 },
  { name: "Content Strategy", desc: "Exploring content planning and communication across digital platforms.", icon: "💡", cat: "Media & Core", lvl: 64 },
];

const PROJECTS = [
  {
    title: "AI-Assisted Journalism & News Research",
    desc: "A concept for a digital journalism workflow that organizes news sources, compares reports and supports fact-checking. Human verification remains essential.",
    emoji: "📰",
    tag: "AI Journalism",
    stack: ["LLMs", "Source Review", "Research"],
  },
  {
    title: "Multimedia Storytelling & Video Production",
    desc: "A proposed multimedia storytelling piece combining documentary-style narration, visual storytelling and optional AI-assisted production tools.",
    emoji: "🎥",
    tag: "Media Production",
    stack: ["Storyboarding", "Video", "Audio"],
  },
  {
    title: "Digital PR & Campaign Strategy",
    desc: "A sample communication campaign concept exploring audience research, message development and social media content planning.",
    emoji: "📈",
    tag: "Strategic PR",
    stack: ["Audience Research", "Content", "Strategy"],
  },
];

const TIMELINE = [
  {
    year: "Current focus",
    title: "Exploring AI & Media",
    desc: "Developing an interest in generative media tools, prompt workflows and data-informed storytelling. This is a learning-stage description, not an employment claim.",
  },
  {
    year: "University studies",
    title: "BS Media Studies",
    desc: "Studying media, communication, journalism and digital storytelling at the University of Sargodha.",
  },
  {
    year: "Portfolio development",
    title: "Creative Practice & Concept Work",
    desc: "Building sample concepts around news research, multimedia storytelling and digital communication. Add verified dates and completed work when available.",
  },
];

const AI = {
  script: {
    label: "📰 News Scripting",
    title: "AI-Assisted News Scripting",
    prompt: "Create a 60-second broadcast news script about digital misinformation among young people in South Asia. Separate verified facts from claims that still need checking. Do not invent statistics or sources.",
    output: "🎙️ SAMPLE SCRIPT: Digital platforms have changed how young people discover and share news. Alongside faster access to information, misleading headlines and unverified posts can spread rapidly. Journalists can respond by checking original sources, comparing independent reports and clearly distinguishing confirmed facts from developing claims. This demonstration shows how AI may assist with drafting while editorial verification remains a human responsibility.",
  },
  pr: {
    label: "📈 PR Strategy",
    title: "Digital PR Campaign Strategy",
    prompt: "Develop a sample digital PR response plan for a fictional media startup facing negative online feedback. Include audience listening, transparent communication, response priorities and evaluation methods. Do not invent real campaign results.",
    output: "📈 SAMPLE STRATEGY: 1. Listen to audience concerns and group feedback by theme. 2. Verify the facts before issuing a public response. 3. Prepare a concise statement acknowledging the concern and explaining next steps. 4. Publish updates through appropriate channels. 5. Review response times, audience questions and engagement trends. These are proposed actions, not a report of a completed campaign.",
  },
  research: {
    label: "📚 Media Research",
    title: "Media Theory Research Assistant",
    prompt: "Explain how Agenda-Setting Theory can be studied in the age of social media algorithms. Identify the key research questions, distinguish established theory from hypotheses, and suggest what evidence a student should collect.",
    output: "📚 SAMPLE RESEARCH SUMMARY: Agenda-Setting Theory examines how the prominence of issues in media can influence what audiences consider important. In digital environments, recommendation systems and personalized feeds introduce additional questions about visibility, repetition and audience selection. A student could compare issue prominence across selected news sources and social platforms, then examine how audience members perceive those issues. The sample is an initial framework; academic claims should be checked against scholarly literature.",
  },
};

type Tab = keyof typeof AI;

/* ================= HOOKS & SMALL COMPONENTS ================= */

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, seen] as const;
}

function useTyper(words: string[]) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setText(words[index]);
      return;
    }

    const word = words[index];
    const complete = text === word;

    const timer = window.setTimeout(() => {
      if (!deleting && complete) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((current) => (current + 1) % words.length);
      } else {
        setText(
          deleting
            ? word.slice(0, text.length - 1)
            : word.slice(0, text.length + 1),
        );
      }
    }, complete && !deleting ? 1400 : deleting ? 35 : 70);

    return () => window.clearTimeout(timer);
  }, [text, deleting, index, words, reducedMotion]);

  return text;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, seen] = useInView(0.12);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal transition-all duration-700 ease-out ${
        seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [ref, seen] = useInView(0.5);
  const [value, setValue] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!seen) return;

    if (reducedMotion) {
      setValue(to);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [seen, to, reducedMotion]);

  return <span ref={ref}>{value}{suffix}</span>;
}

function Bar({ value, name }: { value: number; name: string }) {
  const [ref, seen] = useInView(0.5);

  return (
    <div
      ref={ref}
      className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800"
      role="img"
      aria-label={`${name}: illustrative self-assessment ${value}%`}
    >
      <div
        style={{ width: seen ? `${value}%` : "0%" }}
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
      />
    </div>
  );
}

function Spot({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const move = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={move}
      className={`spot relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A]/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 ${className}`}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <Reveal className="mb-16 text-center">
      <h2 className="text-3xl font-black tracking-tight sm:text-5xl">{title}</h2>
      <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
        {sub}
      </p>
    </Reveal>
  );
}

/* ================= MOUSE TRAIL EFFECT ================= */

function CursorChain() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = [
      { color: "#5813BC", shape: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
      { color: "#AC22CB", shape: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>' },
      { color: "#0ea5e9", shape: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/>' },
      { color: "#f59e0b", shape: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
    ];

    const speeds = [0.22, 0.16, 0.12, 0.09];
    const style = document.createElement("style");

    style.textContent = `
      #hx-line{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483646}
      #hx-line polyline{fill:none;stroke:rgba(124,58,237,.6);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
      .hx-dot{position:fixed;top:0;left:0;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#fff;display:grid;place-items:center;pointer-events:none;z-index:2147483647;box-shadow:0 3px 12px rgba(0,0,0,.35);opacity:0;transition:opacity .2s}
      .hx-on .hx-dot{opacity:1}
      .hx-dot svg{width:15px;height:15px;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    `;

    document.head.appendChild(style);

    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.id = "hx-line";

    const line = document.createElementNS(namespace, "polyline");
    svg.appendChild(line);
    document.body.appendChild(svg);

    const mouse = { x: 0, y: 0 };
    let started = false;
    let running = false;
    let frame = 0;

    const root = document.documentElement;

    const dots = items.map((item) => {
      const element = document.createElement("div");
      element.className = "hx-dot";
      element.innerHTML = `<svg viewBox="0 0 24 24" stroke="${item.color}">${item.shape}</svg>`;
      document.body.appendChild(element);
      return { element, x: 0, y: 0 };
    });

    const tick = () => {
      let targetX = mouse.x;
      let targetY = mouse.y;
      let moving = false;
      const points = [`${mouse.x},${mouse.y}`];

      dots.forEach((dot, index) => {
        dot.x += (targetX - dot.x) * speeds[index];
        dot.y += (targetY - dot.y) * speeds[index];

        if (
          Math.abs(targetX - dot.x) > 0.2 ||
          Math.abs(targetY - dot.y) > 0.2
        ) {
          moving = true;
        }

        dot.element.style.transform = `translate3d(${dot.x}px,${dot.y}px,0)`;
        points.push(`${dot.x},${dot.y}`);
        targetX = dot.x;
        targetY = dot.y;
      });

      line.setAttribute("points", points.join(" "));

      if (moving) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      mouse.x = event.clientX;
      mouse.y = event.clientY;

      if (!started) {
        dots.forEach((dot) => {
          dot.x = mouse.x;
          dot.y = mouse.y;
        });
        started = true;
      }

      root.classList.add("hx-on");

      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const leave = () => {
      root.classList.remove("hx-on");
      line.setAttribute("points", "");
    };

    const enter = () => root.classList.add("hx-on");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      cancelAnimationFrame(frame);
      style.remove();
      svg.remove();
      dots.forEach((dot) => dot.element.remove());
      root.classList.remove("hx-on");
    };
  }, []);

  return null;
}

/* ================= PAGE ================= */

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [tab, setTab] = useState<Tab>("script");
  const [out, setOut] = useState("");
  const [playing, setPlaying] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const role = useTyper(ROLES);

  useEffect(() => {
    const updateProgress = () => {
      const html = document.documentElement;
      const maximum = Math.max(1, html.scrollHeight - html.clientHeight);
      setProgress((html.scrollTop / maximum) * 100);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    if (typeof IntersectionObserver === "undefined") {
      return () => {
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("resize", updateProgress);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    NAV.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const contact = document.getElementById("contact");
    if (contact) observer.observe(contact);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setOut("");
    const full = AI[tab].output;
    let index = 0;

    const interval = window.setInterval(() => {
      index += 1;
      setOut(full.slice(0, index));

      if (index >= full.length) window.clearInterval(interval);
    }, 12);

    return () => window.clearInterval(interval);
  }, [tab]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // This front-end demo does not send or store messages.
    setDemoNotice(true);
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-700/80 bg-[#070B14] px-5 py-4 text-slate-100 placeholder:text-slate-600 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070B14] font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      <style>{`
        html{scroll-behavior:smooth;scroll-padding-top:6rem}
        .spot::before{content:"";position:absolute;inset:0;background:radial-gradient(420px circle at var(--x,50%) var(--y,50%),rgba(59,130,246,.16),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none;z-index:1}
        .spot:hover::before{opacity:1}
        @keyframes floaty{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-35px) scale(1.08)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes eq{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
        @keyframes blink{50%{opacity:0}}
        @keyframes shine{to{background-position:200% center}}
        .orb{animation:floaty 14s ease-in-out infinite}
        .marquee{animation:marquee 32s linear infinite}
        .marquee:hover{animation-play-state:paused}
        .eq{transform-origin:bottom;animation:eq .7s ease-in-out infinite alternate}
        .caret{animation:blink 1s step-end infinite}
        .shine{background-size:200% auto;animation:shine 6s linear infinite}
        @media (prefers-reduced-motion:reduce){
          html{scroll-behavior:auto}
          *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
          .orb,.marquee,.eq,.caret,.shine{animation:none!important}
          .reveal{opacity:1!important;transform:none!important}
        }
      `}</style>

      <CursorChain />

      {/* SCROLL PROGRESS */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"
        style={{ width: `${progress}%` }}
      />

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070B14]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-2 text-xl font-black tracking-wider text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text sm:text-2xl"
          >
            M. Shayan
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
          </a>

          <div className="hidden items-center gap-2 text-sm font-semibold md:flex">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                className={`rounded-full px-4 py-2 transition-colors ${
                  active === id
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-300 hover:text-blue-400"
                }`}
              >
                {label}
              </a>
            ))}

            <a
              href="#contact"
              className="ml-3 rounded-xl bg-blue-600 px-5 py-2.5 text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Let&apos;s Talk
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenu((current) => !current)}
            className="rounded-lg p-2 text-2xl text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 md:hidden"
            aria-label={menu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menu}
            aria-controls="mobile-navigation"
          >
            {menu ? "✕" : "☰"}
          </button>
        </div>

        <div
          id="mobile-navigation"
          aria-hidden={!menu}
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menu ? "max-h-96 border-t border-slate-800" : "max-h-0"
          }`}
        >
          <div className="space-y-4 bg-[#0A0F1D]/95 px-6 py-5">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                tabIndex={menu ? 0 : -1}
                onClick={() => setMenu(false)}
                className="block font-medium text-slate-300 hover:text-blue-400"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              tabIndex={menu ? 0 : -1}
              onClick={() => setMenu(false)}
              className="block rounded-xl bg-blue-600 py-3 text-center font-medium"
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </nav>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden px-4 py-20 text-center sm:py-28 lg:py-32">
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(148,163,184,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="orb pointer-events-none absolute left-[12%] top-10 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]" />
          <div className="orb pointer-events-none absolute bottom-0 right-[10%] h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px] [animation-delay:-6s]" />
          <div className="orb pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px] [animation-delay:-3s]" />

          <div className="relative z-10 mx-auto max-w-5xl space-y-8">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-700/40 bg-blue-950/70 px-5 py-2.5 text-sm font-semibold text-blue-300 backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                Student portfolio · Open to learning and collaboration
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
                <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                  Muhammad
                </span>
                <br />
                <span
                  className="shine bg-clip-text text-transparent [filter:drop-shadow(0_0_30px_rgba(168,85,247,.4))]"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg,#22d3ee,#818cf8,#e879f9,#fb7185,#fbbf24,#22d3ee)",
                  }}
                >
                  Shayan
                </span>
              </h1>
            </Reveal>

            {/* Optional personal photograph: place your own image at public/profile.jpg */}
            <Reveal delay={150} className="flex justify-center">
              <div className="relative mx-auto mb-2 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 p-1 shadow-[0_0_55px_rgba(59,130,246,0.22)] sm:h-44 sm:w-44">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-[#070B14] bg-slate-900">
                  {!imageError ? (
                    <img
                      src="/shayan.jpeg"
                      alt="Muhammad Shayan"
                      className="h-full w-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div
                      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 text-center"
                      aria-label="Profile photograph not added"
                    >
                      <span className="text-4xl font-black tracking-tight text-cyan-300">
                        MS
                      </span>
                      <span className="mt-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Add your photo
                      </span>
                    </div>
                  )}
                </div>
                <span
                  className="absolute bottom-2 right-1 h-5 w-5 rounded-full border-4 border-[#070B14] bg-cyan-400"
                  aria-hidden="true"
                />
              </div>
            </Reveal>

            <Reveal delay={200}>
              <p
                className="min-h-10 text-xl font-bold text-slate-200 sm:text-3xl"
                aria-label={`Current role: ${role}`}
              >
                {role}
                <span className="caret text-blue-400" aria-hidden="true">|</span>
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl">
                A BS Media Studies student at the{" "}
                <span className="font-semibold text-slate-200">
                  University of Sargodha
                </span>
                , exploring the intersection of{" "}
                <span className="font-semibold text-blue-400">
                  Artificial Intelligence
                </span>
                , digital journalism, prompt engineering, video production and digital storytelling.
              </p>
            </Reveal>

            <Reveal
              delay={400}
              className="flex flex-col justify-center gap-4 pt-4 sm:flex-row sm:gap-5"
            >
              <a
                href="#projects"
                className="group rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-bold shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/50"
              >
                Explore Concept Projects{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#playground"
                className="rounded-2xl border border-slate-700/80 bg-[#0F172A]/80 px-8 py-4 font-bold backdrop-blur transition-all hover:-translate-y-1 hover:bg-slate-800"
              >
                Try the AI Prompt Lab
              </a>
            </Reveal>

            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 pt-10 sm:gap-5 md:grid-cols-4 md:pt-16">
              {STATS.map((stat, index) => (
                <Reveal key={stat.l} delay={index * 80}>
                  <Spot className="!rounded-2xl p-5 sm:p-6">
                    <div className="bg-gradient-to-b from-blue-300 to-blue-500 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                      <Count to={stat.n} suffix={stat.s} />
                    </div>
                    <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                      {stat.l}
                    </div>
                  </Spot>
                </Reveal>
              ))}
            </div>

            <p className="pt-2 text-xs text-slate-500">
              Editable portfolio placeholders — update these labels and values to match your verified experience.
            </p>
          </div>
        </section>

        {/* AI TOOLS MARQUEE */}
        <div className="overflow-hidden border-y border-slate-800/80 bg-[#0A0F1D] py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee flex w-max gap-4">
            {[...TOOLS, ...TOOLS].map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="whitespace-nowrap rounded-full border border-slate-800 bg-[#0F172A] px-5 py-2 text-sm font-semibold text-slate-400 transition-colors hover:border-blue-500/50 hover:text-blue-400"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="scroll-mt-20 bg-[#0A0F1D] py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Head
              title="About Me & My Interests"
              sub="Connecting media studies, responsible communication and emerging creative technologies."
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Reveal>
                <Spot className="h-full p-8 sm:p-10">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-700/40 bg-blue-950/80 text-3xl">
                    🎙️
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">
                    Media Studies & Broadcasting
                  </h3>
                  <p className="leading-relaxed text-slate-400">
                    I am a BS Media Studies student interested in how journalism,
                    broadcasting and digital communication shape the stories people
                    encounter. I want to develop my skills in research, ethical
                    storytelling, audience understanding and multimedia production.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Journalism", "Broadcasting", "Digital Storytelling"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-blue-800/60 bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </Spot>
              </Reveal>

              <Reveal delay={150}>
                <Spot className="h-full p-8 sm:p-10">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-700/40 bg-cyan-950/80 text-3xl">
                      🎧
                    </div>
                    <span className="rounded-full border border-blue-800 bg-blue-950/80 px-3 py-1 text-xs font-bold text-blue-400">
                      Interactive Demo
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">
                    AI & Media Podcast Concept
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-400">
                    A simulated podcast-player interface illustrating a possible
                    discussion about AI and digital media. It is a visual demo,
                    not a playable audio recording.
                  </p>
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#070B14] p-4">
                    <button
                      type="button"
                      onClick={() => setPlaying((current) => !current)}
                      aria-label={playing ? "Pause visual audio demo" : "Play visual audio demo"}
                      aria-pressed={playing}
                      className="h-12 w-12 shrink-0 rounded-xl bg-blue-600 text-lg font-bold shadow-lg transition-all hover:scale-105 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      {playing ? "⏸" : "▶"}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-slate-400">
                        <span className="truncate">Concept: AI & Digital Storytelling</span>
                        <span>Demo</span>
                      </div>
                      <div className="flex h-8 items-end gap-1" aria-hidden="true">
                        {[40, 70, 30, 90, 60, 80, 50, 100, 40, 70, 30, 85, 65, 45, 95, 55, 75, 35].map((height, index) => (
                          <div
                            key={index}
                            style={{
                              height: `${height}%`,
                              animationDelay: `${index * 70}ms`,
                              animationPlayState: playing ? "running" : "paused",
                            }}
                            className={`eq flex-1 rounded-full ${playing ? "bg-blue-400" : "bg-slate-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Spot>
              </Reveal>
            </div>
          </div>
        </section>

        {/* AI PROMPT LAB */}
        <section id="playground" className="scroll-mt-20 border-t border-slate-800/80 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Head
              title="Interactive AI Prompt Lab"
              sub="Explore sample prompts and illustrative outputs for journalism, public relations and media research."
            />

            <Reveal>
              <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/80 p-6 shadow-2xl backdrop-blur sm:p-10">
                <div className="mb-8 flex flex-wrap justify-center gap-3" role="group" aria-label="Choose a prompt example">
                  {(Object.keys(AI) as Tab[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      aria-pressed={tab === key}
                      className={`rounded-xl px-4 py-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:px-6 ${
                        tab === key
                          ? "scale-105 bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "border border-slate-800 bg-[#070B14] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {AI[key].label}
                    </button>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#070B14]">
                  <div className="flex items-center gap-2 border-b border-slate-800 bg-[#0B1120] px-5 py-3">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-extrabold uppercase tracking-widest text-blue-400 sm:ml-3">
                      {AI[tab].title}
                    </span>
                  </div>

                  <div className="space-y-5 p-5 sm:p-8">
                    <div className="break-words rounded-xl border border-blue-900/40 bg-blue-950/30 p-4 font-mono text-sm leading-relaxed text-slate-300 sm:text-base">
                      <span className="text-blue-400">prompt › </span>
                      {AI[tab].prompt}
                    </div>

                    <div
                      className="min-h-[160px] rounded-xl border border-slate-800 bg-slate-900/70 p-5 text-sm leading-relaxed text-slate-300 sm:text-base"
                      aria-live="polite"
                      aria-label="Sample AI output"
                    >
                      <span className="mb-2 block text-xs font-bold uppercase text-cyan-400">
                        Illustrative Sample Output
                      </span>
                      {out}
                      <span className="caret text-cyan-400" aria-hidden="true">▍</span>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-500">
                      These are prewritten demonstrations, not live AI responses.
                      Verify factual claims and consult reliable sources before using
                      any generated material in journalism or academic work.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="scroll-mt-20 border-t border-slate-800/80 bg-[#0A0F1D] py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Head
              title="Skills & AI Stack"
              sub="Areas I am exploring and developing across media, communication and AI. Bars are illustrative self-assessments, not formal test results."
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SKILLS.map((skill, index) => (
                <Reveal key={skill.name} delay={(index % 4) * 70}>
                  <Spot className="group h-full p-6">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-800/60 bg-blue-950/60 text-3xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      {skill.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {skill.cat}
                    </span>
                    <h3 className="mb-2 mt-1 text-lg font-bold">{skill.name}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {skill.desc}
                    </p>
                    <Bar value={skill.lvl} name={skill.name} />
                    <p className="mt-2 text-xs text-slate-500">
                      Illustrative level: {skill.lvl}%
                    </p>
                  </Spot>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-20 border-t border-slate-800/80 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Head
              title="Featured AI & Media Concepts"
              sub="Three portfolio concepts demonstrating possible applications of AI in journalism, multimedia storytelling and digital PR. These are demonstrations, not claims of completed client work."
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {PROJECTS.map((project, index) => (
                <Reveal key={project.title} delay={index * 100}>
                  <Spot className="group flex h-full flex-col p-8">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-800/50 bg-blue-950/80 text-3xl transition-transform duration-300 group-hover:scale-110">
                        {project.emoji}
                      </div>
                      <span className="rounded-full border border-blue-800/60 bg-blue-950/60 px-3 py-1.5 text-xs font-semibold text-blue-400">
                        {project.tag}
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-blue-400 sm:text-2xl">
                      {project.title}
                    </h3>

                    <p className="flex-1 text-sm leading-relaxed text-slate-400">
                      {project.desc}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-slate-800 pt-5 text-xs font-semibold text-slate-500">
                      Concept project · Demonstration only
                    </div>
                  </Spot>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ACADEMIC & CREATIVE JOURNEY */}
        <section id="timeline" className="scroll-mt-20 border-t border-slate-800/80 bg-[#0A0F1D] py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Head
              title="Academic & Creative Journey"
              sub="A student-focused overview of academic interests and developing portfolio goals."
            />

            <div className="relative ml-4 space-y-8 border-l-2 border-blue-600/30 pl-6 sm:ml-8 sm:pl-10">
              {TIMELINE.map((item, index) => (
                <Reveal key={item.title} delay={index * 100}>
                  <div className="group relative">
                    <span className="absolute -left-[33px] top-6 flex h-4 w-4 sm:-left-[49px]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-30" />
                      <span className="relative inline-flex h-4 w-4 rounded-full border-4 border-[#0A0F1D] bg-blue-500 transition-transform group-hover:scale-125" />
                    </span>

                    <Spot className="!rounded-2xl p-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                        {item.year}
                      </span>
                      <h3 className="mb-2 mt-1 text-xl font-bold">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-400">
                        {item.desc}
                      </p>
                    </Spot>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-slate-800/80 py-24">
          <div className="orb pointer-events-none absolute -bottom-20 left-1/2 h-[300px] w-[600px] max-w-full -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Head
              title="Let's Collaborate"
              sub="Interested in media, AI-assisted content, digital storytelling or creative ideas? Use this demo form layout as a starting point."
            />

            <Reveal>
              <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/80 p-6 shadow-2xl backdrop-blur sm:p-12">
                {demoNotice && (
                  <div
                    role="status"
                    className="mb-6 rounded-2xl border border-amber-700/40 bg-amber-950/30 p-4 text-sm text-amber-200"
                  >
                    This is a front-end demo. Your message has not been sent or stored.
                    Connect a real form service before using this form for actual contact.
                  </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-300">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-300">
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-300">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      minLength={10}
                      rows={5}
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                      placeholder="Tell me about your project or idea..."
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-5 text-lg font-bold shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    Preview Demo Form
                  </button>
                </form>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-400 sm:flex-row">
                  <span>
                    📧 <span className="text-slate-300">Add your real email address</span>
                  </span>
                  <span className="text-center sm:text-right">
                    🔗{" "}
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-400 hover:underline"
                    >
                      Find me on LinkedIn
                    </a>
                    <span className="text-slate-500"> (profile URL to be added)</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="space-y-3 border-t border-slate-800 bg-[#070B14] px-4 py-10 text-center text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} Muhammad Shayan. Media Studies & AI exploration.
          Built with Next.js, React and Tailwind CSS.
        </p>
        <a
          href="#top"
          className="inline-block font-semibold text-blue-400 transition-colors hover:text-blue-300"
        >
          ↑ Back to top
        </a>
      </footer>
    </div>
  );
}