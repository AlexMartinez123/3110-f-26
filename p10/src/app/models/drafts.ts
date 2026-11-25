import { Product } from './product';

// A form holds a DRAFT, not a finished record. A number input the user clears
// hands back null, which a `number` field is not allowed to be, so the draft
// types say so honestly and the save methods convert once validated.

export interface ProductDraft {
  productId: string;
  name: string;
  category: string;
  price: number | null;
  stockQuantity: number | null;
  sku: string;
  status: Product['status'];
}

export interface OfficeDraft {
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

// Which dataset a tab or a modal is working on
export type TabName = 'customers' | 'products' | 'offices';

export function emptyProductDraft(): ProductDraft {
  return {
    productId: '', name: '', category: '', price: null,
    stockQuantity: null, sku: '', status: 'In Stock'
  };
}

export function emptyOfficeDraft(): OfficeDraft {
  return {
    officeId: '', officeName: '', address: '', city: '', state: '',
    zipCode: '', phone: '', manager: '', employeeCount: null
  };
}
