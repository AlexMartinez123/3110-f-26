import { Injectable, computed, signal } from '@angular/core';
import { Office } from '../models/office';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private officeData = signal<Office[]>([
    { officeId: 'OFF-01', officeName: 'Headquarters', address: '500 Commerce Blvd',
      city: 'San Francisco', state: 'CA', zipCode: '94105', phone: '555-1000',
      manager: 'Linda Torres', employeeCount: 120 },
    { officeId: 'OFF-02', officeName: 'East Coast Office', address: '200 Madison Ave',
      city: 'New York', state: 'NY', zipCode: '10016', phone: '555-2000',
      manager: 'Kevin Walsh', employeeCount: 65 },
    { officeId: 'OFF-03', officeName: 'Midwest Office', address: '150 Wacker Dr',
      city: 'Chicago', state: 'IL', zipCode: '60606', phone: '555-3000',
      manager: 'Aisha Johnson', employeeCount: 40 },
    { officeId: 'OFF-04', officeName: 'Southwest Office', address: '300 Congress Ave',
      city: 'Austin', state: 'TX', zipCode: '78701', phone: '555-4000',
      manager: 'Daniel Chen', employeeCount: 28 }
  ]);

  offices = this.officeData.asReadonly();

  totalEmployees = computed(() =>
    this.offices().reduce((total, office) => total + office.employeeCount, 0)
  );

  addOffice(newOffice: Office): void {
    this.officeData.update(list => [...list, newOffice]);
  }

  deleteOffice(indexToRemove: number): void {
    this.officeData.update(list => list.filter((_, index) => index !== indexToRemove));
  }

  insertOffice(index: number, office: Office): void {
    this.officeData.update(list => [
      ...list.slice(0, index),
      office,
      ...list.slice(index)
    ]);
  }

  isDuplicateId(officeId: string, ignoreIndex = -1): boolean {
    return this.offices().some(
      (office, index) => index !== ignoreIndex && office.officeId === officeId
    );
  }
}
