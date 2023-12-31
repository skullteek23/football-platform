import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Constants } from '@ballzo-ui/core';

@Component({
  selector: 'app-full-screen-image-viewer',
  templateUrl: './full-screen-image-viewer.component.html',
  styleUrls: ['./full-screen-image-viewer.component.scss']
})
export class FullScreenImageViewerComponent {
  @Input() set url(value: any) {
    if (value) {
      this.imageUrl = value;
    } else {
      this.imageUrl = Constants.DEFAULT_IMG;
    }
  }

  imageUrl: string = '';
  isOpen: boolean = false;

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.close();
  }

  /**
   * Opens the image viewer
   */
  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the image viewer
   */
  close() {
    this.isOpen = false;
    document.body.style.overflow = 'auto';
  }

}
