import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MelSharedModuleConfig } from '../../mel-shared.model';
import { MEL_ENV } from '../../mel-shared.token';
import { ResourceBaseService } from '../resource-base.service';
import { Brand } from './brands.model';

@Injectable({ providedIn: 'root' })
export class ResourcesBrandsService extends ResourceBaseService<Brand> {

  resource = 'brands';
  brands: Brand[] = [];

  constructor(
    @Inject(MEL_ENV) protected env: MelSharedModuleConfig,
    protected http: HttpClient
  ) { super(env, http); }

  findAll(): Observable<Brand[]> {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return super.findAll().pipe(
      map(brands => {
        this.brands = brands;
        return this.brands;
      })
    );
  }

}
