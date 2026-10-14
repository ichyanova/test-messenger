import type { ComponentProps } from 'react';


// Кастомные пропсы поля
interface CustomInputProps {
  className?: string,
  id: string,
  label?: string | null,
  placeholder?: string,
  disabled?: boolean,
  invalid?: boolean,
};

// Объединяем кастомные пропсы со всеми стандартными атрибутами HTML-поля
export type InputProps = CustomInputProps & Omit<ComponentProps<'input'>, keyof CustomInputProps>;