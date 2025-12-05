import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  useEffect(() => {
    try {
      if (
        storedValue === undefined ||
        storedValue === null ||
        (Array.isArray(storedValue) && storedValue.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      throw new Error('localStorage 저장 실패');
      // memo: localStorage에 저장 실패하는 경우가 있을까? 저장할 수 있는 데이터 양의 한계는 얼마일까?
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
