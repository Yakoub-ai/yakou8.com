import { Github, ExternalLink, ArrowRight, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Project {
  title: string;
  description: string;
  link: string;
  tag: string;
}

const tagColors: Record<string, string> = {
  "AI Agent": "bg-primary/20 text-primary border-primary/30",
  "Game": "bg-accent/20 text-accent border-accent/30",
  "Tool": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "Best Practice": "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to fetch projects", err));
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo_Y_nobg.png" alt="YAKOUB" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-foreground">YAKOUB</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/Yakoub-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>

          <button
            className="text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                className="block py-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/Yakoub-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(240_100%_77%/0.06)_0%,transparent_50%),radial-gradient(ellipse_at_70%_50%,hsl(297_98%_76%/0.04)_0%,transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
            <img
            src="/logo_with_text_nobg.png"
            alt="YAKOUB Logo"
            className="mx-auto mb-8 h-48 w-auto sm:h-64"
          />
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Building tools, games & solutions
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              that bring joy and optimization
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
            A playground for our experimental ideas and projects, built with a focus on innovation and joy.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#projects">
              <Button size="lg" className="gap-2 rounded-xl font-semibold">
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="mailto:georgeyakoub@gmail.com">
              <Button variant="outline" size="lg" className="gap-2 rounded-xl border-border font-semibold">
                Contact Us
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Projects
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              AI agents, games, tools and best practices.
            </p>
          </motion.div>

          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">Projects coming soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <motion.a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(240_100%_77%/0.2)]"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <Badge
                      variant="outline"
                      className={`text-xs ${tagColors[project.tag] || "bg-secondary text-muted-foreground border-border"}`}
                    >
                      {project.tag}
                    </Badge>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="rounded-2xl border border-border bg-card p-8 sm:p-12"
          >
            <h2 className="mb-6 text-3xl font-bold text-foreground">About YAKOUB</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                YAKOUB is a team focused on building tools and projects at the intersection
                of artificial intelligence and human joy. From autonomous agents to
                entertainment solutions, our goal is to bring optimization and delight to life.
              </p>
              <p>
                Every project we build follows our commitment to innovation — clean code, 
                joyful experiences, and engineering excellence.
              </p>
            </div>
            <div className="mt-8">
              <a href="https://github.com/Yakoub-ai" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 rounded-xl border-border font-semibold">
                  <Github className="h-4 w-4" />
                  Follow on GitHub
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src="/logo_Y_nobg.png" alt="YAKOUB" className="h-6 w-6" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} YAKOUB Team. All rights reserved.
            </span>
          </div>
          <a
            href="https://github.com/Yakoub-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
