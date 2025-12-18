import { Component, ChangeDetectionStrategy, signal, computed, effect, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form" class="password-form-container">
      <div class="radio-group-container">
        <mat-radio-group formControlName="passwordType" class="password-radio-group">
          <mat-radio-button value="original">Use original password</mat-radio-button>
          <mat-radio-button value="auto">Auto-generate password</mat-radio-button>
          <mat-radio-button value="custom">Set custom password</mat-radio-button>
        </mat-radio-group>
      </div>

      @if (showCustomPasswordFields()) {
        <div class="custom-password-fields">
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
            <button mat-icon-button matSuffix (click)="togglePasswordVisibility($event)" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hidePassword()">
              <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            @if (form.get('password')?.hasError('required')) {
              <mat-error>Password is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'" formControlName="confirmPassword">
            <button mat-icon-button matSuffix (click)="toggleConfirmPasswordVisibility($event)" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hideConfirmPassword()">
              <mat-icon>{{hideConfirmPassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            @if (form.get('confirmPassword')?.hasError('required')) {
              <mat-error>Confirm Password is required</mat-error>
            }
            @if (form.hasError('passwordMismatch') && !form.get('confirmPassword')?.hasError('required')) {
               <mat-error>Passwords do not match</mat-error>
            }
          </mat-form-field>
        </div>
      }
    </div>
  `,
  styles: [`
    .password-form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .password-radio-group {
      display: flex;
      gap: 24px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .custom-password-fields {
      display: flex;
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class PasswordFormComponent {
  
  form = new FormGroup({
    passwordType: new FormControl<'original' | 'auto' | 'custom'>('original', { nonNullable: true }),
    password: new FormControl<string>(''),
    confirmPassword: new FormControl<string>('')
  }, { validators: this.passwordMatchValidator });

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  
  showCustomPasswordFields = signal(false);

  constructor() {
    // React to password type changes
    this.form.controls.passwordType.valueChanges.subscribe(type => {
      this.updateValidators(type);
      this.showCustomPasswordFields.set(type === 'custom');
    });
  }
  
  // Public method to expose form group to parent
  getFormGroup(): FormGroup {
    return this.form;
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.stopPropagation();
    this.hidePassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(event: MouseEvent) {
    event.stopPropagation();
    this.hideConfirmPassword.update(v => !v);
  }

  private updateValidators(type: 'original' | 'auto' | 'custom') {
    const passwordCtrl = this.form.controls.password;
    const confirmCtrl = this.form.controls.confirmPassword;

    if (type === 'custom') {
      passwordCtrl.setValidators([Validators.required]);
      confirmCtrl.setValidators([Validators.required]);
    } else {
      passwordCtrl.clearValidators();
      confirmCtrl.clearValidators();
      passwordCtrl.setValue(''); // Clear values when not in custom mode
      confirmCtrl.setValue('');
    }
    passwordCtrl.updateValueAndValidity();
    confirmCtrl.updateValueAndValidity();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const type = group.get('passwordType')?.value;
    
    if (type !== 'custom') return null;

    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return pass === confirm ? null : { passwordMismatch: true };
  }
}
