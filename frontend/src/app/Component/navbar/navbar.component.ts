import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
declare var google: any;
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../model/customer.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  isDarkMode = false;
  isloggedIn = false;
  private mediaQuery: MediaQueryList | null = null;

  constructor(
    private router: Router,
    private customerservice: CustomerService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Initialize Google Sign-In
      google.accounts.id.initialize({
        client_id: "129421237209-jricn8ed4fgld4glk6k716deq5ebsmpb.apps.googleusercontent.com",
        callback: (response: any) => this.handlelogin(response)
      });
    }
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'theme') {
      this.applyTheme(event.newValue === 'dark');
    }
  }

  ngOnInit(): void {
    // Check login status
    if (isPlatformBrowser(this.platformId)) {
      this.isloggedIn = this.authService.isAuthenticated();
      // Subscribe to authentication state changes
      this.authService.currentUser.subscribe((user: any) => {
        this.isloggedIn = !!user;
      });
      
      // Initialize theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else if (this.mediaQuery) {
        this.isDarkMode = this.mediaQuery.matches;
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      }
      this.applyTheme(this.isDarkMode);

      // Listen for system theme changes
      if (this.mediaQuery) {
        this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.rendergooglebutton();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  private handleSystemThemeChange = (e: MediaQueryListEvent): void => {
    if (isPlatformBrowser(this.platformId) && !localStorage.getItem('theme')) {
      this.isDarkMode = e.matches;
      this.applyTheme(this.isDarkMode);
    }
  }
private rendergooglebutton():void{
  const googlebtn=document.getElementById('google-btn');
  if(googlebtn){
    google.accounts.id.renderButton(googlebtn,{
      theme:'outline',
      size:'medium',
      shape:'pill',
      width:150,
    })
  }
}

private decodetoken(token:String){
  return JSON.parse(atob(token.split(".")[1]))
}
handlelogin(response:any){
  const payload=this.decodetoken(response.credential)
  this.customerservice.addcustomermongo(payload).subscribe({
    next:(response)=>{
      console.log('POST success',response);
      this.authService.login(response);
    },
    error:(error)=>{
      console.error('Post request failed',error)
    }
  })
}
handlelogout(){
  google.accounts.id.disableAutoSelect();
  this.authService.logout();
  window.location.reload();
}
navigate(route:string){
  this.router.navigate([route])
}
}
