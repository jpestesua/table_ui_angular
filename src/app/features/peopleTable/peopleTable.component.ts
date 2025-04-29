import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../core/services/person.service';
import { Person } from '../../core/models/person.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-peopleTable',
  standalone: true,
  templateUrl: './peopleTable.component.html',
  styleUrls: ['./peopleTable.component.scss'],
  imports: [CommonModule],
})
export class PeopleTableComponent implements OnInit {
  people: Person[] = [];

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.personService.getPeople().subscribe((data) => {
      console.log(data);
      this.people = data;
    });
  }
}
