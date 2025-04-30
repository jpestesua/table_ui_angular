import { Component, OnInit } from '@angular/core';
import {
  PersonService,
  SortConfig,
  SortDirection,
} from '../../core/services/person.service';
import { Person } from '../../core/models/person.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-peopleTable',
  standalone: true,
  templateUrl: './peopleTable.component.html',
  styleUrls: ['./peopleTable.component.scss'],
  imports: [CommonModule, HttpClientModule, FormsModule],
})
export class PeopleTableComponent implements OnInit {
  people: Person[] = [];
  searchTerm: string = '';
  loading = false;
  error: string | null = null;
  sortConfig: SortConfig = { column: 'firstName', direction: '' };

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading = true;
    this.error = null;

    this.personService.getPeople(this.searchTerm, this.sortConfig).subscribe({
      next: (data) => {
        this.people = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading data';
        this.loading = false;
      },
    });
  }

  filterPeople(): void {
    this.loadPeople();
  }

  onSort(column: keyof Person): void {
    if (this.sortConfig.column === column) {
      // Cambiar la dirección del ordenamiento
      this.sortConfig = {
        ...this.sortConfig,
        direction: this.getNextSortDirection(this.sortConfig.direction),
      };
    } else {
      // Nueva columna, ordenar ascendente por defecto
      this.sortConfig = { column, direction: 'asc' };
    }
    this.loadPeople();
  }

  private getNextSortDirection(currentDirection: SortDirection): SortDirection {
    switch (currentDirection) {
      case 'asc':
        return 'desc';
      case 'desc':
        return '';
      default:
        return 'asc';
    }
  }
}
