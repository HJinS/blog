import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://hjins.github.io",
    title: "메모장",
    description: "잊지 않기 위한 메모장",
    author: "진수",
    profile: "https://www.linkedin.com/in/hjins",
    ogImage: "default-og.jpg",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
      url: "https://github.com/HJinS/HJinS.github.io/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/HJinS" },
    { name: "linkedin", url: "https://www.linkedin.com/in/hjins" },
    { name: "mail",     url: "mailto:windowed18@gmail.com" },
  ],
  shareLinks: [
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});