import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthorizationInterceptor } from './http/interceptors/authorization.interceptor';
import { InactiveInterceptor } from './http/interceptors/inactive.interceptor';
import { MelSharedModuleConfig, SignOutBehaviors } from './mel-shared.model';
import { MEL_ENV, MEL_SIGN_OUT_BEHAVIOR } from './mel-shared.token';
import { ItemPhotoPipe } from './resources/items/item-photo.pipe';
import { PhotosPipe } from './resources/items/photos.pipe';
import { CacheItemNamePipe } from './resources/user-content/cache-item-name.pipe';
import { CacheItemPhotoPipe } from './resources/user-content/cache-item-photo.pipe';
import { CacheItemPipe } from './resources/user-content/cache-item.pipe';
import { CoordMainPiecePipe } from './resources/user-content/coord-main-piece.pipe';
import { InClosetDirective } from './resources/user-content/in-closet.directive';
import { InWishListDirective } from './resources/user-content/in-wishlist.directive';



@NgModule({
  declarations: [
    ItemPhotoPipe,
    PhotosPipe,
    CacheItemNamePipe,
    CacheItemPhotoPipe,
    CacheItemPipe,
    CoordMainPiecePipe,
    InClosetDirective,
    InWishListDirective,
  ],
  imports: [
    HttpClientModule,
  ],
  exports: [
    ItemPhotoPipe,
    PhotosPipe,
    CacheItemNamePipe,
    CacheItemPhotoPipe,
    CacheItemPipe,
    CoordMainPiecePipe,
    InClosetDirective,
    InWishListDirective,
  ]
})
export class MelSharedModule {
  static forRoot(config: MelSharedModuleConfig): ModuleWithProviders<MelSharedModule> {
    return {
      ngModule: MelSharedModule,
      providers: [
        { provide: MEL_ENV, useValue: config },
        { provide: MEL_SIGN_OUT_BEHAVIOR, useValue: SignOutBehaviors.HOME_REDIRECT },
        { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: InactiveInterceptor, multi: true },
      ]
    };
  }
}
