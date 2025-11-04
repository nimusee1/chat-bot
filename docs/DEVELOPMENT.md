# 개발 가이드

## 프로젝트 구조 이해

### 디렉토리 구성
```
chat-bot/
├── docs/                    # 📚 문서 (README, 아키텍처, 개발 가이드)
├── src/
│   ├── components/         # 🎨 React 컴포넌트
│   │   ├── ChatRoom.tsx   # 메인 채팅 화면
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── InputBox.tsx
│   │   ├── Markdown.tsx
│   │   └── *.css          # 컴포넌트 스타일
│   ├── lib/               # 🛠️ 유틸리티
│   │   ├── types.ts       # TypeScript 타입 정의
│   │   ├── storage.ts     # localStorage 관리
│   │   └── api.ts         # API 호출 함수
│   ├── server/            # 🔌 Express 백엔드
│   │   └── index.ts       # 서버 진입점
│   ├── prompts/           # 💬 시스템 프롬프트
│   │   └── system.md      # 개발의신 페르소나
│   ├── App.tsx
│   ├── main.tsx           # React 진입점
│   ├── index.css          # 글로벌 스타일
│   └── App.css
├── public/                # 정적 자산
├── key.json              # 🔑 Gemini API 키 (커밋 금지)
├── package.json          # npm 설정
├── tsconfig.json         # TypeScript 설정
├── vite.config.ts        # Vite 설정
└── README.md             # 이전 (docs/로 이동됨)
```

## 개발 워크플로우

### 1. 새 컴포넌트 작성

**템플릿:**
```typescript
// src/components/NewComponent.tsx
import React from 'react';
import './NewComponent.css';

interface NewComponentProps {
  // Props 정의
}

export const NewComponent: React.FC<NewComponentProps> = ({ }) => {
  return (
    <div className="new-component">
      {/* JSX */}
    </div>
  );
};
```

**스타일:**
```css
/* src/components/NewComponent.css */
.new-component {
  /* 스타일 정의 */
}

@media (max-width: 768px) {
  /* 모바일 반응형 */
}
```

### 2. 새 유틸리티 함수 작성

**위치:** `src/lib/`

```typescript
// src/lib/myUtility.ts
export const myFunction = (param: string): boolean => {
  return true;
};
```

### 3. 타입 정의

**위치:** `src/lib/types.ts`

```typescript
export interface MyType {
  id: string;
  name: string;
}
```

## 코드 스타일 가이드

### TypeScript

- 타입 명시 (any 사용 금지)
- 인터페이스 우선 (타입 별칭 지양)
- 함수 반환 타입 명시

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

const getUser = (id: string): User => {
  // ...
};

// ❌ Bad
const getUser = (id: any) => {
  // ...
};
```

### React

- 함수형 컴포넌트 사용 (클래스 컴포넌트 금지)
- Hooks 활용 (useState, useEffect, useContext)
- Props 타입 명시
- 조건부 렌더링은 && 또는 삼항연산자 사용

```typescript
// ✅ Good
const MyComponent: React.FC<MyComponentProps> = ({ isActive }) => {
  return isActive && <div>Active</div>;
};

// ❌ Bad
class MyComponent extends React.Component {
  // ...
}
```

### CSS

- CSS Modules 또는 BEM 네이밍 (일관성)
- 색상 변수 사용 (하드코딩 금지)
- 모바일 우선 반응형 디자인

```css
/* ✅ Good */
.message-bubble {
  background-color: #FFE165;
  padding: 12px 16px;
}

@media (max-width: 768px) {
  .message-bubble {
    padding: 8px 12px;
  }
}

/* ❌ Bad */
.messageBubble {
  background-color: #FFE165;
}
```

## 상태 관리

### localStorage 사용

```typescript
import { storage } from '@/lib/storage';

// 저장
storage.saveMessages(messages);

// 로드
const messages = storage.loadMessages();

// 삭제
storage.clearMessages();
```

### React State 관리

```typescript
const [messages, setMessages] = useState<Message[]>([]);

// 메시지 추가
setMessages(prev => [...prev, newMessage]);

// 메시지 수정
setMessages(prev =>
  prev.map(msg => msg.id === id ? { ...msg, content: newContent } : msg)
);
```

## API 호출

### 채팅 API 호출

```typescript
import { streamChat } from '@/lib/api';

await streamChat(
  messages,
  (chunk) => {
    // 응답 청크 처리
    updateMessage(chunk);
  },
  (error) => {
    // 에러 처리
    console.error(error);
  }
);
```

## 테스트

### 단위 테스트 (예정)
```bash
npm run test
```

### 통합 테스트 (예정)
```bash
npm run test:integration
```

### 수동 테스트 체크리스트

- [ ] 메시지 전송 및 수신
- [ ] 마크다운 렌더링
- [ ] localStorage 저장/복구
- [ ] 에러 처리
- [ ] 모바일 반응형
- [ ] 브라우저 호환성

## 디버깅

### 브라우저 DevTools
1. F12 또는 Cmd+Option+I (Mac)
2. Console: 에러 메시지 확인
3. Network: API 요청 확인
4. Application: localStorage 확인

### 서버 로깅
```bash
# 서버 콘솔에서 로그 확인
npm run dev:server
```

### 마크다운 렌더링 테스트
```markdown
# Heading 1
## Heading 2

**Bold** *Italic* `code`

```javascript
console.log('Hello');
```

- List item 1
- List item 2
```

## 자주 하는 작업

### 새 메시지 타입 추가

1. `src/lib/types.ts`에 타입 추가
```typescript
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  // 새 필드 추가
  reactions?: string[];
}
```

2. 컴포넌트 수정 (예: MessageBubble)
3. localStorage 호환성 확인

### 색상 변경

1. `src/components/*.css` 파일 수정
2. 주요 색상:
   - 배경: `#B8D4E8`
   - 사용자 메시지: `#FFE165`
   - 봇 메시지: `#FFFFFF`

### API 응답 형식 변경

1. `src/lib/types.ts` 업데이트
2. `src/server/index.ts` 백엔드 로직 수정
3. `src/lib/api.ts` 클라이언트 파서 수정

## 성능 최적화

### React 성능
- `React.memo()` 사용 (필요시)
- useCallback 사용 (콜백 함수)
- useMemo 사용 (복잡한 계산)

### 번들 크기
```bash
# 번들 분석
npm run build -- --analyze
```

### 런타임 성능
- 불필요한 리렌더링 제거
- localStorage 쿼리 최소화
- API 요청 최적화

## 커밋 메시지 규칙

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- feat: 새 기능
- fix: 버그 수정
- docs: 문서 변경
- style: 코드 스타일 변경
- refactor: 리팩토링
- perf: 성능 개선
- test: 테스트 추가

**Example:**
```
feat(ChatRoom): add emoji support to input box

- Added emoji picker component
- Updated InputBox to handle emoji selection
- Modified message rendering for proper emoji display

Closes #123
```

## 추가 리소스

- [React 공식 문서](https://react.dev)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Vite 가이드](https://vitejs.dev)
- [Express.js 문서](https://expressjs.com)
