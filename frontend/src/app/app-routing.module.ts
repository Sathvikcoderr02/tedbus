import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';
// Feature modules are lazy loaded below
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { ProfilePageComponent } from './Component/profile-page/profile-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { 
    path: 'select-bus', 
    loadChildren: () => import('./Component/selectbus-page/selectbus.module').then(m => m.SelectbusModule) 
  },
  { path: 'payment', component: PaymentPageComponent },
  { 
    path: 'profile', 
    component: ProfilePageComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'community', 
    loadChildren: () => import('./community/community.module').then(m => m.CommunityModule) 
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
