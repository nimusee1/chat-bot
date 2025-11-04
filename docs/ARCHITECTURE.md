# 아키텍처 문서

## 시스템 개요

개발의신 챗봇은 클라이언트-서버 아키텍처로 구성되어 있습니다.

```
┌─────────────────────┐
│   React Frontend    │
│  (Vite, TypeScript) │
└──────────┬──────────┘
           │ HTTP/SSE
           ▼
┌─────────────────────┐
│  Express Backend    │
│  (TypeScript)       │
└──────────┬──────────┘
           │ REST API
           ▼
┌─────────────────────┐
│  Gemini API         │
│  (gemini-1.5-flash) │
└─────────────────────┘
```

## 컴포넌트 구조

### 프론트엔드

#### Components
- **ChatRoom**: 전체 채팅 화면 레이아웃
  - 헤더 (제목, 버튼)
  - MessageList
  - InputBox

- **MessageList**: 메시지 스크롤 영역
  - 메시지 렌더링
  - 자동 스크롤

- **MessageBubble**: 개별 메시지
  - 사용자 메시지 (노란색)
  - 봇 메시지 (흰색)
  - 마크다운 렌더링

- **InputBox**: 메시지 입력
  - 자동 높이 조정
  - Enter 전송

- **Markdown**: 마크다운 렌더러
  - 코드 강조
  - 텍스트 서식

#### Libraries
- **react-markdown**: 마크다운 파싱
- **react-syntax-highlighter**: 코드 강조
- **uuid**: 메시지 ID 생성

### 백엔드

#### Express Routes
- `POST /api/chat`: 메시지 처리 및 스트리밍
- `GET /health`: 헬스 체크

#### Flow
1. 클라이언트 → 메시지 송신
2. 서버 → Gemini API 호출 (시스템 프롬프트 + 메시지 히스토리)
3. Gemini API → 스트리밍 응답
4. 서버 → SSE로 클라이언트 전달
5. 클라이언트 → 실시간 렌더링

## 데이터 흐름

### 메시지 전송
```
User Input
    ↓
InputBox Component
    ↓
handleSendMessage (ChatRoom)
    ↓
Create User Message + Bot Message
    ↓
Update React State (localStorage 자동 저장)
    ↓
streamChat API Call
    ↓
Express /api/chat
    ↓
Gemini API Request
    ↓
SSE Stream Response
    ↓
onChunk Callback
    ↓
Update Bot Message State
    ↓
MessageBubble Re-render
    ↓
Display in UI
```

## 상태 관리

### ChatRoom (Main State)
```typescript
const [messages, Message[]] = useState()  // 전체 메시지 히스토리
const [loading, boolean] = useState()     // 응답 대기 중 여부
```

**Persistence**: 메시지 변경 시 자동으로 localStorage에 저장

## API 명세

### POST /api/chat

**Request:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "사용자 메시지",
      "timestamp": 1234567890
    }
  ]
}
```

**Response (SSE):**
```
data: {"text": "응답 첫 번째 청크"}
data: {"text": " 응답 두 번째 청크"}
...
data: [DONE]
```

## 시스템 프롬프트

`src/prompts/system.md`에 정의된 "개발의신" 페르소나:
- 소프트웨어 개발 전문가
- 최신 기술 스택 지식
- 친절하고 상세한 설명
- 마크다운 포맷 사용

## 스타일 아키텍처

### CSS 전략
- **CSS Modules**: 컴포넌트별 독립적 스타일
- **전역 스타일**: `index.css` (리셋, 기본 설정)
- **반응형 디자인**: 모바일 우선 (@media queries)

### 색상 팔레트
- 배경: `#B8D4E8` (라이트 블루)
- 사용자 메시지: `#FFE165` (노란색)
- 봇 메시지: `#FFFFFF` (흰색)
- 텍스트: `#333` (진회색)

## 보안 고려사항

- ✅ API 키는 서버에서만 관리 (key.json)
- ✅ 클라이언트는 직접 Gemini API 호출 불가
- ✅ CORS 설정으로 도메인 보호
- ✅ 사용자 입력 안전 처리

## 성능 최적화

- ✅ React Hooks 사용 (함수형 컴포넌트)
- ✅ Vite로 빠른 번들링
- ✅ SSE 스트리밍으로 실시간 성능
- ✅ localStorage로 네트워크 요청 감소
- ✅ 자동 스크롤 smooth behavior

## 확장성 고려

향후 추가 가능한 기능:
1. 사용자 인증 및 계정 관리
2. 데이터베이스 연동 (메시지 히스토리 저장)
3. 다중 채팅방 지원
4. 첨부 파일 지원
5. 사용자 프로필 및 설정
6. 메시지 검색 및 필터링
