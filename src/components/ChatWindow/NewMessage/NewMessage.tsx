import { useEffect, useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';

import Textarea from './Textarea/Textarea';
import { useChatContext } from '@/context/use-chat-context';
import { useAuthContext } from '@/context/use-auth-context';

interface NewMessageProps {
  className?: string;
}

/**
 * Поле ввода и кнопка отправки текстового сообщения
 * @param className
 */
const NewMessage = ({ className = '' }: NewMessageProps) => {
  const { currentChatId, sendMessage } = useChatContext();
  const { userData } = useAuthContext();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageText = text.trim();
  const canSend = messageText.length > 0;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const sendMessageHandler = async () => {
    if (!canSend || isLoading) {
      return;
    }

    setIsLoading(true);
    const result = await sendMessage(currentChatId, messageText, userData);
    if (result.isSuccess) {
      setText('');
      setError(null);
    } else {
      setError(result.errorMessage);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessageHandler();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) {
      return;
    }

    e.preventDefault();
    sendMessageHandler();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(null);
  };

  return (
    <form
      className={`${className} flex items-end gap-2 rounded-3xl bg-white p-1`}
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col flex-1 pl-4'>
        <Textarea
          className='min-w-0 w-full py-2'
          ref={textareaRef}
          name='message'
          placeholder='Сообщение'
          value={text}
          enterKeyHint='send'
          autoComplete='off'
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        {error && <span className='text-sm text-[var(--alert)]'>{error}</span>}
      </div>

      <button
        type='submit'
        aria-label='Отправить сообщение'
        disabled={!canSend || isLoading}
        className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--blue)] text-white transition-colors hover:bg-[var(--dark-blue)] disabled:cursor-default disabled:bg-[var(--light-blue)]'
      >
        {isLoading ? (
          <Loader2 className='h-5 w-5 animate-spin' />
        ) : (
          <Send className='h-5 w-5' />
        )}
      </button>
    </form>
  );
};

export default NewMessage;
