/**
 * Korean display names and descriptions for category pages.
 *
 * Keys are category folder paths under `src/content/posts/`:
 * `<group>` or `<group>/<sub>`. The description is used for the page's
 * `<meta name="description">` and as the intro line under the heading, so
 * each one should be unique and summarize what the category actually covers.
 *
 * When adding a new category folder, add an entry here too. Categories without
 * an entry fall back to the generic English text.
 */
export type CategoryInfo = {
  label: string;
  description: string;
};

const categoryInfo: Record<string, CategoryInfo> = {
  cs: {
    label: "CS 기초",
    description:
      "운영체제, 네트워크, 데이터베이스, 컴퓨터 구조, 분산 시스템, 알고리즘, 보안까지 백엔드 개발의 바탕이 되는 컴퓨터 과학 개념을 원리부터 따라가며 정리한 글 모음이다.",
  },
  "cs/algorithm": {
    label: "알고리즘과 자료구조",
    description:
      "해시 테이블, 힙과 타이밍 휠, Trie, LRU 캐시, Skip List와 Bloom filter, 정렬과 최단 경로, 정규식 엔진까지 자료구조와 알고리즘이 실제 시스템에서 어떻게 쓰이는지 정리한다.",
  },
  "cs/architecture": {
    label: "컴퓨터 구조",
    description:
      "숫자 표현과 메모리 레이아웃, 캐시 계층과 캐시 일관성, 메모리 모델과 배리어, CAS와 lock-free, NUMA, 파이프라인과 분기 예측까지 CPU와 메모리가 동작하는 방식을 다룬다.",
  },
  "cs/database": {
    label: "데이터베이스",
    description:
      "B+tree와 LSM-tree, 인덱스 설계, 트랜잭션 격리 수준과 MVCC, InnoDB 락, 직렬 가능성, 조인 알고리즘, WAL과 크래시 복구까지 데이터베이스의 내부 동작을 정리한다.",
  },
  "cs/distributed": {
    label: "분산 시스템",
    description:
      "복제와 CAP, PACELC, 일관성 모델과 쿼럼, Raft 합의, 2단계 커밋, 논리 시계, 분산 락과 fencing token, 멱등성까지 여러 노드가 협력할 때 생기는 문제를 다룬다.",
  },
  "cs/network": {
    label: "네트워크",
    description:
      "TCP 연결 수립과 종료, 신뢰성, 흐름 제어와 혼잡 제어, MTU와 PMTUD, DNS, TLS 1.3, HTTP/2와 HTTP/3까지 네트워크 프로토콜의 동작과 장애 사례를 정리한다.",
  },
  "cs/os": {
    label: "운영체제",
    description:
      "프로세스와 스레드, 스케줄링, 락과 동기화, 가상 메모리와 페이지 교체, 메모리 할당과 OOM, 파일 시스템과 페이지 캐시, I/O 멀티플렉싱까지 운영체제의 핵심 동작을 다룬다.",
  },
  "cs/security": {
    label: "보안",
    description:
      "비밀번호 저장을 위한 salt와 KDF처럼 백엔드 개발자가 알아야 할 보안의 기초 원리를 정리한다.",
  },
  dev: {
    label: "개발 실무",
    description:
      "Spring, Kotlin, Redis, Kafka, DDD 등으로 실제 서비스를 개발하며 마주친 설계 결정, 버그, 트러블슈팅을 정리한 글 모음이다.",
  },
  "dev/architecture": {
    label: "아키텍처",
    description:
      "DDD 전략적 설계와 전술적 설계, Port/Adapter와 인터페이스 경계, 조회 계층과 N+1 문제처럼 애플리케이션 구조를 설계하며 정리한 내용을 모았다.",
  },
  "dev/auth": {
    label: "인증과 인가",
    description:
      "Spring Security로 구현한 카카오와 애플 OAuth2 로그인, JWT 발급과 세션 관리, AWS KMS를 이용한 refresh token 암호화 등 인증을 구현하며 정리한 내용을 다룬다.",
  },
  "dev/backend": {
    label: "백엔드",
    description:
      "Spring의 @Transactional과 @TransactionalEventListener 함정, Jackson 3 직렬화, STOMP 세션 추적, 외부 API 응답 처리, Django 정리 등 백엔드 개발 중 겪은 문제와 해법을 모았다.",
  },
  "dev/cache": {
    label: "캐시",
    description:
      "Redis 자료구조 선택, Redis와 RDB 비교, 캐시 무효화와 Cache Stampede처럼 캐시를 설계하고 운영하며 정리한 내용을 다룬다.",
  },
  "dev/concurrency": {
    label: "동시성",
    description:
      "Spring @Async와 Kotlin 코루틴의 선택 기준, Java 21 가상 스레드의 pinning 문제처럼 동시성 도구를 실무에 적용하며 정리한 글을 모았다.",
  },
  "dev/database": {
    label: "데이터베이스 실무",
    description:
      "FK 없는 스키마 설계, SQL NULL과 3값 논리 때문에 생긴 필터 버그처럼 실제 서비스의 데이터베이스 설계와 쿼리 문제를 다룬다.",
  },
  "dev/messaging": {
    label: "메시징",
    description:
      "Kafka의 구조와 기본 개념, 파티셔닝 전략과 순서 보장처럼 메시지 브로커를 이해하고 사용하며 정리한 내용을 다룬다.",
  },
};

export const categoriesIndexDescription =
  "글을 CS 기초(cs)와 개발 실무(dev) 두 갈래로 나누고, 그 아래 운영체제, 네트워크, 데이터베이스, 아키텍처 같은 세부 주제별로 모은 카테고리 목록이다.";

export function getCategoryInfo(path: string[]): CategoryInfo | undefined {
  return categoryInfo[path.join("/")];
}
