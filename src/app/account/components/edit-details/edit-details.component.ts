import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountConstants } from '@app/account/constants/account.constants';
import { AccountService } from '@app/account/services/account.service';
import { AuthService } from '@app/authentication/auth.service';
import { AccountMessages } from '@ballzo-ui/core/common';
import { IUser } from '@app/models/user.model';
import { ILocationCity, ILocationState } from '@ballzo-ui/core/location';
import { Player } from '@ballzo-ui/core/user';
import { LocationService } from '@app/services/location.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { UserService } from '@app/services/user.service';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { getFirestoreErrorMsg } from '@app/utils/api-error-handling-utility';
import { FULL_NAME_VALIDATORS } from '@app/utils/form-validators-utility';
import { compareFunction } from '@app/utils/objects-utility';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements OnInit {

  readonly maxDate = AccountConstants.YOUNGEST_DATE_OF_BIRTH;
  readonly minDate = AccountConstants.OLDEST_DATE_OF_BIRTH;
  readonly messages = AccountMessages;
  readonly compareFunction = compareFunction;

  user!: IUser;
  userDetails!: Player;
  isLoaderShown = false;
  userForm!: FormGroup;
  submitBtnDetails = new ButtonConfig();
  states: ILocationState[] = [];
  cities: ILocationCity[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private accountService: AccountService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.authService._user().subscribe((user) => {
      if (user && user.uid) {
        this.user = user;
        this.getUserDetails();
      } else {
        this.router.navigate(['/error']);
      }
    });
    this.submitBtnDetails.label = 'Save Changes';
    this.submitBtnDetails.type = 'submit';
    this.submitBtnDetails.icon = '';
  }

  /**
   * Gets the states of India
   */
  getStates() {
    this.locationService.getStates().subscribe({
      next: (states) => {
        this.states = states;
        this.setSelectedCity();
      },
      error: (error) => {
        if (error.error) {
          this.snackbarService.displayError(error.error);
        }
        this.hideLoader();
      }
    })
  }

  /**
   * Get the cities if the state already stored on backend
   */
  setSelectedCity() {
    const currentState = this.checkStateNameValidity();
    if (currentState) {
      this.getStateCities(currentState.iso2);
    } else {
      this.hideLoader();
    }
  }


  /**
   * Checks if state already saved in database and return state object
   * @returns 
   */
  checkStateNameValidity(): ILocationState | undefined {
    return this.states.find((state: ILocationState) => {
      return (state.name === this.userDetails?.locationState);
    });
  }


  /**
   * Gets the cities of particular state
   */
  getStateCities(iso2: string) {
    this.showLoader();
    this.locationService.getCities(iso2).subscribe({
      next: (cities) => {
        this.cities = cities;
        this.hideLoader();
      },
      error: (error) => {
        if (error.error) {
          this.snackbarService.displayError(error.error);
        }
        this.hideLoader();
      }
    })
  }

  /**
   * Gets the user details
   */
  getUserDetails() {
    if (this.user?.uid) {
      this.showLoader();
      this.userService.getUser(this.user.uid).subscribe({
        next: (response) => {
          if (response) {
            this.userDetails = response;
          }
          this.initForm();
          this.getStates();
        },
        error: (err) => {
          this.hideLoader();
          this.snackbarService.displayError(getFirestoreErrorMsg(err));
        }
      });
    }
  }

  /**
   * Initializes the form
   */
  initForm() {
    this.userForm = new FormGroup({
      name: new FormControl(this.user?.displayName, FULL_NAME_VALIDATORS),
      email: new FormControl(this.user?.email, [Validators.email]),
      dob: new FormControl(this.userDetails?._dateOfBirthString, [Validators.required]),
      locationState: new FormControl(this.userDetails?.locationState, [Validators.required]),
      locationCity: new FormControl(this.userDetails?.locationCity, [Validators.required]),
      imgUrl: new FormControl(null, [this.isPhotoMandatory.bind(this)]),
    });
    this.email?.disable();
  }

  /**
   * Compares the value with the value to compare
   * @param valueToCompare
   * @returns
   */
  isPhotoMandatory(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const imgUrl = this.userDetails?.imgLink;

      if (imgUrl) {
        return { 'required': false };
      } else {
        return { 'required': true };
      }
    };
  }

  /**
   * Sets the profile photo
   * @param file
   */
  setProfilePhoto(file: File) {
    if (this.imgUrl && file) {
      this.imgUrl.setValue(file);
    }
  }

  /**
   * Saves the changes
   * @returns
   */
  saveChanges() {
    if (this.userForm.invalid || !this.user?.uid) {
      return;
    }
    this.showLoader();
    this.accountService.saveAccountDetails(this.userForm.value, this.userDetails, this.user.uid)
      .then((response) => {
        if (response === 0) {
          this.snackbarService.displayCustomMsg(this.messages.success.noChanges);
        } else {
          this.snackbarService.displayCustomMsg(this.messages.success.changesSaved);
        }
        this.hideLoader();
        this.router.navigate(['/m', 'user', 'account']);
      })
      .catch(err => {
        this.hideLoader();
        this.snackbarService.displayError(err);
      })
  }


  /**
   * Returns the result from compareFunction
   */
  compareLocation(value: any, option: any) {
    return compareFunction(value, option, "name");
  }

  /**
   * Returns the name form control
   */
  get name() {
    return this.userForm.get('name');
  }

  /**
   * Returns the email form control
   */
  get email() {
    return this.userForm.get('email');
  }

  /**
   * Returns the dob form control
   */
  get dob() {
    return this.userForm.get('dob');
  }

  /**
   * Returns the City form control
   */
  get locationCity() {
    return this.userForm.get('locationCity');
  }

  /**
   * Returns the State form control
   */
  get locationState() {
    return this.userForm.get('locationState');
  }

  /**
   * Returns the image form control
   */
  get imgUrl() {
    return this.userForm.get('imgUrl');
  }

  /**
   * Shows the loader
   */
  showLoader() {
    this.isLoaderShown = true;
  }

  /**
   * Hides the loader
   */
  hideLoader() {
    this.isLoaderShown = false;
  }

}
