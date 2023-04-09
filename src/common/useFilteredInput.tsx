import { ChangeEvent, useCallback } from 'react';
import { disabledCodePoints } from './disabledCharacters';

export const useFilteredInput = (
  value: string,
  setValue: (value: string) => void
) => {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const inputCodePoints = Array.from(inputValue, (char) => char.codePointAt(0) || 0);
      const filteredCodePoints = inputCodePoints.filter((codePoint) => !disabledCodePoints.includes(codePoint));
      const filteredValue = String.fromCodePoint(...filteredCodePoints);
      setValue(filteredValue);
    },
    [setValue]
  );

  return handleInputChange;
};
