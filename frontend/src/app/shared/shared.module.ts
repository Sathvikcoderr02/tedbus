import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

// Third-party modules
import { ToastrModule } from 'ngx-toastr';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatDialogModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatTableModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatSelectModule
];

const angularModules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [],
  imports: [
    ...angularModules,
    ...materialModules,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      timeOut: 5000
    })
  ],
  exports: [
    ...angularModules,
    ...materialModules,
    ToastrModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SharedModule { }
