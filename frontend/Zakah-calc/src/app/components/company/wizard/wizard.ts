import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ZakahCompanyRecordService } from '../../../services/zakah-company-service/zakah-company-service';
import { ZakahCompanyExcelService } from '../../../services/zakah-company-service/zakah-company-excel-service';
import { ZakahFormData } from '../../../models/zakah.model';
import { TooltipComponent } from '../../../shared/tooltip/tooltip';
import { ZakahCompanyRecordRequest } from '../../../models/request/ZakahCompanyRequest';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [CommonModule, TooltipComponent, CurrencyPipe],
  templateUrl: './wizard.html',
  styleUrls: ['./wizard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZakahCompanyRecordComponent {
  private excelService = inject(ZakahCompanyExcelService);
  private zakahService = inject(ZakahCompanyRecordService);

  formData = this.zakahService.formData;
  currentStep = this.zakahService.currentWizardStep;
  steps = this.zakahService.wizardSteps;
  isCalculating = this.zakahService.isCalculating;

  fileName = signal<string | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  downloadInProgress = signal(false);

  // دالة لتحويل أي تاريخ إلى yyyy-MM-dd
  private toYYYYMMDD(dateStr: string): string {
    if (!dateStr) return '';

    const trimmed = dateStr.trim();

    // 1. إذا كان yyyy-MM-dd بالفعل
    const yyyyMMddMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (yyyyMMddMatch) {
      const [, year, month, day] = yyyyMMddMatch.map(n => parseInt(n, 10));
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // 2. إذا كان dd/MM/yyyy
    const ddMMyyyySlash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddMMyyyySlash) {
      const [, day, month, year] = ddMMyyyySlash.map(n => parseInt(n, 10));
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // 3. إذا كان dd-MM-yyyy
    const ddMMyyyyDash = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (ddMMyyyyDash) {
      const [, day, month, year] = ddMMyyyyDash.map(n => parseInt(n, 10));
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // 4. محاولة مع Date
    try {
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Date parsing error:', e);
    }

    return '';
  }

  getDisplayDate(): string {
    const date = this.formData().balanceSheetDate;

    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      this.zakahService.updateFormData({ balanceSheetDate: today });
      return today;
    }

    return date;
  }

  onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // input type="date" يعطي yyyy-MM-dd مباشرة
    this.zakahService.updateFormData({ balanceSheetDate: value });
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const key = target.name as keyof ZakahFormData;
    const value = target.valueAsNumber || 0;

    const patch: Partial<ZakahFormData> = { [key]: value };
    this.zakahService.updateFormData(patch);
  }

  async downloadExcelTemplate() {
    this.downloadInProgress.set(true);

    try {
      const templateUrl = '/templates/balance_sheet_templete.xlsx';
      const response = await fetch(templateUrl);

      if (!response.ok) {
        throw new Error('لم يتم العثور على ملف النموذج');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'balance_sheet_templete.xlsx';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading template:', error);
      this.errorMessage.set('حدث خطأ في تحميل النموذج. تأكد من وجود الملف.');
    } finally {
      this.downloadInProgress.set(false);
    }
  }

  async onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.fileName.set(file.name);
      this.isLoading.set(true);
      this.errorMessage.set(null);

      try {
        const excelRequest: ZakahCompanyRecordRequest = await this.excelService.readCompanyExcel(file);

        const formDataPatch: Partial<ZakahFormData> = {
          cash: excelRequest.cashEquivalents || 0,
          stocks: excelRequest.investment || 0,
          inventory: excelRequest.inventory || 0,
          receivables: excelRequest.accountsReceivable || 0,
          accountPayable: excelRequest.accountsPayable || 0,
          expenses: excelRequest.accruedExpenses || 0,
          shortTermLoans: excelRequest.shortTermLiability || 0,
          longTermDebt: excelRequest.yearlyLongTermLiabilities || 0,
          goldPricePerGram: excelRequest.goldPrice || 0
        };

        // تحويل التاريخ إلى yyyy-MM-dd
        if (excelRequest.balanceSheetDate) {
          const dateStr = excelRequest.balanceSheetDate.toString();
          const formattedDate = this.toYYYYMMDD(dateStr);

          if (formattedDate) {
            formDataPatch.balanceSheetDate = formattedDate;
          } else {
            // إذا فشل التحويل، استخدم اليوم
            formDataPatch.balanceSheetDate = new Date().toISOString().split('T')[0];
          }
        } else {
          // إذا لم يكن هناك تاريخ، استخدم اليوم
          formDataPatch.balanceSheetDate = new Date().toISOString().split('T')[0];
        }

        this.zakahService.updateFormData(formDataPatch);

        const reviewStepIndex = this.steps().indexOf('التفاصيل');
        if (reviewStepIndex !== -1) {
          this.zakahService.goToStep(reviewStepIndex);
        }

      } catch (error) {
        console.error('Error reading Excel file:', error);
        this.errorMessage.set('حدث خطأ في قراءة ملف Excel. تأكد من تنسيق الملف.');
      } finally {
        this.isLoading.set(false);
        target.value = '';
      }
    } else {
      this.fileName.set(null);
    }
  }

  next() {
    this.zakahService.nextStep();
  }

  back() {
    this.zakahService.prevStep();
  }

  async calculate() {
    await this.zakahService.calculateZakah();
  }

  // دالة لعرض التاريخ بشكل مقروء (فقط للعرض)
  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';

    // تحويل من yyyy-MM-dd إلى dd/MM/yyyy للعرض
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }

    return dateStr;
  }
}
