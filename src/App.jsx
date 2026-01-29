import { useEffect, useRef, useState } from "react";
import { translations } from "./data/translations";

const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/api/cerebras";
const CHAT_VERSION = import.meta.env.VITE_CHAT_VERSION || "AI";
const THEME_STORAGE_KEY = "solvix-theme";
const LANG_STORAGE_KEY = "solvix-lang";

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialLang = () => {
  const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
  if (storedLang) {
    return storedLang;
  }
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "id";
};

const App = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [lang, setLang] = useState(getInitialLang);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatMessagesRef = useRef(null);
  const chatHistoryRef = useRef([]);
  const userSetThemeRef = useRef(localStorage.getItem(THEME_STORAGE_KEY) !== null);

  const t = (key) => translations[lang]?.[key] || translations.id[key] || key;

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang;
    document.title = t("meta.title");
  }, [lang]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", navOpen);
  }, [navOpen]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => {
      if (!userSetThemeRef.current) {
        setTheme(event.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["home", "about", "projects", "skills", "experience", "contact"];
      let currentId = sectionIds[0];
      const offset = 140;

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && window.scrollY + offset >= section.offsetTop) {
          currentId = id;
        }
      });

      setActiveSection(currentId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (chatOpen && chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatOpen, messages]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    userSetThemeRef.current = true;
  };

  const changeLang = (nextLang) => {
    const normalized = nextLang === "en" ? "en" : "id";
    setLang(normalized);
    localStorage.setItem(LANG_STORAGE_KEY, normalized);
  };

  const buildSiteContext = () => {
    const sections = Array.from(document.querySelectorAll("[data-chat-context]"));
    if (!sections.length) {
      return "";
    }

    const parts = sections
      .map((section) => {
        const label = section.dataset.chatContext || section.id || "Section";
        const text = section.textContent?.replace(/\s+/g, " ").trim() || "";
        if (!text) {
          return "";
        }
        return `${label}: ${text}`;
      })
      .filter(Boolean);

    const joined = parts.join("\n");
    const maxLength = 2400;
    return joined.length > maxLength ? `${joined.slice(0, maxLength)}…` : joined;
  };

  const buildSystemMessage = () => {
    const siteContext = buildSiteContext();
    const contextLabel =
      lang === "en" ? "Website content summary:" : "Ringkasan konten website:";

    if (lang === "en") {
      return {
        role: "system",
        content: [
          "You are a helpful assistant for Solvix Studio.",
          "Always respond in English.",
          "Use the website content summary below to answer questions about this site.",
          "If a detail is not in the summary, say you don't have that information.",
          siteContext ? `${contextLabel}\n${siteContext}` : ""
        ]
          .filter(Boolean)
          .join("\n\n")
      };
    }

    return {
      role: "system",
      content: [
        "Anda adalah asisten yang membantu untuk Solvix Studio.",
        "Selalu balas dalam Bahasa Indonesia.",
        "Gunakan ringkasan konten website di bawah ini untuk menjawab pertanyaan tentang situs ini.",
        "Jika detail tidak ada di ringkasan, sampaikan bahwa informasinya belum tersedia.",
        siteContext ? `${contextLabel}\n${siteContext}` : ""
      ]
        .filter(Boolean)
        .join("\n\n")
    };
  };

  const requestCerebras = async (history) => {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: "v1",
        messages: [buildSystemMessage(), ...history]
      })
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      const message = data?.error || `Server error (${response.status})`;
      throw new Error(message);
    }

    return data.reply || "";
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) {
      return;
    }

    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    chatHistoryRef.current.push({ role: "user", content: text });

    setMessages((prev) => [...prev, { role: "bot", content: t("chat.thinking"), pending: true }]);

    try {
      const reply = await requestCerebras(chatHistoryRef.current);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "bot", content: reply || t("chat.noReply") };
        return next;
      });
      chatHistoryRef.current.push({ role: "assistant", content: reply });
    } catch (error) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "bot",
          content: error?.message || t("chat.offline")
        };
        return next;
      });
    }
  };

  const navItems = [
    { href: "#home", key: "nav.home", id: "home" },
    { href: "#about", key: "nav.about", id: "about" },
    { href: "#projects", key: "nav.projects", id: "projects" },
    { href: "#skills", key: "nav.skills", id: "skills" },
    { href: "#experience", key: "nav.experience", id: "experience" },
    { href: "#contact", key: "nav.contact", id: "contact" }
  ];

  const skillChips = [
    "Figma",
    "Adobe XD",
    "Illustrator",
    "Photoshop",
    "After Effects",
    "Framer",
    "Notion",
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "WordPress",
    "Webflow",
    "Tailwind CSS",
    "GSAP",
    "Git",
    "GitHub",
    "Postman",
    "Docker",
    "Vercel",
    "Netlify",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "Supabase"
  ];

  return (
    <>
      <div className="background">
        <div className="grid"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="#home">
            <img className="logo-mark" src="/assets/img/logo2.png" alt="Solvix Studio" />
            <span className="logo-text">Solvix Studio</span>
          </a>
          <nav className="nav" id="site-nav" data-chat-context="Navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setNavOpen(false)}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="theme-toggle"
              id="theme-toggle"
              type="button"
              aria-label={t("aria.theme")}
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              <svg
                className="icon icon-sun"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
              </svg>
              <svg
                className="icon icon-moon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 14.5A9 9 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"></path>
              </svg>
            </button>
            <div
              className="lang-toggle"
              id="lang-toggle"
              role="group"
              aria-label={t("aria.lang")}
              data-lang={lang}
            >
              <svg
                className="lang-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>
              </svg>
              <button
                className={`lang-btn ${lang === "id" ? "active" : ""}`}
                type="button"
                data-lang="id"
                aria-pressed={lang === "id"}
                onClick={() => changeLang("id")}
              >
                IN
              </button>
              <button
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
                type="button"
                data-lang="en"
                aria-pressed={lang === "en"}
                onClick={() => changeLang("en")}
              >
                EN
              </button>
            </div>
            <button
              className="nav-toggle"
              id="nav-toggle"
              type="button"
              aria-expanded={navOpen}
              aria-controls="site-nav"
              onClick={() => setNavOpen((prev) => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="section hero" id="home" data-chat-context="Home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1 className="reveal" style={{ "--delay": "0.2s" }}>
                {t("hero.title")}
              </h1>
              <p className="lead reveal" style={{ "--delay": "0.3s" }}>
                {t("hero.lead")}
              </p>
              <div className="hero-actions reveal" style={{ "--delay": "0.4s" }}>
                <a className="btn primary" href="#projects">
                  {t("hero.cta.primary")}
                </a>
                <a className="btn ghost" href="#contact">
                  {t("hero.cta.secondary")}
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-card reveal" style={{ "--delay": "0.5s" }}>
                  <h3>7+</h3>
                  <p>{t("hero.stats.products")}</p>
                </div>
                <div className="stat-card reveal" style={{ "--delay": "0.55s" }}>
                  <h3>4</h3>
                  <p>{t("hero.stats.brands")}</p>
                </div>
                <div className="stat-card reveal" style={{ "--delay": "0.6s" }}>
                  <h3>2</h3>
                  <p>{t("hero.stats.hackathons")}</p>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="holo-card reveal" style={{ "--delay": "0.4s" }}>
                <div className="holo-header">
                  <span className="pulse-dot"></span>
                  <span>{t("hero.holo.label")}</span>
                  <span className="status">{t("hero.holo.status")}</span>
                </div>
                <div className="holo-content">
                  <div className="signal">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <h4>{t("hero.holo.title")}</h4>
                  <p>{t("hero.holo.desc")}</p>
                  <div className="holo-tags">
                    <span>{t("hero.holo.tag1")}</span>
                    <span>{t("hero.holo.tag2")}</span>
                    <span>{t("hero.holo.tag3")}</span>
                    <span>{t("hero.holo.tag4")}</span>
                    <span>{t("hero.holo.tag5")}</span>
                    <span>{t("hero.holo.tag6")}</span>
                    <span>{t("hero.holo.tag7")}</span>
                    <span>{t("hero.holo.tag8")}</span>
                    <span>{t("hero.holo.tag9")}</span>
                    <span>{t("hero.holo.tag10")}</span>
                    <span>{t("hero.holo.tag11")}</span>
                  </div>
                </div>
                <div className="orbit"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section about" id="about" data-chat-context="About">
          <div className="container about-grid">
            <div className="about-copy">
              <p className="eyebrow reveal" style={{ "--delay": "0.1s" }}>
                {t("about.eyebrow")}
              </p>
              <h2 className="reveal" style={{ "--delay": "0.2s" }}>
                {t("about.title")}
              </h2>
              <p className="reveal" style={{ "--delay": "0.3s" }}>
                {t("about.p1")}
              </p>
              <p className="reveal" style={{ "--delay": "0.35s" }}>
                {t("about.p2")}
              </p>
            </div>
            <div className="about-panels">
              <div className="panel-card reveal" style={{ "--delay": "0.3s" }}>
                <h3>{t("about.panel1.title")}</h3>
                <ul>
                  <li>{t("about.panel1.item1")}</li>
                  <li>{t("about.panel1.item2")}</li>
                  <li>{t("about.panel1.item3")}</li>
                </ul>
              </div>
              <div className="panel-card reveal" style={{ "--delay": "0.4s" }}>
                <h3>{t("about.panel2.title")}</h3>
                <ul>
                  <li>{t("about.panel2.item1")}</li>
                  <li>{t("about.panel2.item2")}</li>
                  <li>{t("about.panel2.item3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section projects" id="projects" data-chat-context="Projects">
          <div className="container">
            <div className="section-title">
              <p className="eyebrow reveal" style={{ "--delay": "0.1s" }}>
                {t("projects.eyebrow")}
              </p>
              <h2 className="reveal" style={{ "--delay": "0.2s" }}>
                {t("projects.title")}
              </h2>
            </div>
            <div className="project-grid">
              <article className="project-card reveal" style={{ "--delay": "0.25s" }}>
                <div className="project-top">
                  <h3>Lunar Command</h3>
                  <span className="chip">{t("projects.card1.chip")}</span>
                </div>
                <div className="project-preview preview-1">
                  <picture>
                    <source srcSet="/assets/img/preview-1.png" type="image/png" />
                    <img
                      src="/assets/img/preview-1.svg"
                      alt="Lunar Command preview"
                      className="preview-image"
                    />
                  </picture>
                  <span className="preview-chip">{t("projects.preview")}</span>
                </div>
                <p>{t("projects.card1.desc")}</p>
                <div className="project-tags">
                  <span>{t("projects.card1.tag1")}</span>
                  <span>{t("projects.card1.tag2")}</span>
                  <span>{t("projects.card1.tag3")}</span>
                </div>
              </article>
              <article className="project-card reveal" style={{ "--delay": "0.3s" }}>
                <div className="project-top">
                  <h3>Neon Dispatch</h3>
                  <span className="chip">{t("projects.card2.chip")}</span>
                </div>
                <div className="project-preview preview-2">
                  <picture>
                    <source srcSet="/assets/img/preview-2.png" type="image/png" />
                    <img
                      src="/assets/img/preview-2.svg"
                      alt="Neon Dispatch preview"
                      className="preview-image"
                    />
                  </picture>
                  <span className="preview-chip">{t("projects.preview")}</span>
                </div>
                <p>{t("projects.card2.desc")}</p>
                <div className="project-tags">
                  <span>{t("projects.card2.tag1")}</span>
                  <span>{t("projects.card2.tag2")}</span>
                  <span>{t("projects.card2.tag3")}</span>
                </div>
              </article>
              <article className="project-card reveal" style={{ "--delay": "0.35s" }}>
                <div className="project-top">
                  <h3>Atlas Studio</h3>
                  <span className="chip">{t("projects.card3.chip")}</span>
                </div>
                <div className="project-preview preview-3">
                  <picture>
                    <source srcSet="/assets/img/preview-3.png" type="image/png" />
                    <img
                      src="/assets/img/preview-3.svg"
                      alt="Atlas Studio preview"
                      className="preview-image"
                    />
                  </picture>
                  <span className="preview-chip">{t("projects.preview")}</span>
                </div>
                <p>{t("projects.card3.desc")}</p>
                <div className="project-tags">
                  <span>{t("projects.card3.tag1")}</span>
                  <span>{t("projects.card3.tag2")}</span>
                  <span>{t("projects.card3.tag3")}</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section skills" id="skills" data-chat-context="Skills">
          <div className="container skills-grid">
            <div className="skills-copy">
              <p className="eyebrow reveal" style={{ "--delay": "0.1s" }}>
                {t("skills.eyebrow")}
              </p>
              <h2 className="reveal" style={{ "--delay": "0.2s" }}>
                {t("skills.title")}
              </h2>
              <p className="reveal" style={{ "--delay": "0.3s" }}>
                {t("skills.desc")}
              </p>
            </div>
            <div className="skills-list">
              {skillChips.map((skill, index) => (
                <span
                  className="skill-chip reveal"
                  style={{ "--delay": `${0.25 + index * 0.05}s` }}
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section experience"
          id="experience"
          data-chat-context="Experience"
        >
          <div className="container">
            <div className="section-title">
              <p className="eyebrow reveal" style={{ "--delay": "0.1s" }}>
                {t("experience.eyebrow")}
              </p>
              <h2 className="reveal" style={{ "--delay": "0.2s" }}>
                {t("experience.title")}
              </h2>
            </div>
            <div className="timeline">
              <div className="timeline-item reveal" style={{ "--delay": "0.25s" }}>
                <div className="time">2024</div>
                <div className="detail">
                  <h3>Solvix Studio</h3>
                  <p>{t("experience.item1.desc")}</p>
                </div>
              </div>
              <div className="timeline-item reveal" style={{ "--delay": "0.3s" }}>
                <div className="time">2023</div>
                <div className="detail">
                  <h3>{t("experience.item2.title")}</h3>
                  <p>{t("experience.item2.desc")}</p>
                </div>
              </div>
              <div className="timeline-item reveal" style={{ "--delay": "0.35s" }}>
                <div className="time">2022</div>
                <div className="detail">
                  <h3>{t("experience.item3.title")}</h3>
                  <p>{t("experience.item3.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact" data-chat-context="Contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow reveal" style={{ "--delay": "0.1s" }}>
                {t("contact.eyebrow")}
              </p>
              <h2 className="reveal" style={{ "--delay": "0.2s" }}>
                {t("contact.title")}
              </h2>
              <p className="reveal" style={{ "--delay": "0.3s" }}>
                {t("contact.desc")}
              </p>
              <div className="contact-info reveal" style={{ "--delay": "0.35s" }}>
                <div>
                  <span>{t("contact.label.email")}</span>
                  <strong>hello@solvix.studio</strong>
                </div>
                <div>
                  <span>{t("contact.label.location")}</span>
                  <strong>Bandung, Indonesia</strong>
                </div>
              </div>
            </div>
            <form className="contact-card reveal" style={{ "--delay": "0.35s" }}>
              <label>
                <span>{t("contact.form.name")}</span>
                <input type="text" placeholder={t("contact.placeholder.name")} />
              </label>
              <label>
                <span>{t("contact.form.email")}</span>
                <input type="email" placeholder={t("contact.placeholder.email")} />
              </label>
              <label>
                <span>{t("contact.form.message")}</span>
                <textarea rows="4" placeholder={t("contact.placeholder.message")}></textarea>
              </label>
              <button type="submit" className="btn primary">
                {t("contact.button")}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer" data-chat-context="Footer">
        <div className="container footer-inner">
          <p>{t("footer.tagline")}</p>
          <p>
            {t("footer.copyright")} {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <div
        className={`chatbot ${chatOpen ? "open" : ""}`}
        id="chatbot"
        data-chat-endpoint={CHAT_ENDPOINT}
        data-chat-version={CHAT_VERSION}
      >
        <div
          className="chatbot-panel"
          id="chatbot-panel"
          role="dialog"
          aria-label={t("aria.chat.panel")}
        >
          <div className="chatbot-header">
            <div>
              <strong>{t("chat.title")}</strong>
              <span className="chatbot-version">{CHAT_VERSION}</span>
            </div>
            <button
              className="chatbot-close"
              id="chatbot-close"
              type="button"
              aria-label={t("aria.chat.close")}
              onClick={() => setChatOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="chatbot-messages" id="chatbot-messages" ref={chatMessagesRef}>
            <div className="chatbot-message bot">{t("chat.welcome")}</div>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chatbot-message ${message.role}`}>
                {message.content}
              </div>
            ))}
          </div>
          <form className="chatbot-input" id="chatbot-form" onSubmit={handleChatSubmit}>
            <input
              id="chatbot-input"
              type="text"
              placeholder={t("chat.placeholder")}
              autoComplete="off"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
            />
            <button type="submit">{t("chat.send")}</button>
          </form>
        </div>
        <button
          className="chatbot-toggle"
          id="chatbot-toggle"
          type="button"
          aria-expanded={chatOpen}
          aria-controls="chatbot-panel"
          aria-label={t("aria.chat.open")}
          onClick={() => setChatOpen((prev) => !prev)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path>
            <path d="M8 9h8M8 13h5"></path>
          </svg>
        </button>
      </div>
    </>
  );
};

export default App;
