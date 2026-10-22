export type FoodRecord = {
  id: string;
  name: string;
  /** Lote */
  batch: string;
  /** ISO yyyy-mm-dd */
  manufactureDate: string;
  /** ISO yyyy-mm-dd */
  expiryDate: string;
  registeredBy: string;
  /** ISO datetime */
  createdAt: string;
};

export type NewFoodRecord = Omit<FoodRecord, 'id' | 'createdAt'>;
