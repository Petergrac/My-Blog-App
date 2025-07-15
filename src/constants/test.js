const posts = [
  {
    id: "1",
    title: "Understanding JavaScript Closures",
    content: "Closures are functions that have access to variables from another function’s scope...",
    image_url: "https://source.unsplash.com/random/800x600?code",
    shared: false,
    likes: 12,
    published: true,
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-07-01T10:00:00Z",
    ownerId: "admin-001"
  },
  {
    id: "2",
    title: "How to Build REST APIs with Node.js",
    content: "This article walks you through setting up Express, handling routes, and organizing controllers...",
    image_url: "https://source.unsplash.com/random/800x600?api",
    shared: true,
    likes: 45,
    published: true,
    createdAt: "2025-07-03T15:32:00Z",
    updatedAt: "2025-07-04T10:12:00Z",
    ownerId: "author-001"
  },
  {
    id: "3",
    title: "Deploying PostgreSQL in Production",
    content: "PostgreSQL is powerful, but it needs tuning for production use. This post covers backups, indexing, and config...",
    image_url: "https://source.unsplash.com/random/800x600?database",
    shared: false,
    likes: 7,
    published: false,
    createdAt: "2025-07-07T09:15:00Z",
    updatedAt: "2025-07-07T09:15:00Z",
    ownerId: "admin-001"
  },
  {
    id: "4",
    title: "Mastering Flexbox: CSS Layout Simplified",
    content: "Flexbox makes it easy to build modern layouts. This guide breaks down each property with visual demos...",
    image_url: "https://source.unsplash.com/random/800x600?css",
    shared: true,
    likes: 30,
    published: true,
    createdAt: "2025-07-08T11:45:00Z",
    updatedAt: "2025-07-09T08:00:00Z",
    ownerId: "author-002"
  },
  {
    id: "5",
    title: "Intro to GSAP Animations",
    content: "GSAP lets you create performant, smooth animations with clean syntax. Here's how to get started with it and Vite...",
    image_url: "https://source.unsplash.com/random/800x600?animation",
    shared: false,
    likes: 18,
    published: true,
    createdAt: "2025-07-10T18:23:00Z",
    updatedAt: "2025-07-10T18:25:00Z",
    ownerId: "admin-001"
  }
];
const contentBlock = [
    {
        heading:'Exprole Knowledge from every corner of life',
        content: 'Over 1,000+ expert articles on a wide range of topics',
        main_content: 'From everyday tech tips to groundbreaking scientific discoveries, our blog is a gateway to deep insights and practical knowledge.'
    }
];
export  {
    posts,
    contentBlock
};