import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, catchError, throwError, map } from 'rxjs';
import { Person } from '../models/person.model';

export type SortDirection = 'asc' | 'desc' | '';
export interface SortConfig {
  column: keyof Person;
  direction: SortDirection;
}

@Injectable({ providedIn: 'root' })
export class PersonService {
  private mockDataUrl = 'assets/mocks/peopleData.json';

  constructor(private http: HttpClient) {}

  getPeople(
    searchTerm?: string,
    sortConfig?: SortConfig
  ): Observable<Person[]> {
    return this.http.get<Person[]>(this.mockDataUrl).pipe(
      delay(500),
      map((data) => {
        let filteredData = this.filterData(data, searchTerm);
        if (sortConfig && sortConfig.direction) {
          filteredData = this.sortData(filteredData, sortConfig);
        }
        return filteredData;
      }),
      catchError((error) => {
        console.error('Error fetching people:', error);
        return throwError(() => error);
      })
    );
  }

  private filterData(data: Person[], searchTerm?: string): Person[] {
    if (!searchTerm) {
      return data;
    }

    const searchLower = searchTerm.toLowerCase();
    return data.filter(
      (person) =>
        person.firstName.toLowerCase().includes(searchLower) ||
        person.lastName.toLowerCase().includes(searchLower) ||
        person.professionalTitle.toLowerCase().includes(searchLower) ||
        person.company.toLowerCase().includes(searchLower) ||
        person.email.toLowerCase().includes(searchLower) ||
        person.phone.toLowerCase().includes(searchLower)
    );
  }

  private sortData(data: Person[], sortConfig: SortConfig): Person[] {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }
}
