import { ComponentFixture, TestBed } from '@angular/core/testing';
import { P4Delete } from './p4-delete';
import { P2Dom } from '../p2-dom/p2-dom';
import { CustomerService } from '../services/customer';

describe('P4Delete', () => {
  let component: P4Delete;
  let fixture: ComponentFixture<P4Delete>;

  const cards = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.card')) as HTMLElement[];
  const names = () => cards().map(card => card.querySelector('h4')?.textContent?.trim());
  const chips = () =>
    cards().map(card => card.querySelector('.index-chip')?.textContent?.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P4Delete],
    }).compileComponents();

    fixture = TestBed.createComponent(P4Delete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('creates and renders a card per customer', () => {
    expect(component).toBeTruthy();
    expect(cards().length).toBe(6);
    expect(names()[0]).toBe('Marcus Lee');
  });

  it('stamps each card with its $index from the @for block', () => {
    expect(chips()).toEqual([
      'index 0', 'index 1', 'index 2', 'index 3', 'index 4', 'index 5'
    ]);
  });

  it('deletes the right record and renumbers the rest', async () => {
    component.deleteCustomer(1); // Priya Patel
    await fixture.whenStable();

    expect(cards().length).toBe(5);
    expect(names()).not.toContain('Priya Patel');
    expect(names()[1]).toBe('Jordan Rivera');
    // the old index 2 is the new index 1, so the next click still lands right
    expect(chips()).toEqual(['index 0', 'index 1', 'index 2', 'index 3', 'index 4']);
  });

  it('clicking a Delete button in the template removes that card', async () => {
    const buttons = fixture.nativeElement.querySelectorAll('.delete-btn') as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    await fixture.whenStable();

    expect(cards().length).toBe(5);
    expect(names()).not.toContain('Marcus Lee');
  });

  it('undo puts the record back in the same slot', async () => {
    component.deleteCustomer(2); // Jordan Rivera
    await fixture.whenStable();
    expect(names()).not.toContain('Jordan Rivera');

    component.undoDelete();
    await fixture.whenStable();

    expect(cards().length).toBe(6);
    expect(names()[2]).toBe('Jordan Rivera');
  });

  it('undo with nothing pending is a safe no-op', async () => {
    component.undoDelete();
    await fixture.whenStable();

    expect(cards().length).toBe(6);
  });

  it('refuses a duplicate id and reports it', async () => {
    component.newCustomer = {
      ...component.newCustomer,
      customerId: 'CUST-101', firstName: 'Dupe', lastName: 'Test'
    };
    component.addCustomer();
    await fixture.whenStable();

    expect(cards().length).toBe(6);
    expect(component.message()?.isError).toBe(true);
  });

  it('adds a customer when the id is free', async () => {
    component.newCustomer = {
      ...component.newCustomer,
      customerId: 'CUST-107', firstName: 'Dana', lastName: 'Whitfield', state: 'az'
    };
    component.addCustomer();
    await fixture.whenStable();

    expect(cards().length).toBe(7);
    expect(names()[6]).toBe('Dana Whitfield');
    expect(component.customers()[6].state).toBe('AZ'); // upper-cased on save
  });

  it('switching tabs swaps which list is on screen', async () => {
    component.showTab('products');
    await fixture.whenStable();

    expect(names()[0]).toBe('Wireless Mouse');
    expect(cards().length).toBe(6);
  });

  it('shares one service instance with the other components', async () => {
    // Both components inject CustomerService, and Angular gives them the same
    // root-provided instance, so a delete here shows up over there too.
    const service = TestBed.inject(CustomerService);
    const other = TestBed.createComponent(P2Dom);
    await other.whenStable();

    const otherCardCount = () => other.nativeElement.querySelectorAll('.card').length;
    const startingTotal = otherCardCount();

    component.deleteCustomer(0);
    await fixture.whenStable();
    await other.whenStable();

    expect(service.customers().length).toBe(5);
    expect(otherCardCount()).toBe(startingTotal - 1);
  });
});
