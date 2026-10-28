import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Award,
  BrainCircuit,
  Check,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Menu,
  Orbit,
  Rocket,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  X,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BootSequence, MotionSystem, Reveal, Tilt } from "./Effects";
import { education, educationLabel, educationStatus, profile, projects, skillGroups } from "./data";

const Universe = lazy(() => import("./Universe"));
const AICore = lazy(() => import("./Universe").then((module) => ({ default: module.AICore })));
const navItems = [
  { id: "about", name: "About" },
  { id: "skills", name: "Skills" },
  { id: "projects", name: "Projects" },
  { id: "experience", name: "Experience" },
];
const roles = [
  "AI Engineer",
  "Full Stack Developer",
  "ML Engineer",
  "Backend Developer",
  "Creator",
  "Builder",
];
const skillIcons = [BrainCircuit, Code2, Server, Database, Sparkles];

function SectionHeading({
  number,
  label,
  title,
  script,
  intro,
}: {
  number: string;
  label: string;
  title: string;
  script: string;
  intro?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <div className="section-index mono">
          {number} / {label}
        </div>
        <h2>
          {title} <span className="script">{script}</span>
        </h2>
      </div>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}

export default function Portfolio() {
  const reduced = useReducedMotion() ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [role, setRole] = useState(0);
  const [skill, setSkill] = useState(0);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [notice, setNotice] = useState<"resume" | "social" | null>(null);
  const [launch, setLaunch] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 45);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", scroll);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => setRole((value) => (value + 1) % roles.length), 3300);
    return () => clearInterval(interval);
  }, [reduced]);

  const openResume = () => {
    if (profile.resume) window.open(profile.resume, "_blank", "noopener,noreferrer");
    else setNotice("resume");
  };
  const openSocial = (key: "github" | "linkedin") => {
    if (profile[key]) window.open(profile[key], "_blank", "noopener,noreferrer");
    else setNotice("social");
  };
  const onContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile.email) {
      setFormStatus(
        "Transmission is not connected yet. Rudraksh’s email address is needed before messages can be sent.",
      );
      return;
    }
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio message from ${String(form.get("name"))}`);
    const body = encodeURIComponent(
      `${String(form.get("message"))}\n\nFrom: ${String(form.get("name"))}\nEmail: ${String(form.get("email"))}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setLaunch(true);
    setFormStatus(
      "Your email draft is ready. Send it from your email app to complete the transmission.",
    );
  };
  const project = selectedProject === null ? null : projects[selectedProject];
  return (
    <div className="portfolio">
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Suspense fallback={null}>
        <Universe reduced={reduced} />
      </Suspense>
      <MotionSystem />
      <BootSequence />
      <header className={`navigation glass ${scrolled ? "scrolled" : ""}`}>
        <a href="#home" className="brand" aria-label="Rudraksh home" onClick={() => setMenu(false)}>
          <div className="brand-mark">R</div>
          <span>
            rudraksh<span className="text-primary">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className={`nav-links ${menu ? "open" : ""}`}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? "active" : ""}
              aria-current={active === item.id ? "location" : undefined}
              onClick={() => setMenu(false)}
            >
              {item.name}
            </a>
          ))}
        </nav>
        <Button asChild variant="glass" size="sm" className="nav-contact text-[10px] gap-3">
          <a href="#contact" onClick={() => setMenu(false)}>
            Let’s talk <ArrowUpRight className="size-3" />
          </a>
        </Button>
        <Button
          variant="quiet"
          size="icon"
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-label={menu ? "Close navigation" : "Open navigation"}
        >
          {menu ? <X /> : <Menu />}
        </Button>
      </header>

      <main>
        <section className="hero" id="home" aria-label="Introduction">
          <Suspense fallback={null}>
            <AICore reduced={reduced} />
          </Suspense>
          <div className="hero-topline mono">
            <span className="signal-dot" /> SYSTEM ONLINE <span className="text-primary/40">/</span>{" "}
            WELCOME TO MY UNIVERSE
          </div>
          <div className="core-label left mono">
            NEURAL CORE <br />
            <b>Imagination × Intelligence</b>
          </div>
          <div className="core-label right mono">
            EXPLORATION MODE
            <br />
            <b>Beyond the ordinary</b>
          </div>
          <aside className="social-rail" aria-label="Social profiles">
            <Button
              variant="quiet"
              size="icon"
              onClick={() => openSocial("github")}
              aria-label="GitHub profile"
              title="GitHub"
            >
              <Github className="size-4" />
            </Button>
            <Button
              variant="quiet"
              size="icon"
              onClick={() => openSocial("linkedin")}
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <Linkedin className="size-4" />
            </Button>
            <div className="h-16 w-px bg-border mx-auto mt-2" />
          </aside>
          <div className="hero-content">
            <Reveal>
              <div className="eyebrow mono">
                <span className="h-px w-6 bg-border" /> A MIND WIRED TO CREATE{" "}
                <span className="h-px w-6 bg-border" />
              </div>
              <h1>Rudraksh</h1>
              <div className="role-line">
                <span className="text-muted-foreground">I am</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={role}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    {roles[role]}
                  </motion.span>
                </AnimatePresence>
                <span className="text-primary/40">✦</span>
              </div>
              <p className="hero-description">
                Turning curiosity into intelligence.
                <br />
                And ambitious ideas into extraordinary experiences.
              </p>
              <div className="hero-affiliation mono">
                <GraduationCap className="size-3" />
                {education.institution} · {educationLabel}
              </div>
              <div className="hero-status mono">{educationStatus}</div>
              <div className="hero-actions">
                <Button variant="cosmic" className="orbit-button" asChild>
                  <a href="#projects">
                    Explore my work <ArrowUpRight />
                  </a>
                </Button>
                <Button variant="glass" className="orbit-button" onClick={openResume}>
                  Download résumé <ArrowDownToLine />
                </Button>
                <Button variant="quiet" className="orbit-button contact-action" asChild>
                  <a href="#contact">
                    Contact me <ArrowRight />
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="hero-bottom page-width">
            <span className="mono coordinates">
              PORTFOLIO / VOL. 01
              <br />
              DESIGNED TO EXPLORE
            </span>
            <a href="#about" className="scroll-cue mono">
              <motion.span
                animate={reduced ? {} : { y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ArrowDown size={13} />
              </motion.span>
              SCROLL TO DISCOVER
            </a>
            <span className="mono coordinates text-right">
              AI · CODE · CREATIVITY
              <br />
              LIMITLESS POSSIBILITIES
            </span>
          </div>
        </section>
        <div className="section-rule" />

        <section id="about" className="section page-width">
          <Reveal>
            <SectionHeading
              number="01"
              label="The human behind the machine"
              title="A little about"
              script="me."
              intro="Somewhere between logic and imagination, that’s where I build."
            />
            <div className="about-grid">
              <div className="about-copy">
                <p>
                  I’m <strong>Rudraksh</strong> — an AI engineer, full stack developer, and creative
                  builder.
                </p>
                <p>
                  <strong>Intelligence. Interfaces. Ideas.</strong>
                  <br />
                  Three worlds, one endlessly curious mind.
                </p>
                <p className="text-sm">
                  The rest of my story is still to come. This space is reserved for my background,
                  what drives me, and the things I’m building next.
                </p>
                <Button variant="quiet" className="px-0 text-[11px] mt-2" asChild>
                  <a href="#contact">
                    Let’s create something meaningful <ArrowUpRight />
                  </a>
                </Button>
              </div>
              <div className="identity-panel glass">
                <div className="panel-header">
                  <span className="mono text-primary">Human.config</span>
                  <Code2 size={16} className="text-muted-foreground" />
                </div>
                <div className="identity-row">
                  <span>Name</span>
                  <b>Rudraksh</b>
                </div>
                <div className="identity-row">
                  <span>Focus</span>
                  <b>AI × Full Stack</b>
                </div>
                <div className="identity-row">
                  <span>University</span>
                  <b>{education.institution}</b>
                </div>
                <div className="identity-row">
                  <span>Degree</span>
                  <b>{education.degree}</b>
                </div>
                <div className="identity-row">
                  <span>Branch</span>
                  <b>{education.branch}</b>
                </div>
                <div className="identity-row">
                  <span>Year</span>
                  <b>{educationStatus}</b>
                </div>
                <div className="identity-row">
                  <span>Mindset</span>
                  <b>Creative builder</b>
                </div>
                <div className="identity-row">
                  <span>Location</span>
                  <b className="text-muted-foreground">To be added</b>
                </div>
                <div className="stats">
                  <div>
                    <b>AI</b>
                    <span>Intelligence</span>
                  </div>
                  <div>
                    <b>&lt;/&gt;</b>
                    <span>Engineering</span>
                  </div>
                  <div>
                    <b>∞</b>
                    <span>Possibilities</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
        <div className="section-rule" />

        <section id="skills" className="section page-width">
          <Reveal>
            <SectionHeading
              number="02"
              label="The technology constellation"
              title="My creative"
              script="universe."
              intro="Different worlds. Connected by one purpose: building something that matters."
            />
            <div className="planet-grid" role="tablist" aria-label="Technology disciplines">
              {skillGroups.map((item, i) => {
                const Icon = skillIcons[i];
                return (
                  <div key={item.name}>
                    <Button
                      variant="quiet"
                      className="planet-control w-full"
                      role="tab"
                      id={`skill-${i}`}
                      aria-controls="skill-panel"
                      aria-selected={skill === i}
                      data-active={skill === i}
                      onClick={() => setSkill(i)}
                      onMouseEnter={() => setSkill(i)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                          event.preventDefault();
                          const next =
                            (i + (event.key === "ArrowRight" ? 1 : -1) + skillGroups.length) %
                            skillGroups.length;
                          setSkill(next);
                          document.getElementById(`skill-${next}`)?.focus();
                        }
                      }}
                    >
                      <motion.span
                        className="planet"
                        animate={reduced ? {} : { y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 5 + i, delay: i * 0.4 }}
                      >
                        {Icon && <Icon />}
                      </motion.span>
                      <span className="planet-label">{item.name}</span>
                    </Button>
                  </div>
                );
              })}
            </div>
            <div
              className="skill-detail"
              id="skill-panel"
              role="tabpanel"
              aria-labelledby={`skill-${skill}`}
            >
              <div>
                <h3>{skillGroups[skill]?.name}</h3>
                <p>
                  {skillGroups[skill]?.description}
                  <br />
                  Experience and project details awaiting your skill list.
                </p>
              </div>
              <div className="chips">
                {skillGroups[skill]?.tech.map((tech) => (
                  <span className="chip" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <p className="pending-notice">
              <CircleHelp size={12} /> Illustrative technology constellation · actual skills to be
              confirmed.
            </p>
          </Reveal>
        </section>
        <div className="section-rule" />

        <section id="projects" className="section page-width">
          <Reveal>
            <SectionHeading
              number="03"
              label="Selected explorations"
              title="Ideas brought to"
              script="life."
              intro="Intelligent systems. Thoughtful experiences. A few worlds waiting to be explored."
            />
          </Reveal>
          <div className="project-grid">
            {projects.map((item, i) => (
              <Tilt key={item.id} className={`project-card ${i === 0 ? "featured" : ""}`}>
                <div className="project-image">
                  <motion.img
                    src={item.image}
                    alt={
                      i === 0
                        ? "Luminous neural connections in a glass brain"
                        : i === 1
                          ? "A sculptural glass orbital infinity ribbon"
                          : "An interconnected crystalline modular system"
                    }
                    loading="lazy"
                    width={1280}
                    height={720}
                    whileHover={reduced ? {} : { scale: 1.04 }}
                    transition={{ duration: 0.8 }}
                  />
                  <span className="project-tag mono">
                    {i === 0 ? "✦ Featured concept" : "Preview concept"}
                  </span>
                </div>
                <div className="project-info">
                  <div className="project-number mono">
                    {item.id} / {item.category}
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="chips">
                    {item.tech.map((tech) => (
                      <span className="chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-footer">
                    <Button
                      variant="quiet"
                      className="p-0 h-7 text-[10px]"
                      onClick={() => setSelectedProject(i)}
                    >
                      Explore concept <ArrowUpRight className="size-3" />
                    </Button>
                    <div className="icon-links">
                      <Button
                        variant="quiet"
                        size="icon"
                        className="size-7"
                        onClick={() => setSelectedProject(i)}
                        aria-label={`GitHub information for ${item.name}`}
                        title="GitHub link pending"
                      >
                        <Github className="size-3.5" />
                      </Button>
                      <Button
                        variant="quiet"
                        size="icon"
                        className="size-7"
                        onClick={() => setSelectedProject(i)}
                        aria-label={`Live demo information for ${item.name}`}
                        title="Live demo link pending"
                      >
                        <ExternalLink className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
          <p className="pending-notice">
            <Orbit size={13} /> Concept previews, not completed personal projects. Your real work
            and links belong here.
          </p>
        </section>
        <div className="section-rule" />

        <section id="experience" className="section page-width">
          <Reveal>
            <SectionHeading
              number="04"
              label="My flight path"
              title="Always moving"
              script="forward."
              intro="Every chapter shapes the next. The journey matters as much as the destination."
            />
          </Reveal>
          <div className="timeline">
            <Reveal className="timeline-item">
              <div className="timeline-date mono">01 / PROFESSIONAL ORBIT</div>
              <div className="timeline-body">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Code2 size={17} />
                  <span className="mono">Experience</span>
                </div>
                <h3>The next chapter</h3>
                <p>
                  Company, role, dates, and contributions will appear here once your experience
                  details are added.
                </p>
                <span className="chip">Details forthcoming</span>
              </div>
            </Reveal>
            <Reveal className="timeline-item">
              <div className="timeline-date mono">02 / THE FOUNDATION</div>
              <div className="timeline-body">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <GraduationCap size={18} />
                  <span className="mono">Education</span>
                </div>
                <h3>{education.institution}</h3>
                <p>
                  {education.degree} in {education.fieldOfStudy} — the academic foundation where
                  curiosity found its discipline.
                </p>
                <div className="chips">
                  <span className="chip">{education.branch}</span>
                  <span className="chip">{educationStatus}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <div className="section-rule" />

        <section id="certifications" className="section page-width">
          <Reveal>
            <SectionHeading
              number="05"
              label="Milestones along the way"
              title="Learning without"
              script="limits."
            />
            <div className="cert-grid">
              {[
                {
                  title: "Certifications",
                  icon: ShieldCheck,
                  text: "Verified courses and professional certifications. Your credentials will appear here.",
                },
                {
                  title: "Achievements",
                  icon: Award,
                  text: "The breakthroughs, recognitions, and small victories that deserve their own constellation.",
                },
                {
                  title: "Beyond the code",
                  icon: Sparkles,
                  text: "Open-source contributions, community work, and the projects driven by pure curiosity.",
                },
              ].map((item) => (
                <Tilt key={item.title} className="cert-card glass">
                  <item.icon />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="mono text-muted-foreground text-[8px] mt-5">
                    Awaiting your details <span className="text-primary">↗</span>
                  </div>
                </Tilt>
              ))}
            </div>
          </Reveal>
        </section>
        <div className="section-rule" />

        <section id="contact" className="section page-width">
          <Reveal>
            <div className="contact-grid">
              <div>
                <div className="section-index mono">06 / Mission control</div>
                <h2 className="contact-title">
                  Great things start
                  <br />
                  with a <span className="script">hello.</span>
                </h2>
                <p className="contact-copy mt-6">
                  Have an ambitious idea, an interesting opportunity, or just a little curiosity?
                  <br />
                  Let’s find out what we can build together.
                </p>
                <div className="contact-status mono">
                  <span className="signal-dot" /> GOOD CONVERSATIONS. NEW POSSIBILITIES.
                </div>
                <div className="flex gap-2 mt-7">
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={() => openSocial("github")}
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <Github />
                  </Button>
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={() => openSocial("linkedin")}
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Linkedin />
                  </Button>
                </div>
              </div>
              <form className="contact-form glass" onSubmit={onContact}>
                <div className="flex items-center justify-between mono text-primary mb-1">
                  <span>Open a transmission</span>
                  <Send size={14} />
                </div>
                <label htmlFor="contact-name">
                  Your name
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="What should I call you?"
                    required
                    maxLength={100}
                  />
                </label>
                <label htmlFor="contact-email">
                  Email address
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@youruniverse.com"
                    required
                    maxLength={254}
                  />
                </label>
                <label htmlFor="contact-message">
                  Your message
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell me what’s on your mind…"
                    required
                    maxLength={5000}
                  />
                </label>
                <Button variant="cosmic" type="submit" className="h-11 text-[11px] justify-between">
                  Launch transmission{" "}
                  <motion.span
                    animate={
                      launch && !reduced
                        ? { x: [0, 10, 100], y: [0, -5, -50], opacity: [1, 1, 0] }
                        : {}
                    }
                  >
                    {launch ? <Check size={16} /> : <Rocket size={16} />}
                  </motion.span>
                </Button>
                <p
                  className="text-[10px] leading-relaxed text-muted-foreground m-0"
                  role="status"
                  aria-live="polite"
                >
                  {formStatus ||
                    "Contact is awaiting Rudraksh’s email. No messages are stored or sent yet."}
                </p>
              </form>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer page-width">
        <a href="#home" className="footer-name" aria-label="Return to the top">
          Rudraksh<span className="text-foreground">.</span>
        </a>
        <p>
          Built with curiosity. A little code. And a lot of stardust.
          <br />
          <span className="footer-affiliation">
            {education.institution} · {educationLabel} · {educationStatus}
          </span>
        </p>
        <Button variant="quiet" className="text-[9px]" asChild>
          <a href="#home">
            BACK TO ORBIT <ArrowUpRight size={13} />
          </a>
        </Button>
      </footer>

      <Dialog
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
      >
        <DialogContent className="max-w-xl bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal">{project?.name}</DialogTitle>
            <DialogDescription>
              This is an illustrative concept, awaiting your actual project details.
            </DialogDescription>
          </DialogHeader>
          {project && (
            <>
              <img
                src={project.image}
                alt={`${project.name} concept artwork`}
                width={1280}
                height={720}
                className="dialog-art"
              />
              <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
              <div className="chips">
                {project.tech.map((tech) => (
                  <span className="chip" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-3">
                <Button variant="glass" disabled>
                  <Github /> GitHub pending
                </Button>
                <Button variant="glass" disabled>
                  <ExternalLink /> Demo pending
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={notice !== null}
        onOpenChange={(open) => {
          if (!open) setNotice(null);
        }}
      >
        <DialogContent className="bg-background border-border max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {notice === "resume" ? "Résumé coming soon" : "A connection in the making"}
            </DialogTitle>
            <DialogDescription>
              {notice === "resume"
                ? "Rudraksh’s résumé hasn’t been added yet. A real PDF or résumé link is needed to enable the download."
                : "Rudraksh’s social profile links haven’t been added yet. Check back once they’re connected."}
            </DialogDescription>
          </DialogHeader>
          <Button variant="glass" onClick={() => setNotice(null)}>
            Back to the universe <ChevronRight />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
