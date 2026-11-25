import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { Office } from '../models/office';
import { CustomerService } from '../services/customer';
import { ProductService } from '../services/product';
import { OfficeService } from '../services/office';

interface ProductDraft {
  productId: string;
  name: string;
  category: string;
  price: number | null;
  stockQuantity: number | null;
  sku: string;
  status: Product['status'];
}

interface OfficeDraft {
  officeId: string;
  officeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  manager: string;
  employeeCount: number | null;
}

type TabName = 'customers' | 'products' | 'offices';

// A discriminated union: the `kind` tells TypeScript which record type `record`
// holds, so undoDelete() can put it back in the right service without casting.
type LastDelete =
  | { kind: 'customers'; index: number; label: string; record: Customer }
  | { kind: 'products'; index: number; label: string; record: Product }
  | { kind: 'offices'; index: number; label: string; record: Office };

@Component({
  selector: 'app-p4-delete',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './p4-delete.html',
  styleUrl: './p4-delete.css',
})
export class P4Delete {
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private officeService = inject(OfficeService);

  customers = this.customerService.customers;
  products = this.productService.products;
  offices = this.officeService.offices;
  totalInventoryValue = this.productService.totalInventoryValue;
  totalEmployees = this.officeService.totalEmployees;

  activeTab = signal<TabName>('customers');
  message = signal<{ text: string; isError: boolean } | null>(null);
  lastDelete = signal<LastDelete | null>(null);

  newCustomer: Customer = this.emptyCustomer();
  newProduct: ProductDraft = this.emptyProduct();
  newOffice: OfficeDraft = this.emptyOffice();

  showTab(tab: TabName): void {
    this.activeTab.set(tab);
    this.message.set(null);
  }

  // ---- DELETE ----
  // The template passes $index, the contextual variable Angular's @for block
  // provides. It replaces the manual `let currentIndex = 0; currentIndex++`
  // counter that project 4 kept inside its render loop.

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
    this.message.set(null);

    console.log(`Customer deleted at index ${index}. Total is now ${this.customers().length}`);
  }

  deleteProduct(index: number): void {
    const record = this.products()[index];
    if (!record) {
      return;
    }

    this.productService.deleteProduct(index);
    this.lastDelete.set({ kind: 'products', index, record, label: record.name });
    this.message.set(null);

    console.log(`Product deleted at index ${index}. Total is now ${this.products().length}`);
  }

  deleteOffice(index: number): void {
    const record = this.offices()[index];
    if (!record) {
      return;
    }

    this.officeService.deleteOffice(index);
    this.lastDelete.set({ kind: 'offices', index, record, label: record.officeName });
    this.message.set(null);

    console.log(`Office deleted at index ${index}. Total is now ${this.offices().length}`);
  }

  // ---- UNDO ----
  // Puts the saved record back in the slot it came from. The `kind` check is
  // what lets TypeScript know which service and which record type apply.
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

    this.message.set({ text: `Restored ${pending.label}.`, isError: false });
    this.lastDelete.set(null);

    console.log(`Undo: ${pending.label} put back at index ${pending.index}`);
  }

  // ---- CREATE (carried over from project 3) ----

  addCustomer(): void {
    const draft = this.newCustomer;

    if (!draft.customerId.trim() || !draft.firstName.trim() || !draft.lastName.trim()) {
      this.message.set({ text: 'Customer ID, first name and last name cannot be blank.', isError: true });
      return;
    }
    if (this.customerService.isDuplicateId(draft.customerId.trim())) {
      this.message.set({ text: `${draft.customerId} is already in use.`, isError: true });
      return;
    }

    this.customerService.addCustomer({
      ...draft,
      customerId: draft.customerId.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      state: draft.state.trim().toUpperCase()
    });

    this.message.set({ text: `Added ${draft.firstName} ${draft.lastName}.`, isError: false });
    this.lastDelete.set(null);
    this.newCustomer = this.emptyCustomer();
  }

  addProduct(): void {
    const draft = this.newProduct;

    if (!draft.productId.trim() || !draft.name.trim()) {
      this.message.set({ text: 'Product ID and name cannot be blank.', isError: true });
      return;
    }
    if (draft.price === null || draft.stockQuantity === null) {
      this.message.set({ text: 'Price and units in stock must both be filled in.', isError: true });
      return;
    }
    if (this.productService.isDuplicateId(draft.productId.trim())) {
      this.message.set({ text: `${draft.productId} is already in use.`, isError: true });
      return;
    }

    this.productService.addProduct({
      productId: draft.productId.trim(),
      name: draft.name.trim(),
      category: draft.category.trim(),
      price: draft.price,
      stockQuantity: draft.stockQuantity,
      sku: draft.sku.trim(),
      status: draft.status
    });

    this.message.set({ text: `Added ${draft.name}.`, isError: false });
    this.lastDelete.set(null);
    this.newProduct = this.emptyProduct();
  }

  addOffice(): void {
    const draft = this.newOffice;

    if (!draft.officeId.trim() || !draft.officeName.trim()) {
      this.message.set({ text: 'Office ID and name cannot be blank.', isError: true });
      return;
    }
    if (draft.employeeCount === null) {
      this.message.set({ text: 'Employees must be filled in.', isError: true });
      return;
    }
    if (this.officeService.isDuplicateId(draft.officeId.trim())) {
      this.message.set({ text: `${draft.officeId} is already in use.`, isError: true });
      return;
    }

    this.officeService.addOffice({
      officeId: draft.officeId.trim(),
      officeName: draft.officeName.trim(),
      address: draft.address.trim(),
      city: draft.city.trim(),
      state: draft.state.trim().toUpperCase(),
      zipCode: draft.zipCode.trim(),
      phone: draft.phone.trim(),
      manager: draft.manager.trim(),
      employeeCount: draft.employeeCount
    });

    this.message.set({ text: `Added ${draft.officeName}.`, isError: false });
    this.lastDelete.set(null);
    this.newOffice = this.emptyOffice();
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

  private emptyProduct(): ProductDraft {
    return {
      productId: '', name: '', category: '', price: null,
      stockQuantity: null, sku: '', status: 'In Stock'
    };
  }

  private emptyOffice(): OfficeDraft {
    return {
      officeId: '', officeName: '', address: '', city: '', state: '',
      zipCode: '', phone: '', manager: '', employeeCount: null
    };
  }
}
