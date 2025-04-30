import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../core/services/person.service';
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

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading = true;
    this.error = null;

    this.personService.getPeople(this.searchTerm).subscribe({
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
}
