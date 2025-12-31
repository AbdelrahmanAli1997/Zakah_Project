// src/app/shared/tooltip/tooltip.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block group">
      <svg xmlns="http://www.w3.org/2000/svg"
           class="h-4 w-4 text-slate-400 cursor-help hover:text-slate-600 transition-colors"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
        <div class="font-medium mb-1">معلومة</div>
        <div class="text-gray-200">{{ text }}</div>
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div class="border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './tooltip.css'
})
export class TooltipComponent {
  @Input() text: string = '';
}
