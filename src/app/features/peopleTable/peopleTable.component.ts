import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../core/services/person.service';
import { Person } from '../../core/models/person.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-peopleTable',
  standalone: true,
  templateUrl: './peopleTable.component.html',
  styleUrls: ['./peopleTable.component.scss'],
  imports: [CommonModule, HttpClientModule],
})
export class PeopleTableComponent implements OnInit {
  people: Person[] = [];
  loading = false;
  error: string | null = null;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading = true;
    this.error = null;

    this.personService.getPeople().subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.people = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading people:', error);
        this.error = 'Error al cargar los datos';
        this.loading = false;
      },
    });
  }
}
