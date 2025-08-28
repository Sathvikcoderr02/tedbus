import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('Loggedinuser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  login(userData: any) {
    sessionStorage.setItem('Loggedinuser', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
    return userData;
  }

  logout() {
    sessionStorage.removeItem('Loggedinuser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }
}
