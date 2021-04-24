import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MelSharedModuleConfig } from '../../mel-shared.model';
import { MEL_ENV } from '../../mel-shared.token';
import { Feature } from './features.model';

@Injectable({ providedIn: 'root' })
export class ResourcesFeaturesService {
  features: Feature[] = [];

  constructor(
    @Inject(MEL_ENV) private env: MelSharedModuleConfig,
    private http: HttpClient
  ) { }

  findAll(): Observable<Feature[]> {
    if (this.features.length > 0) {
      return of(this.features);
    }
    return this.http.get<Feature[]>(`${this.env.domains.mel}/api/resources/features`).pipe(
      map(features => {
        this.features = features;
        return this.features;
      }),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
}
