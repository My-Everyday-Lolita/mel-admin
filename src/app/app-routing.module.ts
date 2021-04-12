import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RESOURCES_ROUTES } from './app.token';
import { SignedInGuard } from './features/user/signed-in.guard';
import { HomeComponent } from './pages/home/home.component';
import { ResourcesBrandsComponent } from './pages/resources-brands/resources-brands.component';
import { ResourcesCategoriesComponent } from './pages/resources-categories/resources-categories.component';
import { ResourcesColorsComponent } from './pages/resources-colors/resources-colors.component';
import { ResourcesFeaturesComponent } from './pages/resources-features/resources-features.component';
import { ResourcesItemsComponent } from './pages/resources-items/resources-items.component';

const resources: Routes = [
  {
    path: 'brands', component: ResourcesBrandsComponent, data: {
      linkLabel: 'APP.LINKS.RESOURCES.BRANDS',
      icon: 'card_membership'
    }
  },
  {
    path: 'categories', component: ResourcesCategoriesComponent, data: {
      linkLabel: 'APP.LINKS.RESOURCES.CATEGORIES',
      icon: 'category'
    }
  },
  {
    path: 'colors', component: ResourcesColorsComponent, data: {
      linkLabel: 'APP.LINKS.RESOURCES.COLORS',
      icon: 'palette'
    }
  },
  {
    path: 'features', component: ResourcesFeaturesComponent, data: {
      linkLabel: 'APP.LINKS.RESOURCES.FEATURES',
      icon: 'tune'
    }
  },
  {
    path: 'items', component: ResourcesItemsComponent, data: {
      linkLabel: 'APP.LINKS.RESOURCES.ITEMS',
      icon: 'checkroom'
    }
  },
];

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [SignedInGuard] },
  {
    path: 'resources', canActivate: [SignedInGuard], children: [
      ...resources
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: RESOURCES_ROUTES, useValue: resources }
  ]
})
export class AppRoutingModule { }
