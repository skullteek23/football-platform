import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmFormClosureGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: CanComponentDeactivate
  ): Promise<boolean | UrlTree> | boolean {
    return component?.canDeactivate ? component.canDeactivate() : true;
  }
}
