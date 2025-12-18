import { Component, ChangeDetectionStrategy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProfileFormComponent } from '../../../../shared/components/profile-form/profile-form.component';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ProfileFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Edit User</h2>
    <mat-dialog-content>
      <!-- We can reuse the same ProfileFormComponent here. 
           User request image shows 'Account', 'Password', 'Setting', 'Profile' all in one page for Edit User?
           Wait, user request image 2 "Edit New User" shows:
           Account (read only?), Password, Setting, Profile.
           
           Let's re-read the request:
           "One is Edit User Profile form."
           "Edit Profile Dialog - contains Edit Profile Form component"
           "Edit Profile Form - can be reused in Create User Dialog and Edit Profile Dialog components, using Profile field to build"
           
           Looking at Image 2 (Edit New User), it actually looks like the FULL Create User form but in a single scrolling page instead of a stepper?
           OR is it just the profile?
           
           Image 3 is "Edit New User" also.
           Image 2 and 3 look like they cover all sections: Account, Password, Setting, Profile.
           
           The user text says:
           "3. A form for Edit User Profile."
           "4. ... Edit User Profile Form ... reusable ... using Profile FormGroup"
           
           However, the images "Edit New User" show ALL SECTIONS.
           If the user literally means "Edit User Profile" as in just the profile section, I should just show that.
           BUT the images imply a full edit.
           
           Re-reading:
           "重點是，Create New User 的表單... 裡面含有四個區塊... 所以我想要使用 Angular material 的 mat-stepper 來呈現"
           This implies "Create" uses Stepper.
           
           "Edit User Profile 的表單" -> "Edit Profile Dialog - contains Edit Profile Form component".
           
           There might be a confusion between "Edit User" (Full) vs "Edit Profile" (Subset).
           BUT looking at the requirement 4: "Edit Profile Form - reusable... using Profile FormGroup". This strongly suggests it's just the Profile part.
           
           HOWEVER, Image 2 shows "Edit New User" with Account, Password, etc.
           Maybe the "Edit Profile Dialog" is SUPPOSED to be just the profile editing?
           Or maybe "Edit User Profile" is a misnomer by the user and they mean "Edit User" (Full)?
           
           Given the specific instruction "Edit Profile Form... using Profile FormGroup", I should probably stick to creating a dialog that wraps the Profile Form. 
           But if I strictly follow "Edit Profile Form - using Profile FormGroup", it implies only the Profile section.
           
           Let's look at the "Edit New User" (Image 2). It definitely has "Account", "Password", "Setting", "Profile".
           If the user wants me to match the image for "Edit User", then "Edit User" is NOT just "Profile".
           
           The user request says:
           "3. A Edit User Profile form." -> "Ein Edit Profile Dialog"
           "4. Edit Profile Form - reusable ... using Profile FormGroup"
           
           If I only implement Profile, I miss the "Account", "Setting", "Password" parts shown in the "Edit New User" image.
           
           Wait, there is a "Change Password Dialog" separately requested.
           "2. A Change Password form." => "Change Password Dialog"
           
           If "Change Password" is separate, why is it in "Edit New User" image?
           Maybe "Edit New User" image is actually a comprehensive edit view?
           
           Let's stick to the text requirements which are more specific about compoment structure:
           "1. Create New User ... 4 blocks ... MatStepper"
           "2. Change Password ... Dialog ... Password Form Component"
           "3. Edit User Profile ... Dialog ... Edit Profile Form"
           "4. Edit Profile Form ... using Profile FormGroup"
           
           It seems the user wants granular dialogs for "Change Password" and "Edit Profile". 
           The "Create New User" is the big one with everything.
           
           I will implement "Edit Profile Dialog" containing ONLY "ProfileFormComponent" for now, as that's what the component structure implies. 
           If the user intended the full "Edit User" page from the screenshot, they would have likely asked for "Edit User Dialog" reuse of all forms.
           Actually, the screenshot "Edit New User" might just be a reference design that happens to show everything.
           
           Let's implement EditProfileDialog as wrapping ProfileFormComponent.
      -->
      
       <app-profile-form #profileComponent></app-profile-form>
      
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="onSubmit()">Save Changes</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 500px;
    }
  `]
})
export class EditProfileDialogComponent {
  @ViewChild('profileComponent') profileComponent!: ProfileFormComponent;
  
  constructor(public dialogRef: MatDialogRef<EditProfileDialogComponent>) {}

  onSubmit() {
    if (this.profileComponent.form.valid) {
      console.log('Profile Updated:', this.profileComponent.form.value);
      this.dialogRef.close(this.profileComponent.form.value);
    } else {
      this.profileComponent.form.markAllAsTouched();
    }
  }
}
