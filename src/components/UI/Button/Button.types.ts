import type { ComponentProps } from 'react';
import type { BUTTON_SIZE, BUTTON_VARIANT } from './Button.const';


// Литеральные типы
export type ButtonVariant = typeof BUTTON_VARIANT[keyof typeof BUTTON_VARIANT];
export type ButtonSize = typeof BUTTON_SIZE[keyof typeof BUTTON_SIZE];

// Кастомные пропсы кнопки
interface CustomButtonProps {
  // Внешний вид кнопки
  variant?: ButtonVariant;
  // Размер кнопки
  size?: ButtonSize;
  //  Флаг состояния загрузки
  isLoading?: boolean;
};

// Объединяем кастомные пропсы со всеми стандартными атрибутами HTML-кнопки
// Используем ComponentProps<'button'>
export type ButtonProps = CustomButtonProps & Omit<ComponentProps<'button'>, keyof CustomButtonProps>;