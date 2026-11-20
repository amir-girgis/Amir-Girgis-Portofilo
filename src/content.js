/**
 * ============================================================================
 * PORTFOLIO CONTENT DATA — SINGLE SOURCE OF TRUTH
 * ============================================================================
 * Edit any text, image path, alt text, or caption below without touching
 * the layout or styles. Optional fields left as "" are hidden automatically.
 * ============================================================================
 */

export const EDITABLE_PLACEHOLDERS = {
  TEAM_SIZE: "8",
  TECHSKILLS_DATES: "",
  MARKET_SPHERE_WORK: "",
  INNOVET_EVENT_DAY: "",
  TECHSKILLS_CHALLENGE: "",
  GEF_COUNTS: ""
};

export const PORTFOLIO_CONTENT = {
  seo: {
    title: "Amir Girgis Mofid — Software Developer, AI Automation & Founder",
    description:
      "Portfolio of Amir Girgis Mofid — Software Development Student (C# / ASP.NET Core), Digital Marketing & AI Automation, and Founder of Market Sphere X Agency in Giza, Egypt.",
    siteName: "Amir Girgis Mofid"
  },

  loader: {
    firstName: "AMIR",
    lastName: "GIRGIS MOFID",
    skipLabel: "Skip intro"
  },

  nav: {
    brand: "AMIR.",
    links: [
      { label: "About", href: "#about" },
      { label: "Achievements", href: "#achievements" },
      { label: "Projects", href: "#projects" },
      { label: "Experience", href: "#experience" },
      { label: "Volunteering", href: "#volunteering" },
      { label: "Skills", href: "#skills" },
      { label: "Education", href: "#education" }
    ],
    primaryCta: { label: "CONTACT ME", href: "#contact" }
  },

  hero: {
    nameParts: [
      { text: "AMIR", style: "solid" },
      { text: "GIRGIS", style: "outline" },
      { text: "MOFID", style: "gradient" }
    ],
    fullName: "Amir Girgis Mofid",
    headline:
      "Software Development Student (C# / ASP.NET Core) | Digital Marketing & AI Automation | Founder, Market Sphere X",
    location: "Giza, Egypt",
    portrait: {
      src: "assets/amir.jpg",
      alt: "Studio portrait of Amir Girgis Mofid",
      fallbackInitials: "AG",
      width: 960,
      height: 1280
    },
    badgeText: "AVAILABLE FOR OPPORTUNITIES • FOUNDER • DEVELOPER • ",
    floatingChips: [
      "C# / ASP.NET CORE",
      "DIGITAL MARKETING",
      "FOUNDER, MARKET SPHERE X"
    ],
    ctas: {
      primary: { label: "VIEW WORK", href: "#projects" },
      secondary: {
        label: "DOWNLOAD CV",
        href: "/Amir_Girgis_CV.pdf",
        download: "Amir_Girgis_Mofid_CV.pdf"
      }
    }
  },

  marquees: {
    top: [
      "C#",
      "ASP.NET CORE",
      "DIGITAL MARKETING",
      "AI AUTOMATION",
      "WEB DEVELOPMENT",
      "LEADERSHIP",
      "ENTREPRENEURSHIP"
    ],
    bottom: [
      "ENTREPRENEURSHIP",
      "LEADERSHIP",
      "WEB DEVELOPMENT",
      "AI AUTOMATION",
      "DIGITAL MARKETING",
      "ASP.NET CORE",
      "C#"
    ]
  },

  about: {
    eyebrow: "01 — ABOUT",
    heading: "Builder & Founder",
    statementParts: [
      { text: "Software development student at ", type: "plain" },
      {
        text: "EVA International School of Applied Technology",
        type: "gradient"
      },
      { text: ", studying on a ", type: "plain" },
      { text: "USAID-supported scholarship", type: "underline" },
      { text: " and leading ", type: "plain" },
      { text: "Market Sphere X Agency", type: "gradient" },
      { text: " across ", type: "plain" },
      { text: "C# / ASP.NET Core", type: "underline" },
      { text: ", digital marketing, and AI automation.", type: "plain" }
    ],
    bio: "Technical Diploma in Software Development (expected 2027). Founder & Team Leader of Market Sphere X Agency, delivering digital marketing, branding, web development and AI automation for businesses in Egypt. Mentor and school ambassador supporting 60+ students. Winner of INNOVET III (1st Place, Digital Marketing) and the TechSkills Forum 2026 \"Discovering\" challenge. Passionate about entrepreneurship, technology, youth empowerment and international cooperation.",
    goal: "Goal: build innovative businesses, create opportunities for young people and contribute to sustainable social and economic development through technology and leadership.",
    photos: [
      {
        src: "assets/me/portrait-studio.jpg",
        alt: "Studio portrait of Amir Girgis Mofid",
        caption: "Amir Girgis Mofid — Giza, Egypt",
        width: 960,
        height: 1280
      }
    ],
    bento: {
      studentsCounter: {
        target: 60,
        suffix: "+",
        label: "Students Mentored",
        detail:
          "Supported in technical, leadership and professional skills at EVA International School of Applied Technology"
      },
      clientsCounter: {
        target: 11,
        suffix: "",
        label: "Clients Served",
        detail:
          "Digital marketing, branding, responsive websites and AI workflow automation via Market Sphere X"
      },
      innovetTile: {
        target: 1,
        suffix: "st",
        badge: "INNOVET III 2026",
        label: "1st Place — Digital Marketing",
        detail: "Team SAKAN · TVET ReAImagined Innovation Summit"
      },
      techSkillsTile: {
        badge: "Mediterranean TVET Forum",
        label: "TechSkills Forum 2026 Winner",
        detail: "Discovering Challenge · Representing Egypt"
      },
      locationTile: {
        city: "Giza, Egypt",
        clockLabel: "CAIRO",
        timezone: "Africa/Cairo"
      },
      focusTile: {
        label: "Current Focus",
        items: [
          "C# & ASP.NET Core Engineering",
          "AI Workflow Automation",
          "Youth Empowerment & Entrepreneurship"
        ]
      }
    }
  },

  achievements: {
    eyebrow: "02 — ACHIEVEMENTS",
    heading: "Recognized Impact",
    spotlight: {
      sticker: "1ST PLACE",
      title: "INNOVET III: TVET ReAImagined — Digital Marketing Competition",
      date: "November 9, 2026",
      location: "Egypt",
      organizers:
        "Organized by Egypt's Ministry of Education and Technical Education, with partners and supporters: German Agency for International Cooperation (GIZ), the European Union and the Swiss Agency for Development and Cooperation.",
      summitFocus:
        "The third edition of the Innovation Summit in Technical Education, focused on the future of technical and technological education, innovation, digital transformation, and the role of AI in preparing students for the labor market.",
      description:
        "Our four-member team won 1st Place with SAKAN, recognized for a student-focused digital product concept and for presenting its branding, marketing strategy, audience targeting and creative campaign.",
      myRole: EDITABLE_PLACEHOLDERS.INNOVET_EVENT_DAY,
      outcomes: "1st Place — Digital Marketing Competition (Team SAKAN)",
      team: ["Amir Girgis", "Keroles Ayman", "Ahmed Adel", "Mina Sameh"],
      photos: [
        {
          src: "assets/innovet/innovet-trophy.jpg",
          alt: "Amir Girgis Mofid holding the 1st Place trophy at INNOVET III",
          caption: "Holding the 1st Place trophy at INNOVET III — November 9, 2026",
          width: 960,
          height: 1280
        },
        {
          src: "assets/innovet/innovet-interview.jpg",
          alt: "Amir Girgis Mofid speaking during a media interview in front of the INNOVET TVET ReAImagined backdrop",
          caption: "Media interview in front of the INNOVET III summit backdrop",
          width: 1600,
          height: 900
        },
        {
          src: "assets/innovet/innovet-stage-speech.jpg",
          alt: "Amir Girgis Mofid speaking at the microphone on the INNOVET III stage",
          caption: "Speaking on stage during the INNOVET III awards ceremony",
          width: 1600,
          height: 900
        },
        {
          src: "assets/innovet/innovet-stage-trophies.jpg",
          alt: "Award winners holding trophies on stage at INNOVET III",
          caption: "Winners on stage at INNOVET III",
          width: 1600,
          height: 900
        }
      ]
    },
    secondary: {
      badge: "International Winner",
      title: 'TechSkills Forum 2026 — Winner, "Discovering" Challenge',
      date: EDITABLE_PLACEHOLDERS.TECHSKILLS_DATES,
      location: "New Administrative Capital, Egypt",
      organizers:
        "Inaugural edition of the Mediterranean Technical and Vocational Education and Training (TVET) Forum (five-day international event).",
      description:
        'Represented Egypt and my school, working with an international team representing Mediterranean countries. Our team won the "Discovering" challenge.',
      myRole: EDITABLE_PLACEHOLDERS.TECHSKILLS_CHALLENGE,
      outcomes:
        'Winner, "Discovering" Challenge · Leadership, innovation and cross-cultural collaboration',
      team: ["International team representing Mediterranean countries"],
      photos: [
        {
          src: "assets/techskills/techskills-delegation.jpg",
          alt: "Mediterranean TVET delegation group photo in front of the TechSkills Forum stage",
          caption: "International delegation at the 1st Mediterranean TVET TechSkills Forum",
          width: 1600,
          height: 900
        },
        {
          src: "assets/techskills/techskills-stage-panel.jpg",
          alt: "Panel session on stage at the 1st Mediterranean Forum and Exhibition for Technical and Vocational Education",
          caption: "Main stage at TechSkills Forum 2026 in Egypt's New Administrative Capital",
          width: 1600,
          height: 900
        },
        {
          src: "assets/techskills/techskills-badge.jpg",
          alt: "Participant credential badge and lanyard for Amir Girgis Mufid Tawfiq at TechSkills Forum",
          caption: "Official TechSkills Forum participant badge and lanyards",
          width: 1200,
          height: 1600
        },
        {
          src: "assets/techskills/techskills-interview.jpg",
          alt: "Amir Girgis Mofid during a television interview at TechSkills Forum",
          caption: "Media interview at TechSkills Forum 2026",
          width: 615,
          height: 345
        }
      ]
    }
  },

  projects: {
    eyebrow: "03 — PROJECTS",
    heading: "Selected Work",
    items: [
      {
        id: "market-sphere-x",
        number: "01",
        category: "Digital Agency · Founder & Team Leader",
        title: "Market Sphere X Agency",
        date: "March 2024 – Present",
        location: "Egypt",
        description:
          "A digital agency specializing in digital marketing, branding, website development, creative solutions and AI workflow automation, serving 11 clients primarily across real estate investment and development companies in Egypt.",
        development:
          `Founded in March 2024 and led across web development, graphic design, video production, photography, AI automation, business development and sales. Manages the full client lifecycle across four stages (requirements, timelines, expectations, reporting) and builds responsive websites, branding, social media strategies, and AI workflows (Claude, Make, webhooks).`,
        outcome:
          `11 clients served to date (primarily real estate investment and development companies in Egypt) with a ${EDITABLE_PLACEHOLDERS.TEAM_SIZE}-member team, strengthening clients' digital presence and reducing manual operational work.`,
        myRole:
          "Founded the agency, lead a cross-functional team, and manage the full client lifecycle across four stages (requirements, timelines, expectations, reporting) to keep projects on schedule and aligned.",
        services: [
          "Digital Marketing & Strategy",
          "Brand Identity & Creative Solutions",
          "Responsive Website Development",
          "AI Workflow Automation (Claude, Make, Webhooks)"
        ],
        stats: [
          { value: "11", label: "Clients Served" },
          {
            value: EDITABLE_PLACEHOLDERS.TEAM_SIZE,
            label: "Team Members"
          }
        ],
        selectedWorkDetail: EDITABLE_PLACEHOLDERS.MARKET_SPHERE_WORK,
        tools: [
          "Web Development",
          "Branding",
          "Digital Marketing",
          "Claude",
          "Make",
          "Webhooks"
        ],
        mood: "sunset",
        photos: []
      },
      {
        id: "ai-lead-qualification",
        number: "02",
        category: "AI Automation & CRM Pipeline",
        title: "AI Lead Qualification Platform",
        date: "2024 – Present",
        location: "Workflow Engineering",
        description:
          "An end-to-end automation pipeline integrating Claude AI, Make, Airtable and a Telegram bot via webhooks. It automatically scores and routes inbound leads and keeps CRM data synchronized, replacing manual qualification, and generates proposals and emails with a single human approval step.",
        development:
          "Built an end-to-end webhook-driven pipeline connecting Claude AI, Make, Airtable, and a Telegram bot across six stages: Lead → AI scoring → Routing → CRM sync → Proposal draft → Human approval.",
        outcome:
          "Replaced manual lead qualification, kept CRM records synchronized automatically, and accelerated prospect response time via automated proposal and email drafts requiring a single human approval step.",
        myRole:
          "Architected and integrated the end-to-end webhook workflow connecting Claude AI, Make, Airtable, and Telegram.",
        flowSteps: [
          "Lead",
          "AI scoring",
          "Routing",
          "CRM sync",
          "Proposal draft",
          "Human approval"
        ],
        tools: ["Claude AI", "Make", "Airtable", "Telegram Bot", "Webhooks"],
        mood: "electric",
        photos: []
      },
      {
        id: "sakan",
        number: "03",
        category: "EdTech / Student Lifestyle · Concept (INNOVET III 2026)",
        title: "SAKAN (سَكَن)",
        tagline: "Your Life, Your Way.",
        date: "November 2026",
        location: "INNOVET III 2026",
        description:
          "An integrated digital platform concept that helps students—especially those living away from their families—manage their academic responsibilities, accommodation, personal finances and everyday activities through one centralized application.",
        development:
          "Concept project focused on value proposition, target student audience analysis, digital marketing strategy, brand identity (#0D2B5B, #3ECF8E, #F7F9F6, #64748B), Instagram feed, stories and reels campaign content, digital presence and final competition presentation.",
        outcome:
          "Won 1st Place in the Digital Marketing Competition at INNOVET III – TVET ReAImagined Innovation Summit (November 9, 2026), recognized for a student-focused digital product concept, branding, marketing strategy, audience targeting, and creative campaign.",
        coreFeatures: [
          "Student accommodation discovery and booking",
          "Study management: organizing tasks, assignments, projects and deadlines, breaking large tasks into steps, tracking progress and reminders",
          "Personal finance management: budgets, monthly allowance, expense tracking, better financial decisions",
          "Daily life management: organizing everyday responsibilities and routines",
          "Smart assistance: a proposed AI-powered assistant to support planning and prioritizing"
        ],
        myRole:
          "Concept project. My role covered the concept, audience analysis, marketing strategy, branding and campaign content.",
        team: ["Amir Girgis", "Keroles Ayman", "Ahmed Adel", "Mina Sameh"],
        outcomes: "1st Place in the Digital Marketing Competition at INNOVET III",
        brandColors: ["#0D2B5B", "#3ECF8E", "#F7F9F6", "#64748B"],
        tools: [
          "Brand Identity",
          "Digital Marketing",
          "Audience Analysis",
          "Instagram Feed / Stories / Reels",
          "Concept Strategy"
        ],
        mood: "sakan",
        photos: [
          {
            src: "assets/sakan/sakan-showcase.jpg",
            alt: "SAKAN platform concept showcase showing website, mobile UI, Instagram cards, and branded notebook and mug",
            caption: "SAKAN concept presentation — web, mobile UI and social media mockups",
            width: 1280,
            height: 720
          },
          {
            src: "assets/sakan/sakan-campaign-board.jpg",
            alt: "SAKAN digital marketing campaign board displaying Instagram Feed posts, Stories, Reels covers and campaign visual system",
            caption: "SAKAN digital marketing campaign — Instagram Feed, Stories, and Reels covers",
            width: 1280,
            height: 1280
          },
          {
            src: "assets/sakan/sakan-brand-identity.jpg",
            alt: "SAKAN brand identity board with logo, app icons, color palette #0D2B5B, #3ECF8E, #F7F9F6, #64748B, and typography",
            caption: "SAKAN brand identity system and color palette (#0D2B5B & #3ECF8E)",
            width: 1280,
            height: 1280
          }
        ]
      },
      {
        id: "coming-soon",
        number: "04",
        category: "Upcoming Work",
        title: "More projects coming soon",
        date: "In Progress",
        location: "Giza, Egypt",
        description:
          "New software engineering and AI automation work will be added here as it is completed.",
        development:
          "Ongoing builds focused on C#, ASP.NET Core, and practical AI workflow automation.",
        outcome:
          "Full case studies with verified architecture, screenshots, and outcomes will be published here upon completion.",
        tools: ["C#", "ASP.NET Core", "AI Automation"],
        mood: "midnight",
        isPlaceholder: true,
        photos: []
      }
    ]
  },

  experience: {
    eyebrow: "04 — EXPERIENCE & LEADERSHIP",
    heading: "Agency & School Impact",
    items: [
      {
        period: "March 2024 – Present",
        role: "Founder & Team Leader",
        organization: "Market Sphere X Agency",
        meta: [
          `Team: ${EDITABLE_PLACEHOLDERS.TEAM_SIZE} members`,
          "Clients: 11"
        ],
        points: [
          `Lead a ${EDITABLE_PLACEHOLDERS.TEAM_SIZE}-member team across web development, graphic design, video production, photography, AI automation, business development and sales.`,
          "Deliver responsive business websites, branding, social media strategy and marketing planning for 11 clients, primarily real estate investment and development companies in Egypt.",
          "Build AI workflows (Claude, Make, webhooks) that reduce clients' manual operational work.",
          "Manage the full client lifecycle across four stages (requirements, timelines, expectations, reporting) to keep projects on schedule and aligned."
        ]
      },
      {
        period: "EVA International School of Applied Technology",
        role: "School Ambassador, PHP Team Leader, Peer Assistant & Student Professional Mentor",
        organization: "EVA International School of Applied Technology",
        meta: ["60+ students supported"],
        points: [
          "Supports and mentors 60+ students in technical, leadership and professional skills.",
          "Represents the school in technology events and school-wide initiatives."
        ]
      }
    ]
  },

  volunteering: {
    eyebrow: "05 — VOLUNTEERING",
    heading: "Global Entrepreneurship Festival",
    role: "Volunteer — Digital Marketing Team",
    event: "Global Entrepreneurship Festival (GEF) 2026",
    location: "Cairo, Egypt",
    date: "November 6–8, 2026",
    certificate: "Official Volunteer Certificate Received",
    countsPlaceholder: EDITABLE_PLACEHOLDERS.GEF_COUNTS,
    highlights: [
      "Served on the Digital Marketing volunteer team at an international entrepreneurship event and contributed to the festival's overall success.",
      "Supported investors in the Deals Room, where many investors met many startup projects, by explaining projects, scheduling meetings and taking notes.",
      "Provided English–Arabic and Arabic–English translation during investor and project discussions.",
      "Helped investors assess each project's strengths and risks, and recorded in the event form whether a project reached a deal.",
      "Gained first-hand exposure to the entrepreneurship, investment and innovation ecosystem; received an official Volunteer Certificate recognizing dedication, commitment and contribution."
    ],
    photos: [
      {
        src: "assets/gef-2026/gef-backdrop-portrait.jpg",
        alt: "Amir Girgis Mofid standing in front of the Global Entrepreneurship Festival backdrop wearing a TEAM badge",
        caption: "At the Global Entrepreneurship Festival (GEF) 2026 in Cairo",
        width: 960,
        height: 1280
      },
      {
        src: "assets/gef-2026/gef-certificate.jpg",
        alt: "Official Global Entrepreneurship Festival Volunteer Certificate presented to Amir Girgis Mofed for 6th–8th November 2026",
        caption: "Official GEF 2026 Volunteer Certificate — Cairo, November 6–8, 2026",
        width: 1600,
        height: 1131
      },
      {
        src: "assets/gef-2026/gef-team-badge.jpg",
        alt: "Close-up of the Global Entrepreneurship Festival TEAM pass inside the event hall",
        caption: "GEF 2026 TEAM credential inside the festival venue",
        width: 960,
        height: 1280
      }
    ]
  },

  skills: {
    eyebrow: "06 — SKILLS",
    heading: "Capabilities & Languages",
    groups: [
      {
        category: "Backend",
        items: [
          "C#",
          "ASP.NET Core",
          "Web API",
          "MVC",
          "Entity Framework Core",
          "LINQ",
          "SQL Server"
        ]
      },
      {
        category: "AI & Automation",
        items: [
          "Claude",
          "ChatGPT",
          "Prompt Engineering",
          "Make",
          "REST APIs",
          "Webhooks"
        ]
      },
      {
        category: "Frontend & Design",
        items: ["HTML", "CSS", "Figma"]
      },
      {
        category: "Tools",
        items: ["Git", "GitHub", "Visual Studio"]
      },
      {
        category: "Digital Marketing",
        items: [
          "Strategy",
          "Market Research",
          "Target Audience Analysis",
          "Social Media Marketing",
          "Content Strategy",
          "Campaign Planning",
          "SEO"
        ]
      },
      {
        category: "Brand & Creative",
        items: [
          "Brand Identity",
          "Creative Direction",
          "Visual Communication"
        ]
      },
      {
        category: "Professional",
        items: [
          "Team Leadership",
          "Collaboration",
          "Presentation",
          "Problem Solving"
        ]
      },
      {
        category: "Languages",
        items: [
          "Arabic (Native)",
          "English (Professional Working Proficiency)"
        ]
      }
    ]
  },

  education: {
    eyebrow: "07 — EDUCATION",
    heading: "Academic Foundation",
    degree: "Technical Diploma in Software Development",
    institution: "EVA International School of Applied Technology",
    timeline: "Expected 2027",
    scholarship: "Studying through a USAID-supported scholarship.",
    coursework: [
      "Object-Oriented Programming (C#)",
      "Data Structures & Algorithms",
      "ASP.NET Core & Web API",
      "MVC",
      "Entity Framework Core & LINQ",
      "SQL & Databases",
      "Software Engineering & Documentation",
      "Software Testing",
      "Git & GitHub",
      "Flutter",
      "Embedded Systems & IoT"
    ]
  },

  contact: {
    eyebrow: "08 — CONTACT",
    headline: "LET'S BUILD SOMETHING IMPACTFUL",
    email: "amirgargas28@gmail.com",
    phone: "+20 122 364 6440",
    linkedin: "https://linkedin.com/in/amir-girgis-9392aa340",
    linkedinLabel: "LinkedIn",
    github: "https://github.com/amir-girgis",
    githubLabel: "GitHub",
    cvHref: "/Amir_Girgis_CV.pdf",
    cvLabel: "DOWNLOAD CV",
    form: {
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      emailLabel: "Your Email",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "Project, internship, or collaboration",
      messageLabel: "Message",
      messagePlaceholder: "Share what you're looking to build...",
      submitLabel: "OPEN IN MAIL APP"
    }
  },

  footer: {
    outlinedName: "AMIR GIRGIS MOFID",
    clockLabel: "CAIRO",
    timezone: "Africa/Cairo",
    location: "Giza, Egypt",
    backToTop: "BACK TO TOP"
  }
};
