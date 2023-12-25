import { Injectable } from '@angular/core';
import { CloudStorageService } from '@app/utils/services/cloud-storage.service';
import { SupportRequest } from '../models/support.model';
import { CloudStorageFileScreens } from '@app/utils/constant/api-constants';
import { CoreApiService } from '@app/utils/services/core-api.service';
import { SupportConstants } from '../constants/support.constants';
import { getRandomString } from '@ballzo-ui/core';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(
    private cloudStorageService: CloudStorageService,
    private coreApiService: CoreApiService
  ) { }

  async submitRequest(value: any, uid: string, refId: string): Promise<any> {
    if (!value['subject'] || !value['description']) {
      return Promise.reject('Subject and description are required');
    }
    const supportRequest = new SupportRequest();
    supportRequest.subject = value?.subject?.trim();
    supportRequest.description = value?.description?.trim();

    const linkUrls: string[] = [];
    const screenshotFiles: File[] = value.screenshots;
    if (screenshotFiles?.length) {
      for (let i = 0; i < screenshotFiles.length; i++) {
        const file = screenshotFiles[i];
        const fileName = SupportConstants.FILE_NAME + getRandomString(10);
        const path = this.cloudStorageService.getFilePath(CloudStorageFileScreens.support, fileName);
        try {
          const fileLink = await this.cloudStorageService.getPublicUrl(file, path);
          if (fileLink) {
            linkUrls.push(fileLink);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
    supportRequest.screenshots = linkUrls;
    supportRequest.uid = uid;

    return this.addRequest(supportRequest, refId);
  }

  /**
   * Get the reference id
   */
  getReferenceId(): string {
    return SupportConstants.SUPPORT_REQUEST_ID_PREFIX + getRandomString(10).toUpperCase();
  }

  /**
   * Add a support request
   * @param data
   * @param docID
   * @returns
   */
  addRequest(data: SupportRequest, docID: string): Promise<any> {
    return this.coreApiService.addDocument('support-requests', data, docID);
  }
}
