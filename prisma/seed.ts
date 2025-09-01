// import { PrismaClient } from "../src/generated/prisma/index.js";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// const categories: string[] = [
//   "frontend",
//   "backend",
//   "devops",
//   "data structures",
//   "data science",
//   "testing",
//   "system design",
// ];

// const tiptapJSON = () =>
//   JSON.stringify({
//     type: "doc",
//     content: [
//       {
//         type: "paragraph",
//         content: [{ type: "text", text: faker.lorem.paragraph() }],
//       },
//     ],
//   });

// async function main() {
//   // Clear previous data (for dev only)
//   await prisma.like.deleteMany();
//   await prisma.comment.deleteMany();
// //   await prisma.post.deleteMany();
// //   await prisma.user.deleteMany();

//   // Create users
//   const users = await Promise.all(
//     Array.from({ length: 5 }).map(() =>
//       prisma.user.create({
//         data: {
//           clerkId: faker.string.uuid(),
//           username: faker.internet.username(),
//           email: faker.internet.email(),
//           country: faker.location.country(),
//           bio: faker.person.bio(),
//           avatar: faker.image.avatar(),
//         },
//       })
//     )
//   );

//   // Create posts
//   const posts = await Promise.all(
//     Array.from({ length: 20 }).map(() => {
//       const author = faker.helpers.arrayElement(users);
//       const category = faker.helpers.arrayElement(categories);

//       return prisma.post.create({
//         data: {
//           title: faker.lorem.sentence(),
//           category,
//           coverImage: faker.image.urlPicsumPhotos(),
//           state: faker.helpers.arrayElement(["PUBLISHED", "DRAFT"]),
//           content: tiptapJSON(),
//           description: faker.lorem.sentences(2),
//           authorId: author.id,
//         },
//       });
//     })
//   );

//   // Add comments
//   for (const post of posts) {
//     const numComments = faker.number.int({ min: 1, max: 5 });
//     for (let i = 0; i < numComments; i++) {
//       const commenter = faker.helpers.arrayElement(users);
//       await prisma.comment.create({
//         data: {
//           content: faker.lorem.sentence(),
//           postId: post.id,
//           authorId: commenter.id,
//         },
//       });
//     }
//   }

//   // Add likes
//   for (const post of posts) {
//     const shuffledUsers = faker.helpers.shuffle(users);
//     const numLikes = faker.number.int({ min: 1, max: users.length });
//     for (let i = 0; i < numLikes; i++) {
//       await prisma.like.create({
//         data: {
//           postId: post.id,
//           userId: shuffledUsers[i].id,
//         },
//       });
//     }
//   }

//   console.log("✅ Seed complete.");
// }

// main()
//   .catch((err) => {
//     console.error("❌ Seed error:", err);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect();
//   });
