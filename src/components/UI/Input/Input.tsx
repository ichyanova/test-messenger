import { useState } from 'react';
import type { InputProps } from './Input.types';
import './Input.css';

/**
 * UI компонент поля ввода
 * @param className
 * @param id - ID
 * @param label - Лейбл
 * @param type - Тип
 * @param placeholder - Плейсхолдер
 * @param invalid - Флаг ошибки
 * @param ref - Ссылка на поле
 * @param inputProps - Остальные стандартные пропсы
 * @returns
 */
const Input = ({
  className = '',
  id,
  label = null,
  type = 'text',
  placeholder = '',
  invalid = false,
  ref,
  ...inputProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`${className} input-container`}
      data-focused={isFocused}
      data-invalid={invalid}
    >
      {label && (
        <label
          htmlFor={id}
          className='input-label'
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className='input'
        type={type}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...inputProps}
      />
    </div>
  );
};

export default Input;
