import type { ComponentProps } from 'react';
import type { BUTTON_SIZE, BUTTON_VARIANT } from './Button.const';

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

export type ButtonProps = CustomButtonProps & Omit<ComponentProps<'button'>, keyof CustomButtonProps>;
