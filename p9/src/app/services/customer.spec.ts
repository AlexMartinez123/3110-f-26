import { TestBed } from '@angular/core/testing';
import { CustomerService } from './customer';
import { Customer } from '../models/customer';

function sample(id: string): Customer {
  return {
    customerId: id, firstName: 'Test', lastName: 'Person',
    email: 'test@example.com', phone: '555-0000', address: '1 Test St',
    city: 'Testville', state: 'CA', zipCode: '90000', status: 'Active'
  };
}

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerService);
  });

  it('is created and seeded with the directory data', () => {
    expect(service).toBeTruthy();
    expect(service.customers().length).toBe(6);
    expect(service.customers()[0].customerId).toBe('CUST-101');
  });

  it('addCustomer appends to the end', () => {
    service.addCustomer(sample('CUST-999'));

    expect(service.customers().length).toBe(7);
    expect(service.customers()[6].customerId).toBe('CUST-999');
  });

  it('deleteCustomer removes the given index and leaves the order intact', () => {
    const before = service.customers().map(c => c.customerId);

    service.deleteCustomer(1); // Priya

    expect(service.customers().length).toBe(5);
    expect(service.customers().map(c => c.customerId))
      .toEqual(before.filter(id => id !== 'CUST-102'));
  });

  it('insertCustomer puts a record back in the slot it came from', () => {
    const removed = service.customers()[1];

    service.deleteCustomer(1);
    service.insertCustomer(1, removed);

    expect(service.customers().length).toBe(6);
    expect(service.customers()[1].customerId).toBe('CUST-102');
    expect(service.customers()[2].customerId).toBe('CUST-103');
  });

  it('never mutates the array it handed out, so Signals notice the change', () => {
    const first = service.customers();
    service.deleteCustomer(0);
    const second = service.customers();

    expect(second).not.toBe(first);   // a new array, not the same one edited
    expect(first.length).toBe(6);     // the old reference is untouched
  });

  it('isDuplicateId spots a clash but lets a record keep its own id', () => {
    expect(service.isDuplicateId('CUST-101')).toBe(true);
    expect(service.isDuplicateId('CUST-NEW')).toBe(false);
    // index 0 IS CUST-101, so ignoring it means no clash
    expect(service.isDuplicateId('CUST-101', 0)).toBe(false);
    expect(service.isDuplicateId('CUST-101', 3)).toBe(true);
  });
});
