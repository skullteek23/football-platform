import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStickyTopBar]'
})
export class StickyTopBarDirective {
  @Input() offset = 72;
  @Input() panelClass = '';
  @Input() disabled = false;

  @HostListener('window:scroll', ['$event'])
  addSticky(): void {
    if (window.pageYOffset >= this.offset) {
      if (!this.disabled) {
        this.renderer.addClass(this.elRef.nativeElement, this.panelClass);
        this.renderer.addClass(this.elRef.nativeElement, 'mat-elevation-z4');
      }
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, this.panelClass);
      this.renderer.removeClass(this.elRef.nativeElement, 'mat-elevation-z4');
    }
  }
  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

}
