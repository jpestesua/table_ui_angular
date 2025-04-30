import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, catchError, throwError } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({ providedIn: 'root' })
export class PersonService {
  constructor(private http: HttpClient) {}

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>('/assets/mocks/peopleData.json').pipe(
      delay(800),
      catchError((error) => {
        console.error('Error fetching people:', error);
        return throwError(() => error);
      })
    );
  }
}
