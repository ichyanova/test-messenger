/**
 * Базовая кнопка
 *  - возможность задавать размер
 *  - варианты оформления
 */

import { Loader2 } from 'lucide-react';
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';
import { BUTTON_SIZE, BUTTON_VARIANT } from './Button.const';

const BUTTON_SIZE_CLASS_NAMES = {
  sm: 'h-8 px-2',
  md: 'h-12 px-4',
  lg: 'h-14 px-6',
};

const BUTTON_VARIANT_CLASS_NAMES = {
  [BUTTON_VARIANT.PRIMARY]:
    'bg-[var(--blue)] hover:bg-[var(--dark-blue)] text-white disabled:bg-[var(--light-blue)]',
};

const variantClassNames = (variant: ButtonVariant): string => {
  return BUTTON_VARIANT_CLASS_NAMES[variant];
};

const sizeClassNames = (size: ButtonSize): string => {
  return BUTTON_SIZE_CLASS_NAMES[size];
};

const Button = ({
  className = '',
  children,
  variant = BUTTON_VARIANT.PRIMARY,
  size = BUTTON_SIZE.MD,
  type = 'button',
  disabled,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${className} ${variantClassNames(variant)} ${sizeClassNames(size)} w-full flex place-items-center justify-center rounded-2xl cursor-pointer disabled:cursor-default relative`}
      type={type}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          Пожалуйста подождите...
          <Loader2
            size={24}
            className='animate-spin absolute right-4'
          />
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
