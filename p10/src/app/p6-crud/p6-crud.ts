import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { Office } from '../models/office';
import {
  OfficeDraft, ProductDraft, TabName, emptyOfficeDraft, emptyProductDraft
} from '../models/drafts';
import { CustomerService } from '../services/customer';
import { ProductService } from '../services/product';
import { OfficeService } from '../services/office';

// A matching record kept together with WHERE it lives in the real array. The
// search shows a filtered subset, but Edit and Delete must act on the array,
// so the original index has to travel with each row.
interface Entry<T> {
  record: T;
  index: number;
}

type LastDelete =
  | { kind: 'customers'; index: number; label: string; record: Customer }
  | { kind: 'products'; index: number; label: string; record: Product }
  | { kind: 'offices'; index: number; label: string; record: Office };

@Component({
  selector: 'app-p6-crud',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './p6-crud.html',
  styleUrl: './p6-crud.css',
  host: { '(document:keydown.escape)': 'closeModal()' },
})
export class P6Crud {
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private officeService = inject(OfficeService);

  customers = this.customerService.customers;
  products = this.productService.products;
  offices = this.officeService.offices;
  totalInventoryValue = this.productService.totalInventoryValue;
  totalEmployees = this.officeService.totalEmployees;

  activeTab = signal<TabName>('customers');

  // ---- READ: search ----
  customerSearch = signal('');
  productSearch = signal('');
  officeSearch = signal('');

  // computed() re-runs only when the list or the search box actually changes.
  // Pairing each match with its index is what keeps Edit and Delete honest
  // while a filter is active.
  filteredCustomers = computed<Entry<Customer>[]>(() =>
    this.customers()
      .map((record, index) => ({ record, index }))
      .filter(entry => this.matches(entry.record, this.customerSearch()))
  );

  filteredProducts = computed<Entry<Product>[]>(() =>
    this.products()
      .map((record, index) => ({ record, index }))
      .filter(entry => this.matches(entry.record, this.productSearch()))
  );

  filteredOffices = computed<Entry<Office>[]>(() =>
    this.offices()
      .map((record, index) => ({ record, index }))
      .filter(entry => this.matches(entry.record, this.officeSearch()))
  );

  private matches(record: object, query: string): boolean {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === '') {
      return true;
    }
    return Object.values(record).join(' ').toLowerCase().includes(trimmed);
  }

  // ---- modal state ----
  // modalType null  -> the popup is shut
  // modalIndex null -> the popup is open in CREATE mode
  // That second null is the whole trick behind one popup doing two jobs.
  modalType = signal<TabName | null>(null);
  modalIndex = signal<number | null>(null);
  isOpen = computed(() => this.modalType() !== null);
  isCreating = computed(() => this.modalIndex() === null);

  modalMessage = signal<string | null>(null);
  pageMessage = signal<{ text: string; isError: boolean } | null>(null);
  lastDelete = signal<LastDelete | null>(null);

  customerDraft: Customer = this.emptyCustomer();
  productDraft: ProductDraft = emptyProductDraft();
  officeDraft: OfficeDraft = emptyOfficeDraft();

  showTab(tab: TabName): void {
    this.activeTab.set(tab);
    this.pageMessage.set(null);
  }

  modalTitle = computed(() => {
    const type = this.modalType();
    if (type === null) {
      return '';
    }
    const noun = type === 'customers' ? 'customer' : type === 'products' ? 'product' : 'office';
    return this.isCreating() ? `Add a ${noun}` : `Edit ${noun}`;
  });

  // Where a new record will land, for the popup's subtitle
  nextIndex = computed(() => {
    const type = this.modalType();
    if (type === 'customers') {
      return this.customers().length;
    }
    if (type === 'products') {
      return this.products().length;
    }
    if (type === 'offices') {
      return this.offices().length;
    }
    return 0;
  });

  // ---- CREATE / UPDATE: one popup ----

  openCreate(type: TabName): void {
    this.modalMessage.set(null);
    this.pageMessage.set(null);

    if (type === 'customers') {
      this.customerDraft = this.emptyCustomer();
    } else if (type === 'products') {
      this.productDraft = emptyProductDraft();
    } else {
      this.officeDraft = emptyOfficeDraft();
    }

    this.modalType.set(type);
    this.modalIndex.set(null); // null = creating
  }

  openEdit(type: TabName, index: number): void {
    this.modalMessage.set(null);
    this.pageMessage.set(null);

    if (type === 'customers') {
      const record = this.customers()[index];
      if (!record) {
        return;
      }
      this.customerDraft = { ...record };
    } else if (type === 'products') {
      const record = this.products()[index];
      if (!record) {
        return;
      }
      this.productDraft = { ...record };
    } else {
      const record = this.offices()[index];
      if (!record) {
        return;
      }
      this.officeDraft = { ...record };
    }

    this.modalType.set(type);
    this.modalIndex.set(index);
  }

  saveRecord(): void {
    const type = this.modalType();
    if (type === null) {
      return; // nothing open. Note the guard is on the TYPE, because a null
              // INDEX is a valid state here: it means "create".
    }

    if (type === 'customers') {
      this.saveCustomer();
    } else if (type === 'products') {
      this.saveProduct();
    } else {
      this.saveOffice();
    }
  }

  private saveCustomer(): void {
    const index = this.modalIndex();
    const draft = this.customerDraft;

    if (!draft.customerId.trim() || !draft.firstName.trim() || !draft.lastName.trim()) {
      this.modalMessage.set('Customer ID, first name and last name cannot be blank.');
      return;
    }

    // Passing the index lets the record keep its own id while still blocking a
    // clash with anyone else. When creating, index is null, so nothing is skipped.
    if (this.customerService.isDuplicateId(draft.customerId.trim(), index ?? -1)) {
      this.modalMessage.set(`${draft.customerId} is already in use by another customer.`);
      return;
    }

    const customer: Customer = {
      ...draft,
      customerId: draft.customerId.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      state: draft.state.trim().toUpperCase()
    };

    if (index === null) {
      this.customerService.addCustomer(customer);
    } else {
      this.customerService.updateCustomer(index, customer);
    }

    this.finish(index === null, `${customer.firstName} ${customer.lastName}`, 'customers');
  }

  private saveProduct(): void {
    const index = this.modalIndex();
    const draft = this.productDraft;

    if (!draft.productId.trim() || !draft.name.trim()) {
      this.modalMessage.set('Product ID and name cannot be blank.');
      return;
    }
    if (draft.price === null || draft.stockQuantity === null) {
      this.modalMessage.set('Price and units in stock must both be numbers.');
      return;
    }
    if (this.productService.isDuplicateId(draft.productId.trim(), index ?? -1)) {
      this.modalMessage.set(`${draft.productId} is already in use by another product.`);
      return;
    }

    const product: Product = {
      productId: draft.productId.trim(),
      name: draft.name.trim(),
      category: draft.category.trim(),
      price: draft.price,
      stockQuantity: draft.stockQuantity,
      sku: draft.sku.trim(),
      status: draft.status
    };

    if (index === null) {
      this.productService.addProduct(product);
    } else {
      this.productService.updateProduct(index, product);
    }

    this.finish(index === null, product.name, 'products');
  }

  private saveOffice(): void {
    const index = this.modalIndex();
    const draft = this.officeDraft;

    if (!draft.officeId.trim() || !draft.officeName.trim()) {
      this.modalMessage.set('Office ID and name cannot be blank.');
      return;
    }
    if (draft.employeeCount === null) {
      this.modalMessage.set('Employees must be a number.');
      return;
    }
    if (this.officeService.isDuplicateId(draft.officeId.trim(), index ?? -1)) {
      this.modalMessage.set(`${draft.officeId} is already in use by another office.`);
      return;
    }

    const office: Office = {
      officeId: draft.officeId.trim(),
      officeName: draft.officeName.trim(),
      address: draft.address.trim(),
      city: draft.city.trim(),
      state: draft.state.trim().toUpperCase(),
      zipCode: draft.zipCode.trim(),
      phone: draft.phone.trim(),
      manager: draft.manager.trim(),
      employeeCount: draft.employeeCount
    };

    if (index === null) {
      this.officeService.addOffice(office);
    } else {
      this.officeService.updateOffice(index, office);
    }

    this.finish(index === null, office.officeName, 'offices');
  }

  private finish(wasCreate: boolean, label: string, type: TabName): void {
    this.closeModal();

    // Clear the search. Without this, saving a record that doesn't match the
    // active filter would look like nothing happened, because the row would be
    // filtered straight back out of view.
    this.setSearch(type, '');

    this.lastDelete.set(null);
    this.pageMessage.set({ text: `${wasCreate ? 'Added' : 'Updated'} ${label}.`, isError: false });
    console.log(`${wasCreate ? 'Created' : 'Updated'}: ${label}`);
  }

  closeModal(): void {
    this.modalType.set(null);
    this.modalIndex.set(null);
    this.modalMessage.set(null);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  // ---- DELETE and UNDO ----

  deleteCustomer(index: number): void {
    const record = this.customers()[index];
    if (!record) {
      return;
    }
    this.customerService.deleteCustomer(index);
    this.lastDelete.set({
      kind: 'customers', index, record,
      label: `${record.firstName} ${record.lastName}`
    });
    this.pageMessage.set(null);
  }

  deleteProduct(index: number): void {
    const record = this.products()[index];
    if (!record) {
      return;
    }
    this.productService.deleteProduct(index);
    this.lastDelete.set({ kind: 'products', index, record, label: record.name });
    this.pageMessage.set(null);
  }

  deleteOffice(index: number): void {
    const record = this.offices()[index];
    if (!record) {
      return;
    }
    this.officeService.deleteOffice(index);
    this.lastDelete.set({ kind: 'offices', index, record, label: record.officeName });
    this.pageMessage.set(null);
  }

  undoDelete(): void {
    const pending = this.lastDelete();
    if (!pending) {
      return;
    }

    if (pending.kind === 'customers') {
      this.customerService.insertCustomer(pending.index, pending.record);
    } else if (pending.kind === 'products') {
      this.productService.insertProduct(pending.index, pending.record);
    } else {
      this.officeService.insertOffice(pending.index, pending.record);
    }

    this.lastDelete.set(null);
    this.pageMessage.set({ text: `Restored ${pending.label}.`, isError: false });
  }

  // ---- READ, the project 1 way ----
  // Printing the live Signals proves every create, update and delete really
  // landed in the data, not just on the screen.
  printConsoleReport(): void {
    console.log('=== CUSTOMER DATA REPORT (P6 CRUD) ===');
    this.customers().forEach((customer, index) => {
      console.log(`[${index}] ${customer.customerId} ${customer.firstName} ${customer.lastName} | ${customer.email} | ${customer.status}`);
    });
    console.log(`Total customers: ${this.customers().length}\n`);

    console.log('=== PRODUCT DATA REPORT (P6 CRUD) ===');
    this.products().forEach((product, index) => {
      console.log(`[${index}] ${product.productId} ${product.name} | $${product.price.toFixed(2)} x ${product.stockQuantity} | ${product.status}`);
    });
    console.log(`Total products: ${this.products().length}`);
    console.log(`Total inventory value: $${this.totalInventoryValue().toFixed(2)}\n`);

    console.log('=== OFFICE DATA REPORT (P6 CRUD) ===');
    this.offices().forEach((office, index) => {
      console.log(`[${index}] ${office.officeId} ${office.officeName} | ${office.manager} | ${office.employeeCount} staff`);
    });
    console.log(`Total offices: ${this.offices().length}`);
    console.log(`Total employees: ${this.totalEmployees()}`);
  }

  // ---- helpers ----

  setSearch(type: TabName, value: string): void {
    if (type === 'customers') {
      this.customerSearch.set(value);
    } else if (type === 'products') {
      this.productSearch.set(value);
    } else {
      this.officeSearch.set(value);
    }
  }

  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().split(' ').join('-');
  }

  private emptyCustomer(): Customer {
    return {
      customerId: '', firstName: '', lastName: '', email: '', phone: '',
      address: '', city: '', state: '', zipCode: '', status: 'Active'
    };
  }
}
