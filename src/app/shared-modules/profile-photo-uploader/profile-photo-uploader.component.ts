import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constants } from '@ballzo-ui/core';
import { FileType, dataURLtoFile } from '@ballzo-ui/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PLAYER, maxImageSizeInMb } from '@app/utils/constant/image-compression-constants';

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

  constructor(private imageCompress: NgxImageCompressService) { }

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

  /**
   * Compress image file
   */
  compressFile() {
    this.imageCompress
      .uploadAndGetImageWithMaxSize(maxImageSizeInMb)
      .then((result) => {
        this.parseCompression(result);
      },
        (result: string) => {
          this.parseCompression(result);
        });
  }

  /**
   * Parse the final file and set preview
   * @param _result
   */
  parseCompression(result: string) {
    if (result) {
      const finalFile = dataURLtoFile(result, PLAYER + `${new Date().getTime()}`);
      if (finalFile) {
        this.emitSelection(finalFile);
        this.preview = result;
      }
    }
  }
}
