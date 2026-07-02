import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName, headers) => {
    // 1. 將資料轉換成 Excel 工作表格式
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. 建立新的 Excel 活頁簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 3. 匯出檔案
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
