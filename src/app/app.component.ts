import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Routes } from '@angular/router';
import { RESOURCES_ROUTES } from './app.token';
import { UserSignInService } from './features/user/user-sign-in.service';
import { User } from './features/user/user.model';
import { UserService } from './features/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  sidenavMode: MatDrawerMode = 'over';
  sidenavOpened = false;
  sidenavFixedInViewport = false;
  isMobile = false;
  user?: User;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userSigneInService: UserSignInService,
    private userService: UserService,
    @Inject(RESOURCES_ROUTES) public resourcesRoutes: Routes
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web]).subscribe({
      next: state => {
        this.isMobile = state.breakpoints[Breakpoints.HandsetLandscape] || state.breakpoints[Breakpoints.HandsetPortrait];
        this.sidenavMode = this.isMobile ? 'over' : 'side';
        this.sidenavOpened = !this.isMobile;
      }
    });
    this.userSigneInService.signedIn$.subscribe({
      next: signedIn => {
        if (signedIn) {
          this.user = this.userService.user;
        } else {
          this.user = undefined;
        }
      }
    });
  }

  signOut(): void {
    this.userSigneInService.signOut();
    location.reload();
  }

}
