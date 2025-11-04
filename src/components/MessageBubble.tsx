import React from "react";
import type { Message } from "../lib/types";
import { Markdown } from "./Markdown";
import "./MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`message-container ${isUser ? "user-message" : "bot-message"}`}
    >
      <div className="message-wrapper">
        <div
          className={`message-bubble ${isUser ? "user-bubble" : "bot-bubble"}`}
        >
          {isUser ? (
            <p className="message-text">{message.content}</p>
          ) : (
            <div className="message-markdown">
              <Markdown content={message.content} />
            </div>
          )}
        </div>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};
