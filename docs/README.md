# 개발의신 - AI 챗봇

Gemini API를 활용한 소프트웨어 개발 전문 AI 챗봇입니다.

## 프로젝트 특징

- **Pure React + Vite**: 모던한 빌드 환경과 빠른 개발 서버
- **Express 백엔드**: Gemini API와의 통신 담당
- **실시간 스트리밍**: SSE(Server-Sent Events)를 통한 응답 실시간 전달
- **마크다운 지원**: 코드블록, 서식 등 완전한 마크다운 렌더링
- **로컬 스토리지**: 인증 없이 대화 히스토리 자동 저장
- **채팅방 스타일**: 실제 채팅 앱과 유사한 UI/UX

## 설치 및 실행

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행

**프론트엔드만 실행:**
```bash
npm run dev
```

**백엔드 서버만 실행:**
```bash
npm run dev:server
```

**프론트엔드 + 백엔드 동시 실행 (권장):**
```bash
npm run dev:all
```

백엔드는 `http://localhost:3001`에서, 프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ChatRoom.tsx    # 메인 채팅 화면
│   ├── MessageList.tsx # 메시지 목록
│   ├── MessageBubble.tsx # 개별 메시지 버블
│   ├── InputBox.tsx    # 입력 상자
│   ├── Markdown.tsx    # 마크다운 렌더러
│   └── *.css           # 컴포넌트별 스타일
├── lib/                # 유틸리티 및 타입
│   ├── types.ts        # TypeScript 타입 정의
│   ├── storage.ts      # localStorage 관리
│   └── api.ts          # API 호출 함수
├── styles/             # 글로벌 스타일
│   └── globals.css
├── server/             # Express 백엔드
│   └── index.ts        # 서버 진입점
├── prompts/            # 시스템 프롬프트
│   └── system.md       # 개발의신 페르소나
└── main.tsx            # React 진입점
```

## 주요 기능

### 1. 실시간 메시지 스트리밍
- Gemini API로부터 토큰 단위 응답을 받아 실시간으로 표시
- SSE(Server-Sent Events)를 통한 효율적인 스트리밍

### 2. 마크다운 렌더링
- 코드 블록: 문법 강조(syntax highlighting)
- 텍스트 서식: 굵게, 기울임, 링크 등
- 테이블, 인용문, 리스트 등 완전한 마크다운 지원

### 3. 대화 히스토리 관리
- 브라우저 localStorage에 자동 저장
- 페이지 새로고침 후에도 대화 유지
- 메시지 타임스탬프 표시

### 4. 반응형 디자인
- 모바일/태블릿/데스크톱 모두 지원
- chatroom.jpeg 스타일을 기반으로 한 디자인

## API 명세

### POST /api/chat
챗봇에 메시지를 보내고 응답을 스트리밍으로 받습니다.

**요청:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "메시지 내용",
      "timestamp": 1234567890
    }
  ]
}
```

**응답 (SSE 스트림):**
```
data: {"text": "응답의 첫 번째 청크"}
data: {"text": " 응답의 두 번째 청크"}
...
data: [DONE]
```

## 환경 설정

### key.json
프로젝트 루트에 `key.json` 파일이 필요합니다:

```json
{
  "key": "YOUR_GEMINI_API_KEY"
}
```

## 기술 스택

- **프론트엔드**
  - React 18+
  - TypeScript
  - Vite
  - CSS Modules
  - react-markdown
  - react-syntax-highlighter

- **백엔드**
  - Express.js
  - TypeScript
  - CORS

- **API**
  - Google Gemini API (gemini-1.5-flash)

## 브라우저 지원

- Chrome/Edge (최신)
- Firefox (최신)
- Safari (최신)
