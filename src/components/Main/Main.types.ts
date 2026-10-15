export interface MessageInfo {
  id: number;
  message: string;
  time: string;
  isOutgoing: boolean;
}

export interface ChatInfo {
  id: number;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: MessageInfo[];
}