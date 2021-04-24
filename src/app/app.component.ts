import { trigger, transition, style, query, animateChild, animate, group } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerMode } from '@angular/material/sidenav';
import { RouterOutlet, Routes } from '@angular/router';
import { User, UserService, UserSignInService } from '@my-everyday-lolita/mel-shared';
import { ToastrService } from 'ngx-toastr';
import { RESOURCES_ROUTES } from './app.token';
import { SignInModalComponent } from './features/user/sign-in-modal/sign-in-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeTransition', [
      transition('* => *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: '32px',
            left: '32px',
            width: 'calc(100% - 64px)',
            height: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateY(100px)', opacity: 0 })
        ], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ transform: 'translateY(-100px)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-out', style({ transform: 'translateY(0px)', opacity: 1 }))
          ], { optional: true })
        ]),
        query(':enter', animateChild(), { optional: true }),
      ]),
    ])
  ]
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
    @Inject(RESOURCES_ROUTES) public resourcesRoutes: Routes,
    private dialog: MatDialog,
    private toastr: ToastrService
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
          this.dialog.open(SignInModalComponent, {
            disableClose: true,
          }).afterClosed().subscribe({
            next: () => {
              this.toastr.clear();
            }
          });
        }
      }
    });
  }

  signOut(): void {
    this.userSigneInService.signOut();
    location.reload();
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
