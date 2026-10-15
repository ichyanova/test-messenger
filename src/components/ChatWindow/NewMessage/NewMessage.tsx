import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

import Textarea from './Textarea/Textarea';

interface NewMessageProps {
  className?: string;
  onSend: (text: string) => void;
}

/**
 * Поле ввода и кнопка отправки текстового сообщения
 * @param className
 * @param onSend - отправка текста
 */
const NewMessage = ({ className = '', onSend }: NewMessageProps) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageText = text.trim();
  const canSend = messageText.length > 0;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const sendMessage = () => {
    if (!canSend) {
      return;
    }

    onSend(messageText);
    setText('');
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) {
      return;
    }

    e.preventDefault();
    sendMessage();
  };

  return (
    <form
      className={`${className} flex items-end gap-2 rounded-3xl bg-white p-1`}
      onSubmit={handleSubmit}
    >
      <div className='flex flex-1 pl-4'>
        <Textarea
          className='min-w-0 w-full py-2'
          ref={textareaRef}
          name='message'
          placeholder='Сообщение'
          value={text}
          enterKeyHint='send'
          autoComplete='off'
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        type='submit'
        aria-label='Отправить сообщение'
        disabled={!canSend}
        className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--blue)] text-white transition-colors hover:bg-[var(--dark-blue)] disabled:cursor-default disabled:bg-[var(--light-blue)]'
      >
        <Send className='h-5 w-5' />
      </button>
    </form>
  );
};

export default NewMessage;
