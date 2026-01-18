export interface GroupMember {
  id: string;
  name: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // array of member IDs who split this item
}

export interface Receipt {
  id: string;
  imageUri: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: Date;
}

export interface Settlement {
  from: string; // member ID
  to: string; // member ID
  amount: number;
}

export interface ReceiptContext {
  receipt: Receipt | null;
  groupMembers: GroupMember[];
  addGroupMember: (name: string) => void;
  removeGroupMember: (id: string) => void;
  setReceipt: (receipt: Receipt) => void;
  updateReceiptItems: (items: ReceiptItem[]) => void;
  updateReceiptTotals: (subtotal: number, tax: number, tip: number) => void;
  calculateSettlements: () => Settlement[];
}
