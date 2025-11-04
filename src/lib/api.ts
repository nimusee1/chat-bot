import type { Message } from './types';

const API_URL = 'http://localhost:3002/api/chat';

export const streamChat = async (
  messages: Message[],
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let finished = false;

    while (!finished) {
      const { done, value } = await reader.read();

      if (done) {
        // 스트림이 끝났을 때 남은 버퍼 처리
        if (buffer.trim()) {
          const lines = buffer.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  onChunk(parsed.text);
                }
              } catch (error) {
                // 파싱 실패한 라인은 무시
              }
            }
          }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            finished = true;
            break;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch (error) {
            // 파싱 실패한 라인은 무시
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
};
