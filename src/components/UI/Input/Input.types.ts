import type { ComponentProps } from 'react';

// Кастомные пропсы поля
interface CustomInputProps {
  className?: string,
  id: string,
  label?: string | null,
  placeholder?: string,
  invalid?: boolean,
};

export type InputProps = CustomInputProps & Omit<ComponentProps<'input'>, keyof CustomInputProps>;
