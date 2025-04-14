import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour débouncer une valeur
 * @param value La valeur à débouncer
 * @param delay Le délai en ms avant que la valeur soit mise à jour
 * @returns La valeur après le délai de debounce
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Mettre en place un timer pour retarder la mise à jour de la valeur
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timer si la valeur change avant la fin du délai
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 