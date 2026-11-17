import fs from "node:fs";
import path from "node:path";
import {
  defineConfig,
  envField,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderWhitespace,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { remarkMermaid } from "./src/utils/remarkMermaid";
import config from "./astro-paper.config";

// Posts moved into `<group>/<sub>` category folders: the old flat URLs redirect
// to the new ones (with trailing slash to match GitHub Pages canonical URLs).
const movedPosts: Record<string, string[]> = {
  "cs/database": ["db-summary"],
  "cs/network": ["http2-vs-http3-quic"],
  "cs/os": ["process-vs-thread-context-switching"],
  "dev/architecture": [
    "ddd-1",
    "ddd-2",
    "ddd-3",
    "ddd-4",
    "port-adapter-interface-boundary",
    "query-layer-cqrs-n-plus-one",
  ],
  "dev/auth": [
    "apple-oauth2-login",
    "kakao-oauth2-login",
    "kms-oauth-refresh-token-encryption",
    "jwt-session-management",
  ],
  "dev/backend": [
    "django-summary",
    "naver-api-text-plain-json-response",
    "spring-boot-4-jackson-3-redis-serialization",
    "spring-self-invocation-requires-new",
    "stomp-session-tracking-pitfalls",
    "transactional-event-listener-after-commit",
  ],
  "dev/cache": [
    "redis-summary",
    "redis-vs-rdb-loss-risk",
    "redis-string-vs-hash-caching",
    "cache-invalidation-stampede",
  ],
  "dev/concurrency": [
    "virtual-thread-pinning",
    "spring-async-vs-kotlin-coroutine",
  ],
  "dev/database": [
    "fk-less-schema-design",
    "sql-null-three-valued-logic-price-filter",
  ],
  "dev/messaging": [
    "kafka-architecture-fundamentals",
    "kafka-partitioning-strategy",
  ],
};

// Legacy tag URLs that existed before migrating from `/tags/<tag>/` to `/categories/`.
const movedTags: Record<string, string[]> = {
  "cs/database": ["database"],
  "cs/network": ["http"],
  "dev/architecture": ["architecture", "ddd"],
  "dev/auth": [
    "apple",
    "aws",
    "jwt",
    "kakao",
    "oauth2",
    "security",
    "session",
  ],
  "dev/backend": [
    "bug",
    "django",
    "event-driven",
    "jackson",
    "jpa",
    "migration",
    "spring",
    "spring-boot",
    "webclient",
    "websocket",
  ],
  "dev/cache": ["caching", "redis"],
  "dev/concurrency": [
    "async",
    "concurrency",
    "coroutine",
    "kotlin",
    "performance",
  ],
  "dev/database": ["querydsl"],
  "dev/messaging": ["kafka"],
};

const redirects: Record<string, string> = {
  "/tags": "/categories/",
  ...Object.fromEntries(
    Object.entries(movedPosts).flatMap(([category, slugs]) =>
      slugs.map(slug => [`/posts/${slug}`, `/posts/${category}/${slug}/`])
    )
  ),
  ...Object.fromEntries(
    Object.entries(movedTags).flatMap(([category, tags]) =>
      tags.map(tag => [`/tags/${tag}`, `/categories/${category}/`])
    )
  ),
};

function buildSitemapLastmodMap(siteUrl: string): Map<string, string> {
  const baseUrl = siteUrl.replace(/\/+$/, "");
  const lastmodMap = new Map<string, Date>();
  const postsRoot = path.resolve("./src/content/posts");

  const updateMaxDate = (url: string, date: Date) => {
    const prev = lastmodMap.get(url);
    if (!prev || date > prev) {
      lastmodMap.set(url, date);
    }
  };

  const walk = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(entry => {
      if (entry.name.startsWith("_")) return [];
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(fullPath) : [fullPath];
    });
  };

  if (fs.existsSync(postsRoot)) {
    const files = walk(postsRoot).filter(
      f => f.endsWith(".md") || f.endsWith(".mdx")
    );
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fmMatch) continue;
      const fm = fmMatch[1];
      if (/^draft:\s*true\b/m.test(fm)) continue;

      const pubMatch = fm.match(/^pubDatetime:\s*(.+)$/m);
      const modMatch = fm.match(/^modDatetime:\s*(.+)$/m);
      const rawDate = (modMatch?.[1] ?? pubMatch?.[1])?.trim();
      if (!rawDate) continue;
      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) continue;

      const slugMatch = fm.match(/^slug:\s*(.+)$/m);
      const fileSlug = path
        .basename(file, path.extname(file))
        .toLowerCase();
      const slug = (slugMatch?.[1]?.trim() || fileSlug).replace(
        /^["']|["']$/g,
        ""
      );

      const relDir = path
        .relative(postsRoot, path.dirname(file))
        .split(path.sep)
        .filter(Boolean)
        .map(s => s.toLowerCase());

      const postPath =
        relDir.length > 0
          ? `/posts/${relDir.join("/")}/${slug}/`
          : `/posts/${slug}/`;

      updateMaxDate(`${baseUrl}${postPath}`, date);
      updateMaxDate(`${baseUrl}/`, date);
      updateMaxDate(`${baseUrl}/about/`, date);
      updateMaxDate(`${baseUrl}/posts/`, date);
      updateMaxDate(`${baseUrl}/archives/`, date);
      updateMaxDate(`${baseUrl}/categories/`, date);

      if (relDir[0]) {
        updateMaxDate(`${baseUrl}/categories/${relDir[0]}/`, date);
      }
      if (relDir[0] && relDir[1]) {
        updateMaxDate(
          `${baseUrl}/categories/${relDir[0]}/${relDir[1]}/`,
          date
        );
      }
    }
  }

  return new Map(
    [...lastmodMap.entries()].map(([url, d]) => [url, d.toISOString()])
  );
}

const sitemapLastmodMap = buildSitemapLastmodMap(config.site.url);

export default defineConfig({
  site: config.site.url,
  base: "/",
  redirects,
  integrations: [
    mdx(),
    sitemap({
      filter: page => {
        if (
          config.features?.showArchives === false &&
          page.endsWith("/archives/")
        ) {
          return false;
        }
        // Exclude search page and paginated listing pages (/2/, /3/, ...)
        if (page.endsWith("/search/")) return false;
        if (/\/\d+\/$/.test(page)) return false;
        return true;
      },
      serialize: item => {
        const lastmod = sitemapLastmodMap.get(item.url);
        if (lastmod) {
          item.lastmod = lastmod;
        }
        return item;
      },
    }),
  ],
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkMermaid,
        remarkMath,
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
        transformerRenderWhitespace({
          position: "all",
          classSpace: "space",
          classTab: "tab",
        }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
