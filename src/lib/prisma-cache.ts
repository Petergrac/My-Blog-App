import { prismaAccelerate } from "./prisma";

const ACCELERATE_TAG_LIMIT = 5;
const ACCELERATE_TAG_MAX_LENGTH = 64;
const DEFAULT_TTL_SECONDS = 60;
const DEFAULT_SWR_SECONDS = 300;

function normalizeTag(tag: string) {
  return tag
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, ACCELERATE_TAG_MAX_LENGTH);
}

function uniqueTags(tags: ReadonlyArray<string>) {
  return Array.from(
    new Set(
      tags
        .map(normalizeTag)
        .filter((tag): tag is string => tag.length > 0),
    ),
  );
}

function createTag(prefix: string, value?: string) {
  return normalizeTag(value ? `${prefix}_${value}` : prefix);
}

export const accelerateTags = {
  publicPosts: createTag("public_posts"),
  postCategories: createTag("post_categories"),
  post: (postId: string) => createTag("post", postId),
  category: (category: string) => createTag("category", category),
};

export function withPublicPostCache(
  tags: ReadonlyArray<string> = [],
  options?: {
    ttl?: number;
    swr?: number;
  },
) {
  return {
    cacheStrategy: {
      ttl: options?.ttl ?? DEFAULT_TTL_SECONDS,
      swr: options?.swr ?? DEFAULT_SWR_SECONDS,
      tags: uniqueTags([accelerateTags.publicPosts, ...tags]).slice(
        0,
        ACCELERATE_TAG_LIMIT,
      ),
    },
  } as const;
}

export async function invalidateAccelerateTags(tags: ReadonlyArray<string>) {
  const resolvedTags = uniqueTags(tags);

  if (resolvedTags.length === 0) {
    return;
  }

  const invalidations = [];

  for (
    let index = 0;
    index < resolvedTags.length;
    index += ACCELERATE_TAG_LIMIT
  ) {
    invalidations.push(
      prismaAccelerate.$accelerate.invalidate({
        tags: resolvedTags.slice(index, index + ACCELERATE_TAG_LIMIT),
      }),
    );
  }

  const results = await Promise.allSettled(invalidations);
  const failedInvalidation = results.find(
    (result) => result.status === "rejected",
  );

  if (failedInvalidation?.status === "rejected") {
    console.error(
      "Failed to invalidate Prisma Accelerate cache.",
      failedInvalidation.reason,
    );
  }
}
