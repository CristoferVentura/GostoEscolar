import AsyncStorage from '@react-native-async-storage/async-storage';

import type { FoodRecord, NewFoodRecord } from '@/types/food';
import { createId } from '@/utils/id';
import { readJsonArray } from '@/utils/storage';

export interface FoodRepository {
  /** Most recent first. */
  list(): Promise<FoodRecord[]>;
  create(input: NewFoodRecord): Promise<FoodRecord>;
  listDistinctNames(): Promise<string[]>;
}

const FOODS_KEY = '@gostoescolar/foods';

function readFoods() {
  return readJsonArray<FoodRecord>(FOODS_KEY);
}

const localFoodRepository: FoodRepository = {
  async list() {
    const foods = await readFoods();
    return foods.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(input) {
    const record: FoodRecord = {
      ...input,
      name: input.name.trim(),
      batch: input.batch.trim(),
      registeredBy: input.registeredBy.trim(),
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    const foods = await readFoods();
    await AsyncStorage.setItem(FOODS_KEY, JSON.stringify([...foods, record]));
    return record;
  },

  async listDistinctNames() {
    return distinctNames(await readFoods());
  },
};

export function distinctNames(foods: FoodRecord[]) {
  const byKey = new Map<string, string>();
  for (const food of foods) {
    const key = food.name.trim().toLocaleLowerCase('pt-BR');
    if (key && !byKey.has(key)) byKey.set(key, food.name.trim());
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export const foodRepository: FoodRepository = localFoodRepository;
