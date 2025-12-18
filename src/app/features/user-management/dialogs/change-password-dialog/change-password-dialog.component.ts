import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PasswordFormComponent } from '../../../../shared/components/password-form/password-form.component';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    PasswordFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Change Password</h2>
    <mat-dialog-content>
      <app-password-form #passwordComponent></app-password-form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="onSubmit()">Update Password</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class ChangePasswordDialogComponent {
  @ViewChild('passwordComponent') passwordComponent!: PasswordFormComponent;

  constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>) {}

  onSubmit() {
    if (this.passwordComponent.form.valid) {
      console.log('Password Changed:', this.passwordComponent.form.value);
      this.dialogRef.close(this.passwordComponent.form.value);
    } else {
      this.passwordComponent.form.markAllAsTouched();
    }
  }
}
