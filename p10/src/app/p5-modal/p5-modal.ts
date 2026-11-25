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

@Component({
  selector: 'app-p5-modal',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './p5-modal.html',
  styleUrl: './p5-modal.css',
  // Escape closes the popup, the same as pressing Cancel
  host: { '(document:keydown.escape)': 'closeModal()' },
})
export class P5Modal {
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private officeService = inject(OfficeService);

  customers = this.customerService.customers;
  products = this.productService.products;
  offices = this.officeService.offices;
  totalInventoryValue = this.productService.totalInventoryValue;
  totalEmployees = this.officeService.totalEmployees;

  activeTab = signal<TabName>('customers');

  // The whole modal is driven by these two Signals. editType is null when the
  // popup is shut, which is the only state the template needs to check.
  editType = signal<TabName | null>(null);
  editIndex = signal<number | null>(null);
  isOpen = computed(() => this.editType() !== null);

  modalMessage = signal<string | null>(null);
  pageMessage = signal<string | null>(null);

  // The popup edits a COPY. Nothing reaches the service until Save, which is
  // what makes Cancel free: throw the copy away and the record is untouched.
  customerDraft: Customer = this.emptyCustomer();
  productDraft: ProductDraft = emptyProductDraft();
  officeDraft: OfficeDraft = emptyOfficeDraft();

  showTab(tab: TabName): void {
    this.activeTab.set(tab);
    this.pageMessage.set(null);
  }

  // ---- OPEN ----
  // Copy the selected record's current values into the draft, then reveal the popup.

  openEdit(type: TabName, index: number): void {
    this.modalMessage.set(null);
    this.pageMessage.set(null);

    if (type === 'customers') {
      const record = this.customers()[index];
      if (!record) {
        return;
      }
      this.customerDraft = { ...record };          // a copy, not the record itself
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

    this.editType.set(type);
    this.editIndex.set(index);
  }

  // A readable label for the popup's subtitle
  editLabel = computed(() => {
    const type = this.editType();
    const index = this.editIndex();
    if (type === null || index === null) {
      return '';
    }
    if (type === 'customers') {
      const record = this.customers()[index];
      return record ? `${record.firstName} ${record.lastName}` : '';
    }
    if (type === 'products') {
      return this.products()[index]?.name ?? '';
    }
    return this.offices()[index]?.officeName ?? '';
  });

  // ---- SAVE ----
  // Writes the draft back into the SAME array slot the popup was opened on.

  saveEdit(): void {
    const type = this.editType();
    const index = this.editIndex();
    if (type === null || index === null) {
      return;
    }

    if (type === 'customers') {
      this.saveCustomer(index);
    } else if (type === 'products') {
      this.saveProduct(index);
    } else {
      this.saveOffice(index);
    }
  }

  private saveCustomer(index: number): void {
    const draft = this.customerDraft;

    if (!draft.customerId.trim() || !draft.firstName.trim() || !draft.lastName.trim()) {
      this.modalMessage.set('Customer ID, first name and last name cannot be blank.');
      return; // leave the popup open so the mistake can be fixed
    }

    // The record being edited may keep its own id; anyone else holding it is a clash
    if (this.customerService.isDuplicateId(draft.customerId.trim(), index)) {
      this.modalMessage.set(`${draft.customerId} already belongs to another customer.`);
      return;
    }

    this.customerService.updateCustomer(index, {
      ...draft,
      customerId: draft.customerId.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      state: draft.state.trim().toUpperCase()
    });

    this.finish(`Updated ${draft.firstName} ${draft.lastName}.`, index);
  }

  private saveProduct(index: number): void {
    const draft = this.productDraft;

    if (!draft.productId.trim() || !draft.name.trim()) {
      this.modalMessage.set('Product ID and name cannot be blank.');
      return;
    }
    if (draft.price === null || draft.stockQuantity === null) {
      this.modalMessage.set('Price and units in stock must both be numbers.');
      return;
    }
    if (this.productService.isDuplicateId(draft.productId.trim(), index)) {
      this.modalMessage.set(`${draft.productId} already belongs to another product.`);
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

    this.productService.updateProduct(index, product);
    this.finish(`Updated ${product.name}.`, index);
  }

  private saveOffice(index: number): void {
    const draft = this.officeDraft;

    if (!draft.officeId.trim() || !draft.officeName.trim()) {
      this.modalMessage.set('Office ID and name cannot be blank.');
      return;
    }
    if (draft.employeeCount === null) {
      this.modalMessage.set('Employees must be a number.');
      return;
    }
    if (this.officeService.isDuplicateId(draft.officeId.trim(), index)) {
      this.modalMessage.set(`${draft.officeId} already belongs to another office.`);
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

    this.officeService.updateOffice(index, office);
    this.finish(`Updated ${office.officeName}.`, index);
  }

  private finish(message: string, index: number): void {
    this.closeModal();
    this.pageMessage.set(message);
    console.log(`Record updated at index ${index}`);
  }

  // ---- CANCEL ----
  // Never touches a service, so the record keeps whatever it had before.
  closeModal(): void {
    this.editType.set(null);
    this.editIndex.set(null);
    this.modalMessage.set(null);
  }

  // Only the dark backdrop itself closes the popup. Without this check a click
  // on the white panel would bubble up and shut it.
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
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
