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
    /*
      The studio's portfolio, mirrored from cotek.live — which is the source
      of truth for what Cotek App FZ-LLC actually ships. Order, names and
      copy are the products' own, taken from there rather than rewritten
      here, so the two sites cannot end up describing different companies.

      Sci-Cotek, BMS and exp used to be listed and are not on cotek.live any
      more; they have been removed rather than left to rot as dead links.
    */
    apps: [
      {
        name: "PExP",
        expansion: "Personal Expense Platform",
        url: "https://pexp.cotek.app",
        what: "A private ledger for individuals, couples and families, where your spending becomes a dataset you can actually question.",
      },
      {
        name: "ProMan",
        expansion: "Project management that plans itself",
        url: "https://proman.cotek.app",
        what: "A calmer project workspace for teams that ship — it plans the work, writes the update, and gets out of the way.",
      },
      {
        name: "ExTraP",
        expansion: "Exploring Travellers Platform",
        url: "https://extrap.cotek.app",
        what: "Restaurants, ruins, hot springs, hidden waterfalls — every dot on the map, every receipt, every photo, in one paper-feel workspace.",
      },
      {
        name: "Oyun",
        expansion: "Yoruba: pregnancy, the womb",
        url: "https://oyun.cotek.app",
        what: "A Christian companion from conception through a child's first two years, written for an expectant mother and the person walking beside her.",
      },
      {
        name: "Ìdílé",
        expansion: "Yoruba: the household, the family line",
        url: "https://idile.cotek.app",
        what: "Daily family worship, children's catechism and Scripture memory for the whole covenant household — with or without children.",
      },
      {
        name: "Bene",
        expansion: "Church benevolence, kept faithfully",
        url: "https://bene.cotek.app",
        what: "Benevolence requests, discernment, approvals and receipts — held in one confidential record that belongs to the church.",
      },
      {
        name: "StEP",
        expansion: "Student Essentials Platform",
        url: "https://step.cotek.app",
        what: "Notes that save themselves, references in Harvard, APA or MLA, assignments, courses and study time — for Bachelor through PhD.",
      },
      {
        name: "Oluko",
        expansion: "Yoruba: the teacher",
        url: "https://oluko.cotek.app",
        what: "A training and education platform whose headline feature turns a single topic into a complete course — modules, lessons, quizzes and a graded exam.",
      },
      {
        name: "Supremo",
        expansion: "Zero commission. Real food. Fair deal.",
        url: "https://supremo.tekapp.org",
        what: "Food delivery and table booking where restaurants pay a flat monthly fee instead of 20–30% of every order.",
      },
      {
        name: "Poetry",
        expansion: "Poetry by Cotek",
        url: "https://poems.cotek.app",
        what: "A read-only poetry garden: wander by constellation, search by title, or let a random pilgrimage choose your next horizon.",
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

/*
  What the status pinger watches.

  Derived from the portfolio rather than written down beside it. The previous
  hand-kept list was still pinging sci, bms and exp long after they stopped
  existing, which is the failure mode a second copy of a list always has.
  A product added above is now watched automatically.
*/
export const COTEK_SUBDOMAINS: Array<{ key: string; url: string }> = TEMI.works.apps.map(
  (a) => ({
    // Ìdílé is the display name; the key is an identifier, and an identifier
    // with combining accents in it is a thing that eventually breaks someone's
    // dashboard. Decompose and drop the marks — cotek.live keeps a `plain`
    // field for the same reason.
    key: a.name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toUpperCase(),
    url: a.url,
  }),
);
