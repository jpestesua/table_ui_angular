import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PersonService,
  SortConfig,
  SortDirection,
} from '../../core/services/person.service';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TableComponent implements OnInit {
  people: Person[] = [];
  searchTerm: string = '';
  sortConfig: SortConfig = { column: 'firstName', direction: '' };

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.personService.getPeople(this.searchTerm, this.sortConfig).subscribe(
      (data) => {
        this.people = data;
      },
      (error) => {
        console.error('Error loading people:', error);
      }
    );
  }

  onSearch(): void {
    this.loadPeople();
  }

  onSort(column: keyof Person): void {
    if (this.sortConfig.column === column) {
      // Cambiar la dirección del ordenamiento
      this.sortConfig.direction = this.getNextSortDirection(
        this.sortConfig.direction
      );
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
