import { Pencil, X } from 'lucide-react';

interface NewChatButtonProps {
  className?: string;
  onClick: () => void;
  isPencilIconVisibility: boolean;
}
/**
 * Кнопка для создания нового чата
 * @param className - CSS класс для кнопки
 * @param onClick - Функция для обработки клика
 * @param isPencilIconVisibility - Булево значение, должна ли отображаться иконка карандаша
 * @returns Компонент NewChatButton
 */
const NewChatButton = ({
  className = '',
  onClick,
  isPencilIconVisibility,
}: NewChatButtonProps) => {
  return (
    <button
      type='button'
      aria-label={isPencilIconVisibility ? 'Создать новый чат' : 'Закрыть'}
      className={`${className} bg-[var(--blue)] rounded-[50%] p-2 w-13.5 h-13.5 flex items-center justify-center hover:bg-[var(--dark-blue)] cursor-pointer `}
      onClick={onClick}
    >
      <span className='relative block w-6 h-6'>
        <Pencil
          className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ease-in-out motion-reduce:transition-none ${
            isPencilIconVisibility
              ? 'scale-100 opacity-100'
              : 'scale-50 opacity-0'
          }`}
        />
        <X
          className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ease-in-out motion-reduce:transition-none ${
            isPencilIconVisibility
              ? 'scale-50 opacity-0'
              : 'scale-100 opacity-100'
          }`}
        />
      </span>
    </button>
  );
};

export default NewChatButton;
