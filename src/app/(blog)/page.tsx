import FeaturedPost from "@/components/FeaturedPost";
import MostRecent from "@/components/MostRecent";
import { getLatestPost } from "@/lib/postQueries";
import Link from "next/link";

export default async function Home() {
  // Fetch the latest posts;
  const posts = await getLatestPost();
  if (posts.length === 0) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <Link href="/new">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>

        <h2 className="text-2xl font-semibold text-muted-foreground">
          No posts found
        </h2>

        <p className="text-sm text-muted-foreground max-w-md">
          There are currently no posts available on your dashboard. If
          you&apos;re seeing this, it&apos;s because no content has been created
          yet.
        </p>

        <div className="text-sm text-muted-foreground max-w-md">
          <p className="font-medium">Want to become an author?</p>
          <p className="mt-1">
            You can start contributing by changing your account role from{" "}
            <span className="font-semibold">user</span> to{" "}
            <span className="font-semibold">author</span>. Just follow these
            quick steps:
          </p>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>Click on your profile icon in the top right corner.</li>
            <li>
              Select <span className="font-medium">Manage Account</span>.
            </li>
            <li>
              Under the <span className="font-medium">Role</span> section,
              switch from{" "}
              <code className="px-1 py-0.5 bg-muted text-sm rounded">user</code>{" "}
              to{" "}
              <code className="px-1 py-0.5 bg-muted text-sm rounded">
                author
              </code>
              .
            </li>
            <li>Save changes and return to start posting!</li>
          </ul>
        </div>

        <Link
          href="/create"
          className="inline-flex border mt-6 px-4 py-2 text-sm font-medium  rounded hover:bg-muted anim"
        >
          Create your first post
        </Link>
      </div>
    );
  }
  const filteredPost = posts.filter((post) => post.category === "testing");
  return (
    <div>
      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-2 gap-y-5 pt-1 justify-center border-b-[1px] pb-3 md:pb-5">
        <Link
          className="text-xs font-lora p-2 hover:bg-foreground/55"
          href="/categories/frontend"
        >
          FRONTEND
        </Link>
        <Link
          className="text-xs font-lora p-2 hover:bg-foreground/55"
          href="/categories/backend"
        >
          BACKEND
        </Link>
        <Link
          className="text-xs font-lora p-2 hover:bg-foreground/55"
          href="/categories/devops"
        >
          DEVOPS
        </Link>
        <Link
          className="text-xs font-lora p-2 hover:bg-foreground/55"
          href="/categories/data-structures"
        >
          DATA STRUCTURES
        </Link>
        <Link
          className="text-xs font-lora p-2 hover:bg-foreground/55"
          href="/categories/data-science"
        >
          DATA SCIENCE
        </Link>
        <Link
          className="text-xs font-lora p-2 hover:bg-foreground/55"
          href="/categories/testing"
        >
          TESTING
        </Link>
        <Link
          className="text-xs font-lora p-2 hover:bg-foreground/55"
          href="/categories/system-design"
        >
          SYSTEM DESIGN
        </Link>
      </div>
      {/* FEATURED */}
      <div className="mt-10 mb-5 max-w-[1080px] mx-auto">
        <p className="text-center text-lg pb-5 underline underline-offset-5">
          Featured Posts
        </p>
        <div className="flex flex-wrap flex-1 gap-5 md:m-5 m-2">
          {filteredPost.map((post) => (
            <FeaturedPost post={post} key={post.id} />
          ))}
        </div>
      </div>
      {/* RECENT POSTS*/}
      <div className="mt-5 mb-10 max-w-[1080px] mx-auto">
        <p className="text-lg text-center underline underline-offset-5">
          Most Recent
        </p>
        <div className="flex flex-wrap gap-2 gap-y-5 mt-5">
          {posts.map((post) => (
            <MostRecent key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
