import { Component, ChangeDetectionStrategy, viewChild, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PasswordFormComponent } from '../../../../shared/components/password-form/password-form.component';
import { ProfileFormComponent } from '../../../../shared/components/profile-form/profile-form.component';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordFormComponent,
    ProfileFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Create New User</h2>
    <mat-dialog-content>
      <mat-vertical-stepper [linear]="true" #stepper>
        <!-- Step 1: Account -->
        <mat-step [stepControl]="accountForm">
          <ng-template matStepLabel>Account</ng-template>
          <form [formGroup]="accountForm" class="step-form">
            <mat-form-field appearance="outline">
              <mat-label>Company</mat-label>
              <mat-select formControlName="company">
                <mat-option value="companyA">Company A</mat-option>
                <mat-option value="companyB">Company B</mat-option>
              </mat-select>
              <mat-error *ngIf="accountForm.get('company')?.hasError('required')">Company is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
               <mat-label>User Name</mat-label>
               <input matInput formControlName="userName">
               <mat-error *ngIf="accountForm.get('userName')?.hasError('required')">User Name is required</mat-error>
            </mat-form-field>
            
            <div class="step-actions">
               <button mat-button matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Password -->
        <mat-step [stepControl]="passwordFormGroup">
           <ng-template matStepLabel>Password</ng-template>
           <!-- We bind the reusable component here. 
                Since MatStepper needs a FormGroup to validate the step, we need to access the child's form.
                A common pattern is to let the child expose its form, or use a ViewChild. 
                I will use ViewChild to get the form from the component to link it. -->
           <app-password-form #passwordComponent></app-password-form>
           
           <div class="step-actions">
              <button mat-button matStepperPrevious>Back</button>
              <button mat-button matStepperNext>Next</button>
           </div>
        </mat-step>

        <!-- Step 3: Setting -->
        <mat-step [stepControl]="settingForm">
          <ng-template matStepLabel>Setting</ng-template>
          <form [formGroup]="settingForm" class="step-form">
             <!-- Row 1 -->
             <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                   <mat-label>User Type</mat-label>
                   <mat-select formControlName="userType">
                      <mat-option value="admin">Admin</mat-option>
                      <mat-option value="user">User</mat-option>
                   </mat-select>
                   <mat-error *ngIf="settingForm.get('userType')?.hasError('required')">Required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                    <mat-label>DINEX User Type</mat-label>
                    <mat-select formControlName="dinexUserType">
                       <mat-option value="typeA">Type A</mat-option>
                       <mat-option value="typeB">Type B</mat-option>
                    </mat-select>
                </mat-form-field>
             </div>

             <!-- Row 2 -->
             <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Active Status</mat-label>
                    <mat-select formControlName="activeStatus">
                       <mat-option value="active">Active</mat-option>
                       <mat-option value="inactive">Inactive</mat-option>
                    </mat-select>
                    <mat-error *ngIf="settingForm.get('activeStatus')?.hasError('required')">Required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Session Expiration</mat-label>
                    <mat-select formControlName="sessionExpiration">
                       <mat-option value="1h">1 Hour</mat-option>
                       <mat-option value="4h">4 Hours</mat-option>
                       <mat-option value="8h">8 Hours</mat-option>
                    </mat-select>
                 </mat-form-field>
             </div>
             
             <div class="step-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-button matStepperNext>Next</button>
             </div>
          </form>
        </mat-step>

        <!-- Step 4: Profile -->
        <mat-step [stepControl]="profileFormGroup">
           <ng-template matStepLabel>Profile</ng-template>
           <app-profile-form #profileComponent></app-profile-form>
           
           <div class="step-actions">
              <button mat-button matStepperPrevious>Back</button>
              <button mat-flat-button color="primary" (click)="onSubmit()">Create User</button>
           </div>
        </mat-step>

      </mat-vertical-stepper>
    </mat-dialog-content>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 600px;
      max-height: 80vh; 
    }
    .step-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .half-width {
      flex: 1;
    }
    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class CreateUserDialogComponent {
  private fb = inject(FormBuilder);
  
  accountForm = this.fb.group({
    company: ['', Validators.required],
    userName: ['', Validators.required]
  });

  settingForm = this.fb.group({
    userType: ['', Validators.required],
    dinexUserType: [''],
    activeStatus: ['', Validators.required],
    sessionExpiration: ['']
  });

  // Access child components to get their FormGroups
  @ViewChild('passwordComponent') passwordComponent!: PasswordFormComponent;
  @ViewChild('profileComponent') profileComponent!: ProfileFormComponent;

  // We need to provide 'stepControl' to MatStepper so it knows if the step is valid.
  // We can't access ViewChild in constructor, so we might need a getter or just rely on the component instance later?
  // Actually, MatStep's [stepControl] expects an AbstractControl. 
  // Since the child component's form isn't available until AfterViewInit, this is tricky for the template binding *initially*.
  // However, we can use a getter that returns null safely, or better:
  // We can't bind [stepControl] directly to property that is undefined.
  // Workaround: 
  // 1. We can rely on 'linear' stepper behavior which checksValidity() on interaction.
  // 2. Or better, we can expose a Signal or property from the child? 
  // Let's try direct binding in template: [stepControl]="passwordComponent?.form"
  // The ?. check handles the initial undefined state.
  
  get passwordFormGroup() {
    return this.passwordComponent?.form;
  }

  get profileFormGroup() {
    return this.profileComponent?.form;
  }

  constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>) {}

  onSubmit() {
    if (this.accountForm.valid && this.settingForm.valid && 
        this.passwordComponent.form.valid && this.profileComponent.form.valid) {
      
      const formData = {
        account: this.accountForm.value,
        password: this.passwordComponent.form.value,
        setting: this.settingForm.value,
        profile: this.profileComponent.form.value
      };
      
      console.log('Form Submitted:', formData);
      this.dialogRef.close(formData);
    } else {
      this.accountForm.markAllAsTouched();
      this.settingForm.markAllAsTouched();
      this.passwordComponent.form.markAllAsTouched();
      this.profileComponent.form.markAllAsTouched();
    }
  }
}
