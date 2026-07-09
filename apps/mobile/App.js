import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  const deployments = [
    { id: '1', name: 'Nifty Options Scalper', mode: 'Live', pnl: 2450.50 },
    { id: '2', name: 'BankNifty Trend', mode: 'Paper', pnl: -450.00 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SIGMASPIRE Mobile</Text>
        <Text style={styles.headerSubtitle}>Deployment Monitor</Text>
      </View>

      {/* Master Kill Button */}
      <TouchableOpacity style={styles.killButton}>
        <Text style={styles.killButtonText}>MASTER KILL ALL</Text>
      </TouchableOpacity>

      {/* List */}
      <ScrollView style={styles.scroll}>
        {deployments.map(dep => (
          <View key={dep.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{dep.name}</Text>
              <View style={[styles.badge, { backgroundColor: dep.mode === 'Live' ? '#fef3c7' : '#dbefe1' }]}>
                <Text style={[styles.badgeText, { color: dep.mode === 'Live' ? '#b45309' : '#047857' }]}>{dep.mode}</Text>
              </View>
            </View>
            <Text style={[styles.pnl, { color: dep.pnl >= 0 ? '#10b981' : '#ef4444' }]}>
              ₹{dep.pnl.toFixed(2)}
            </Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Positions</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  killButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  killButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pnl: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
