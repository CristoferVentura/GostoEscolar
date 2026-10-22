import { StyleSheet, Text, View } from 'react-native';

import { ExpiryBadge } from '@/components/expiry-badge';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { FoodRecord } from '@/types/food';
import { isoToBr } from '@/utils/date';

type FoodListItemProps = {
  food: FoodRecord;
  layout: 'card' | 'row';
};

export function FoodListItem({ food, layout }: FoodListItemProps) {
  if (layout === 'row') {
    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.cellName]} numberOfLines={2}>
          {food.name}
        </Text>
        <Text style={styles.cell}>{food.batch}</Text>
        <Text style={styles.cell}>{isoToBr(food.manufactureDate)}</Text>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{isoToBr(food.expiryDate)}</Text>
          <ExpiryBadge expiryDate={food.expiryDate} />
        </View>
        <Text style={styles.cell} numberOfLines={1}>
          {food.registeredBy}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{food.name}</Text>
        <ExpiryBadge expiryDate={food.expiryDate} />
      </View>
      <Text style={styles.detail}>
        <Text style={styles.detailLabel}>Lote: </Text>
        {food.batch}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.detailLabel}>Fabricação: </Text>
        {isoToBr(food.manufactureDate)}
        {'   '}
        <Text style={styles.detailLabel}>Validade: </Text>
        {isoToBr(food.expiryDate)}
      </Text>
      <Text style={styles.meta}>Registrado por {food.registeredBy}</Text>
    </View>
  );
}

export const tableColumnStyles = StyleSheet.create({
  cell: {
    flex: 1,
    paddingHorizontal: Spacing.two,
  },
  cellName: {
    flex: 1.6,
  },
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  cell: {
    ...tableColumnStyles.cell,
    fontSize: 15,
    color: Colors.black,
    gap: Spacing.one,
  },
  cellName: {
    ...tableColumnStyles.cellName,
    fontWeight: '700',
  },
  cellText: {
    fontSize: 15,
    color: Colors.black,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.black,
  },
  detail: {
    fontSize: 15,
    color: Colors.black,
  },
  detailLabel: {
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
    color: Colors.muted,
  },
});
