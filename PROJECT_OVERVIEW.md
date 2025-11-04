# 개발의신 - 프로젝트 개요

Gemini API를 활용한 소프트웨어 개발 전문 AI 챗봇입니다.

## 🎯 프로젝트 목표

- 사용자 친화적인 채팅 인터페이스
- 실시간 AI 응답 스트리밍
- 마크다운 기반 풍부한 콘텐츠 표현
- 로컬 저장소 기반 히스토리 관리
- 인증 없이 빠른 접근

## ✨ 주요 특징

| 특징 | 설명 |
|------|------|
| **실시간 스트리밍** | SSE를 통한 토큰 단위 응답 전달 |
| **마크다운 지원** | 코드 강조, 서식, 테이블 등 완전 지원 |
| **로컬 저장소** | 대화 히스토리 자동 저장/복구 |
| **반응형 디자인** | 모바일/태블릿/데스크톱 완벽 지원 |
| **통합 구조** | 프론트/백엔드 단일 저장소 관리 |
| **최신 기술스택** | React 18, TypeScript, Express, Vite |

## 📂 문서 구조

```
docs/
├── README.md           # 설치 및 사용 가이드
├── SETUP.md           # 개발 환경 설정 & 배포
├── ARCHITECTURE.md    # 시스템 아키텍처
└── DEVELOPMENT.md     # 개발 가이드 & 코드 스타일
```

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. API 키 설정 (key.json)
echo '{"key": "YOUR_API_KEY"}' > key.json

# 3. 개발 서버 실행
npm run dev:all

# 브라우저 접속
# - 프론트엔드: http://localhost:5173
# - 백엔드: http://localhost:3001
```

자세한 설정은 [docs/SETUP.md](docs/SETUP.md) 참조

## 🏗️ 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
├── lib/              # 유틸리티 & 타입
├── server/           # Express 백엔드
├── prompts/          # 시스템 프롬프트
└── styles/           # 전역 스타일
```

전체 구조는 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) 참조

## 💻 기술 스택

### 프론트엔드
- React 18+ with Hooks
- TypeScript
- Vite (번들러)
- CSS Modules
- react-markdown + react-syntax-highlighter

### 백엔드
- Express.js
- TypeScript
- Node.js 18+

### 외부 API
- Google Gemini API (gemini-1.5-flash)

## 📋 개발 명령어

```bash
# 개발
npm run dev          # 프론트엔드만
npm run dev:server   # 백엔드만
npm run dev:all      # 통합 (권장)

# 빌드
npm run build        # 프로덕션 빌드

# 기타
npm run lint         # ESLint 실행
npm run preview      # 빌드 결과 미리보기
```

## 🔑 설정 파일

### key.json (필수)
```json
{
  "key": "YOUR_GEMINI_API_KEY"
}
```

⚠️ **주의**: .gitignore에 추가되어 있으니 절대 커밋하지 마세요.

### .env (선택)
```
PORT=3001
NODE_ENV=development
```

## 🎨 UI/UX 특징

### 색상 팔레트
- 배경: `#B8D4E8` (라이트 블루)
- 사용자 메시지: `#FFE165` (노란색)
- 봇 메시지: `#FFFFFF` (흰색)
- 텍스트: `#333` (진회색)

### 레이아웃
- 헤더 (제목, 메뉴)
- 메시지 목록 (스크롤 가능)
- 입력 상자 (자동 높이 조정)

## 📊 시스템 아키텍처

```
┌─────────────┐
│   Browser   │
│ (React SPA) │ ◄───────────────┐
└──────┬──────┘                 │
       │ HTTP/SSE               │ localStorage
       │                        │
       ▼                        │
┌─────────────┐                │
│   Express   │                │
│  Backend    │                │
└──────┬──────┘                │
       │ REST API               │
       ▼                        │
┌─────────────────────────────┘
│   Gemini API
│  (gemini-1.5-flash)
└──────────────────────────────
```

자세한 아키텍처는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참조

## 🔒 보안

- ✅ API 키는 서버에서만 관리
- ✅ 클라이언트는 직접 Gemini API 호출 불가
- ✅ CORS 설정으로 도메인 보호
- ✅ 입력 값 안전 처리

## 🚦 상태 관리

### 데이터 흐름
1. **사용자 입력** → InputBox
2. **메시지 생성** → ChatRoom 상태
3. **API 호출** → Express 서버
4. **Gemini 요청** → SSE 스트리밍
5. **실시간 렌더링** → MessageBubble

### localStorage
- `chat_history`: 메시지 배열 저장
- 페이지 새로고침 후 자동 복구

## 📈 성능 최적화

- Vite: 빠른 번들링 & HMR
- React Hooks: 효율적 상태 관리
- SSE: 효율적 스트리밍
- 자동 스크롤: smooth behavior
- 로컬 저장소: 네트워크 요청 감소

## 🧪 테스트

### 수동 테스트 체크리스트
- [ ] 메시지 전송/수신
- [ ] 마크다운 렌더링
- [ ] localStorage 저장/복구
- [ ] 에러 처리
- [ ] 반응형 레이아웃
- [ ] 브라우저 호환성

자동화 테스트는 향후 추가 예정

## 🔄 Git 워크플로우

### 브랜치 전략
```
main (프로덕션)
  ↑
develop (개발)
  ↑
feature/* (새 기능)
```

### 커밋 규칙
```
<type>(<scope>): <subject>

예시:
- feat(ChatRoom): add emoji support
- fix(API): handle Gemini API timeout
- docs(README): update installation guide
```

## 📞 문제 해결

### 자주 묻는 질문

**Q: API 키는 어디서 얻나요?**
A: [Google AI Studio](https://makersuite.google.com/app/apikey)에서 무료 API 키 발급

**Q: 로컬 저장소에만 저장하나요?**
A: 현재는 로컬 저장소만 지원. DB 연동은 향후 추가 예정

**Q: 사용자 인증이 필요한가요?**
A: 현재는 인증 없음. 향후 추가 가능

자세한 문제 해결은 [docs/SETUP.md](docs/SETUP.md) 참조

## 🎓 학습 자료

- [React 공식 문서](https://react.dev)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Vite 가이드](https://vitejs.dev)
- [Express.js 문서](https://expressjs.com)

## 📝 라이선스

MIT

## 👤 유지보수

프로젝트 관리 및 기여는 [DEVELOPMENT.md](docs/DEVELOPMENT.md) 참조

---

**Last Updated**: 2024년 11월 4일
**Node Version**: 18+
**npm Version**: 최신
