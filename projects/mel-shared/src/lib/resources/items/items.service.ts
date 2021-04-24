import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MelSharedModuleConfig } from '../../mel-shared.model';
import { MEL_ENV } from '../../mel-shared.token';
import { Criterium, Item, ItemStats } from './items.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  readonly TMP_SAVE_KEY = 'item:tmp-save';

  constructor(
    @Inject(MEL_ENV) private env: MelSharedModuleConfig,
    private http: HttpClient
  ) { }

  create(data: Item): Observable<Item> {
    return this.http.put<Item>(`${this.env.domains.mel}/api/resources/items`, data, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    });
  }

  update(data: Item): Observable<Item> {
    return this.http.patch<Item>(`${this.env.domains.mel}/api/resources/items`, data, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    });
  }

  findById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.env.domains.mel}/api/resources/items/get/${id}`);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.env.domains.mel}/api/resources/items/${id}`, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    });
  }

  findByCriteria(criteria: Criterium[], skip = 0, limit = 60): Observable<Item[]> {
    const params = new HttpParams({
      fromObject: {
        limit: `${limit}`,
        skip: `${skip}`,
      }
    });
    return this.http.post<Item[]>(`${this.env.domains.mel}/api/resources/items/search`, criteria, { params });
  }

  recentlyAdded(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.env.domains.mel}/api/resources/items/recently-added`);
  }

  stats(): Observable<ItemStats[]> {
    return this.http.get<ItemStats[]>(`${this.env.domains.mel}/api/resources/items/stats`, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    });
  }

}
