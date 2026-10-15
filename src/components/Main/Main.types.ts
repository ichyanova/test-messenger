export interface MessageInfo {
  id: number;
  message: string;
  time: string;
}

export interface ChatInfo {
  id: number;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: MessageInfo[];
}