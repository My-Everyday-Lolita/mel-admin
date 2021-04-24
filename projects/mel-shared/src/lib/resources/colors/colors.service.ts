import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MelSharedModuleConfig } from '../../mel-shared.model';
import { MEL_ENV } from '../../mel-shared.token';
import { ResourceBaseService } from '../resource-base.service';
import { Color } from './colors.model';

@Injectable({ providedIn: 'root' })
export class ResourcesColorsService extends ResourceBaseService<Color> {

  resource = 'colors';

  colors: Color[] = [];

  constructor(
    @Inject(MEL_ENV) env: MelSharedModuleConfig,
    http: HttpClient
  ) { super(env, http); }

  findAll(): Observable<Color[]> {
    if (this.colors.length > 0) {
      return of(this.colors);
    }
    return super.findAll().pipe(
      map(colors => {
        this.colors = colors;
        return this.colors;
      }),
    );
  }
}
