/**
 * Одно сообщение в чате
 */

import type { MessageInfo } from '@/types/chat.types';
import './MessageBubble.css';

interface MessageBubbleProps {
  className?: string;
  message: MessageInfo;
}

const MessageBubble = ({ className = '', message }: MessageBubbleProps) => {
  return (
    <div
      key={message.id}
      className={`${className} message-bubble`}
      data-outgoing={message.isOutgoing}
    >
      <p className='message-text'>{message.message}</p>
      <p className='message-time'>{message.time}</p>
    </div>
  );
};

export default MessageBubble;
