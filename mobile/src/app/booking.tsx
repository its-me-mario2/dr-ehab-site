import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createAppointment } from '../api';
import { getUser } from '../auth';
import CalendarPicker from '../components/CalendarPicker';
import { palette } from '../theme';

const LOCATIONS = [
  { value: 'nasr-city-clinic', title: 'Nasr City Clinic', addr: '68 Abbas El-Akkad, Nasr City', days: 'Sat,Mon,Wed', hours: '5:00 – 8:00 PM' },
  { value: 'dar-al-fouad', title: 'Dar Al Fouad Hospital', addr: 'Makram Ebeid & Abbas El-Akkad, Nasr City', days: 'Sun,Tue,Thu', hours: '2:00 – 5:00 PM' },
];

const SPECIALTIES = ['Arthroscopy', 'Joint Replacement', 'Sports Injuries', 'Fractures & Trauma', 'Deformity Correction', 'Pediatric Orthopedics', 'General Orthopedics'];

export default function BookingScreen() {
  const router = useRouter();
  const user = getUser();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('nasr-city-clinic');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialty, setSpecialty] = useState(0);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const locObj = LOCATIONS.find(l => l.value === location) || LOCATIONS[0];

  async function handleSubmit() {
    if (!name || !/^01\d{9}$/.test(phone?.replace(/\s/g, ''))) { Alert.alert('Error', 'Valid name & 11-digit phone required'); return; }
    if (!date) { Alert.alert('Error', 'Please select a date'); return; }
    setLoading(true);
    try {
      const d = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      await createAppointment({ name: name.trim(), phone: phone.replace(/\s/g, ''), location: locObj.title, specialty: SPECIALTIES[specialty], date: d });
      Alert.alert('Done!', 'Appointment request received.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.surface }}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Book Appointment</Text>
        <View style={s.steps}>
          {[1, 2, 3].map(s => <View key={s} style={[s.dot, s <= step && s.active, s < step && s.done]} />)}
        </View>

        {step === 1 && (
          <View>
            <Text style={s.label}>Choose Location</Text>
            {LOCATIONS.map(l => (
              <TouchableOpacity key={l.value} style={[s.locOpt, location === l.value && s.locSel]} onPress={() => { setLocation(l.value); setDate(null); }}>
                <View style={s.radio}>{location === l.value && <View style={s.radioIn} />}</View>
                <View style={{ flex: 1 }}><Text style={s.locTitle}>{l.title}</Text><Text style={s.locAddr}>{l.addr}</Text></View>
              </TouchableOpacity>
            ))}
            <View style={s.hoursBox}><Text style={s.hoursText}>{locObj.days}  {locObj.hours}</Text></View>
            <TouchableOpacity style={s.btn} onPress={() => setStep(2)}><Text style={s.btnText}>Next</Text></TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={s.label}>Full Name</Text>
            <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#94a3b8" />
            <Text style={s.label}>Phone</Text>
            <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="01x xxxx xxxx" keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
            <Text style={s.label}>Specialty</Text>
            <View style={s.chips}>{SPECIALTIES.map((sp, i) => (
              <TouchableOpacity key={sp} style={[s.chip, specialty === i && s.chipSel]} onPress={() => setSpecialty(i)}>
                <Text style={[s.chipText, specialty === i && s.chipTextSel]}>{sp}</Text>
              </TouchableOpacity>
            ))}</View>
            <View style={s.btnRow}>
              <TouchableOpacity style={s.btnOutline} onPress={() => setStep(1)}><Text style={s.btnOutlineText}>Back</Text></TouchableOpacity>
              <TouchableOpacity style={s.btn} onPress={() => setStep(3)}><Text style={s.btnText}>Next</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={s.label}>Pick a Date</Text>
            <CalendarPicker availableDays={locObj.days.split(',')} selectedDate={date} onSelectDate={setDate} />
            <View style={s.hoursBox}><Text style={s.hoursText}>Available: {locObj.days}  {locObj.hours}</Text></View>
            <View style={s.btnRow}>
              <TouchableOpacity style={s.btnOutline} onPress={() => setStep(2)}><Text style={s.btnOutlineText}>Back</Text></TouchableOpacity>
              <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Confirm</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: palette.text, marginBottom: 16 },
  steps: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: palette.border },
  active: { backgroundColor: palette.primary },
  done: { backgroundColor: palette.primaryLight },
  label: { fontSize: 13, fontWeight: '600', color: palette.text, marginBottom: 8, marginTop: 4 },
  locOpt: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: palette.border, borderRadius: 12, marginBottom: 8, backgroundColor: palette.surface },
  locSel: { borderColor: palette.primary, backgroundColor: '#f0fdfa' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: palette.border, alignItems: 'center', justifyContent: 'center' },
  radioIn: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.primary },
  locTitle: { fontSize: 14, fontWeight: '600', color: palette.text },
  locAddr: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },
  hoursBox: { backgroundColor: '#f0fdfa', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(13,148,136,0.15)', marginBottom: 16 },
  hoursText: { fontSize: 13, color: palette.primaryDark },
  btn: { backgroundColor: palette.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', flex: 1, shadowColor: palette.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnOutline: { borderWidth: 1.5, borderColor: palette.border, paddingVertical: 15, borderRadius: 12, alignItems: 'center', flex: 1 },
  btnOutlineText: { color: palette.textSecondary, fontWeight: '600', fontSize: 15 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  input: { borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: palette.bg, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.surface },
  chipSel: { backgroundColor: palette.primary, borderColor: palette.primary },
  chipText: { fontSize: 13, color: palette.textSecondary },
  chipTextSel: { color: '#fff', fontWeight: '600' },
});
