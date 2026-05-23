import { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "physics",
    slug: "physics",
    name: "Physics",
    icon: "⚛️",
    description: "Research positions, summer schools, and fellowships in physics and astrophysics.",
  },
  {
    id: "chemistry",
    slug: "chemistry",
    name: "Chemistry",
    icon: "🧪",
    description: "Lab internships, research programs, and competitions in chemistry.",
  },
  {
    id: "biology",
    slug: "biology",
    name: "Biology",
    icon: "🧬",
    description: "Life sciences research, biotech internships, and fellowship programs.",
  },
  {
    id: "economics",
    slug: "economics",
    name: "Economics",
    icon: "📊",
    description: "Policy fellowships, economic research programs, and competitions.",
  },
  {
    id: "engineering",
    slug: "engineering",
    name: "Engineering",
    icon: "⚙️",
    description: "Core engineering internships, research grants, and technical programs.",
  },
  {
    id: "sde",
    slug: "sde",
    name: "SDE",
    icon: "💻",
    description: "Software engineering internships, open source programs, and hackathons.",
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finance",
    icon: "💹",
    description: "Investment banking, fintech internships, and finance competitions.",
  },
  {
    id: "research",
    slug: "research",
    name: "Research",
    icon: "🔬",
    description: "Interdisciplinary research fellowships, grants, and academic programs.",
  },
  {
    id: "government",
    slug: "government",
    name: "Government",
    icon: "🏛️",
    description: "Civil service, policy fellowships, and government internship programs.",
  },
  {
    id: "data-science",
    slug: "data-science",
    name: "Data Science",
    icon: "📈",
    description: "Machine learning internships, data competitions, and AI research programs.",
  },
  {
    id: "mba",
    slug: "mba",
    name: "MBA",
    icon: "🎓",
    description: "Business school programs, management fellowships, and case competitions.",
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);
