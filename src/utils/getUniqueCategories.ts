import type { CollectionEntry } from "astro:content";
import { getPostCategoryPath } from "./getPostPaths";
import { postFilter } from "./postFilter";

export type CategoryGroup = {
  group: string;
  count: number;
  subs: { sub: string; count: number }[];
};

/**
 * Builds a sorted two-level category tree from the folders of posts:
 * `<group>/<sub>/post.mdx`.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - Names are the slugs used in URLs and for display
 * - Posts directly under `<group>/` count toward the group only
 * - Posts without a folder have no category and are skipped
 */
export function getCategoryTree(posts: CollectionEntry<"posts">[]) {
  const groups = new Map<string, { count: number; subs: Map<string, number> }>();

  for (const post of posts.filter(postFilter)) {
    const [group, sub] = getPostCategoryPath(post.filePath);
    if (!group) continue;

    const entry = groups.get(group) ?? { count: 0, subs: new Map() };
    entry.count += 1;
    if (sub) entry.subs.set(sub, (entry.subs.get(sub) ?? 0) + 1);
    groups.set(group, entry);
  }

  const tree: CategoryGroup[] = [...groups]
    .map(([group, { count, subs }]) => ({
      group,
      count,
      subs: [...subs]
        .map(([sub, count]) => ({ sub, count }))
        .sort((a, b) => a.sub.localeCompare(b.sub)),
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
  return tree;
}
