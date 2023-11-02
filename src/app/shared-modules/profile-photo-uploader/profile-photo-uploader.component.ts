import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constants } from '@ballzo-ui/core/common';
import { FileType } from '@app/utils/file-utility';

@Component({
  selector: 'app-profile-photo-uploader',
  templateUrl: './profile-photo-uploader.component.html',
  styleUrls: ['./profile-photo-uploader.component.scss']
})
export class ProfilePhotoUploaderComponent {

  @Input() actionBtnLabel = 'Browse Photo';
  @Input() set url(value: any) {
    if (value) {
      this.preview = value;
    } else {
      this.preview = Constants.DEFAULT_IMG;
    }
  }
  @Output() uploadChange = new EventEmitter<File>();

  readonly ACCEPTED_EXTENSIONS = FileType.image;

  preview: string = '';
  file!: File;

  /**
   * Browse photo from the local system
   * @param ev
   * @param previewEl
   */
  onBrowsePhoto(ev: any, previewEl: HTMLElement): void {
    if (ev && ev.target && ev.target.files && previewEl) {
      const file = ev.target.files[0];
      const imageEl = previewEl as HTMLImageElement;
      imageEl.src = URL.createObjectURL(file);
      this.emitSelection(file);
    }
  }

  /**
   * Emits the selected file to the parent component
   * @param file
   */
  emitSelection(file: File) {
    this.uploadChange.emit(file);
  }

  /**
   * Resets the image to default image
   */
  resetImage(): void {
    this.preview = '';
    this.file = new File([], '');
  }
}
