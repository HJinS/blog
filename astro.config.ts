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
// to the new ones.
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

const redirects: Record<string, string> = {
  "/tags": "/categories",
  ...Object.fromEntries(
    Object.entries(movedPosts).flatMap(([category, slugs]) =>
      slugs.map(slug => [`/posts/${slug}`, `/posts/${category}/${slug}`])
    )
  ),
};

export default defineConfig({
  site: config.site.url,
  base: "/",
  redirects,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
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
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
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
