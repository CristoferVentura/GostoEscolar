import { useState } from 'react';
import { Alert, Platform } from 'react-native';

import { Button } from '@/components/ui/button';
import type { FoodRecord } from '@/types/food';
import { exportFoodsToExcel } from '@/utils/export-excel';

export function ExportButton({ foods }: { foods: FoodRecord[] }) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportFoodsToExcel(foods);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao exportar a planilha.';
      if (Platform.OS === 'web') window.alert(message);
      else Alert.alert('Erro na exportação', message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      title={`Exportar para Excel (${foods.length})`}
      loading={exporting}
      disabled={foods.length === 0}
      onPress={handleExport}
    />
  );
}
