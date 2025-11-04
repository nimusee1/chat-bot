import React, { useState, useRef, useEffect } from 'react';
import './InputBox.css';

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSend(trimmedInput);
      setInput('');
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="input-box">
      <div className="input-wrapper">
        <button className="emoji-btn">😊</button>
        <textarea
          ref={inputRef}
          className="input-field"
          placeholder="메시지 입력"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <button className="hash-btn">#</button>
      </div>
      <button
        className={`send-btn ${disabled || !input.trim() ? 'disabled' : ''}`}
        onClick={handleSend}
        disabled={disabled || !input.trim()}
      >
        <span>+</span>
      </button>
    </div>
  );
};
