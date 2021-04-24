import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MelSharedModuleConfig } from '../../mel-shared.model';
import { MEL_ENV } from '../../mel-shared.token';
import { ResourceBaseService } from '../resource-base.service';
import { Category } from './categories.model';

@Injectable({ providedIn: 'root' })
export class ResourcesCategoriesService extends ResourceBaseService<Category> {
  resource = 'categories';
  categories: Category[] = [];

  constructor(
    @Inject(MEL_ENV) env: MelSharedModuleConfig,
    http: HttpClient
  ) { super(env, http); }

  findAll(): Observable<Category[]> {
    if (this.categories.length > 0) {
      return of(this.categories);
    }
    return super.findAll().pipe(
      map(categories => {
        this.categories = categories;
        return this.categories;
      }),
    );
  }
}
