import { ConfirmationResult, User } from '@angular/fire/auth';
import { StorageErrorCode } from '@angular/fire/storage';
import { FirebaseError } from 'firebase/app';
import { FunctionsErrorCode } from 'firebase/functions';

// Classes
export class IListOption {
  viewValue: string = 'Label';
  value: any = null;
}

// Interfaces
export type IUser = User | null;
export type IConfirmationResult = ConfirmationResult | null;
export interface IUserProperties {
  displayName?: string | null;
  photoURL?: string | null;
}
export interface IApiError extends FirebaseError { }
export type CloudFnErrorCode = FunctionsErrorCode;
export type CloudStorageErrorCode = StorageErrorCode;
export type IUserRole = { user: IUser, role: string };

export class BackgroundCSS {
  background: string = '';
  color: string = 'black';
}
