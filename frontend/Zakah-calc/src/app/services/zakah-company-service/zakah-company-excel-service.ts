import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ZakahCompanyRecordRequest } from '../../models/request/ZakahCompanyRequest';


@Injectable({
  providedIn: 'root'
})
export class ZakahCompanyExcelService {

  /* ================= READ EXCEL FILE ================= */
  readCompanyExcel(file: File): Promise<Partial<ZakahCompanyRecordRequest>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const buffer = reader.result as ArrayBuffer;
          const workbook = XLSX.read(buffer, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // الصف يتحول مباشرة إلى Object بالـ headers
          const rows = XLSX.utils.sheet_to_json<any>(worksheet, {
            defval: 0
          });

          if (!rows.length) {
            throw new Error('Excel file is empty');
          }

          resolve(this.mapRowToRequest(rows[0]));

        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = err => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  private mapRowToRequest(row: any): Partial<ZakahCompanyRecordRequest> {
    return {
      cashEquivalents: this.toNumber(row['Cash Equivalents']),
      accountsReceivable: this.toNumber(row['Accounts Receivable']),
      inventory: this.toNumber(row['Inventory']),
      investment: this.toNumber(row['Investment']),

      accountsPayable: this.toNumber(row['Accounts Payable']),
      accruedExpenses: this.toNumber(row['Accrued Expenses']),
      shortTermLiability: this.toNumber(row['Short Term Liability']),
      yearlyLongTermLiabilities: this.toNumber(row['Yearly Long Term Liabilities'])
    };
  }

  private toNumber(value: any): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
}
