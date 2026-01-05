
import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-restore-account',
  standalone: true,
  templateUrl: './restore-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestoreAccountComponent {
  restore = output<void>();
  logout = output<void>();

  onRestore() {
    this.restore.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}