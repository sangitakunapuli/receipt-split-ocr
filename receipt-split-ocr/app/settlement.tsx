import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useReceiptContext } from '@/contexts/ReceiptContext';

export default function SettlementScreen() {
  const router = useRouter();
  const { receipt, groupMembers, calculateSettlements } = useReceiptContext();
  const settlements = calculateSettlements();

  const getMemberName = (memberId: string) => {
    return groupMembers.find((m) => m.id === memberId)?.name || 'Unknown';
  };

  const handleReset = () => {
    router.push('/(tabs)');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settlement Summary</Text>
        <Text style={styles.headerSubtitle}>Who owes who and how much</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receipt Total</Text>
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>${receipt?.subtotal?.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Tax</Text>
            <Text style={styles.value}>${receipt?.tax?.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Tip</Text>
            <Text style={styles.value}>${receipt?.tip?.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.borderTop]}>
            <Text style={styles.boldLabel}>Total</Text>
            <Text style={styles.boldValue}>${receipt?.total?.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Breakdown</Text>
        <View style={styles.itemsList}>
          {receipt?.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMembers}>
                  {item.assignedTo.length > 0
                    ? item.assignedTo
                        .map((id) => getMemberName(id))
                        .join(', ')
                    : 'Unassigned'}
                </Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settlements</Text>
        {settlements.length === 0 ? (
          <View style={styles.noSettlements}>
            <Text style={styles.noSettlementsText}>
              Everyone is settled! 🎉
            </Text>
          </View>
        ) : (
          <View style={styles.settlementsList}>
            {settlements.map((settlement, index) => (
              <View key={index} style={styles.settlementCard}>
                <View style={styles.settlementContent}>
                  <View style={styles.settlementText}>
                    <Text style={styles.fromName}>
                      {getMemberName(settlement.from)}
                    </Text>
                    <Text style={styles.owesText}>owes</Text>
                    <Text style={styles.toName}>
                      {getMemberName(settlement.to)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.settlementAmount}>
                  ${settlement.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleReset}
        >
          <Text style={styles.primaryButtonText}>Start New Receipt</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#34C759',
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
  totalBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  borderTop: {
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  boldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  boldValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemMembers: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  settlementsList: {
    gap: 12,
  },
  settlementCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  settlementContent: {
    flex: 1,
  },
  settlementText: {
    alignItems: 'center',
  },
  fromName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  owesText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
  },
  toName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  settlementAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  noSettlements: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noSettlementsText: {
    fontSize: 16,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
