import type { Message } from './types';

const STORAGE_KEY = 'chat_history';

export const storage = {
  loadMessages: (): Message[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load messages from storage:', error);
      return [];
    }
  },

  saveMessages: (messages: Message[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages to storage:', error);
    }
  },

  clearMessages: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear messages from storage:', error);
    }
  }
};
