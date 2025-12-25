import { Directive, ElementRef, inject, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  clickOutside = output<void>(); // New Angular 21 Output API
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.clickOutside.emit();
      }
    });
  }
}