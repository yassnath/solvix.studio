const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("site-nav");
const themeToggle = document.getElementById("theme-toggle");
const langToggle = document.getElementById("lang-toggle");
const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
const chatbotWidget = document.getElementById("chatbot");
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotVersion = document.getElementById("chatbot-version");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("section[id]"));
const reveals = document.querySelectorAll(".reveal");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const translations = {
  id: {
    "meta.title": "Solvix Studio | Portofolio Pribadi",
    "aria.theme": "Ganti tema",
    "aria.lang": "Ganti bahasa",
    "aria.chat.panel": "Chatbot Cerebras",
    "aria.chat.open": "Buka chatbot",
    "aria.chat.close": "Tutup chatbot",
    "nav.home": "Beranda",
    "nav.about": "Profil",
    "nav.projects": "Karya",
    "nav.skills": "Stack",
    "nav.experience": "Lintasan",
    "nav.contact": "Kontak",
    "hero.title": "Mendesain produk digital yang menarik dan relevan.",
    "hero.eyebrow": "Portofolio pribadi 2024",
    "hero.lead": "Kami adalah desainer dan front-end creator di Solvix Studio. Fokus pada UI yang menarik, strategi produk, dan pengalaman pengguna yang cepat dan elegan.",
    "hero.cta.primary": "Lihat karya",
    "hero.cta.secondary": "Ayo kolaborasi",
    "hero.stats.products": "Produk konsep",
    "hero.stats.brands": "Brand digital",
    "hero.stats.hackathons": "Hackathon",
    "hero.holo.label": "Sistem Visual",
    "hero.holo.status": "Online",
    "hero.holo.desc": "Grid modular, komponen neon, dan navigasi adaptif untuk produk masa depan.",
    "about.eyebrow": "Profil",
    "about.title": "Menggabungkan estetika futuristik dengan bisnis yang realistis.",
    "about.p1": "Solvix Studio membantu tim membangun produk digital dari nol sampai siap rilis. Gaya kami mengandalkan tipografi tegas, grid presisi, dan warna neon yang terkontrol.",
    "about.p2": "Fokus saat ini: desain sistem, prototyping cepat, dan front-end yang responsif untuk startup, studio kreatif, serta produk teknologi.",
    "about.panel1.title": "Spesialisasi",
    "about.panel1.item1": "Figma dan prototyping interaktif",
    "about.panel1.item2": "Web flow dengan HTML, CSS, JS",
    "about.panel1.item3": "Branding digital dan strategi konten",
    "about.panel2.title": "Nilai kerja",
    "about.panel2.item1": "Iterasi cepat, keputusan data ringan",
    "about.panel2.item2": "Kolaborasi transparan dan fokus",
    "about.panel2.item3": "Visual konsisten dari konsep ke rilis",
    "projects.eyebrow": "Karya pilihan",
    "projects.title": "Eksperimen produk dengan karakter kuat.",
    "projects.card1.chip": "Sistem UI",
    "projects.card1.desc": "Dashboard operasi berbasis data real time untuk tim logistik luar angkasa.",
    "projects.card1.tag1": "Aplikasi Web",
    "projects.card1.tag2": "Visual Data",
    "projects.card1.tag3": "Kaca Gelap",
    "projects.card2.chip": "Brand",
    "projects.card2.desc": "Identitas visual untuk platform pengiriman kota pintar dengan nuansa neon hijau.",
    "projects.card2.tag1": "Branding",
    "projects.card2.tag2": "Animasi",
    "projects.card2.tag3": "Landing",
    "projects.card3.chip": "Produk",
    "projects.card3.desc": "Produk portofolio kreator dengan modul interaktif dan layout modular.",
    "projects.card3.tag1": "Portofolio",
    "projects.card3.tag2": "Alur UX",
    "projects.card3.tag3": "CMS",
    "skills.eyebrow": "Stack utama",
    "skills.title": "Alat yang kami gunakan untuk membangun pengalaman futuristik.",
    "skills.desc": "Kombinasi desain, prototyping, dan front-end memastikan ide tetap konsisten saat diwujudkan.",
    "experience.eyebrow": "Lintasan",
    "experience.title": "Perjalanan membangun produk kreatif.",
    "experience.item1.desc": "Memimpin desain sistem untuk portofolio klien teknologi dan edutech.",
    "experience.item2.title": "Desainer Produk Freelance",
    "experience.item2.desc": "Membangun UI untuk startup logistik dan health tech dengan fokus pada konversi.",
    "experience.item3.title": "UI Engineer",
    "experience.item3.desc": "Eksperimen motion dan micro interactions untuk aplikasi finansial.",
    "contact.eyebrow": "Kontak",
    "contact.title": "Butuh tampilan futuristik untuk produkmu?",
    "contact.desc": "Kirim brief singkat, tim Solvix Studio akan respon dalam 24 jam. Bisa untuk desain landing page, produk web, atau audit UI.",
    "contact.label.email": "Email",
    "contact.label.location": "Lokasi",
    "contact.form.name": "Nama",
    "contact.form.email": "Email",
    "contact.form.message": "Pesan",
    "contact.placeholder.name": "Nama lengkap",
    "contact.placeholder.email": "nama@email.com",
    "contact.placeholder.message": "Ceritakan proyekmu",
    "contact.button": "Kirim brief",
    "footer.tagline": "Solvix Studio. Dibuat untuk gelombang berikutnya.",
    "footer.copyright": "Hak Cipta",
    "chat.title": "Solvix Studio Assistant",
    "chat.welcome": "Halo! Aku siap bantu menjawab pertanyaanmu.",
    "chat.placeholder": "Tulis pesan...",
    "chat.send": "Kirim",
    "chat.thinking": "Sedang mengetik...",
    "chat.offline": "Chatbot belum terhubung ke server.",
    "chat.noReply": "Maaf, belum ada jawaban."
  },
  en: {
    "meta.title": "Solvix Studio | Personal Portfolio",
    "aria.theme": "Toggle theme",
    "aria.lang": "Switch language",
    "aria.chat.panel": "Cerebras chatbot",
    "aria.chat.open": "Open chatbot",
    "aria.chat.close": "Close chatbot",
    "nav.home": "Home",
    "nav.about": "Profile",
    "nav.projects": "Work",
    "nav.skills": "Stack",
    "nav.experience": "Journey",
    "nav.contact": "Contact",
    "hero.title": "Designing digital products that feel engaging and relevant.",
    "hero.eyebrow": "Personal portfolio 2024",
    "hero.lead": "We are designers and front-end creators at Solvix Studio. Focused on engaging UI, product strategy, and fast, elegant user experiences.",
    "hero.cta.primary": "View work",
    "hero.cta.secondary": "Let's collaborate",
    "hero.stats.products": "Concept products",
    "hero.stats.brands": "Digital brands",
    "hero.stats.hackathons": "Hackathons",
    "hero.holo.label": "Visual System",
    "hero.holo.status": "Online",
    "hero.holo.desc": "Modular grids, neon components, and adaptive navigation for future-ready products.",
    "about.eyebrow": "Profile",
    "about.title": "Blending futuristic aesthetics with practical business goals.",
    "about.p1": "I help teams build digital products from zero to launch. My style relies on bold typography, precise grids, and controlled neon tones.",
    "about.p2": "Current focus: design systems, rapid prototyping, and responsive front-end for startups, creative studios, and tech products.",
    "about.panel1.title": "Specialties",
    "about.panel1.item1": "Figma and interactive prototyping",
    "about.panel1.item2": "Web flow with HTML, CSS, JS",
    "about.panel1.item3": "Digital branding and content strategy",
    "about.panel2.title": "Work values",
    "about.panel2.item1": "Fast iterations, lightweight data decisions",
    "about.panel2.item2": "Transparent, focused collaboration",
    "about.panel2.item3": "Consistent visuals from concept to launch",
    "projects.eyebrow": "Selected work",
    "projects.title": "Product experiments with a strong character.",
    "projects.card1.chip": "UI System",
    "projects.card1.desc": "Real-time operations dashboard for space logistics teams.",
    "projects.card1.tag1": "Web App",
    "projects.card1.tag2": "Data Viz",
    "projects.card1.tag3": "Dark Glass",
    "projects.card2.chip": "Brand",
    "projects.card2.desc": "Visual identity for a smart-city delivery platform with neon green accents.",
    "projects.card2.tag1": "Branding",
    "projects.card2.tag2": "Motion",
    "projects.card2.tag3": "Landing",
    "projects.card3.chip": "Product",
    "projects.card3.desc": "Creator portfolio product with interactive modules and a modular layout.",
    "projects.card3.tag1": "Portfolio",
    "projects.card3.tag2": "UX Flow",
    "projects.card3.tag3": "CMS",
    "skills.eyebrow": "Core stack",
    "skills.title": "Tools I use to build futuristic experiences.",
    "skills.desc": "A mix of design, prototyping, and front-end keeps ideas consistent through delivery.",
    "experience.eyebrow": "Journey",
    "experience.title": "The journey of building creative products.",
    "experience.item1.desc": "Leading design systems for technology and edtech client portfolios.",
    "experience.item2.title": "Freelance Product Designer",
    "experience.item2.desc": "Building UI for logistics and health-tech startups with a conversion focus.",
    "experience.item3.title": "UI Engineer",
    "experience.item3.desc": "Experimenting with motion and micro-interactions for financial apps.",
    "contact.eyebrow": "Contact",
    "contact.title": "Need a futuristic look for your product?",
    "contact.desc": "Send a short brief, I'll respond within 24 hours. Available for landing pages, web products, or UI audits.",
    "contact.label.email": "Email",
    "contact.label.location": "Location",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.placeholder.name": "Full name",
    "contact.placeholder.email": "name@email.com",
    "contact.placeholder.message": "Tell me about your project",
    "contact.button": "Send brief",
    "footer.tagline": "Solvix Studio. Crafted for the next wave.",
    "footer.copyright": "Copyright",
    "chat.title": "Solvix Studio Assistant",
    "chat.welcome": "Hi! I'm ready to help answer your questions.",
    "chat.placeholder": "Type a message...",
    "chat.send": "Send",
    "chat.thinking": "Typing...",
    "chat.offline": "Chatbot is not connected to the server.",
    "chat.noReply": "Sorry, no reply yet."
  }
};

let currentLang = "id";

const applyTranslations = (lang) => {
  const dictionary = translations[lang] || translations.id;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (dictionary[key]) {
      element.setAttribute("placeholder", dictionary[key]);
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    if (dictionary[key]) {
      element.setAttribute("aria-label", dictionary[key]);
    }
  });

  if (dictionary["meta.title"]) {
    document.title = dictionary["meta.title"];
  }
};

const t = (key) => {
  return translations[currentLang]?.[key] || translations.id[key] || key;
};

const themeStorageKey = "solvix-theme";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const setTheme = (theme) => {
  document.body.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
};

const storedTheme = localStorage.getItem(themeStorageKey);
const initialTheme = storedTheme || (prefersDark.matches ? "dark" : "light");
setTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(themeStorageKey, nextTheme);
  });
}

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem(themeStorageKey)) {
    setTheme(event.matches ? "dark" : "light");
  }
});

const langStorageKey = "solvix-lang";
const setLang = (lang) => {
  const normalizedLang = lang === "en" ? "en" : "id";
  currentLang = normalizedLang;
  document.body.dataset.lang = normalizedLang;
  document.documentElement.lang = normalizedLang;
  if (langToggle) {
    langToggle.dataset.lang = normalizedLang;
  }
  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === normalizedLang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  applyTranslations(normalizedLang);
};

if (langButtons.length) {
  const storedLang = localStorage.getItem(langStorageKey);
  const browserLang = navigator.language?.toLowerCase().startsWith("en") ? "en" : "id";
  setLang(storedLang || browserLang);

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedLang = button.dataset.lang || "id";
      setLang(selectedLang);
      localStorage.setItem(langStorageKey, selectedLang);
    });
  });
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
);

reveals.forEach((el) => observer.observe(el));

const setActiveLink = () => {
  if (!sections.length) {
    return;
  }

  const offset = 140;
  let currentId = sections[0].id;

  sections.forEach((section) => {
    if (window.scrollY + offset >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
};

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      setActiveLink();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

setActiveLink();

const resolveChatEndpoint = () => {
  const customEndpoint = chatbotWidget?.dataset.chatEndpoint;
  return customEndpoint || "/api/cerebras";
};

const resolveChatVersion = () => {
  const customVersion = chatbotWidget?.dataset.chatVersion;
  return customVersion || "AI";
};

const cerebrasConfig = {
  version: "v1",
  displayVersion: resolveChatVersion(),
  endpoint: resolveChatEndpoint()
};

if (chatbotVersion) {
  chatbotVersion.textContent = cerebrasConfig.displayVersion || chatbotVersion.textContent;
}

const setChatOpen = (open) => {
  if (!chatbotWidget) {
    return;
  }
  chatbotWidget.classList.toggle("open", open);
  if (chatbotToggle) {
    chatbotToggle.setAttribute("aria-expanded", String(open));
  }
  if (open && chatbotInput) {
    chatbotInput.focus();
  }
};

if (chatbotToggle) {
  chatbotToggle.addEventListener("click", () => {
    const isOpen = chatbotWidget?.classList.contains("open");
    setChatOpen(!isOpen);
  });
}

if (chatbotClose) {
  chatbotClose.addEventListener("click", () => setChatOpen(false));
}

const addChatMessage = (role, text) => {
  if (!chatbotMessages) {
    return null;
  }
  const message = document.createElement("div");
  message.className = `chatbot-message ${role}`;
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return message;
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
    currentLang === "en" ? "Website content summary:" : "Ringkasan konten website:";
  if (currentLang === "en") {
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

const requestCerebras = async (messages) => {
  const response = await fetch(cerebrasConfig.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: cerebrasConfig.version,
      messages: [buildSystemMessage(), ...messages]
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

const chatHistory = [];

if (chatbotForm && chatbotInput) {
  chatbotForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) {
      return;
    }

    chatbotInput.value = "";
    addChatMessage("user", text);
    chatHistory.push({ role: "user", content: text });

    const thinkingMessage = addChatMessage("bot", t("chat.thinking"));

    try {
      const reply = await requestCerebras(chatHistory);
      if (thinkingMessage) {
        thinkingMessage.textContent = reply || t("chat.noReply");
      }
      chatHistory.push({ role: "assistant", content: reply });
    } catch (error) {
      if (thinkingMessage) {
        thinkingMessage.textContent = error?.message || t("chat.offline");
      }
    }
  });
}
