import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAdminAppointments, acceptAppointment, completeAppointment, deleteAppointment } from '../api';
import AppointmentCard from '../components/AppointmentCard';
import { palette } from '../theme';

export default function AdminScreen() {
  const router = useRouter();
  const [appts, setAppts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { fetchAppts(); }, []));

  async function fetchAppts() {
    try { const d = await getAdminAppointments(); setAppts(d); } catch (e) {}
  }

  const pending = appts.filter(a => a.status === 'pending');
  const accepted = appts.filter(a => a.status === 'accepted');
  const done = appts.filter(a => a.status === 'done' || a.status === 'completed');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>{'< Back'}</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Admin Panel</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await fetchAppts(); setRefreshing(false); }} />}>
        {appts.length === 0 && <View style={s.empty}><Text style={{ fontSize: 16, color: palette.textSecondary }}>No appointments</Text></View>}
        {pending.length > 0 && (
          <><Text style={s.secTitle}>Pending ({pending.length})</Text>
            {pending.map(a => <AppointmentCard key={a.id} appointment={a} isAdmin onAccept={async () => { try { await acceptAppointment(a.id); await fetchAppts(); } catch (e) { Alert.alert('Error', e.message); } }} onDelete={async () => { Alert.alert('Delete', 'Sure?', [{ text: 'No', style: 'cancel' }, { text: 'Yes', onPress: async () => { try { await deleteAppointment(a.id); await fetchAppts(); } catch (e) { Alert.alert('Error', e.message); } } }]); }} />)}</>
        )}
        {accepted.length > 0 && (
          <><Text style={s.secTitle}>Accepted ({accepted.length})</Text>
            {accepted.map(a => <AppointmentCard key={a.id} appointment={a} isAdmin onComplete={async () => { try { await completeAppointment(a.id); await fetchAppts(); } catch (e) { Alert.alert('Error', e.message); } }} onDelete={async () => { Alert.alert('Delete', 'Sure?', [{ text: 'No', style: 'cancel' }, { text: 'Yes', onPress: async () => { try { await deleteAppointment(a.id); await fetchAppts(); } catch (e) { Alert.alert('Error', e.message); } } }]); }} />)}</>
        )}
        {done.length > 0 && (
          <><Text style={s.secTitle}>Completed ({done.length})</Text>
            {done.map(a => <AppointmentCard key={a.id} appointment={a} isAdmin onDelete={async () => { Alert.alert('Delete', 'Sure?', [{ text: 'No', style: 'cancel' }, { text: 'Yes', onPress: async () => { try { await deleteAppointment(a.id); await fetchAppts(); } catch (e) { Alert.alert('Error', e.message); } } }]); }} />)}</>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: palette.headerBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  back: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secTitle: { fontSize: 13, fontWeight: '700', color: palette.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginVertical: 10 },
  empty: { alignItems: 'center', paddingVertical: 60 },
});
