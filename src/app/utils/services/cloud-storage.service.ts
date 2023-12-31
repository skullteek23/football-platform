import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { CloudStorageFileScreens } from '@app/utils/constant/api-constants';
import { Constants } from '@ballzo-ui/core';
import { sanitizeFileName } from '@ballzo-ui/core';
import { getStorageError } from '../main-utilities/api-error-handling-utility';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {

  private cloudStorage: Storage = inject(Storage);

  constructor() { }

  /**
   * Get the public url of the file
   * @param file
   * @param path
   * @returns
   */
  getPublicUrl(file: File, path: string): Promise<any> {
    if (file && path) {
      return this.upload(file, path);
    }
    return Promise.reject(null);
  }

  /**
   * Upload the file to the given path
   * @param file
   * @param path
   * @returns
   */
  private async upload(file: File, path: string): Promise<any> {
    const storageRef = ref(this.cloudStorage, path);

    try {
      const result = (await uploadBytes(storageRef, file))
      const urlPromise = getDownloadURL(result.ref);
      return urlPromise;
    } catch (error: any) {
      return Promise.reject(getStorageError(error));
    }
  }

  /**
   * Returns the path of the screenshot
   * @param fileName
   */
  getFilePath(screen: CloudStorageFileScreens, fileName: string): string {
    const timestamp = new Date().getTime();
    const uniqueName = sanitizeFileName(`${fileName}-${timestamp}`, Constants.FILE_NAME_SEPARATOR);
    switch (screen) {
      case CloudStorageFileScreens.support:
        return `/support/screenshots/${uniqueName}`;
      case CloudStorageFileScreens.userProfilePhoto:
        return `/users/profile-photos/${uniqueName}`;

      default:
        return `/${uniqueName}`;
    }
  }
}
