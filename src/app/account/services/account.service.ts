import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/authentication/auth.service';
import { CloudStorageFileScreens } from '@app/constant/api-constants';
import { Constants } from '@app/constant/app-constants';
import { IUser, IUserProperties } from '@app/models/common.model';
import { CloudStorageService } from '@app/services/cloud-storage.service';
import { getRandomString } from '@app/utils/string-utility';
import { AccountConstants } from '../constants/account.constants';
import { Player } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private datePipe: DatePipe,
    private storageService: CloudStorageService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  /**
   * Gets the date of birth
   * @param timestamp
   * @returns
   */
  getDob(timestamp: number): string {
    if (timestamp && timestamp < new Date().getTime()) {
      const date = this.datePipe.transform(timestamp, Constants.DATE_TIME_FORMATS.format_2)
      return date || Constants.NOT_AVAILABLE;;
    }
    return Constants.NOT_AVAILABLE;
  }

  /**
   * Saves the account details
   */
  async saveAccountDetails(value: any, existingDetails: Player, userId: string): Promise<any> {
    const properties: IUserProperties = {};
    const player: Partial<Player> = {};

    if (value?.name !== existingDetails.name) {
      properties.displayName = value.name;
      player.name = value.displayName;
    }

    if (value.imgUrl) {
      const fileName = AccountConstants.FILE_NAME + getRandomString(10);
      const filePath = this.storageService.getFilePath(CloudStorageFileScreens.userProfilePhoto, fileName);
      const imgUrl = await this.storageService.getPublicUrl(value.imgUrl, filePath);

      properties.photoURL = imgUrl;
      player.imgLink = imgUrl;
    }

    if (value.dob && new Date(value.dob).getTime() !== existingDetails.dob) {
      player.dob = new Date(value.dob).getTime();

    }
    if (value.locationCity !== existingDetails.locationCity) {
      player.locationCity = value.locationCity.name;
    }

    if (value.locationState !== existingDetails.locationState) {
      player.locationState = value.locationState.name;
    }

    if (Object.keys(player).length) {
      const allPromises = [];
      allPromises.push(this.userService.updateUserDetails(player, userId));
      allPromises.push(this.authService.updateUserProfile(properties));

      return Promise.all(allPromises);
    }

    console.log('No values are changed');
    return Promise.resolve(0);

  }
}
