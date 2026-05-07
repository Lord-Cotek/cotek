// lib/identities.ts
// The canonical record. Single source of truth for names, handles, works,
// affiliations, and the COTEK acronym.

export const TEMI = {
  fullName: "Temitayo Ezekiel Olayiwola",
  shortName: "Temi Cotek",
  acronym: {
    word: "COTEK",
    meaning: "Hope",
    expansion: [
      { letter: "C", name: "Chimera" },
      { letter: "O", name: "Omogbolahan / Olayiwola" },
      { letter: "T", name: "Temitayo" },
      { letter: "E", name: "Ezekiel" },
      { letter: "K", name: "Kadiri" },
    ],
  },
  names: [
    "Temi Cotek",
    "Cotek Temi",
    "Temitayo Cotek",
    "Cotek Temitayo",
    "Temitayo Ezekiel Olayiwola",
    "Omogbolahan",
    "Kadiri",
    "Cotek",
  ],
  roles: [
    "Environmentalist",
    "Software founder",
    "Author",
    "Poet",
    "Bible teacher",
    "Photographer",
    "Husband",
    "Diver",
  ],
  handles: {
    linkedin: "https://www.linkedin.com/in/cotek/",
    unsplash: "https://unsplash.com/@cotek",
    instagram_personal: "https://www.instagram.com/lord.cotek/",
    instagram_creative: "https://www.instagram.com/life_vs_love_/",
    facebook: "https://www.facebook.com/Dr.cotek407/",
    researchgate: "https://www.researchgate.net/profile/Temi-Cotek-2",
    academia: "https://independent.academia.edu/Cotektemitayo",
    openlibrary: "https://openlibrary.org/authors/OL11313996A/Temi_Cotek",
    amazon: "https://www.amazon.com/stores/Temi-Cotek/author/B08PSN6D91",
    allpoetry: "https://allpoetry.com/Temi+Cotek",
    biography_omics:
      "https://biography.omicsonline.org/india/indian-institute-of-science-education-and-research/cotek-temitayo-2169204",
    googleplay_books:
      "https://play.google.com/store/books/details/Orchids_and_Tamarind_The_First_Book_on_Life_Vs_Lov?id=rNGBDwAAQBAJ",
    everand: "https://www.everand.com/author/564720121/Temi-Cotek",
  },
  career: [
    {
      org: "AMRO",
      role: "Environment Division Manager",
      tenure: "current",
      what: "Environmental solutions across the UAE and the GCC.",
    },
    {
      org: "Action International Services",
      role: "Senior Water Quality Analyst",
      tenure: "former",
      what: "Water and wastewater treatment systems.",
    },
    {
      org: "Cotek App FZ-LLC",
      role: "Founder",
      tenure: "current",
      location: "RAKEZ, Ras Al Khaimah, UAE",
      what: "A software studio building tools around stewardship and accountability.",
    },
  ],
  memberships: [
    {
      name: "Emirates Nature–WWF",
      url: "https://www.emiratesnaturewwf.ae/",
    },
  ],
  certifications: [
    {
      name: "PADI Open Water Diver",
      body: "PADI",
      diverNumber: "2602UD0947",
      issuedAt: "2026-02-12",
      instructor: "Ibrahim Al Dubai",
      school: "Al Jazeera Diving & Swimming Centre",
    },
  ],
  affiliations: [
    { name: "TGN Ghana", url: "https://tgnghana.org/" },
    { name: "Dewa Arabia", url: "https://dewarabia.com/" },
    {
      name: "RAK Church",
      role: "Bible teacher",
      url: "https://www.rakchurch.com/",
    },
    { name: "IISER (India)", role: "Researcher (former)" },
  ],
  works: {
    apps: [
      {
        name: "PExP",
        url: "https://pexp.cotek.app",
        what: "Personal Expense Platform — iOS, Android.",
      },
      {
        name: "ProMan",
        url: "https://proman.cotek.app",
        what: "Project management for small teams.",
      },
      {
        name: "Sci-Cotek",
        url: "https://sci.cotek.app",
        what: "Environmental science data analysis with a live API.",
      },
      {
        name: "BMS",
        url: "https://bms.cotek.app",
        what: "Business management.",
      },
      {
        name: "Poems",
        url: "https://poems.cotek.app",
        what: "A library of his lines.",
      },
      {
        name: "exp",
        url: "https://exp.cotek.live",
        what: "A household ledger.",
      },
    ],
    // The "Life vs Love" trilogy plus The Cerulean Monster.
    books: [
      {
        title: "Orchids and Tamarind: The First Book on Life vs Love",
        year: 2018,
        series: "Life vs Love",
        seriesIndex: 1,
        link: "https://www.amazon.com/stores/Temi-Cotek/author/B08PSN6D91",
        bol: "https://www.bol.com/nl/nl/p/orchids-and-tamarind/9200000104076998/",
      },
      {
        title: "Infinity Wall: The Second Book on Life vs Love",
        year: 2020,
        series: "Life vs Love",
        seriesIndex: 2,
        link: "https://www.amazon.in/Infinity-Wall-Second-Book-Life/dp/B08R9F3711",
      },
      {
        title: "The Cerulean Monster",
        year: 2021,
        link: "https://us.amazon.com/Cerulean-Monster-Temi-Cotek/dp/B093RZJKJW",
        note: "Poems written across 113 days in early 2021.",
      },
      // augmented at runtime via OpenLibrary feed
    ],
    // Reef notes — a small visual log; written in his voice. Image-led.
    reef: [
      {
        place: "Dibba",
        when: "March",
        line: "The clownfish were exactly where last March left them. A small assurance.",
      },
      {
        place: "Khasab",
        when: "October",
        line: "A turtle, unbothered by the boat. We are the visitors. The reef is the host.",
      },
      {
        place: "Fujairah",
        when: "August",
        line: "Visibility low; current strong. You learn to read the water by what it refuses to show you.",
      },
      {
        place: "Ras al-Khaimah lagoon",
        when: "After the rains",
        line: "Wastewater testing in the morning, snorkel at dusk. Same water, different vocabulary.",
      },
    ],
  },
  contact: {
    work: "tcotek@amrome.com",
    letters: "temi@cotek.live",
  },
  location: "Ras Al Khaimah, United Arab Emirates",
} as const;

// Subdomains the status pinger watches.
export const COTEK_SUBDOMAINS: Array<{ key: string; url: string }> = [
  { key: "POEMS", url: "https://poems.cotek.app" },
  { key: "EXP", url: "https://exp.cotek.live" },
  { key: "PEXP", url: "https://pexp.cotek.app" },
  { key: "PROMAN", url: "https://proman.cotek.app" },
  { key: "SCI", url: "https://sci.cotek.app" },
  { key: "BMS", url: "https://bms.cotek.app" },
];

// Routes — used by the constellation, the keyboard console, and the sitemap.
export const ROOMS = [
  { slug: "apps", title: "Apps", count: 7, weight: 1.1 },
  { slug: "books", title: "Books", count: 1, weight: 0.9 },
  { slug: "poems", title: "Poems", count: 0, weight: 1.0 },
  { slug: "research", title: "Research", count: 0, weight: 0.85 },
  { slug: "sermons", title: "Sermons", count: 0, weight: 1.05 },
  { slug: "photos", title: "Photos", count: 0, weight: 1.0 },
  { slug: "field", title: "Field", count: 0, weight: 1.6 },
] as const;
