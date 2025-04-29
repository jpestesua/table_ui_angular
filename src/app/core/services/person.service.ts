import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({ providedIn: 'root' })
export class PersonService {
  constructor(private http: HttpClient) {}

  getPeople(): Observable<Person[]> {
    return this.http
      .get<Person[]>('src/assets/mockData/peopleData.json')
      .pipe(delay(800));
  }
}
