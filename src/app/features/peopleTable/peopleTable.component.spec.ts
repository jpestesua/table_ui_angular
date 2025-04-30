import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PeopleTableComponent } from './peopleTable.component';
import { PersonService } from '../../core/services/person.service';
import { of, throwError, delay } from 'rxjs';
import { Person } from '../../core/models/person.model';

describe('PeopleTableComponent', () => {
  let component: PeopleTableComponent;
  let fixture: ComponentFixture<PeopleTableComponent>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;

  // Test data
  const mockPeople: Person[] = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Smith',
      professionalTitle: 'Software Engineer',
      company: 'Company A',
      email: 'john@company.com',
      phone: '+1 234 567 890',
      birthDate: '2023-01-01',
    },
    {
      _id: '2',
      firstName: 'Mary',
      lastName: 'Johnson',
      professionalTitle: 'Software Engineer',
      company: 'Company B',
      email: 'mary@company.com',
      phone: '+1 098 765 432',
      birthDate: '2023-02-01',
    },
  ];

  beforeEach(async () => {
    // Create spy for PersonService
    personServiceSpy = jasmine.createSpyObj('PersonService', ['getPeople']);

    await TestBed.configureTestingModule({
      imports: [PeopleTableComponent],
      providers: [{ provide: PersonService, useValue: personServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleTableComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load people list on initialization', fakeAsync(() => {
    personServiceSpy.getPeople.and.returnValue(of(mockPeople));
    fixture.detectChanges();
    expect(personServiceSpy.getPeople).toHaveBeenCalled();
    tick();
    expect(component.people).toEqual(mockPeople);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('should show error when data loading fails', fakeAsync(() => {
    personServiceSpy.getPeople.and.returnValue(
      throwError(() => new Error('Network error'))
    );
    fixture.detectChanges();
    expect(personServiceSpy.getPeople).toHaveBeenCalled();
    tick();
    expect(component.error).toBe('Error loading data');
    expect(component.loading).toBeFalse();
    expect(component.people).toEqual([]);
  }));

  it('should display table with correct data', fakeAsync(() => {
    personServiceSpy.getPeople.and.returnValue(of(mockPeople));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(mockPeople.length);

    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');

    expect(cells[0].textContent.trim()).toBe(mockPeople[0].firstName);
    expect(cells[1].textContent.trim()).toBe(mockPeople[0].lastName);
    expect(cells[2].textContent.trim()).toBe(mockPeople[0].professionalTitle);
    expect(cells[3].textContent.trim()).toContain('Jan 1, 2023'); // Fecha formateada
    expect(cells[4].textContent.trim()).toBe(mockPeople[0].company);
    expect(cells[5].textContent.trim()).toBe(mockPeople[0].email);
    expect(cells[6].textContent.trim()).toBe(mockPeople[0].phone);
  }));

  it('should show loading state', fakeAsync(() => {
    personServiceSpy.getPeople.and.returnValue(of([]).pipe(delay(1000)));
    component.loadPeople();
    expect(component.loading).toBeTrue();
    tick(1000);
    expect(component.loading).toBeFalse();
  }));
});
