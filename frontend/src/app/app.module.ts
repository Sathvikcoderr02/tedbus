import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

// App Routing
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { FooterComponent } from './Component/footer/footer.component';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';
import { DialogComponent } from './Component/landing-page/dialog/dialog.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { ProfilePageComponent } from './Component/profile-page/profile-page.component';
import { MyTripComponent } from './Component/profile-page/my-trip/my-trip.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

// Services
import { ChatbotService } from './services/chatbot.service';
import { AuthService } from './services/auth.service';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Shared Module
import { SharedModule } from './shared/shared.module';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingPageComponent,
    DialogComponent,
    ChatbotComponent,
    PaymentPageComponent,
    ProfilePageComponent,
    MyTripComponent,
    VirtualTourComponent
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // App Routing
    AppRoutingModule,
    
    // Shared Module (contains all common modules and Material modules)
    SharedModule
  ],
  providers: [
    ChatbotService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
