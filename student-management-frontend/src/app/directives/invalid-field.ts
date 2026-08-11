import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appInvalidField]',
})
export class InvalidField {
  private element = inject(ElementRef<HTMLInputElement>);

  @HostListener('blur')
  checkValue(): void {
    const input = this.element.nativeElement;

    if (input.value.trim() === '') {
      input.style.border = '2px solid red';
      input.style.backgroundColor = '#fff5f5';
    } else {
      input.style.border = '';
      input.style.backgroundColor = '';
    }
  }

  @HostListener('input')
  removeWarning(): void {
    const input = this.element.nativeElement;

    if (input.value.trim() !== '') {
      input.style.border = '';
      input.style.backgroundColor = '';
    }
  }
}
