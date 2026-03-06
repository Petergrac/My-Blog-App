export const postCategoryValues = [
  "frontend",
  "backend",
  "devops",
  "data structures",
  "data science",
  "testing",
  "system design",
] as const;

export type PostCategory = (typeof postCategoryValues)[number];

export const postCategories: ReadonlyArray<{
  value: PostCategory;
  label: string;
  description: string;
}> = [
  {
    value: "frontend",
    label: "Frontend",
    description: "Interfaces, accessibility, motion, and performance.",
  },
  {
    value: "backend",
    label: "Backend",
    description: "APIs, data models, auth, and service architecture.",
  },
  {
    value: "devops",
    label: "DevOps",
    description: "Deployment pipelines, observability, and reliability.",
  },
  {
    value: "data structures",
    label: "Data Structures",
    description: "Algorithms, systems thinking, and problem solving.",
  },
  {
    value: "data science",
    label: "Data Science",
    description: "Analysis, modeling, experiments, and decision support.",
  },
  {
    value: "testing",
    label: "Testing",
    description: "Confidence-building workflows, coverage, and QA practice.",
  },
  {
    value: "system design",
    label: "System Design",
    description: "Scalability, tradeoffs, and production architecture.",
  },
] as const;

export function getCategoryHref(category: string) {
  return `/categories/${encodeURIComponent(category)}`;
}

export function getCategoryLabel(category: string) {
  return (
    postCategories.find((item) => item.value === category)?.label ??
    category
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}
