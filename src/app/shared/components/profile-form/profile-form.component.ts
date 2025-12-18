import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PhoneNumberComponent } from '../phone-number/phone-number.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    PhoneNumberComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form" class="profile-form-container">
      <div class="row">
         <mat-form-field appearance="outline" class="half-width">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
            @if (form.get('firstName')?.hasError('required')) {
              <mat-error>First Name is required</mat-error>
            }
         </mat-form-field>

         <mat-form-field appearance="outline" class="half-width">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
            @if (form.get('lastName')?.hasError('required')) {
              <mat-error>Last Name is required</mat-error>
            }
         </mat-form-field>
      </div>

      <div class="row">
        <!-- Phone Number Component -->
        <app-phone-number formControlName="phone" class="half-width"></app-phone-number>
        
       
      </div>
      <div class="row">
         <mat-form-field appearance="outline" class="full-width">
           <mat-label>Email</mat-label>
           <input matInput formControlName="email">
           @if (form.get('email')?.hasError('required')) {
              <mat-error>Email is required</mat-error>
           }
           @if (form.get('email')?.hasError('email')) {
              <mat-error>Invalid email</mat-error>
           }
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [`
    .profile-form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .row {
      display: flex;
      gap: 16px;
      width: 100%;
    }
    .half-width {
      flex: 1;
    }
    /* Ensure phone number component takes proper width in flex container */
    app-phone-number {
      display: block;
    }
  `]
})
export class ProfileFormComponent {
  form = new FormGroup({
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    phone: new FormControl(null), // Validates itself
    email: new FormControl('', { validators: [Validators.required, Validators.email] })
  });

  getFormGroup(): FormGroup {
    return this.form;
  }
}
