import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { login, register } from '../api';
import { setAuth } from '../auth';
import { palette } from '../theme';

export default function LoginScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (!/^01\d{9}$/.test(phone)) { Alert.alert('Error', 'Enter a valid 11-digit Egyptian phone number'); return; }
    if (password.length < 4) { Alert.alert('Error', 'Password must be at least 4 characters'); return; }
    if (tab === 'register' && !name.trim()) { Alert.alert('Error', 'Name is required'); return; }
    try {
      const fn = tab === 'login' ? login : register;
      const body = tab === 'login' ? { phone, password } : { name: name.trim(), phone, password };
      const data = await fn(body.phone, body.password);
      await setAuth(data.token, data.user || { name: name.trim(), phone, id: data.userId });
      router.replace('/');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={s.title}>{tab === 'login' ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={s.subtitle}>{tab === 'login' ? 'Sign in to manage your appointments' : 'Register to book appointments'}</Text>

          <View style={s.tabRow}>
            <TouchableOpacity style={[s.tab, tab === 'login' && s.tabActive]} onPress={() => { setTab('login'); setName(''); setPhone(''); setPassword(''); }}>
              <Text style={[s.tabText, tab === 'login' && s.tabTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.tab, tab === 'register' && s.tabActive]} onPress={() => { setTab('register'); setName(''); setPhone(''); setPassword(''); }}>
              <Text style={[s.tabText, tab === 'register' && s.tabTextActive]}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            {tab === 'register' && (
              <TextInput style={s.input} placeholder="Full Name" value={name} onChangeText={setName} placeholderTextColor={palette.textSecondary} />
            )}
            <TextInput style={s.input} placeholder="Phone (01xxxxxxxxx)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={palette.textSecondary} />
            <TextInput style={s.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={palette.textSecondary} />
            <TouchableOpacity style={s.btn} onPress={handleSubmit}>
              <Text style={s.btnText}>{tab === 'login' ? 'Sign In' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: palette.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: palette.textSecondary, textAlign: 'center', marginBottom: 24, marginTop: 6 },
  tabRow: { flexDirection: 'row', backgroundColor: palette.border, borderRadius: 12, padding: 3, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: palette.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  tabText: { fontSize: 14, fontWeight: '600', color: palette.textSecondary },
  tabTextActive: { color: palette.primary },
  card: { backgroundColor: palette.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: palette.border },
  input: { backgroundColor: palette.bg, borderRadius: 12, padding: 14, fontSize: 15, color: palette.text, marginBottom: 12, borderWidth: 1, borderColor: palette.border },
  btn: { backgroundColor: palette.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
