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
    // Configure spy to return mock data
    personServiceSpy.getPeople.and.returnValue(of(mockPeople));

    // Initialize component
    fixture.detectChanges();

    // Verify service was called
    expect(personServiceSpy.getPeople).toHaveBeenCalled();

    // Wait for async call to resolve
    tick();

    // Verify data was loaded correctly
    expect(component.people).toEqual(mockPeople);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('should show error when data loading fails', fakeAsync(() => {
    // Configure spy to simulate error
    personServiceSpy.getPeople.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    // Initialize component
    fixture.detectChanges();

    // Verify service was called
    expect(personServiceSpy.getPeople).toHaveBeenCalled();

    // Wait for async call to resolve
    tick();

    // Verify error was handled correctly
    expect(component.error).toBe('Error loading data');
    expect(component.loading).toBeFalse();
    expect(component.people).toEqual([]);
  }));

  it('should display table with correct data', fakeAsync(() => {
    // Configure spy to return mock data
    personServiceSpy.getPeople.and.returnValue(of(mockPeople));

    // Initialize component
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Verify table renders correctly
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tbody tr');

    // Verify row count
    expect(rows.length).toBe(mockPeople.length);

    // Verify first row content
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');

    expect(cells[0].textContent).toContain(
      `${mockPeople[0].firstName} ${mockPeople[0].lastName}`
    );
    expect(cells[1].textContent).toContain(mockPeople[0].birthDate);
    expect(cells[2].textContent).toContain(mockPeople[0].professionalTitle);
    expect(cells[3].textContent).toContain(mockPeople[0].company);
    expect(cells[4].textContent).toContain(mockPeople[0].email);
    expect(cells[5].textContent).toContain(mockPeople[0].phone);
  }));

  it('should show loading state', fakeAsync(() => {
    // Configure spy to return delayed response
    personServiceSpy.getPeople.and.returnValue(of([]).pipe(delay(1000)));

    // Initialize loading
    component.loadPeople();

    // Verify loading state is active immediately
    expect(component.loading).toBeTrue();

    // Advance time
    tick(1000);

    // Verify loading state is deactivated after loading
    expect(component.loading).toBeFalse();
  }));
});
