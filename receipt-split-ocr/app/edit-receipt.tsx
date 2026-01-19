import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useReceiptContext } from '@/contexts/ReceiptContext';
import { ReceiptItem } from '@/types';

export default function EditReceiptScreen() {
  const router = useRouter();
  const { receipt, updateReceiptItems, updateReceiptTotals } =
    useReceiptContext();
  const [subtotal, setSubtotal] = useState(receipt?.subtotal?.toString() || '0');
  const [tax, setTax] = useState(receipt?.tax?.toString() || '0');
  const [tip, setTip] = useState(receipt?.tip?.toString() || '0');
  const [items, setItems] = useState<ReceiptItem[]>(receipt?.items || []);

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    if (field === 'name') {
      updatedItems[index].name = value;
    } else if (field === 'price') {
      updatedItems[index].price = parseFloat(value) || 0;
    }
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: 'New Item',
        price: 0,
        assignedTo: [],
      },
    ]);
  };

  const handleNext = () => {
    const subtotalNum = parseFloat(subtotal) || 0;
    const taxNum = parseFloat(tax) || 0;
    const tipNum = parseFloat(tip) || 0;

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    updateReceiptItems(items);
    updateReceiptTotals(subtotalNum, taxNum, tipNum);
    router.push('/assign-items');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Receipt</Text>
        <Text style={styles.headerSubtitle}>Review and modify items</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <TextInput
                style={[styles.input, styles.flex2]}
                placeholder="Item name"
                value={item.name}
                onChangeText={(text) => handleUpdateItem(index, 'name', text)}
              />
              <TextInput
                style={[styles.input, styles.flex1]}
                placeholder="$0.00"
                value={item.price.toFixed(2)}
                onChangeText={(text) => handleUpdateItem(index, 'price', text)}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(index)}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Totals</Text>

        <View style={styles.totalRow}>
          <Text style={styles.label}>Subtotal</Text>
          <TextInput
            style={styles.totalInput}
            placeholder="$0.00"
            value={subtotal}
            onChangeText={setSubtotal}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.label}>Tax</Text>
          <TextInput
            style={styles.totalInput}
            placeholder="$0.00"
            value={tax}
            onChangeText={setTax}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.label}>Tip</Text>
          <TextInput
            style={styles.totalInput}
            placeholder="$0.00"
            value={tip}
            onChangeText={setTip}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.totalRow}>
          <Text style={[styles.label, styles.boldLabel]}>Total</Text>
          <Text style={styles.totalValue}>
            ${(parseFloat(subtotal) + parseFloat(tax) + parseFloat(tip)).toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next: Assign Items →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  itemsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  boldLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 100,
    textAlign: 'right',
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#34C759',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
