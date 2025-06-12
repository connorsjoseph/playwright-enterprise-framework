import ExcelJS from "exceljs";
import fs from "fs";

export function loadJSON<T = any>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function loadExcel(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  const data: Record<string, string>[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    const rowData: Record<string, string> = {};
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      rowData[cell.text.toString()] = row.getCell(colNumber).text;
    });
    data.push(rowData);
  });

  return data;
}
