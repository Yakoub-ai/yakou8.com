import { Github, ArrowRight, ArrowUpRight, Globe, Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, MotionConfig } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface Project {
  title: string;
  description: string;
  link: string;
  tag: string;
}

const GITHUB_URL = "https://github.com/Yakoub-ai";
const EMAIL = "george@yakou8.com";

const tagColors: Record<string, string> = {
  "AI Agent": "text-primary border-primary/40 bg-primary/10",
  "Game": "text-accent border-accent/40 bg-accent/10",
  "Tool": "text-sky-400 border-sky-500/40 bg-sky-500/10",
  "Best Practice": "text-violet-400 border-violet-500/40 bg-violet-500/10",
  "Platform": "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
};

const navLinks = [
  { href: "#about", label: "about" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

const roles = [
  {
    title: "Tech Lead & MarTech Engineer",
    body: "Architecting AI/ML platforms and marketing automation systems in production.",
  },
  {
    title: "Data-first mindset",
    body: "From raw signals to predictive models — I care about what the numbers are actually saying.",
  },
  {
    title: "AI tooling builder",
    body: "Autonomous agents, LLM pipelines and developer productivity tools.",
  },
];

const stack = [
  {
    group: "Data & AI",
    items: ["Python", "PyMC", "scikit-learn", "Pandas", "Databricks", "MLflow", "BigQuery", "SQL", "OpenAI API", "Anthropic API", "MCP"],
  },
  {
    group: "Cloud & Infrastructure",
    items: ["Azure", "Azure DevOps", "Docker"],
  },
];

// projects.json is editable via the admin CMS; only render http(s) links.
const parseLink = (link: string) => {
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const SectionHeader = ({ index, label, title }: { index: string; label: string; title: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={fadeUp}
    custom={0}
    className="mb-12"
  >
    <p className="mb-3 font-mono text-sm text-primary">
      <span className="text-muted-foreground">//</span> {index} — {label}
    </p>
    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
  </motion.div>
);

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch projects", err))
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.tag)))], [projects]);
  const visibleProjects = activeTag === "All" ? projects : projects.filter((p) => p.tag === activeTag);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>

        {/* Navbar */}
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <a href="#top" className="flex items-center gap-2.5">
              <img src="/logo_Y_nobg.png" alt="" className="h-7 w-7" />
              <span className="font-mono text-sm font-medium text-foreground">
                yakou8<span className="text-primary">.com</span>
              </span>
            </a>

            <div className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="text-primary/60">./</span>
                  {link.label}
                </a>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Github className="h-4 w-4" />
                Yakoub-ai
              </a>
            </div>

            <button
              className="text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-border bg-background px-6 py-4 md:hidden">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 font-mono text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-primary/60">./</span>
                  {link.label}
                </a>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary"
              >
                <Github className="h-4 w-4" />
                Yakoub-ai
              </a>
            </div>
          )}
        </nav>

        <main id="main">
          {/* Hero */}
          <section id="top" className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-40">
            <div className="bg-grid pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,hsl(240_100%_77%/0.08)_0%,transparent_50%),radial-gradient(ellipse_at_80%_60%,hsl(297_98%_76%/0.05)_0%,transparent_50%)]" />

            <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p className="mb-6 font-mono text-sm text-muted-foreground">
                  <span className="text-primary">~/yakoub</span> $ whoami
                  <span className="cursor-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-primary" aria-hidden />
                </p>
                <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  AI-Driven <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Developer</span>
                </h1>
                <p className="mb-4 max-w-xl text-lg text-foreground/90">
                  Building at the intersection of marketing technology, data science, and AI.
                </p>
                <p className="mb-10 max-w-xl font-mono text-sm text-muted-foreground">
                  Turning raw data into decisions. Turning decisions into systems.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="gap-2 rounded-md font-mono">
                    <a href="#projects">
                      view projects
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 rounded-md border-border font-mono">
                    <a href={`mailto:${EMAIL}`}>
                      <Mail className="h-4 w-4" />
                      get in touch
                    </a>
                  </Button>
                </div>
              </motion.div>

              {/* Terminal card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_0_60px_-20px_hsl(240_100%_77%/0.25)]"
              >
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <span className="h-3 w-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">profile.json</span>
                </div>
                <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
                  <code>
                    <span className="text-muted-foreground">{"{"}</span>
                    {"\n  "}<span className="text-primary">"role"</span>: <span className="text-emerald-400">"Tech Lead & MarTech Engineer"</span>,
                    {"\n  "}<span className="text-primary">"focus"</span>: [
                    {"\n    "}<span className="text-emerald-400">"marketing automation"</span>,
                    {"\n    "}<span className="text-emerald-400">"machine learning"</span>,
                    {"\n    "}<span className="text-emerald-400">"AI tooling"</span>
                    {"\n  "}],
                    {"\n  "}<span className="text-primary">"org"</span>: <span className="text-emerald-400">"Yakoub-ai"</span>,
                    {"\n  "}<span className="text-primary">"motto"</span>: <span className="text-emerald-400">"Built with curiosity. Driven by data."</span>
                    {"\n"}<span className="text-muted-foreground">{"}"}</span>
                  </code>
                </pre>
              </motion.div>
            </div>
          </section>

          {/* About */}
          <section id="about" className="scroll-mt-20 border-t border-border/60 px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <SectionHeader index="01" label="about" title="What I build" />

              <p className="mb-12 max-w-3xl text-lg text-muted-foreground">
                I build data-driven systems at the edge of <span className="text-foreground">marketing automation</span>,{" "}
                <span className="text-foreground">machine learning</span>, and <span className="text-foreground">AI tooling</span> —
                professionally and as a builder.
              </p>

              <div className="mb-16 grid gap-4 md:grid-cols-3">
                {roles.map((role, i) => (
                  <motion.div
                    key={role.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeUp}
                    custom={i}
                    className="rounded-lg border border-border bg-card p-6"
                  >
                    <p className="mb-3 font-mono text-xs text-primary">0{i + 1}</p>
                    <h3 className="mb-2 font-semibold text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.body}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                {stack.map((group) => (
                  <div key={group.group} className="grid gap-3 md:grid-cols-[220px_1fr]">
                    <p className="font-mono text-sm text-muted-foreground">
                      <span className="text-primary">#</span> {group.group}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="scroll-mt-20 border-t border-border/60 px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <SectionHeader index="02" label="projects" title="Things I've shipped" />

              {projects.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by type">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      aria-pressed={activeTag === tag}
                      className={`rounded-md border px-3 py-1 font-mono text-xs transition-colors ${
                        activeTag === tag
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <p className="font-mono text-sm text-muted-foreground">loading projects…</p>
              ) : projects.length === 0 ? (
                <p className="font-mono text-sm text-muted-foreground">Projects coming soon.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleProjects.map((project, i) => {
                    const url = parseLink(project.link);
                    const isRepo = url?.hostname === "github.com";
                    const display = url ? `${url.hostname}${url.pathname}`.replace(/\/$/, "") : "";
                    const content = (
                      <>
                        <div className="mb-4 flex items-center justify-between">
                          <span
                            className={`rounded border px-2 py-0.5 font-mono text-[11px] ${
                              tagColors[project.tag] || "border-border bg-secondary text-muted-foreground"
                            }`}
                          >
                            {project.tag}
                          </span>
                          {url && (
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                          )}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                          {project.title}
                        </h3>
                        <p className="mb-6 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                        {url && (
                          <p className="mt-auto flex items-center gap-2 truncate border-t border-border/60 pt-4 font-mono text-xs text-muted-foreground">
                            {isRepo ? <Github className="h-3.5 w-3.5 shrink-0" /> : <Globe className="h-3.5 w-3.5 shrink-0" />}
                            <span className="truncate">{display}</span>
                          </p>
                        )}
                      </>
                    );
                    const className =
                      "group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-12px_hsl(240_100%_77%/0.3)]";

                    return (
                      <motion.div
                        key={`${activeTag}-${project.title}-${i}`}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={i}
                      >
                        {url ? (
                          <a href={url.href} target="_blank" rel="noopener noreferrer" className={className}>
                            {content}
                          </a>
                        ) : (
                          <div className={className}>{content}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="scroll-mt-20 border-t border-border/60 px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <SectionHeader index="03" label="connect" title="Let's build something" />
              <p className="mb-8 max-w-2xl text-muted-foreground">
                I'm interested in projects involving <span className="text-foreground">data-driven decision making</span>,{" "}
                <span className="text-foreground">AI product development</span>, and anything that needs both technical depth
                and strategic thinking. Active projects and experiments live under{" "}
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Yakoub-ai
                </a>
                .
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2 rounded-md font-mono">
                  <a href={`mailto:${EMAIL}`}>
                    <Mail className="h-4 w-4" />
                    {EMAIL}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 rounded-md border-border font-mono">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    github.com/Yakoub-ai
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-xs text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-3">
              <img src="/logo_Y_nobg.png" alt="" className="h-5 w-5" />
              <span>© {new Date().getFullYear()} YAKOUB</span>
            </div>
            <span>Built with curiosity. Driven by data.</span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
};

export default Index;
