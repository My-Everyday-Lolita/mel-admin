import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserSignInService } from '../user-sign-in.service';
import { ROLES } from '../user.model';
import { UserService } from '../user.service';

@Component({
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.scss']
})
export class SignInModalComponent {

  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SignInModalComponent>,
    private userSignInService: UserSignInService,
    private userService: UserService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.userSignInService.signIn(this.signInForm.value).subscribe({
      next: signedIn => {
        if (signedIn && this.userService.hasRole(ROLES.DAHSBOARD_ACCESS)) {
          this.dialogRef.close(true);
        } else {
          this.translateService.get('APP.TOASTS.ERRORS.ACCESS_DENIED').subscribe({
            next: translatedString => {
              this.toastr.error(translatedString, undefined, { disableTimeOut: true });
            }
          });
        }
      }
    });
  }

}
