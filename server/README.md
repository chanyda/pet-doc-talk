# pet-doc-talk Server

## NestJS 11 기반의 PetDocTalk 백엔드 API 서버입니다.

---

## 아키텍처

### 백엔드 레이어 구조

```
Controller (HTTP + Swagger)
  ↓
Service (비즈니스 로직 + @Transactional)
  ↓
Repository (데이터 접근)
  ↓
Prisma Client
```

### 주요 패턴

- **Repository Pattern**: 모든 Repository는 인터페이스 구현
- **Transaction Management**: DB 트랜잭션이 필요한 작업은 `@Transactional()` 사용
- **Authentication**: JWT Bearer 토큰 (httpOnly cookie), `@Auth()` 데코레이터
- **Validation**: class-validator를 활용한 DTO 검증
- **API Documentation**: Swagger 데코레이터로 자동 문서화

---

### 주요 모델

- **User**: 사용자 계정 (Kakao OAuth)
- **Point**: 사용자 포인트 (1:1 관계)
- **PointHistory**: 포인트 사용/획득 내역
- **Pet**: 반려동물 정보 (DOG/CAT)
- **Consultation**: AI 상담 세션
- **ConsultationConversation**: OpenAI 상담 Conversation
- **ConsultationMessage**: 상담 메시지
- **Post**: 커뮤니티 게시글
- **Comment**: 댓글/대댓글 (계층형)
- **Category**: 게시판 카테고리

---

## API 엔드포인트

### 인증

- `GET /auth/kakao/callback` - 카카오 로그인 콜백
- `POST /auth/refresh` - 토큰 갱신
- `POST /auth/logout` - 로그아웃

### 사용자

- `GET /users/me` - 내 프로필 조회
- `PATCH /users/me` - 프로필 수정

### 반려동물

- `GET /pets` - 내 반려동물 목록
- `GET /pets/:id` - 내 반려동물 조회
- `POST /pets` - 반려동물 등록
- `PATCH /pets/:id` - 반려동물 수정
- `DELETE /pets/:id` - 반려동물 삭제

### 포인트

- `GET /points/me` - 내 포인트 조회

### 상담

- `GET /consultations` - 상담 목록
- `POST /consultations` - 새 상담 시작
- `DELETE /consultations/:consultationId` - 상담 삭제
- `GET /consultations/:consultationId/messages` - 메시지 목록
- `POST /consultations/:consultationId/messages` - 메시지 전송 (SSE 스트리밍)

### 게시글

- `GET /posts` - 게시글 목록 (커서 페이징, 공개)
- `GET /posts/me` - 내 게시글 목록
- `GET /posts/:id` - 게시글 상세 (공개)
- `POST /posts` - 게시글 작성
- `PATCH /posts/:id` - 게시글 수정
- `DELETE /posts/:id` - 게시글 삭제

### 댓글

- `GET /posts/:postId/comments` - 댓글 목록 (공개)
- `GET /comments/:commentId/replies` - 대댓글 목록 (공개)
- `GET /comments/me` - 내 댓글 목록
- `POST /posts/:postId/comments` - 댓글/대댓글 작성
- `PATCH /comments/:id` - 댓글 수정
- `DELETE /comments/:id` - 댓글 삭제

### 이미지

- `POST /images/uploads` - 이미지 업로드 URL 요청 (S3 Presigned URL)

### 카테고리

- `GET /categories` - 카테고리 목록 (공개)

전체 API 문서: http://localhost:3000/docs

---

## 빌드 및 배포

### 프로덕션 빌드

```bash
# TypeScript 컴파일
yarn build

# Prisma 마이그레이션 (프로덕션 DB)
yarn migrate:prod
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 프로덕션 실행

```bash
yarn start:prod
```
