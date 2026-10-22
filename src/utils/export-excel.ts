import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import * as XLSX from 'xlsx';

import type { FoodRecord } from '@/types/food';
import { formatDateTimeBr, isoToBr } from '@/utils/date';

const SHEET_NAME = 'Alimentos';
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const HEADERS = [
  'Nome do Alimento',
  'Lote',
  'Data de Fabricação',
  'Data de Validade',
  'Registrado por',
  'Data do Registro',
];

const COLUMN_WIDTHS = [30, 16, 20, 18, 26, 20];

function buildWorkbook(foods: FoodRecord[]) {
  const rows = foods.map((food) => [
    food.name,
    food.batch,
    isoToBr(food.manufactureDate),
    isoToBr(food.expiryDate),
    food.registeredBy,
    formatDateTimeBr(food.createdAt),
  ]);

  const sheet = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);
  sheet['!cols'] = COLUMN_WIDTHS.map((wch) => ({ wch }));
  sheet['!autofilter'] = { ref: sheet['!ref'] ?? 'A1' };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, SHEET_NAME);
  return workbook;
}

function buildFileName() {
  const today = new Date().toISOString().slice(0, 10);
  return `gostoescolar-alimentos-${today}.xlsx`;
}

export async function exportFoodsToExcel(foods: FoodRecord[]) {
  const workbook = buildWorkbook(foods);
  const fileName = buildFileName();

  if (Platform.OS === 'web') {
    XLSX.writeFile(workbook, fileName);
    return;
  }

  const data: ArrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  const file = new File(Paths.cache, fileName);
  if (file.exists) file.delete();
  file.create();
  file.write(new Uint8Array(data));

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Compartilhamento indisponível neste dispositivo.');
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: XLSX_MIME,
    dialogTitle: 'Exportar planilha GostoEscolar',
    UTI: 'org.openxmlformats.spreadsheetml.sheet',
  });
}
