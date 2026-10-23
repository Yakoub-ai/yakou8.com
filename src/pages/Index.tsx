import { useEffect, useState } from "react";
import AsciiField from "@/components/AsciiField";
import StackMap from "@/components/StackMap";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import "./manual.css";

interface Project {
  title: string;
  description: string;
  link: string;
  tag: string;
}

const GITHUB_URL = "https://github.com/Yakoub-ai";
const EMAIL = "george@yakou8.com";

const chapters = [
  { id: "practice", number: "01", label: "Practice" },
  { id: "instruments", number: "02", label: "Instruments" },
  { id: "work", number: "03", label: "Work" },
  { id: "open", number: "04", label: "Open" },
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
    short: "DATA & AI",
    items: [
      "Python",
      "SQL",
      "Pandas",
      "Databricks",
      "MLflow",
      "Predictive Models",
      "Marketing Mix Modeling",
      "OpenAI API",
      "Anthropic API",
      "Claude Code",
      "MCP",
    ],
  },
  {
    group: "Build & Ship",
    short: "BUILD & SHIP",
    items: ["React", "TypeScript", "Phaser", "Flutter", "Docker", "Vercel"],
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

const pad = (n: number) => String(n).padStart(2, "0");

const useActiveChapter = () => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
};

// Draws in from the left the first time it enters the viewport.
const Rule = () => {
  const [ref, drawn] = useInViewOnce<HTMLDivElement>();
  return <div ref={ref} className="rule" data-drawn={drawn} aria-hidden />;
};

const Chapter = ({
  id,
  number,
  kicker,
  title,
  children,
}: {
  id: string;
  number: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="chapter" aria-labelledby={`${id}-title`}>
    <Rule />
    <p className="label kicker">{kicker}</p>
    <p className="chapter-number" aria-hidden>
      {number}
    </p>
    <h2 id={`${id}-title`}>{title}</h2>
    {children}
  </section>
);

const Index = () => {
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

  const visible = projects
    .map((p) => ({ ...p, url: typeof p?.link === "string" ? parseLink(p.link) : null }))
    .filter((p): p is Project & { url: URL } => p.url !== null)
    .map((p, i) => ({ ...p, n: i + 1, tag: typeof p.tag === "string" ? p.tag : "" }));

  const tagCounts = new Map<string, number>();
  visible.forEach((p) => p.tag && tagCounts.set(p.tag, (tagCounts.get(p.tag) ?? 0) + 1));
  const tags = Array.from(tagCounts);
  const shown = activeTag === "All" ? visible : visible.filter((p) => p.tag === activeTag);

  const active = useActiveChapter();

  return (
    <div className="manual">
      <AsciiField />
      <div className="content">
      <a href="#main" className="skip mono">
        Skip to content
      </a>

      <header className="column header">
        <a href="#top" className="wordmark" aria-label="yakou8.com, YAKOUB">
          <span className="label">yakou8.com</span>
          <span className="wordmark-name">YAKOUB</span>
        </a>
        <nav className="header-index" aria-label="Sections">
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} aria-label={`${c.number} ${c.label}`}>
              {c.number}
            </a>
          ))}
        </nav>
      </header>

      <nav className="side-index" aria-label="Sections">
        {chapters.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-label={`${c.number} ${c.label}`}
            aria-current={active === c.id ? "location" : undefined}
          >
            {c.number}
          </a>
        ))}
      </nav>

      <main id="main" className="column">
        <section id="top" className="mast">
          <h1>
            AI-driven developer<span className="accent">.</span>
          </h1>
          <p className="lede measure">Building at the intersection of marketing technology, data science, and AI.</p>
          <p>Turning raw data into decisions. Turning decisions into systems.</p>        </section>

        <Chapter id="practice" number="01" kicker="01 — Practice" title="What I build.">
          <p className="chapter-intro measure">
            I build data-driven systems at the edge of marketing automation, machine learning, and AI tooling —
            professionally and as a builder.
          </p>
          <ol className="rows">
            {roles.map((role, i) => (
              <li key={role.title} className="row">
                <span className="row-index">{pad(i + 1)}</span>
                <div>
                  <h3>{role.title}</h3>
                  <p className="muted">{role.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter id="instruments" number="02" kicker="02 — Instruments" title="What I use.">
          <p className="chapter-intro measure">The stack behind the systems. No extras for show.</p>
          <StackMap groups={stack} />
        </Chapter>

        <Chapter
          id="work"
          number="03"
          kicker={`03 — Work · Index ${loading ? "--" : pad(visible.length)}`}
          title="Things I've shipped."
        >
          <p className="chapter-intro measure">Public builds, in the order they are published.</p>
          {loading ? (
            <p className="mono muted" style={{ fontSize: 13 }}>
              Reading index.
            </p>
          ) : visible.length === 0 ? (
            <p className="mono muted" style={{ fontSize: 13 }}>
              No public work yet.
            </p>
          ) : (
            <>
              {tags.length > 1 && (
                <div className="filters" role="group" aria-label="Filter projects by tag">
                  {[["All", visible.length] as [string, number], ...tags].map(([tag, count]) => (
                    <button
                      key={tag}
                      type="button"
                      className="pill"
                      aria-pressed={activeTag === tag}
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                      <span className="pill-count">{pad(count)}</span>
                    </button>
                  ))}
                </div>
              )}
              <ul className="cards">
                {shown.map((project) => (
                  <li key={`${project.url.href}-${project.n}`}>
                    <a className="card" href={project.url.href} target="_blank" rel="noopener noreferrer">
                      <span className="card-top label">
                        <span>{pad(project.n)}</span>
                        {project.tag && <span className="card-tag">{project.tag}</span>}
                      </span>
                      <h3>
                        {String(project.title ?? "")}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </h3>
                      <span className="card-body">{String(project.description ?? "")}</span>
                      <span className="card-url">
                        {`${project.url.hostname}${project.url.pathname}`.replace(/\/$/, "")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Chapter>

        <Chapter id="open" number="04" kicker="04 — Open" title="Let's build something.">
          <p className="chapter-intro measure">
            I'm interested in projects involving data-driven decision making, AI product development, and anything
            that needs both technical depth and strategic thinking. Active projects and experiments live under{" "}
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              Yakoub-ai
            </a>
            .
          </p>
          <dl className="rows">
            <div className="row">
              <dt className="label">Mail</dt>
              <dd className="mono">
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </dd>
            </div>
            <div className="row">
              <dt className="label">Code</dt>
              <dd className="mono">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  github.com/Yakoub-ai
                </a>
              </dd>
            </div>
          </dl>
        </Chapter>
      </main>

      <footer className="column">
        <div className="footer label">
          <span>Built with curiosity. Driven by data.</span>
          <span>© {new Date().getFullYear()} YAKOUB</span>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;
