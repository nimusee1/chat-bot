import React, { useEffect, useRef } from "react";
import type { Message } from "../lib/types";
import { MessageBubble } from "./MessageBubble";
import "./MessageList.css";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">개발의신과 대화를 시작하세요</div>
          <div className="empty-subtitle">
            소프트웨어 개발에 관한 모든 질문을 물어보세요
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
      <div ref={endRef} />
    </div>
  );
};
