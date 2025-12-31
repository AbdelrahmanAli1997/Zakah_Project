// src/app/models/zakah.model.ts
// src/app/models/zakah.model.ts
export interface ZakahFormData {
  // معلومات أساسية
  balanceSheetDate: string; // بصيغة yyyy-MM-dd فقط

  // الأصول
  cash: number;
  stocks: number;
  inventory: number;
  receivables: number;

  // الخصوم
  accountPayable: number;
  expenses: number;
  shortTermLoans: number;
  longTermDebt: number;

  // معلومات الزكاة
  goldWeightInGrams: number;
  goldPricePerGram: number;
  zakahAmount: number;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
}
