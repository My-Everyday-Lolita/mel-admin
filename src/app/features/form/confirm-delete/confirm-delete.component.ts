import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteComponent {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { token: string },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(this.data.token)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(true);
    }
  }

}
