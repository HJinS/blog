# 블로그 글 작성 및 수정 가이드 (NOTE.md)

이 문서는 블로그(`https://blog.hjins.dev`)에 새로운 글을 작성하거나 기존 글을 수정·이동할 때 Google Search Console(GSC) 색인 및 SEO 문제가 재발하지 않도록 지켜야 할 규칙을 정리한 메모입니다.

---

## 1. 파일 경로 및 URL 규칙

- **저장 위치**: `src/content/posts/<대분류>/<소분류>/<파일명>.mdx` (2단 카테고리 구조)
  - 예: `src/content/posts/cs/os/page-cache-fsync.mdx` → 배포 URL: `/posts/cs/os/page-cache-fsync/`
- **파일명 규칙**: 영문 소문자와 하이픈(`kebab-case`)으로 작성합니다.
  - 대문자가 섞여 있어도 빌드 시 소문자 URL로 변환되지만, 파일명 자체를 소문자 `kebab-case`로 통일하는 것이 안전합니다.

---

## 2. Frontmatter 작성 규칙

```yaml
---
author: 허진수
pubDatetime: 2026-11-17T09:00:00.000Z
modDatetime: 2026-11-18T12:00:00.000Z # 기존 글을 대폭 수정했을 때만 추가/갱신
title: "글 제목을 명확하게 작성"
featured: false
draft: false
tags:
  - os
  - filesystem
description: "글의 핵심 내용을 요약한 1~2문장(약 50~150자). 검색엔진 스니펫과 메타 설명에 그대로 사용됩니다."
---
```

1. **`pubDatetime` (필수)**
   - UTC 기준(`Z`) ISO 8601 형식으로 작성합니다.
   - **주의**: 빌드 시점보다 **미래 시각**(15분 이상 미래)으로 설정되어 있으면 예약 글로 간주되어 **실제 배포 사이트와 `sitemap-0.xml`에서 제외**됩니다. 한국 시간(KST)에서 9시간을 뺀 UTC 시각인지 확인하세요.
2. **`modDatetime` (기존 글 수정 시)**
   - 이미 발행된 글의 내용을 대폭 보강하거나 수정했을 때 `modDatetime`을 현재 UTC 시각으로 추가/갱신합니다.
   - `modDatetime`을 갱신하면 `sitemap-0.xml`의 `<lastmod>`와 구조화 데이터(`dateModified`)가 업데이트되어 구글봇의 재크롤링 우선순위가 높아집니다. (단, 글 목록 정렬도 `modDatetime` 기준으로 최신순 배치됩니다.)
3. **`title` & `description` (필수)**
   - 다른 글과 중복되지 않는 고유한 제목과 요약문을 작성합니다.
   - 제목에 콜론(`:`)이 들어갈 경우 YAML 파싱 에러 방지를 위해 큰따옴표(`"..."`)로 감싸주세요.

---

## 3. 본문 내 내부 링크 작성 규칙 (중요 ⭐️)

GitHub Pages는 정적 디렉토리(`.../index.html`) 구조로 서빙하므로 **모든 표준(Canonical) URL 끝에 슬래시(`/`)가 붙습니다.**
본문에서 블로그 내부의 다른 글을 링크할 때 **반드시 끝에 `/`를 붙여야 합니다.** (`/`를 빼먹으면 매번 `301 Redirect`가 발생하여 Google Search Console에서 *"페이지에 리디렉션이 있음"* 으로 분류됩니다.)

- ✅ **올바른 예시 (끝에 `/` 포함)**:
  ```markdown
  자세한 내용은 [페이지 캐시와 fsync](/posts/cs/os/page-cache-fsync/)에서 다룬다.
  관련 사례는 [클러스터드 vs 세컨더리 인덱스](/posts/cs/database/clustered-vs-secondary-index/#7-사례)를 참고한다.
  ```
- ❌ **잘못된 예시 (끝에 `/` 누락)**:
  ```markdown
  자세한 내용은 [페이지 캐시와 fsync](/posts/cs/os/page-cache-fsync)에서 다룬다.
  관련 사례는 [클러스터드 vs 세컨더리 인덱스](/posts/cs/database/clustered-vs-secondary-index#7-사례)를 참고한다.
  ```

---

## 4. 기존 글의 경로(카테고리) 이동 또는 파일명 변경 시

이미 한 번 이상 배포된 글의 폴더 위치를 옮기거나 파일명(슬러그)을 바꿀 때는 다음 두 가지를 함께 수정해야 합니다.

1. **`astro.config.ts`의 `redirects` 등록**
   - 이전 URL로 들어오는 검색엔진/외부 링크가 404가 되지 않도록 리다이렉트를 추가합니다.
   - 이때 **도착 URL(Target)의 끝에도 반드시 `/`를 붙여야 합니다.**
   ```ts
   // 예: /posts/old-path -> /posts/cs/os/new-path/
   "/posts/old-path": "/posts/cs/os/new-path/",
   ```
2. **다른 글 본문에서 해당 글을 가리키던 내부 링크 일괄 수정**
   - 이전 경로를 바라보던 마크다운 링크들을 새 경로(`/posts/.../`)로 직접 업데이트합니다.

---

## 5. 배포 전 확인 명령어

글 작성을 마친 후 아래 명령어로 빌드 및 포맷 이상 유무를 확인할 수 있습니다.

```bash
pnpm run build
```
