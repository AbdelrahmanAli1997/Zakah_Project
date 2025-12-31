// src/app/services/zakah-company-service/zakah-company-service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ZakahCompanyRecordResponse } from '../../models/response/ZakahCompanyResponse';
import { ZakahCompanyRecordRequest } from '../../models/request/ZakahCompanyRequest';
import { ZakahFormData } from '../../models/zakah.model';

@Injectable({
  providedIn: 'root'
})
export class ZakahCompanyRecordService {
  private readonly BASE_URL = `${environment.apiUrl}/zakah/company`;

  latestResult = signal<ZakahCompanyRecordResponse | null>(null);
  history = signal<ZakahCompanyRecordResponse[]>([]);

  // إشارات للـ wizard
  formData = signal<ZakahFormData>(this.getInitialFormData());
  currentWizardStep = signal<number>(0);
  wizardSteps = signal<string[]>(['البداية', 'الأصول', 'الالتزامات', 'التفاصيل', 'مراجعة']);
  isCalculating = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  private getInitialFormData(): ZakahFormData {
    return {
      balanceSheetDate: '',
      cash: 0,
      stocks: 0,
      inventory: 0,
      receivables: 0,
      accountPayable: 0,
      expenses: 0,
      shortTermLoans: 0,
      goldWeightInGrams: 0,
      goldPricePerGram: 75.21,
      longTermDebt: 0,
      zakahAmount: 0
    };
  }

  updateFormData(patch: Partial<ZakahFormData>): void {
    this.formData.update(current => ({ ...current, ...patch }));
  }

  nextStep(): void {
    const current = this.currentWizardStep();
    const totalSteps = this.wizardSteps().length;
    if (current < totalSteps - 1) {
      this.currentWizardStep.set(current + 1);
    }
  }

  prevStep(): void {
    const current = this.currentWizardStep();
    if (current > 0) {
      this.currentWizardStep.set(current - 1);
    }
  }

  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.wizardSteps().length) {
      this.currentWizardStep.set(stepIndex);
    }
  }

  async calculateZakah(): Promise<void> {
    this.isCalculating.set(true);

    try {
      const formData = this.formData();

      // تحويل ZakahFormData إلى ZakahCompanyRecordRequest
      const request: ZakahCompanyRecordRequest = {
        balanceSheetDate: this.formatDateForAPI(formData.balanceSheetDate),
        cashEquivalents: formData.cash,
        accountsReceivable: formData.receivables,
        inventory: formData.inventory,
        investment: formData.stocks,
        accountsPayable: formData.accountPayable,
        accruedExpenses: formData.expenses,
        shortTermLiability: formData.shortTermLoans,
        yearlyLongTermLiabilities: formData.longTermDebt,
        goldPrice: formData.goldPricePerGram
      };

      console.log('Sending request to API:', request);
      const response = await this.calculateAndSave(request).toPromise();

      if (response) {
        this.latestResult.set(response);
        this.updateFormData({ zakahAmount: response.zakahAmount });

        // تحديث الـ history
        this.history.update(history => [response, ...history]);
      }

    } catch (error) {
      console.error('Error calculating zakah:', error);
    } finally {
      this.isCalculating.set(false);
    }
  }

  private formatDateForAPI(dateStr: string): string {
    if (!dateStr) return this.formatDate(new Date());

    try {
      const date = new Date(dateStr);
      return this.formatDate(date);
    } catch {
      return this.formatDate(new Date());
    }
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // الوظائف الأصلية للـ API
  calculateAndSave(
    request: ZakahCompanyRecordRequest
  ): Observable<ZakahCompanyRecordResponse> {
    return this.http.post<ZakahCompanyRecordResponse>(
      `${this.BASE_URL}/calculate`,
      request
    );
  }

  getAllSummaries(): Observable<ZakahCompanyRecordResponse[]> {
    return this.http.get<ZakahCompanyRecordResponse[]>(
      `${this.BASE_URL}/summaries`
    );
  }

  getById(id: number): Observable<ZakahCompanyRecordResponse> {
    return this.http.get<ZakahCompanyRecordResponse>(
      `${this.BASE_URL}/${id}`
    );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.BASE_URL}/${id}`
    );
  }
}
