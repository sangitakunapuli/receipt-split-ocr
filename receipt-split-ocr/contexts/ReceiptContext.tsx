import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Receipt, ReceiptItem, GroupMember, Settlement, ReceiptContext as ReceiptContextType } from '@/types';

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
  const [receipt, setReceiptState] = useState<Receipt | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  const addGroupMember = (name: string) => {
    const newMember: GroupMember = {
      id: Date.now().toString(),
      name,
    };
    setGroupMembers([...groupMembers, newMember]);
  };

  const removeGroupMember = (id: string) => {
    setGroupMembers(groupMembers.filter((member) => member.id !== id));
  };

  const setReceipt = (newReceipt: Receipt) => {
    setReceiptState(newReceipt);
  };

  const updateReceiptItems = (items: ReceiptItem[]) => {
    if (receipt) {
      setReceiptState({ ...receipt, items });
    }
  };

  const updateReceiptTotals = (subtotal: number, tax: number, tip: number) => {
    if (receipt) {
      setReceiptState({
        ...receipt,
        subtotal,
        tax,
        tip,
        total: subtotal + tax + tip,
      });
    }
  };

  const calculateSettlements = (): Settlement[] => {
    if (!receipt || groupMembers.length === 0) return [];

    // Calculate how much each person owes
    const owedByPerson: Record<string, number> = {};
    groupMembers.forEach((member) => {
      owedByPerson[member.id] = 0;
    });

    // For each item, divide the cost among the people assigned to it
    receipt.items.forEach((item) => {
      if (item.assignedTo.length === 0) return;

      const costPerPerson = item.price / item.assignedTo.length;
      item.assignedTo.forEach((memberId) => {
        owedByPerson[memberId] += costPerPerson;
      });
    });

    // Distribute tax proportionally
    const totalItemPrice = receipt.items.reduce((sum, item) => sum + item.price, 0);
    if (totalItemPrice > 0) {
      const taxPercentage = receipt.tax / totalItemPrice;
      receipt.items.forEach((item) => {
        if (item.assignedTo.length === 0) return;
        const itemTax = item.price * taxPercentage;
        const taxPerPerson = itemTax / item.assignedTo.length;
        item.assignedTo.forEach((memberId) => {
          owedByPerson[memberId] += taxPerPerson;
        });
      });

      // Distribute tip proportionally
      const tipPercentage = receipt.tip / totalItemPrice;
      receipt.items.forEach((item) => {
        if (item.assignedTo.length === 0) return;
        const itemTip = item.price * tipPercentage;
        const tipPerPerson = itemTip / item.assignedTo.length;
        item.assignedTo.forEach((memberId) => {
          owedByPerson[memberId] += tipPerPerson;
        });
      });
    }

    // Find the person who paid (assuming it's the first group member for now)
    // In a real app, you might track who paid separately
    const payer = groupMembers[0];
    if (!payer) return [];

    const settlements: Settlement[] = [];
    groupMembers.forEach((member) => {
      if (member.id !== payer.id && owedByPerson[member.id] > 0) {
        settlements.push({
          from: member.id,
          to: payer.id,
          amount: owedByPerson[member.id],
        });
      }
    });

    return settlements;
  };

  const value: ReceiptContextType = {
    receipt,
    groupMembers,
    addGroupMember,
    removeGroupMember,
    setReceipt,
    updateReceiptItems,
    updateReceiptTotals,
    calculateSettlements,
  };

  return <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>;
};

export const useReceiptContext = (): ReceiptContextType => {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceiptContext must be used within a ReceiptProvider');
  }
  return context;
};
