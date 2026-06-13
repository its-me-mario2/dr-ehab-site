import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getUserAppointments, cancelUserAppointment } from '../api';
import { getUser, clearAuth } from '../auth';
import AppointmentCard from '../components/AppointmentCard';
import { palette } from '../theme';

export default function DashboardScreen() {
  const router = useRouter();
  const user = getUser();
  const [appts, setAppts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAppts() {
    try { const d = await getUserAppointments(); setAppts(d); } catch (e) {}
  }

  useFocusEffect(useCallback(() => { fetchAppts(); }, []));

  async function handleCancel(id) {
    Alert.alert('Cancel', 'Cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: async () => { try { await cancelUserAppointment(id); await fetchAppts(); } catch (e) { Alert.alert('Error', e.message); } } },
    ]);
  }

  const pending = appts.filter(a => a.status === 'pending');
  const accepted = appts.filter(a => a.status === 'accepted');
  const done = appts.filter(a => a.status === 'done' || a.status === 'completed');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>{'< Back'}</Text></TouchableOpacity>
        <Text style={s.headerTitle}>My Appointments</Text>
        <TouchableOpacity onPress={() => { clearAuth(); router.replace('/'); }}><Text style={s.back}>Logout</Text></TouchableOpacity>
      </View>
      <View style={s.profile}>
        <View style={s.avatar}><Text style={s.avatarText}>{(user?.name || '?')[0]}</Text></View>
        <Text style={s.profileName}>{user?.name || 'User'}</Text>
        <Text style={s.profilePhone}>{user?.phone || ''}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await fetchAppts(); setRefreshing(false); }} />}>
        {appts.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 16, color: palette.textSecondary, marginBottom: 16 }}>No appointments yet</Text>
            <TouchableOpacity style={s.ctaSmall} onPress={() => router.push('/booking')}><Text style={{ color: '#fff', fontWeight: '600' }}>Book Now</Text></TouchableOpacity>
          </View>
        ) : (
          <>
            {pending.length > 0 && <><Text style={s.secTitle}>Pending ({pending.length})</Text>{pending.map(a => <AppointmentCard key={a.id} appointment={a} canCancel onCancel={() => handleCancel(a.id)} />)}</>}
            {accepted.length > 0 && <><Text style={s.secTitle}>Accepted ({accepted.length})</Text>{accepted.map(a => <AppointmentCard key={a.id} appointment={a} canCancel onCancel={() => handleCancel(a.id)} />)}</>}
            {done.length > 0 && <><Text style={s.secTitle}>Completed ({done.length})</Text>{done.map(a => <AppointmentCard key={a.id} appointment={a} />)}</>}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: palette.headerBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  back: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  profile: { backgroundColor: palette.headerBg, alignItems: 'center', paddingBottom: 24 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  profileName: { fontSize: 17, fontWeight: '700', color: '#fff' },
  profilePhone: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  secTitle: { fontSize: 13, fontWeight: '700', color: palette.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginVertical: 10 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  ctaSmall: { backgroundColor: palette.primary, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12 },
});
