# pet-doc-talk

**AI 수의사 상담 + 반려인 커뮤니티 서비스**

PetDocTalk은 AI 수의사와의 상담을 통해 반려동물의 건강·행동·생활 전반에 대해 도움을 받을 수 있는 서비스입니다.

단순한 Q&A를 넘어, 반려인 커뮤니티를 통해 경험을 공유하고 공감하며 함께 성장하는 반려동물 라이프를 지향합니다.

---

## 주요 기능

### AI 수의사 상담

- **실시간 채팅 기반 상담**: OpenAI GPT 모델을 활용한 전문적인 수의학 상담
- **반려동물 프로필 관리**: 강아지/고양이 정보, 품종, 나이, 성별 등록 및 관리
- **포인트 시스템**: 신규 가입 시 3회 무료 상담 제공
- **대화 히스토리**: 과거 상담 내역 보관 및 재확인 가능

### 커뮤니티

- **카테고리별 게시판**: 자유게시판, 질문게시판, 정보공유 등
- **계층형 댓글**: 댓글 및 대댓글 기능
- **리치 텍스트 에디터**: TipTap을 활용한 에디터

### 인증 및 보안

- **카카오 소셜 로그인**: OAuth 2.0 기반 인증
- **JWT 토큰 인증**: Access Token + Refresh Token 자동 갱신
- **프로필 관리**: 닉네임, 프로필 이미지 설정

---

## 기술 스택

### Backend

- **Framework**: NestJS 11
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL 18
- **ORM**: Prisma 7
- **Authentication**: JWT + Kakao OAuth 2.0
- **AI**: OpenAI API (GPT-5-nano)
- **File Storage**: AWS S3 + CloudFront
- **API Documentation**: Swagger/OpenAPI
- **Transaction Management**: @nestjs-cls/transactional
- **Validation**: class-validator + class-transformer
- **Testing**: Jest

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Rich Text Editor**: TipTap
- **HTTP Client**: Axios
- **XSS Protection**: DOMPurify
- **Image Optimization**: browser-image-compression
- **Toast Notifications**: Sonner

### Infrastructure

- **Containerization**: Docker Compose
- **Process Manager**: PM2

---

## 프로젝트 구조

```
pet-doc-talk/
├── server/              # NestJS 백엔드 (포트 3000)
│   ├── src/
│   │   ├── auth/        # 인증 (JWT, Kakao OAuth)
│   │   ├── users/       # 사용자 관리
│   │   ├── pets/        # 반려동물 관리
│   │   ├── consultations/  # AI 상담
│   │   ├── points/      # 포인트 시스템
│   │   ├── posts/       # 커뮤니티 게시글
│   │   ├── comments/    # 댓글
│   │   └── uploads/     # 파일 업로드
│   ├── prisma/          # DB 스키마 및 마이그레이션
│   └── generated/       # Prisma Client
│
├── client/              # Next.js 프론트엔드 (포트 3001)
│   └── src/
│       ├── app/         # App Router 페이지
│       ├── components/  # React 컴포넌트
│       ├── lib/         # 유틸리티 (API 클라이언트 등)
│       ├── hooks/       # Custom Hooks
│       └── store/       # Zustand 스토어
│
└── docker-compose.yml   # PostgreSQL 컨테이너
```

---

## 시작하기

### 사전 요구사항

- **Node.js**: v20 이상
- **Yarn**: 패키지 매니저
- **Docker**: PostgreSQL 컨테이너 실행용

### 1. 저장소 클론

```bash
git clone <repository-url>
cd pet-doc-talk
```

### 2. PostgreSQL 실행

```bash
docker compose up -d
```

### 3. 백엔드 설정 및 로컬 환경 실행

```bash
cd server

# 의존성 설치
yarn install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필수 값 입력

# Prisma 마이그레이션 및 클라이언트 생성
yarn migrate:dev

# 시드 데이터 생성
yarn seed

# 개발 서버 실행
yarn start:dev
```

서버: http://localhost:3000

Swagger 문서: http://localhost:3000/docs

### 4. 프론트엔드 설정 및 로컬 환경 실행

```bash
cd client

# 의존성 설치
yarn install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필수 값 입력

# 개발 서버 실행
yarn dev
```

프론트엔드: http://localhost:3001

---

## 개발 스크립트

### 서버

```bash
yarn start:dev          # 개발 서버 (hot-reload)
yarn build              # 프로덕션 빌드
yarn start:prod         # 프로덕션 실행 (PM2)
yarn test               # 테스트 실행
yarn format             # Prettier 포맷팅
yarn lint               # ESLint 검사
yarn migrate:dev        # Prisma 마이그레이션
```

### 클라이언트

```bash
yarn dev                # 개발 서버
yarn build              # 프로덕션 빌드
yarn start              # 프로덕션 실행
yarn lint               # ESLint 검사
```
