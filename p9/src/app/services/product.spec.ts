import { TestBed } from '@angular/core/testing';
import { ProductService } from './product';
import { OfficeService } from './office';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('is seeded with the product data', () => {
    expect(service.products().length).toBe(6);
  });

  it('totalInventoryValue is a computed Signal over price x stock', () => {
    // 24.99*150 + 89.99*42 + 329*0 + 249.50*18 + 499*5 + 39.95*230
    expect(service.totalInventoryValue()).toBeCloseTo(23702.58, 2);
  });

  it('the computed total follows a delete without being told to', () => {
    service.deleteProduct(0); // drop the 24.99 x 150 line

    expect(service.products().length).toBe(5);
    expect(service.totalInventoryValue()).toBeCloseTo(23702.58 - 24.99 * 150, 2);
  });

  it('the computed total follows an add too', () => {
    const before = service.totalInventoryValue();

    service.addProduct({
      productId: 'PROD-900', name: 'Test Widget', category: 'Test',
      price: 10, stockQuantity: 3, sku: 'TS-900', status: 'In Stock'
    });

    expect(service.totalInventoryValue()).toBeCloseTo(before + 30, 2);
  });
});

describe('OfficeService', () => {
  let service: OfficeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficeService);
  });

  it('totals the headcount', () => {
    expect(service.offices().length).toBe(4);
    expect(service.totalEmployees()).toBe(253); // 120 + 65 + 40 + 28
  });

  it('recomputes the headcount after a delete and an undo', () => {
    const removed = service.offices()[0]; // Headquarters, 120 people

    service.deleteOffice(0);
    expect(service.totalEmployees()).toBe(133);

    service.insertOffice(0, removed);
    expect(service.totalEmployees()).toBe(253);
    expect(service.offices()[0].officeId).toBe('OFF-01');
  });
});
