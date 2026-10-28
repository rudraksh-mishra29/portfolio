import neural from "@/assets/neural.jpg";
import orbit from "@/assets/orbit.jpg";
import cube from "@/assets/cube.jpg";

// Empty fields are intentional: never represent sample work as verified personal work.
export const profile = {
  name: "Rudraksh",
  tagline: "AI Engineer | Full Stack Developer | Creative Builder",
  email: "",
  phone: "",
  location: "",
  resume: "",
  github: "",
  linkedin: "",
};

// Verified academic details. Graduation year stays blank until Rudraksh confirms it.
export const education = {
  institution: "JECRC University",
  degree: "B.Tech",
  fieldOfStudy: "Artificial Intelligence & Data Science",
  branch: "AI & Data Science",
  yearOfStudy: "2nd Year",
  semester: "3rd Semester",
  graduationYear: "",
};

// Compact labels reused by the hero badge, timeline, panel, and footer.
export const educationLabel = `${education.degree} ${education.branch}`;
export const educationStatus = `${education.yearOfStudy} · ${education.semester}`;

export const projects = [
  {
    id: "01",
    name: "Neural intelligence",
    category: "AI / MACHINE LEARNING",
    image: neural,
    description:
      "A space for intelligent systems. Your first AI project, the problem it solves, and its story will live here.",
    tech: ["Python", "PyTorch", "FastAPI"],
    github: "",
    live: "",
    sample: true,
  },
  {
    id: "02",
    name: "Connected experiences",
    category: "FULL STACK DEVELOPMENT",
    image: orbit,
    description:
      "Thoughtful interfaces. Powerful foundations. A space for your full-stack project and the experience behind it.",
    tech: ["React", "TypeScript", "Node.js"],
    github: "",
    live: "",
    sample: true,
  },
  {
    id: "03",
    name: "Systems at scale",
    category: "BACKEND ENGINEERING",
    image: cube,
    description:
      "A home for your backend work — from a first API to the systems that bring ambitious ideas to life.",
    tech: ["Python", "PostgreSQL", "Docker"],
    github: "",
    live: "",
    sample: true,
  },
];
export const skillGroups = [
  {
    name: "AI & ML",
    icon: "brain",
    description: "Models, learning systems, and intelligent applications.",
    tech: ["Python", "PyTorch", "TensorFlow", "scikit-learn"],
  },
  {
    name: "Frontend",
    icon: "code",
    description: "Expressive interfaces and considered digital experiences.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Three.js"],
  },
  {
    name: "Backend",
    icon: "server",
    description: "APIs, services, and the architecture behind the experience.",
    tech: ["Node.js", "Python", "FastAPI", "REST APIs"],
  },
  {
    name: "Data & Cloud",
    icon: "database",
    description: "Reliable data, connected infrastructure, and deployment.",
    tech: ["PostgreSQL", "MongoDB", "Docker", "AWS"],
  },
  {
    name: "Creative Tools",
    icon: "sparkles",
    description: "The tools that turn an idea into something tangible.",
    tech: ["Git", "Figma", "Linux", "VS Code"],
  },
];
