import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const ExportAsExcel = (
  data: Record<string, unknown>[],
  fileName: string = 'bookings.xlsx',
) => {
  // Step 1: Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Step 2: Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

  // Step 3: Convert to binary and trigger download
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};
