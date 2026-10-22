import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FoodListItem, tableColumnStyles } from '@/components/food-list-item';
import { Colors, Spacing } from '@/constants/theme';
import type { FoodRecord } from '@/types/food';

type FoodListProps = {
  foods: FoodRecord[];
  isLoading: boolean;
  wide: boolean;
};

const COLUMNS = ['Alimento', 'Lote', 'Fabricação', 'Validade', 'Registrado por'];

export function FoodList({ foods, isLoading, wide }: FoodListProps) {
  if (isLoading) {
    return <ActivityIndicator color={Colors.primary} style={styles.loading} />;
  }

  if (foods.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Nenhum alimento registrado</Text>
        <Text style={styles.emptyText}>Use o formulário para adicionar o primeiro registro.</Text>
      </View>
    );
  }

  if (wide) {
    return (
      <View>
        <View style={styles.tableHeader}>
          {COLUMNS.map((column, index) => (
            <Text
              key={column}
              style={[
                tableColumnStyles.cell,
                index === 0 && tableColumnStyles.cellName,
                styles.tableHeaderText,
              ]}>
              {column}
            </Text>
          ))}
        </View>
        {foods.map((food) => (
          <FoodListItem key={food.id} food={food} layout="row" />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.cards}>
      {foods.map((food) => (
        <FoodListItem key={food.id} food={food} layout="card" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    padding: Spacing.five,
  },
  empty: {
    alignItems: 'center',
    padding: Spacing.five,
    gap: Spacing.one,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.two,
    backgroundColor: Colors.black,
    borderRadius: 6,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  cards: {
    gap: Spacing.two,
  },
});
