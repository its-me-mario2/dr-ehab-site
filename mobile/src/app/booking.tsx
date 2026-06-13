import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createAppointment } from '../api';
import CalendarPicker from '../components/CalendarPicker';
import { palette } from '../theme';

const SPECIALTIES = ['Arthroscopy', 'Trauma & Fractures', 'Pediatric Ortho', 'Joint Replacement', 'Sports Injuries', 'Deformity Correction'];
const LOCATIONS = ['Nasr City Clinic', 'Dar Al Fouad Hospital'];

export default function BookingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function handleSubmit() {
    if (!/^01\d{9}$/.test(phone)) { Alert.alert('Error', 'Enter a valid 11-digit Egyptian phone number'); return; }
    try {
      await createAppointment({ name, phone, specialty, location, requested_date: date ? date.toISOString().split('T')[0] : '', time_slot: time });
      Alert.alert('Success', 'Appointment requested! We will contact you soon.', [{ text: 'OK', onPress: () => router.replace('/') }]);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
        <Text style={s.title}>Book Appointment</Text>
        <Text style={s.subtitle}>Step {step} of 3</Text>

        {step === 1 && (
          <>
            <Text style={s.sectionTitle}>Select Specialty</Text>
            {SPECIALTIES.map(s => (
              <TouchableOpacity key={s} style={[s.option, specialty === s && s.optionActive]} onPress={() => setSpecialty(s)}>
                <Text style={[s.optionText, specialty === s && s.optionTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[s.btn, !specialty && s.btnDisabled]} disabled={!specialty} onPress={() => setStep(2)}>
              <Text style={s.btnText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <CalendarPicker onSelectDate={(d) => setDate(d)} onSelectTime={(t) => setTime(t)} />
            <Text style={[s.sectionTitle, { marginTop: 20 }]}>Select Location</Text>
            {LOCATIONS.map(l => (
              <TouchableOpacity key={l} style={[s.option, location === l && s.optionActive]} onPress={() => setLocation(l)}>
                <Text style={[s.optionText, location === l && s.optionTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
            <View style={s.navRow}>
              <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(1)}><Text style={s.ghostText}>Back</Text></TouchableOpacity>
              <TouchableOpacity style={[s.btn, (!date || !location) && s.btnDisabled]} disabled={!date || !location} onPress={() => setStep(3)}>
                <Text style={s.btnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={s.sectionTitle}>Your Details</Text>
            <TextInput style={s.input} placeholder="Full Name" value={name} onChangeText={setName} placeholderTextColor={palette.textSecondary} />
            <TextInput style={s.input} placeholder="Phone (01xxxxxxxxx)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={palette.textSecondary} />
            <View style={s.summary}>
              <Text style={s.summaryText}>Specialty: {specialty}</Text>
              <Text style={s.summaryText}>Location: {location}</Text>
              <Text style={s.summaryText}>Date: {date ? date.toDateString() : ''} @ {time}</Text>
            </View>
            <View style={s.navRow}>
              <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(2)}><Text style={s.ghostText}>Back</Text></TouchableOpacity>
              <TouchableOpacity style={[s.btn, (!name || !phone) && s.btnDisabled]} disabled={!name || !phone} onPress={handleSubmit}>
                <Text style={s.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: palette.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: palette.textSecondary, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text, marginBottom: 12 },
  option: { backgroundColor: palette.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: palette.border },
  optionActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  optionText: { fontSize: 14, fontWeight: '600', color: palette.text },
  optionTextActive: { color: '#fff' },
  input: { backgroundColor: palette.surface, borderRadius: 12, padding: 14, fontSize: 15, color: palette.text, marginBottom: 12, borderWidth: 1, borderColor: palette.border },
  btn: { backgroundColor: palette.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  ghostBtn: { flex: 1, borderWidth: 1, borderColor: palette.border, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  ghostText: { color: palette.textSecondary, fontWeight: '600', fontSize: 14 },
  summary: { backgroundColor: palette.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: palette.border, marginTop: 8 },
  summaryText: { fontSize: 14, color: palette.text, lineHeight: 22 },
});
