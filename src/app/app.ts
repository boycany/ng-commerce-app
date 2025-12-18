import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './features/user-management/dialogs/create-user-dialog/create-user-dialog.component';
import { EditProfileDialogComponent } from './features/user-management/dialogs/edit-profile-dialog/edit-profile-dialog.component';
import { ChangePasswordDialogComponent } from './features/user-management/dialogs/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CommonModule, RouterOutlet, MatButtonModule, MatDialogModule],
})
export class App {
  protected readonly title = signal('ng-commerce-app');
  private dialog = inject(MatDialog);

  openCreateUser() {
    this.dialog.open(CreateUserDialogComponent, {
      width: '800px',
      disableClose: true,
    });
  }

  openEditProfile() {
    this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
    });
  }

  openChangePassword() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '450px',
    });
  }
}
