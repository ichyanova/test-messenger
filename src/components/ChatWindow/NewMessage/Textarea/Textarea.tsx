/**
 * Многострочное поле ввода сообщения
 */

import type { ComponentProps } from 'react';

interface CustomTextareaProps {
  className?: string;
  value: string;
}

type TextareaProps = CustomTextareaProps &
  Omit<ComponentProps<'textarea'>, keyof CustomTextareaProps>;

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
