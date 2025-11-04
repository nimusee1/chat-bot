# 설정 및 배포 가이드

## 개발 환경 설정

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn
- Gemini API 키 (Google AI Studio에서 발급)

### 설치 단계

1. **저장소 클론 및 디렉토리 이동**
```bash
cd /Users/sumin/dev/claude-playground/chat/chat-bot
```

2. **의존성 설치**
```bash
npm install
```

3. **API 키 설정**

프로젝트 루트에 `.env.local` 파일 생성:
```bash
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
PORT=3002
NODE_ENV=development
```

> **보안**: `.env.local`은 절대 Git에 커밋하지 마세요. `.gitignore`에 추가됨.
>
> 실제 개발 과정:
> 1. `.env.example` 파일을 템플릿으로 사용
> 2. `.env.local` 파일을 생성하여 실제 키 입력
> 3. `.env.local`은 로컬에서만 사용

4. **개발 서버 실행**

**옵션 A: 통합 실행 (권장)**
```bash
npm run dev:all
```
- 프론트엔드: http://localhost:5174 (또는 사용 가능한 포트)
- 백엔드: http://localhost:3002

**옵션 B: 별도 실행**

터미널 1:
```bash
npm run dev          # Vite 개발 서버
```

터미널 2:
```bash
npm run dev:server   # Express 백엔드
```

## 환경 변수

### 백엔드 (.env 또는 key.json)
```
PORT=3001           # Express 서버 포트
GEMINI_API_KEY=...  # Gemini API 키 (현재는 key.json 사용)
```

### 프론트엔드
API URL은 하드코딩됨: `http://localhost:3001/api/chat`

## 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

빌드 결과:
- `dist/`: React 앱 빌드 결과 (정적 파일)
- 백엔드는 별도로 컴파일 필요

### 배포 구조 (예시)

```
production/
├── dist/                    # React 빌드 결과
│   ├── index.html
│   ├── assets/
│   └── ...
├── server.js               # 컴파일된 Express 서버
├── prompts/
│   └── system.md
├── key.json               # API 키 (환경변수 권장)
└── package.json
```

### Docker 배포 (선택사항)

Dockerfile 예시:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# 프론트엔드 빌드
RUN npm run build

EXPOSE 3001 5173

CMD ["npm", "run", "dev:all"]
```

## 프로덕션 체크리스트

- [ ] API 키 환경변수로 관리
- [ ] 오류 로깅 설정
- [ ] CORS 정책 확인
- [ ] SSL/TLS 설정
- [ ] 모니터링 & 알림 설정
- [ ] 백업 전략 수립
- [ ] 성능 최적화 (압축, 캐싱)

## 문제 해결

### 서버가 시작되지 않음

```bash
# 포트 확인
lsof -i :3001    # 3001 포트 사용 확인
lsof -i :5173    # 5173 포트 사용 확인

# 포트 해제
kill -9 <PID>
```

### API 키 오류

```
Failed to load API key from key.json
```

해결:
- `key.json`이 프로젝트 루트에 있는지 확인
- 파일 형식 확인 (유효한 JSON)
- 파일 권한 확인

### CORS 오류

```
Access to XMLHttpRequest blocked by CORS policy
```

해결:
- Express 서버가 실행 중인지 확인 (`http://localhost:3001/health`)
- CORS 설정 확인 (`src/server/index.ts`)
- 브라우저 개발자 도구 Network 탭 확인

### 메시지가 전송되지 않음

1. 네트워크 탭에서 POST 요청 확인
2. 서버 콘솔에 에러 메시지 확인
3. API 키 유효성 확인
4. Gemini API 할당량 확인

## 성능 튜닝

### 프론트엔드
- Vite: 자동 코드 분할
- React: 자동 최적화
- 번들 분석: `npm run build -- --analyze`

### 백엔드
- Node.js 클러스터 모드 사용
- 요청 타임아웃 설정
- 메모리 제한 설정

## 로깅

### 프론트엔드
- 브라우저 Console에서 확인
- localStorage 확인: `localStorage.chat_history`

### 백엔드
- 콘솔 로그: `console.log()`, `console.error()`
- 파일 로깅 추가 (선택사항): winston, pino 등

## 모니터링

### 헬스 체크
```bash
curl http://localhost:3001/health
```

### 메트릭 추가 (선택사항)
- Prometheus 통합
- Grafana 대시보드
- APM 모니터링 (New Relic, DataDog 등)
