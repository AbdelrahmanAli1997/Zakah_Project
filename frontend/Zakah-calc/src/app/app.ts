import {Component, DoCheck, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Navbar} from "./shared/navbar/navbar";
import {AuthService} from './services/auth-service/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements DoCheck{

  protected readonly title = signal('Zakah-calc');
  private router = inject(Router);
  authState = inject(AuthService);
  a = inject(ActivatedRoute)
  islogin:boolean = this.authState.isLoggedIn();


 ngDoCheck(): void {
   initFlowbite();
   
   this.islogin = this.authState.isLoggedIn();
  
  }


  showLogin() {
    this.router.navigate(['/login']);
  }

  showRegister() {
    this.router.navigate(['/register']);
  }

  showForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
