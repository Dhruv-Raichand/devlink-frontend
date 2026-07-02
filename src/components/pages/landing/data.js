export const SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Docker",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Kubernetes",
  "Next.js",
  "Vue",
  "Flutter",
  "Swift",
  "Kotlin",
];

export const PROFILES = [
  {
    id: 1,
    photo:
      "https://i.pinimg.com/originals/5d/5d/22/5d5d226151f9cd1e8087bc84a1b03a90.png",
    firstName: "Kai",
    lastName: "Verma",
    age: 25,
    role: "Cybersecurity engineer",
    about:
      "Building secure systems, automation tools, and exploring cloud infrastructure.",
    skills: ["Rust", "Go", "Docker", "AWS"],
    status: "Online",
  },

  {
    id: 2,
    photo: "https://logos.ai/wp-content/uploads/2025/01/Logo-design-tools.jpg",
    firstName: "Maya",
    lastName: "Chen",
    age: 24,
    role: "Frontend engineer",
    about:
      "Creating beautiful interfaces with React and modern design systems.",
    skills: ["React", "TypeScript", "Next.js", "Figma"],
    status: "Online",
  },

  {
    id: 3,
    photo:
      "https://5.imimg.com/data5/SELLER/Default/2024/10/460049956/CJ/LB/OD/11069576/freelance-graphic-designer-1000x1000.jpg",
    firstName: "Leo",
    lastName: "Martins",
    age: 26,
    role: "Product designer",
    about: "Designing digital products, experiences, and creative interfaces.",
    skills: ["Figma", "UI/UX", "Motion", "Branding"],
    status: "Away",
  },

  {
    id: 4,
    photo:
      "https://img.freepik.com/premium-photo/programming-background-with-person-working-with-codes-computer_1054941-32164.jpg",
    firstName: "Aarav",
    lastName: "Mehta",
    age: 27,
    role: "Full-stack engineer",
    about: "Building realtime tools with React, Node.js, and clean systems.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    status: "Online",
  },
];

export const STATS = [
  { n: "2.4k", label: "Developers" },
  { n: "840+", label: "Connections made", featured: true },
  { n: "30+", label: "Tech stacks" },
];

export const PRICING = [
  {
    name: "Free",
    price: "Free",
    description: "Start meeting developers",
    features: ["10 swipes per day", "Basic profile", "Connections", "Chat"],
  },
  {
    name: "Pro",
    price: "Rs 499",
    suffix: "/mo",
    description: "For active collaborators",
    popular: true,
    features: [
      "Unlimited swipes",
      "Skill filters",
      "See who liked you",
      "Read receipts",
    ],
  },
  {
    name: "Elite",
    price: "Rs 999",
    suffix: "/mo",
    description: "Maximum visibility",
    features: [
      "Priority in feed",
      "Weekly profile boost",
      "Verified badge",
      "Everything in Pro",
    ],
  },
];

export const FEATURES = [
  { title: "Match by stack", demo: "skills" },
  { title: "Real-time chat", demo: "chat" },
  { title: "GitHub linking", demo: "github" },
  { title: "Swipe to connect", demo: "swipe" },
];
