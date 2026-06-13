import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { login, register } from '../api';
import { setAuth } from '../auth';
import { palette } from '../theme';

export default function LoginScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!phone || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await login(phone.replace(/\s/g, ''), password);
      await setAuth(res.token, res.user);
      router.back();
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  }

  async function handleRegister() {
    if (!name || !regPhone || !regPass) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (!/^01\d{9}$/.test(regPhone)) { Alert.alert('Error', 'Phone must be 11 digits starting with 01'); return; }
    if (regPass.length < 4) { Alert.alert('Error', 'Password minimum 4 characters'); return; }
    setLoading(true);
    try {
      await register(name, regPhone.replace(/\s/g, ''), regPass);
      Alert.alert('Success', 'Account created!', [{ text: 'OK', onPress: () => setTab('login') }]);
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.surface }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.container}>
          <Text style={s.title}>Welcome</Text>
          <Text style={s.sub}>Sign in or create an account</Text>
          <View style={s.tabRow}>
            {['login', 'register'].map(t => (
              <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
                <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t === 'login' ? 'Sign In' : 'Register'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {tab === 'login' ? (
            <View>
              <Text style={s.label}>Phone</Text>
              <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="01x xxxx xxxx" keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
              <Text style={s.label}>Password</Text>
              <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry placeholderTextColor="#94a3b8" />
              <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign In</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={s.label}>Full Name</Text>
              <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#94a3b8" />
              <Text style={s.label}>Phone</Text>
              <TextInput style={s.input} value={regPhone} onChangeText={setRegPhone} placeholder="01x xxxx xxxx" keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
              <Text style={s.label}>Password</Text>
              <TextInput style={s.input} value={regPass} onChangeText={setRegPass} placeholder="Min 4 characters" secureTextEntry placeholderTextColor="#94a3b8" />
              <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Create Account</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { padding: 24, flex: 1 },
  title: { fontSize: 28, fontWeight: '800', color: palette.text, marginBottom: 4 },
  sub: { fontSize: 14, color: palette.textSecondary, marginBottom: 24 },
  tabRow: { flexDirection: 'row', backgroundColor: palette.bg, borderRadius: 12, padding: 3, marginBottom: 24 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  tabActive: { backgroundColor: palette.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: palette.textSecondary },
  tabTextActive: { color: palette.primary },
  label: { fontSize: 13, fontWeight: '600', color: palette.text, marginBottom: 5, marginTop: 14 },
  input: { borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: palette.bg },
  btn: { backgroundColor: palette.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 22, shadowColor: palette.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
