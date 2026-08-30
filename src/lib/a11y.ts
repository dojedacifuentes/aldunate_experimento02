import type { KeyboardEvent } from 'react';

/**
 * Navegación de teclado para grupos de radios construidos con botones.
 * Flechas, Inicio y Fin mueven la selección y el foco como exige el patrón ARIA.
 */
export function handleRadioKeyDown<T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  values: readonly T[],
  current: T,
  onChange: (value: T) => void,
) {
  const currentIndex = values.indexOf(current);
  let targetIndex: number | undefined;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      targetIndex = (currentIndex + 1) % values.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      targetIndex = (currentIndex - 1 + values.length) % values.length;
      break;
    case 'Home':
      targetIndex = 0;
      break;
    case 'End':
      targetIndex = values.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  const targetValue = values[targetIndex];
  onChange(targetValue);

  const group = event.currentTarget.closest('[role="radiogroup"]');
  const radios = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
  radios?.[targetIndex]?.focus();
}
