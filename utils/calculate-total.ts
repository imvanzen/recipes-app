type RecipeItem = {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discount: number;
};

/**
 * Calculates the total amount of a list of items.
 *
 * @param items RecipeItem[]
 * @returns number
 */
export const calculateTotal = (items: RecipeItem[]) => {
  return items.reduce((total: number, item: RecipeItem) => {
    const itemTotal = item.quantity * item.pricePerUnit - item.discount;
    return total + itemTotal;
  }, 0);
};
