import type { ComponentProps } from 'react';


// Кастомные пропсы поля
interface CustomInputProps {
  className?: string,
  id: string,
  label?: string | null,
  placeholder?: string,
  invalid?: boolean,
};

/**
 * Объединяем кастомные пропсы со всеми стандартными атрибутами HTML-поля
 * @param CustomInputProps - Кастомные пропсы
 * @param ComponentProps<'input'> - Стандартные атрибуты HTML-поля
 * @returns InputProps
 */
export type InputProps = CustomInputProps & Omit<ComponentProps<'input'>, keyof CustomInputProps>;