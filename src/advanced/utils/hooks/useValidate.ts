import { useCallback } from 'react';
import {
  isValidDiscountRate,
  isValidDiscountAmount,
  isValidProductName,
  isNumericInput,
  parseNumberInput,
  isWithinMaxStock,
} from '../validators';
import {
  MAX_STOCK_LIMIT,
  MAX_DISCOUNT_AMOUNT,
  MESSAGES,
} from '../../constants';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface UseValidateReturn {
  validatePrice: (value: string) => ValidationResult;
  validateStock: (value: string) => ValidationResult;
  validateDiscountRate: (value: string) => ValidationResult;
  validateDiscountAmount: (value: string) => ValidationResult;
  validateProductName: (value: string) => ValidationResult;
  handleNumericInput: (
    value: string,
    currentValue: number
  ) => { isValid: boolean; newValue: number };
  handlePriceInput: (
    value: string,
    onValid: (price: number) => void,
    onError: (message: string) => void
  ) => void;
  handleStockInput: (
    value: string,
    onValid: (stock: number) => void,
    onError: (message: string) => void
  ) => void;
  handleDiscountValueInput: (
    value: string,
    discountType: 'amount' | 'percentage',
    onValid: (value: number) => void,
    onError: (message: string) => void
  ) => void;
}

export function useValidate(): UseValidateReturn {
  const validatePrice = useCallback((value: string): ValidationResult => {
    const numValue = parseNumberInput(value);

    if (numValue < 0) {
      return { isValid: false, message: MESSAGES.PRICE_MUST_BE_POSITIVE };
    }

    return { isValid: true };
  }, []);

  const validateStock = useCallback((value: string): ValidationResult => {
    const numValue = parseNumberInput(value);

    if (numValue < 0) {
      return { isValid: false, message: MESSAGES.STOCK_MUST_BE_POSITIVE };
    }

    if (!isWithinMaxStock(numValue)) {
      return { isValid: false, message: MESSAGES.STOCK_EXCEEDS_MAX };
    }

    return { isValid: true };
  }, []);

  const validateDiscountRate = useCallback(
    (value: string): ValidationResult => {
      const numValue = parseNumberInput(value);

      if (!isValidDiscountRate(numValue)) {
        return { isValid: false, message: MESSAGES.DISCOUNT_RATE_EXCEEDS_MAX };
      }

      return { isValid: true };
    },
    []
  );

  const validateDiscountAmount = useCallback(
    (value: string): ValidationResult => {
      const numValue = parseNumberInput(value);

      if (!isValidDiscountAmount(numValue)) {
        return {
          isValid: false,
          message: MESSAGES.DISCOUNT_AMOUNT_EXCEEDS_MAX,
        };
      }

      return { isValid: true };
    },
    []
  );

  const validateProductName = useCallback((value: string): ValidationResult => {
    if (!isValidProductName(value)) {
      return { isValid: false, message: '���D �%t�8�.' };
    }

    return { isValid: true };
  }, []);

  const handleNumericInput = useCallback(
    (
      value: string,
      currentValue: number
    ): { isValid: boolean; newValue: number } => {
      if (!isNumericInput(value)) {
        return { isValid: false, newValue: currentValue };
      }

      const newValue = value === '' ? 0 : parseNumberInput(value);
      return { isValid: true, newValue };
    },
    []
  );

  const handlePriceInput = useCallback(
    (
      value: string,
      onValid: (price: number) => void,
      onError: (message: string) => void
    ) => {
      if (!isNumericInput(value)) {
        return;
      }

      const numValue = value === '' ? 0 : parseNumberInput(value);
      const validation = validatePrice(value);

      if (!validation.isValid && validation.message) {
        onError(validation.message);
        onValid(0);
      } else {
        onValid(numValue);
      }
    },
    [validatePrice]
  );

  const handleStockInput = useCallback(
    (
      value: string,
      onValid: (stock: number) => void,
      onError: (message: string) => void
    ) => {
      if (!isNumericInput(value)) {
        return;
      }

      const numValue = value === '' ? 0 : parseNumberInput(value);
      const validation = validateStock(value);

      if (!validation.isValid && validation.message) {
        onError(validation.message);
        if (numValue > MAX_STOCK_LIMIT) {
          onValid(MAX_STOCK_LIMIT);
        } else {
          onValid(0);
        }
      } else {
        onValid(numValue);
      }
    },
    [validateStock]
  );

  const handleDiscountValueInput = useCallback(
    (
      value: string,
      discountType: 'amount' | 'percentage',
      onValid: (value: number) => void,
      onError: (message: string) => void
    ) => {
      if (!isNumericInput(value)) {
        return;
      }

      const numValue = value === '' ? 0 : parseNumberInput(value);

      if (discountType === 'percentage') {
        const validation = validateDiscountRate(value);
        if (!validation.isValid && validation.message) {
          onError(validation.message);
          onValid(100);
        } else {
          onValid(numValue);
        }
      } else {
        const validation = validateDiscountAmount(value);
        if (!validation.isValid && validation.message) {
          onError(validation.message);
          onValid(MAX_DISCOUNT_AMOUNT);
        } else {
          onValid(numValue);
        }
      }
    },
    [validateDiscountRate, validateDiscountAmount]
  );

  return {
    validatePrice,
    validateStock,
    validateDiscountRate,
    validateDiscountAmount,
    validateProductName,
    handleNumericInput,
    handlePriceInput,
    handleStockInput,
    handleDiscountValueInput,
  };
}
