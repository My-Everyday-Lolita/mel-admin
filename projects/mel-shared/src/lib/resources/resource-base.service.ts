import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MelSharedModuleConfig } from '../mel-shared.model';

export abstract class ResourceBaseService<T> {

  abstract resource: string;

  constructor(
    protected env: MelSharedModuleConfig,
    protected http: HttpClient
  ) { }

  findAll(needAuth = false): Observable<T[]> {
    return this.http.get<T[]>(`${this.env.domains.mel}/api/resources/${this.resource}`, {
      headers: this.getDefaultHeaders(needAuth)
    }).pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  create(data: T, needAuth = true): Observable<T> {
    return this.http.put<T>(`${this.env.domains.mel}/api/resources/${this.resource}`, data, {
      headers: this.getDefaultHeaders(needAuth)
    });
  }

  update(data: T, needAuth = true): Observable<T> {
    return this.http.patch<T>(`${this.env.domains.mel}/api/resources/${this.resource}`, data, {
      headers: this.getDefaultHeaders(needAuth)
    });
  }

  findById(id: string, needAuth = false): Observable<T> {
    return this.http.get<T>(`${this.env.domains.mel}/api/resources/${this.resource}/get/${id}`, {
      headers: this.getDefaultHeaders(needAuth)
    });
  }

  delete(id: string, needAuth = true): Observable<any> {
    return this.http.delete<any>(`${this.env.domains.mel}/api/resources/${this.resource}/${id}`, {
      headers: this.getDefaultHeaders(needAuth)
    });
  }

  protected getDefaultHeaders(addAuth: boolean): HttpHeaders {
    let headers = new HttpHeaders();
    if (addAuth) {
      headers = headers.append('Authorization', 'auto');
    }
    return headers;
  }
}
