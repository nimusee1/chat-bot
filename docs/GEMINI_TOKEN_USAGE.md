# Gemini API 토큰 사용량 예측 가이드

## 개요

이 문서는 이 프로젝트에서 Google Gemini API를 사용할 때 예상되는 토큰 사용량과 비용을 계산하는 방법을 설명합니다.

## Gemini API 가격 정책 (2024년 기준)

### gemini-2.5-flash 모델

| 항목 | 가격 |
|------|------|
| 입력 토큰 (Input) | $0.075 / 백만 토큰 |
| 출력 토큰 (Output) | $0.30 / 백만 토큰 |

**참고:** 가격은 변동될 수 있으므로 [Google AI Pricing](https://ai.google.dev/pricing) 페이지에서 최신 정보를 확인하세요.

## 프로젝트 설정

### 현재 설정

```typescript
// src/server/index.ts
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2000,  // 최대 출력 토큰
  }
});
```

## 토큰 사용량 계산

### 1. 입력 토큰 (User Message)

평균 사용자 메시지 크기: **100-200 토큰**
- 1 토큰 ≈ 4-5 문자
- 한국어: 1 토큰 ≈ 1-2 글자

예시:
- 짧은 질문 (10-20자): ~5-10 토큰
- 일반적인 질문 (50-100자): ~20-50 토큰
- 긴 질문 (200자 이상): ~80-150 토큰

### 2. 출력 토큰 (Assistant Response)

현재 설정: **최대 2,000 토큰**
- 평균 출력: ~500-1,500 토큰
- 1 메시지당 예상 출력: **1,000 토큰** (평균)

### 3. 시스템 프롬프트

`src/prompts/system.md` 파일의 내용:
- 예상 크기: ~500-1,000 토큰
- **매 요청마다** 입력에 포함됨

## 비용 예측

### 시나리오별 계산

#### 1. 경량 사용 (일일 50 메시지)

```
일일 메시지: 50개
한 메시지당 예상 토큰:
  - 시스템 프롬프트: 750 토큰
  - 사용자 메시지: 100 토큰
  - 어시스턴트 응답: 1,000 토큰
  - 대화 히스토리: 평균 500 토큰 (누적)
  - 합계: ~2,350 토큰/메시지

일일 사용량: 50 × 2,350 = 117,500 토큰
입력: 117,500 × 0.6 = 70,500 토큰 → $5.29
출력: 117,500 × 0.4 = 47,000 토큰 → $14.10
일일 비용: ~$19.39

월간 비용: 19.39 × 30 = $581.70
```

#### 2. 중간 사용 (일일 200 메시지)

```
일일 메시지: 200개
예상 일일 비용: $581.70 × 4 = $2,326.80
월간 비용: ~$2,327
```

#### 3. 고용량 사용 (일일 500 메시지)

```
일일 메시지: 500개
예상 일일 비용: $581.70 × 10 = $5,817
월간 비용: ~$5,817
```

## 토큰 사용량 최적화

### 1. 시스템 프롬프트 최적화

**현재 상태:** 매 요청마다 전체 시스템 프롬프트 포함

**개선 방법:**
- 시스템 프롬프트 길이 축소
- 가장 중요한 지침만 유지
- 세부 사항은 사용자에게 제공

**예상 절감:** 30-50% 입력 토큰 감소

### 2. 대화 히스토리 관리

**현재 상태:** 모든 이전 메시지를 히스토리에 포함

**개선 방법:**
```typescript
// 최근 10개 메시지만 유지
const recentHistory = messages.slice(-10);
```

**예상 절감:** 20-40% 입력 토큰 감소

### 3. 출력 토큰 제한

**현재 설정:** `maxOutputTokens: 2000`

**개선 방법:**
```typescript
// 상황에 따라 조정
const generationConfig = {
  temperature: 0.7,
  maxOutputTokens: isBriefQuestion ? 500 : 1500,
};
```

**예상 절감:** 20-30% 출력 토큰 감소

## 비용 모니터링

### 1. Google Cloud Console에서 확인

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 선택
3. **Billing** → **Reports** 메뉴
4. **Generative Language API** 사용량 확인

### 2. 프로그래매틱 모니터링 (구현 예시)

```typescript
// src/server/index.ts에 추가 가능
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

function trackTokenUsage(usage: TokenUsage) {
  console.log(`[Token Usage]`);
  console.log(`  Prompt: ${usage.promptTokens}`);
  console.log(`  Completion: ${usage.completionTokens}`);
  console.log(`  Total: ${usage.totalTokens}`);
}
```

## 비용 절감 전략

### 우선순위별 추천

| 순위 | 전략 | 효과 | 난이도 |
|------|------|------|--------|
| 1 | 히스토리 길이 제한 (최근 5-10개) | 20-40% ↓ | 낮음 |
| 2 | 시스템 프롬프트 최적화 | 30-50% ↓ | 낮음 |
| 3 | 동적 `maxOutputTokens` 설정 | 10-30% ↓ | 중간 |
| 4 | 캐싱 전략 도입 | 15-25% ↓ | 높음 |
| 5 | 다른 모델 평가 (gemini-1.5) | 변동 가능 | 높음 |

## 월간 예산 제안

| 사용 규모 | 추정 월간 비용 | 권장 예산 |
|----------|--------|----------|
| 경량 (50 msg/day) | $500-700 | $1,000 |
| 중간 (200 msg/day) | $2,000-2,500 | $3,000 |
| 고용량 (500 msg/day) | $5,000-6,000 | $7,000 |

## 주의사항

### Free Tier 정책

Google Generative AI는 무료 사용 가능하지만:
- **Rate Limit:** 요청/분 및 일일 요청 수 제한
- **타임아웃:** 요청당 최대 처리 시간 제한
- **할당량:** Free Tier의 할당량 확인 필요

### 프로덕션 배포

프로덕션 환경에서는:
1. 예상 비용 계산 및 예산 책정
2. 사용량 모니터링 및 알림 설정
3. 월간 청구 한도 설정 (Google Cloud Console에서)
4. 정기적인 비용 분석 및 최적화

## 참고 자료

- [Google AI Python SDK](https://github.com/google/generative-ai-python)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Google Cloud Billing](https://cloud.google.com/billing/docs)
- [토큰 카운팅 도구](https://ai.google.dev/docs/tokens)

## 업데이트 이력

| 날짜 | 내용 |
|------|------|
| 2025-11-04 | 초기 문서 작성 |
