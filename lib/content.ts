/**
 * Single source of truth for all site copy. Plain data, no React.
 * Copy edits go here, never into JSX. Public strings carry no numbers other
 * than years (see DESIGN.md hard rules).
 */

/** Contact details and identity. */
export const profile = {
  name: "Marc Tchetchenigbo",
  email: "tchetchenigbo@gmail.com",
  github: "https://github.com/marctche",
  githubLabel: "github.com/marctche",
  linkedin: "https://www.linkedin.com/in/marc-tche/",
  linkedinLabel: "linkedin.com/in/marc-tche",
  location: "Ottawa, Canada",
};

/** Site title and meta description. */
export const siteTitle = "Marc Tchetchenigbo";
export const siteDescription =
  "Personal site of Marc Tchetchenigbo, a software engineering student at the University of Ottawa: projects, experience and a little about him.";

/**
 * Homepage: the greeting, one line under it, then the four tiles. Two sentences on
 * screen at a time, never three.
 *
 * `lines[0]` is the default: it's what renders first, and all that no-JS visitors,
 * reduced-motion visitors and screen readers get. After a couple of seconds the line
 * types its way through the rest in order, then loops (components/TypedLine). Only the
 * words that differ from the previous line get deleted and retyped, so lines that share
 * a frame ("i'm … at …") read as small edits. Same rules as everywhere else: lowercase,
 * no numbers, nothing that isn't already true elsewhere on the site.
 */
export const home: {
  greeting: string;
  lines: [string, ...string[]];
  /** Once `lines[line]` is fully typed, `word` in it becomes a link to `href`. */
  lineLink: { line: number; word: string; href: string };
  tiles: { n: string; title: string; line: string; href: string }[];
} = {
  greeting: "hey, i'm marc.",
  lines: [
    "i'm studying software engineering at the university of ottawa.",
    "i'm working in management consulting at bdo canada.",
    "i'm building things.",
    "you should check out my projects!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    "i'm slowly making my way around the world.",
    "i'm trying to make my guitar sound like mk.gee's.",
    "i'm usually learning something completely unrelated to what i was learning last week.",
  ],
  lineLink: { line: 3, word: "projects", href: "/projects" },
  tiles: [
    { n: "01", title: "PROJECTS", line: "THINGS I'VE MADE", href: "/projects" },
    {
      n: "02",
      title: "EXPERIENCE",
      line: "SOFTWARE, SYSTEMS & CONSULTING",
      href: "/experience",
    },
    { n: "03", title: "ABOUT", line: "THE SHORT VERSION", href: "/about" },
    { n: "04", title: "ELSEWHERE", line: "NOTHING HERE YET", href: "/elsewhere" },
  ],
};

export type ProjectLinks = { repo?: string; live?: string };

/** Detail page copy. Each array is a list of paragraphs; optional beats are skipped when empty. */
export type ProjectDetail = {
  lead: string;
  what: string[];
  why?: string[];
  mine: string[];
  interesting?: string[];
  next?: string[];
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  oneLiner: string;
  links: ProjectLinks;
  stack: string[];
  role: string;
  team?: string;
  detail: ProjectDetail;
  /** Keep the name's capitals on its page title (which is otherwise lowercased), e.g. "rePlay". */
  keepCase?: boolean;
  /** Only "public" renders. */
  status: "public" | "draft";
  /** Internal editorial notes, never rendered. */
  notes?: string;
};

/** Every public project gets its own page. This order is the table order. */
export const projects: Project[] = [
  {
    slug: "layover",
    name: "Layover",
    year: "2026",
    oneLiner:
      "Helping a group of friends agree on where to go, for how long, and what it'll cost, without the group chat.",
    links: { repo: "https://github.com/marctche/layover" },
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Claude",
      "AWS Lambda",
      "Terraform",
    ],
    role: "solo: product, design, and all of the code",
    status: "public",
    detail: {
      lead: "i built layover because planning trips with my friends was getting harder than it needed to be.",
      what: [
        "Layover helps a group of friends decide where to go, in what order, for how many nights, and what it will all cost. Everyone says what they want and what they can spend, and it works out which trips are actually possible.",
      ],
      why: [
        "My friends and I are always talking about trips we want to take, but once we actually start planning, it gets messy. Everyone has different budgets, dates, and places they want to go. We end up trying to keep track of everything in a group chat, where details get buried and it's hard to know what's been decided. I wanted a better way to organize it all.",
      ],
      mine: [
        "All of it. I decided what the product should do, designed the data model and the planner, built the app, and set up the cloud pieces around it.",
      ],
      interesting: [
        "The planner is deterministic. It computes routes, feasibility and budgets itself, and the AI only explains the results and helps people navigate the trade-offs. That split means it can't invent a price or quietly override a constraint.",
        "Private budgets stay private because the database enforces who can see what, not just the interface. A small cloud worker fetches flight pricing on a schedule so the planner works from real numbers.",
      ],
      next: [
        "The scoring and a few of the screens have been redesigned more than once, and some still feel unsettled. Next I want to watch real groups use it and let that decide what to simplify.",
      ],
    },
  },
  {
    slug: "e-hotels",
    name: "e-Hotels",
    year: "2026",
    oneLiner:
      "A hotel booking and front-desk system: customers book, staff check people in.",
    links: { repo: "https://github.com/marctche/e-hotels" },
    stack: ["Next.js", "TypeScript", "Flask", "PostgreSQL", "Supabase"],
    role: "full-stack",
    team: "team of three",
    status: "public",
    detail: {
      lead: "a hotel booking system for guests and front-desk staff, built as part of a database course.",
      what: [
        "e-Hotels is a booking system for a group of hotel chains. Customers search for rooms and book them. Staff look after the other side: check-ins, walk-in rentals, and managing hotels and rooms.",
      ],
      why: [
        "It started as a database course project, where the point was to design a proper relational model and build something real on top of it.",
      ],
      mine: [
        "I worked across the stack in a team of three. I built screens for both customers and staff, wrote the typed API layer that sits between the Next.js front end and the Flask back end, and built the room search with its filters.",
        "I also spent a lot of time resolving integration issues between the frontend and backend, including schema mismatches, credentials, and rendering bugs.",
      ],
      interesting: [
        "The database does real work: triggers and views keep availability and capacity honest, so the app doesn't have to re-derive them. The room search waits for you to stop typing before it asks the server anything.",
      ],
      next: [
        "I would define the API contract before writing either side. We found most of our bugs at the boundary, and agreeing the shapes first would have saved most of them.",
      ],
    },
  },
  {
    slug: "pharmacy-management-system",
    name: "Pharmacy Management System",
    year: "2025",
    oneLiner:
      "A pharmacy management system with prescription validation, role-based access, and workflows.",
    links: {
      repo: "https://github.com/marctche/Pharmacy-Management-System",
    },
    stack: ["Kotlin", "Spring Boot", "Thymeleaf", "Gradle", "JUnit"],
    role: "full-stack",
    team: "team of five",
    status: "public",
    detail: {
      lead: "a pharmacy system for managing prescriptions, from creation and validation to preparation and pickup.",
      what: [
        "A system for the life of a prescription in a pharmacy: it is written, prepared, verified, and picked up, or cancelled along the way. Pharmacists, assistants and administrators each see and do different things.",
      ],
      why: [
        "It was a software architecture course, and a pharmacy is a good excuse: the rules are strict, the roles are clear, and the cost of a wrong state is easy to imagine.",
      ],
      mine: [
        "I worked across the stack in a team of five, from the screens people use to the logic behind them, including the prescription flow and the sign-in and role handling around it.",
      ],
      interesting: [
        "We modelled it with domain-driven design: the prescription lifecycle lives in the domain, not in the controllers, so an invalid step is something the model refuses rather than something the interface hopes nobody clicks. Roles decide which transitions each person can trigger.",
      ],
      next: [
        "Working with a shared domain model taught me how much a team leans on names. If I did it again I would write the vocabulary down on day one, before anyone writes a class.",
      ],
    },
  },
  {
    slug: "replay",
    name: "rePlay",
    keepCase: true,
    year: "2026",
    oneLiner:
      "My Apple Music history as a bilingual dashboard. Yes, that's a lot of one artist.",
    links: {
      repo: "https://github.com/marctche/ma-bibliotheque",
      live: "https://devoir5.vercel.app",
    },
    stack: ["React", "Vite", "Recharts"],
    role: "solo: everything",
    status: "public",
    detail: {
      lead: "years of listening, and apparently i have a type.",
      what: [
        "An interactive dashboard built from my own Apple Music history. It shows what I listened to, when, and how my taste has drifted, in English or in French.",
      ],
      why: [
        "The course asked for a data visualization, and I would rather make charts about something I care about than a dataset from a textbook. My own listening history was the obvious choice, and a slightly embarrassing one.",
      ],
      mine: [
        "Everything: cleaning the export, deciding which questions the data could answer, choosing the charts, and building the interface.",
      ],
      interesting: [
        "It is fully bilingual, with a small translation approach of my own instead of a library. Switching languages changes more than labels: dates, numbers and plurals follow the language too.",
      ],
      next: [
        "I would let the dashboard load a fresh export instead of baking mine in, so anyone could see their own library. It is the obvious next step and I have not done it.",
      ],
    },
  },
  {
    slug: "transfer-fit-finder",
    name: "Transfer Fit Finder",
    year: "2026",
    oneLiner: "Pick a club and a need, get the players who'd actually fit.",
    links: {},
    stack: ["Python", "Flask", "API-Football", "pytest"],
    role: "solo: everything",
    status: "public",
    notes: "Add the repo link once Marc makes the repo public.",
    detail: {
      lead: "i spend enough time thinking about football transfers that i figured i'd try building something around it.",
      what: [
        "You pick a club and say what it needs, like a goalscorer or a midfielder who wins the ball back. Transfer Fit Finder ranks players who would suit that need and shows how the ranking was reached.",
      ],
      why: [
        "I wanted to turn an argument I have all the time into something I could test. Is a player a good fit for a club, or just a good player?",
      ],
      mine: [
        "All of it: pulling the data, designing the scoring, and building the dashboard around it.",
      ],
      interesting: [
        "The scoring weights statistics differently for each position, since a striker and a defensive midfielder are not judged on the same things. Everything is normalised per ninety minutes so a player who barely played does not look better or worse than one who played every game, and extreme values are capped so one freak stat cannot dominate.",
        "It caches API responses to stay polite to the data provider, falls back to sample data when the service is unavailable, and projects how a signing would slot into the lineup.",
      ],
      next: [
        "The weights are my judgement, not something learned from outcomes. I would like to check them against real transfers and see where I was wrong.",
      ],
    },
  },
  {
    slug: "recipe-hero",
    name: "Recipe Hero",
    year: "2026",
    oneLiner:
      "Paste a recipe link, get a clean version, then ask an AI to change it.",
    links: { repo: "https://github.com/marctche/recipe-hero" },
    stack: ["Next.js", "TypeScript", "Gemini"],
    role: "developer, at a hackathon",
    team: "team of three",
    status: "public",
    notes:
      "MY PART is general on purpose. Confirm what Marc built before adding detail.",
    detail: {
      lead: "the recipe you wanted is usually somewhere under a life story. this digs it out, then lets you change it.",
      what: [
        "Paste a link to a recipe and Recipe Hero pulls out the parts you cook from, the ingredients and the steps, into one clean format. From there you can ask for changes in plain language, swap an ingredient, or apply one of a few preset changes.",
      ],
      why: [
        "We built it over a weekend at uOttaHack 8. Every recipe site formats things differently, and we wanted one clean version you could cook from, and change.",
      ],
      mine: [
        "I was one of three developers. We split the work across the app over the weekend, from importing the recipe to the screen where you ask for changes.",
      ],
      interesting: [
        "The recipe is turned into a consistent structure before the AI touches it, so the model is changing a known list of ingredients and steps, not trying to make sense of a page full of ads.",
      ],
    },
  },
  {
    slug: "wheelchair-360-camera-mount",
    name: "Wheelchair 360° camera mount",
    year: "2024",
    oneLiner:
      "A camera a wheelchair user can aim with the controls they already have.",
    links: {},
    stack: ["Arduino", "C", "Bluetooth"],
    role: "firmware, wiring, and the mount",
    status: "public",
    detail: {
      lead: "if you drive your chair with your head, you should be able to aim a camera with it too.",
      what: [
        "An assistive prototype that lets a wheelchair user aim a camera that turns all the way around, hands-free, using the head-array controls they already use to drive. The camera sits on a mount that comes off when it isn't needed.",
      ],
      why: [
        "It was an engineering design project built around an accessibility problem: almost every camera rig assumes you have a free hand.",
      ],
      mine: [
        "The firmware, the wiring and the mount. I programmed the Arduino to turn head-array signals into camera commands, connected it to the camera over Bluetooth, and put the physical and electronic parts together.",
      ],
      interesting: [
        "Having an actual physical prototype made the testing pretty different from a web app. I had to check how quickly the camera responded to inputs and whether the Bluetooth connection stayed reliable.",
      ],
    },
  },
  {
    slug: "attendly",
    name: "Attendly",
    year: "2024",
    oneLiner:
      "An Android app for running events, with a different view for each kind of user.",
    links: {},
    stack: ["Java", "Android"],
    role: "team member",
    status: "draft",
    notes:
      "Repo not confirmed. Marc's exact role also unconfirmed, so MY PART stays general.",
    detail: {
      lead: "an event has organizers, attendees and someone keeping an eye on both. each of them gets a different app.",
      what: [
        "An Android app for running events, with accounts for administrators, organizers and attendees. Each role sees its own version of the app after signing in, and organizers are the ones who create events.",
      ],
      why: ["It was the team project for a software engineering course."],
      mine: ["I was one of the developers on the team."],
      interesting: [
        "Roles shape the whole app. The same sign-in leads to different screens and different permissions, so who you are decides what the app lets you do.",
      ],
    },
  },
  {
    slug: "personal-training-site",
    name: "Personal training site",
    year: "",
    oneLiner: "A website for a personal trainer.",
    links: {},
    stack: ["Next.js", "Tailwind"],
    role: "solo: everything",
    status: "draft",
    notes:
      "Unconfirmed: real client, live URL, year. The page stays short until Marc confirms them.",
    detail: {
      lead: "a small site for a personal trainer.",
      what: [
        "A website for a personal trainer's services, built with Next.js and Tailwind.",
      ],
      mine: ["All of it: the design and the build."],
    },
  },
];

/** The blue footer on every project page. */
export const projectLinks = {
  eyebrow: "LINKS",
  repo: "github",
  live: "live site",
  empty: "nothing public to link to yet.",
};

export type Entry = {
  name: string;
  role: string;
  when: string;
  line: string;
  body?: string[];
  href?: string;
};

/** Experience, grouped in page order: work, pro bono, involvement, hacks. */
export const experience: {
  work: Entry[];
  proBono: Entry[];
  involvement: Entry[];
  hacks: Entry[];
} = {
  work: [
    {
      name: "BDO Canada",
      role: "Management consulting intern",
      when: "fall 2026",
      line: "Management consulting work on change management, business requirements, and client sessions on data and AI.",
      body: [
        "Most of my time has gone to supporting change management on client engagements, helping people get ready for new systems and new ways of working. I've also helped gather business requirements, including for a cloud vendor selection, and supported client sessions on data and AI.",
        "It's been quite different from my previous technical internships. There's more emphasis on research, understanding the client's needs, and figuring out how to present recommendations in a way that's actually useful.",
      ],
    },
    {
      name: "ISED",
      role: "Software quality and requirements",
      when: "summer 2026",
      line: "Testing radio-frequency licensing systems, documenting bugs, and checking that delivered features matched their requirements.",
      body: [
        "I worked on testing SPECTRAweb and SPECTRAplus, checking licensing workflows against their requirements and documenting issues when something wasn't behaving as expected. A big part of it was writing up problems clearly enough that developers could reproduce them and understand what needed fixing.",
      ],
    },
    {
      name: "ESDC",
      role: "Infrastructure developer",
      when: "winter–summer 2025",
      line: "Automation scripts, a security check over RPA packages, and cloud cost reporting.",
      body: [
        "I wrote scripts that checked automation packages for a known security problem, so people could review the findings instead of opening every package by hand. I also built a dashboard that made cloud spending visible by service, which turned \"where is the money going?\" into a question you could answer.",
        "It was my first look at infrastructure work in a large organization, where the interesting problems are often about making something visible.",
      ],
    },
  ],
  proBono: [
    {
      name: "Accenture Ottawa Community Consulting Program",
      role: "AI enablement lead, student consultant",
      when: "2026",
      line: "Part of a student consulting team exploring how AI could support employment counsellors, including a multi-agent prototype and an adoption roadmap.",
      body: [
        "This was a pro bono engagement through Accenture's Ottawa Community Consulting Program. We worked with a nonprofit employment services organization, exploring where counsellors were spending time and how AI might help with parts of their work.",
        "Our team developed a prototype using n8n and Azure OpenAI to process intake information, identify relevant jobs and certifications, and generate recommendations for counsellors to review. My focus was the AI workflow itself, including the agent instructions, structured outputs, and the checks between steps.",
        "Alongside the prototype, we worked on local labour market research, youth personas, and a roadmap covering privacy, human oversight, and what adopting a system like this would actually involve. It remained a prototype and wasn't deployed.",
        "What I liked about this engagement was that building the prototype was only one part of it. We also had to think about whether it would be useful for the people working with it and what the organization would need before putting something like it into practice.",
      ],
    },
  ],
  involvement: [
    {
      name: "uOttawa Business Technology Association",
      role: "VP development",
      when: "2026 –",
      line: "Developing intro to AI workshops for students, plus the association's website and corporate partnerships.",
      body: [
        "As VP of Development, I'm developing and leading a set of intro to AI workshops for students who want to learn more about it: what it is, how it works, and how to start using it. They're still in the works. I've also worked on the association's website and reached out to companies about partnerships and sponsorships.",
      ],
    },
  ],
  hacks: [
    {
      name: "Scotiabank S:/HACKS 2026",
      role: "Technical and pitch lead",
      when: "2026",
      line: "We spent the hackathon building a fintech prototype aimed at helping younger banking customers make better financial decisions. I worked on the technical development and led our final pitch. We finished fourth.",
    },
    {
      name: "uOttaHack 8",
      role: "Developer",
      when: "2026",
      line: "This was my first hackathon, and I got to spend the weekend building Recipe Hero with some of my friends. It was honestly a lot of fun.",
      href: "/projects/recipe-hero",
    },
  ],
};

/** About page: intro paragraphs and the contact block copy. */
export const about: {
  lead: string[];
  contactHeading: string;
  contactLine: string;
} = {
  lead: [
    "I'm a software engineering student at the University of Ottawa. I like building things end to end, and I like understanding where an idea comes from before I start on it.",
    "I've had the chance to work in software, infrastructure, quality assurance, and now management consulting. They've been pretty different experiences, which I think is part of what I've enjoyed about them.",
    "I tend to get pretty invested in the things I build. I like understanding how everything fits together, especially when a project takes me into something I haven't done before. I'm pretty much the same way with my interests outside of software.",
  ],
  contactHeading: "have an idea, a question, or want to connect?",
  contactLine: "Send it over, I read everything.",
};

type PageHead = { title: string; intro: string };

/** Section headers for each page. */
export const pages: {
  projects: PageHead;
  experience: PageHead;
  about: PageHead;
  elsewhere: PageHead;
} = {
  projects: {
    title: "some things i've made.",
    intro:
      "some for school, some for fun, and a couple because i couldn't stop thinking about the idea.",
  },
  experience: {
    title: "where i've worked.",
    intro:
      "software, quality, infrastructure and consulting: each one a different way of looking at the same problem.",
  },
  about: {
    title: "a little more about me.",
    intro: "",
  },
  elsewhere: {
    title: "nothing here yet.",
    intro: "this part of the site is intentionally empty for now.",
  },
};
