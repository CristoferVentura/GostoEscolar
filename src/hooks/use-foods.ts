import { useCallback, useEffect, useMemo, useState } from 'react';

import { distinctNames, foodRepository } from '@/services/foods';
import type { FoodRecord, NewFoodRecord } from '@/types/food';

export function useFoods() {
  const [foods, setFoods] = useState<FoodRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    () =>
      foodRepository
        .list()
        .then((list) => {
          setFoods(list);
          setError(null);
        })
        .catch(() => setError('Não foi possível carregar os registros.'))
        .finally(() => setIsLoading(false)),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    return load();
  }, [load]);

  const createFood = useCallback(async (input: NewFoodRecord) => {
    const record = await foodRepository.create(input);
    setFoods((current) => [record, ...current]);
    return record;
  }, []);

  const names = useMemo(() => distinctNames(foods), [foods]);

  return { foods, names, isLoading, error, refresh, createFood };
}
