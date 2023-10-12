import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { IUploaderOptions } from './models/custom-file-uploader.model';

@Component({
  selector: 'app-custom-file-uploader',
  templateUrl: './custom-file-uploader.component.html',
  styleUrls: ['./custom-file-uploader.component.scss']
})
export class CustomFileUploaderComponent implements OnInit {

  @Input() isDisabled = false;
  @Input() options!: IUploaderOptions;
  @Output() fileSelect = new Subject<File[]>();

  filesList: File[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Browse file
   * @param event
   */
  browse(event: any) {
    if (!this.isDisabled && event?.target?.files[0] && !this.fileExists(event.target.files[0])) {
      this.filesList.push(event.target.files[0]);
      event.target.value = null;
      this.emitFile();
    }
  }

  /**
   * Emit file
   */
  emitFile() {
    if (this.filesList) {
      this.fileSelect.next(this.filesList);
    } else {
      console.log('Invalid file selected');
    }
  }

  /**
   * Delete file
   * @param index
   */
  deleteFile(index: number) {
    if (this.filesList.length && this.filesList[index]) {
      this.filesList.splice(index, 1);
      this.emitFile();
    }
  }

  /**
   * Returns true if file exists
   * @param file
   * @returns
   */
  fileExists(file: File) {
    return this.filesList.find(f => f.name === file.name);
  }

  /**
   * Getter for the placeholder.
   */
  get placeholder() {
    return this.options?.placeholder ? this.options?.placeholder.trim() : '';
  }

}
