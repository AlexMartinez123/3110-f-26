import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // The dataset that used to live in a rawCustomersJson template string and
  // get JSON.parse'd on load. It is now a strictly typed Signal, so any
  // component reading it re-renders by itself when it changes.
  private customerData = signal<Customer[]>([
    {
      customerId: 'CUST-101', firstName: 'Marcus', lastName: 'Lee',
      email: 'marcus.lee@example.com', phone: '555-0201',
      address: '88 Harbor Way', city: 'Portland', state: 'OR', zipCode: '97201',
      status: 'Active'
    },
    {
      customerId: 'CUST-102', firstName: 'Priya', lastName: 'Patel',
      email: 'priya.patel@example.com', phone: '555-0202',
      address: '1420 Cedar Ln', city: 'Austin', state: 'TX', zipCode: '78701',
      status: 'Active'
    },
    {
      customerId: 'CUST-103', firstName: 'Jordan', lastName: 'Rivera',
      email: 'jrivera@example.com', phone: '555-0203',
      address: '305 Aspen Ct', city: 'Denver', state: 'CO', zipCode: '80202',
      status: 'Inactive'
    },
    {
      customerId: 'CUST-104', firstName: 'Hannah', lastName: 'Kim',
      email: 'hannah.kim@example.com', phone: '555-0204',
      address: '42 Beacon St', city: 'Boston', state: 'MA', zipCode: '02108',
      status: 'Pending'
    },
    {
      customerId: 'CUST-105', firstName: 'Samuel', lastName: 'Okafor',
      email: 'sam.okafor@example.com', phone: '555-0205',
      address: '910 Lakeview Dr', city: 'Chicago', state: 'IL', zipCode: '60601',
      status: 'Active'
    },
    {
      customerId: 'CUST-106', firstName: 'Olivia', lastName: 'Nguyen',
      email: 'olivia.n@example.com', phone: '555-0206',
      address: '77 Rainier Ave', city: 'Seattle', state: 'WA', zipCode: '98101',
      status: 'Active'
    }
  ]);

  // Handed out read-only so a component can display the list but cannot reach
  // in and mutate the array behind the service's back.
  customers = this.customerData.asReadonly();

  // CREATE (project 3). Replaces customers.push(newCustomer) + renderCustomers()
  addCustomer(newCustomer: Customer): void {
    this.customerData.update(list => [...list, newCustomer]);
  }

  // DELETE (project 4). Replaces customers.splice(indexToRemove, 1) + renderCustomers()
  deleteCustomer(indexToRemove: number): void {
    this.customerData.update(list => list.filter((_, index) => index !== indexToRemove));
  }

  // UNDO (project 4). Replaces splice(index, 0, item): puts a record back in
  // the exact slot it was removed from.
  insertCustomer(index: number, customer: Customer): void {
    this.customerData.update(list => [
      ...list.slice(0, index),
      customer,
      ...list.slice(index)
    ]);
  }

  // True when some OTHER record already owns this id
  isDuplicateId(customerId: string, ignoreIndex = -1): boolean {
    return this.customers().some(
      (customer, index) => index !== ignoreIndex && customer.customerId === customerId
    );
  }
}
