import type { ComponentProps } from 'react';

interface CustomTextareaProps {
  className?: string;
  value: string;
}

type TextareaProps = CustomTextareaProps &
  Omit<ComponentProps<'textarea'>, keyof CustomTextareaProps>;

/**
 * Многострочное поле ввода сообщения
 * @param className
 * @param value - Текст
 * @param ref - Ссылка на поле
 * @param textareaProps - Остальные стандартные атрибуты textarea
 */
const Textarea = ({
  className = '',
  value,
  ref,
  ...textareaProps
}: TextareaProps) => {
  return (
    <textarea
      ref={ref}
      rows={1}
      className={`${className} field-sizing-content max-h-40 min-w-0 flex-1 resize-none overflow-y-auto text-sm outline-none placeholder:text-gray-300`}
      value={value}
      {...textareaProps}
    />
  );
};

export default Textarea;
