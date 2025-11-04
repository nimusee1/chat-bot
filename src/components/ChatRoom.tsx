import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '../lib/types';
import { storage } from '../lib/storage';
import { streamChat } from '../lib/api';
import { MessageList } from './MessageList';
import { InputBox } from './InputBox';
import './ChatRoom.css';

export const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 초기 로드 시 localStorage에서 메시지 복구
  useEffect(() => {
    const savedMessages = storage.loadMessages();
    setMessages(savedMessages);
  }, []);

  // 메시지 변경 시 localStorage에 저장
  useEffect(() => {
    storage.saveMessages(messages);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const botMessageId = uuidv4();
    const botMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setLoading(true);

    try {
      await streamChat(
        [...messages, userMessage],
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const messageIndex = updated.findIndex((m) => m.id === botMessageId);
            if (messageIndex !== -1) {
              updated[messageIndex] = {
                ...updated[messageIndex],
                content: updated[messageIndex].content + chunk,
              };
            }
            return updated;
          });
        },
        (error) => {
          console.error('Chat error:', error);
          const errorMessage: Message = {
            id: botMessageId,
            role: 'assistant',
            content: `오류가 발생했습니다: ${error.message}`,
            timestamp: Date.now(),
          };
          setMessages((prev) => {
            const updated = [...prev];
            const messageIndex = updated.findIndex((m) => m.id === botMessageId);
            if (messageIndex !== -1) {
              updated[messageIndex] = errorMessage;
            }
            return updated;
          });
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-room">
      <header className="chat-header">
        <button className="back-btn">←</button>
        <h1 className="chat-title">개발의신</h1>
        <div className="header-icons">
          <button className="header-icon">🔍</button>
          <button className="header-icon">☰</button>
        </div>
      </header>

      <MessageList messages={messages} />

      <InputBox onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};
