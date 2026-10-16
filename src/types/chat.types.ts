export interface MessageInfo {
  id: string;
  message: string;
  time: string;
  isOutgoing: boolean;
}

export interface ShortChatInfo {
  chatId: string;
  username: string;
  phoneNumber: number;
}

export interface ChatInfo extends ShortChatInfo {
  lastMessage: string;
  lastMessageTime: string;
  messages: MessageInfo[];
}