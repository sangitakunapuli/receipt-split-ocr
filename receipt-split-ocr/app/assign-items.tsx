import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import { useReceiptContext } from '@/contexts/ReceiptContext';
import { ReceiptItem } from '@/types';

export default function AssignItemsScreen({ navigation }: any) {
  const { receipt, groupMembers, updateReceiptItems } = useReceiptContext();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    receipt?.items[0]?.id || null
  );
  const [items, setItems] = useState<ReceiptItem[]>(receipt?.items || []);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const handleToggleMember = (memberId: string) => {
    if (!selectedItem) return;

    const updatedItems = items.map((item) => {
      if (item.id === selectedItemId) {
        const isAssigned = item.assignedTo.includes(memberId);
        return {
          ...item,
          assignedTo: isAssigned
            ? item.assignedTo.filter((id) => id !== memberId)
            : [...item.assignedTo, memberId],
        };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const handleNext = () => {
    updateReceiptItems(items);
    navigation.navigate('settlement');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assign Items</Text>
        <Text style={styles.headerSubtitle}>
          Click items and select who ordered them
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.itemsList}>
          <Text style={styles.listTitle}>Items</Text>
          <ScrollView style={styles.itemsScroll}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  selectedItemId === item.id && styles.itemCardSelected,
                ]}
                onPress={() => setSelectedItemId(item.id)}
              >
                <View style={styles.itemCardContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                {item.assignedTo.length > 0 && (
                  <Text style={styles.assignedCount}>
                    {item.assignedTo.length} person{item.assignedTo.length > 1 ? 's' : ''}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedItem && (
          <View style={styles.assignmentPanel}>
            <Text style={styles.panelTitle}>{selectedItem.name}</Text>
            <Text style={styles.panelPrice}>${selectedItem.price.toFixed(2)}</Text>

            <Text style={styles.subheading}>Who ordered this?</Text>

            <View style={styles.membersList}>
              {groupMembers.map((member) => {
                const isAssigned = selectedItem.assignedTo.includes(member.id);
                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberButton,
                      isAssigned && styles.memberButtonSelected,
                    ]}
                    onPress={() => handleToggleMember(member.id)}
                  >
                    <View style={styles.checkbox}>
                      {isAssigned && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.memberName,
                        isAssigned && styles.memberNameSelected,
                      ]}
                    >
                      {member.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedItem.assignedTo.length > 0 && (
              <Text style={styles.splitInfo}>
                Split ${selectedItem.price.toFixed(2)} among{' '}
                {selectedItem.assignedTo.length} person
                {selectedItem.assignedTo.length > 1 ? 's' : ''} ≈ $
                {(selectedItem.price / selectedItem.assignedTo.length).toFixed(2)} each
              </Text>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next: View Settlement →</Text>
      </TouchableOpacity>
    </View>
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
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  itemsList: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingTop: 12,
    color: '#333',
  },
  itemsScroll: {
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemCardSelected: {
    backgroundColor: '#E7F3FF',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  itemCardContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  assignedCount: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: 'bold',
  },
  assignmentPanel: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  panelPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 8,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
  },
  membersList: {
    gap: 10,
  },
  memberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  memberButtonSelected: {
    backgroundColor: '#E7F3FF',
    borderColor: '#007AFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#34C759',
    fontWeight: 'bold',
    fontSize: 14,
  },
  memberName: {
    fontSize: 14,
    color: '#333',
  },
  memberNameSelected: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  splitInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#34C759',
    marginHorizontal: 16,
    marginVertical: 16,
    marginBottom: 32,
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
