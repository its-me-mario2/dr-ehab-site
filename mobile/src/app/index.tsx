import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUser } from '../auth';
import { palette } from '../theme';

const SPECS = [
  { icon: '🩺', title: 'Arthroscopy', desc: 'Minimally invasive diagnostic & surgical procedures for knee, shoulder, hip, ankle.' },
  { icon: '🦴', title: 'Trauma & Fractures', desc: 'Complex fractures, non-unions, intramedullary & MIPO fixation techniques.' },
  { icon: '👶', title: 'Pediatric & Adult Ortho', desc: 'Comprehensive care from childhood growth disorders to adult joint conditions.' },
  { icon: '🦿', title: 'Joint Replacement', desc: 'Total & partial replacement of hip, knee, and major joints.' },
  { icon: '⚽', title: 'Sports Injuries', desc: 'Ligament tears, cartilage damage, tendon injuries & sports-related conditions.' },
  { icon: '📐', title: 'Deformity Correction', desc: 'Congenital & acquired skeletal deformity correction using advanced techniques.' },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = getUser();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View>
            <Text style={s.logoSub}>Orthopedic Surgeon</Text>
            <Text style={s.logoMain}>Dr. Ehab El Zahed</Text>
          </View>
          <TouchableOpacity style={s.authPill} onPress={() => router.push(user ? '/dashboard' : '/login')}>
            <Text style={s.authPillText}>{user ? 'My Appts' : 'Login'}</Text>
          </TouchableOpacity>
        </View>

        <View style={s.hero}>
          <Text style={s.heroIcon}>🦴</Text>
          <Text style={s.heroTitle}>Expert Orthopedic{"\n"}Care</Text>
          <Text style={s.heroSub}>Joint replacement, arthroscopy, sports injuries, trauma, deformity correction & pediatric orthopedics.</Text>
          <TouchableOpacity style={s.cta} onPress={() => router.push('/booking')}>
            <Text style={s.ctaText}>Book an Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.ghostBtn} onPress={() => router.push('/admin')}>
            <Text style={s.ghostText}>Admin Panel</Text>
          </TouchableOpacity>
        </View>

        <View style={s.statsRow}>
          {[{ n: '20+', l: 'Years Exp' }, { n: '6', l: 'Specialties' }, { n: '2', l: 'Locations' }, { n: '3+', l: 'Publications' }].map((st, i) => (
            <View key={i} style={s.stat}><Text style={s.statNum}>{st.n}</Text><Text style={s.statLabel}>{st.l}</Text></View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>About</Text>
          <View style={s.aboutCard}>
            <Text style={s.aboutText}>Specialized orthopedic surgeon based in Giza, Egypt, with expertise in adult and pediatric orthopedics, trauma, deformity correction, joint replacement, and sports injuries.</Text>
            <Text style={s.aboutText}>Lecturer at Al-Azhar University Faculty of Medicine, bridging clinical practice with academic research.</Text>
            <TouchableOpacity style={s.callBtn} onPress={() => Linking.openURL('tel:+201006557255')}>
              <Text style={s.callBtnText}>📞  0100 655 7255</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Specializations</Text>
          <View style={s.specGrid}>
            {SPECS.map((sp, i) => (
              <View key={i} style={s.specCard}>
                <Text style={{ fontSize: 24, marginBottom: 6 }}>{sp.icon}</Text>
                <Text style={s.specTitle}>{sp.title}</Text>
                <Text style={s.specDesc}>{sp.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Locations</Text>
          <View style={s.locCard}>
            <View style={s.locBadge}><Text style={s.locBadgeText}>Clinic</Text></View>
            <Text style={s.locName}>Nasr City Clinic</Text>
            <Text style={s.locAddr}>68 Abbas El-Akkad Street, Madinet Nasr</Text>
            <Text style={s.locHours}>Sat, Mon, Wed  5:00 – 8:00 PM</Text>
          </View>
          <View style={[s.locCard, { borderLeftColor: palette.accent }]}>
            <View style={[s.locBadge, { backgroundColor: '#e0f2fe' }]}><Text style={[s.locBadgeText, { color: palette.accent }]}>Hospital</Text></View>
            <Text style={s.locName}>Dar Al Fouad Hospital</Text>
            <Text style={s.locAddr}>Makram Ebeid & Abbas El-Akkad, Nasr City</Text>
            <Text style={s.locHours}>Sun, Tue, Thu  2:00 – 5:00 PM</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>2026 Dr. Ehab El Zahed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: palette.headerBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, paddingTop: 8 },
  logoSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  logoMain: { fontSize: 18, fontWeight: '800', color: palette.headerText, marginTop: 1 },
  authPill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  authPillText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  hero: { backgroundColor: palette.headerBg, padding: 28, alignItems: 'center', paddingBottom: 36 },
  heroIcon: { fontSize: 40, marginBottom: 8 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 36, marginBottom: 10 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 21, marginBottom: 22, maxWidth: 320 },
  cta: { backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 12, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  ctaText: { color: palette.primary, fontWeight: '700', fontSize: 16 },
  ghostBtn: { marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', paddingVertical: 11, paddingHorizontal: 28, borderRadius: 12, width: '100%', alignItems: 'center' },
  ghostText: { color: 'rgba(255,255,255,0.8)', fontWeight: '500', fontSize: 14 },
  statsRow: { flexDirection: 'row', backgroundColor: palette.surface, marginHorizontal: 16, marginTop: -20, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: 1, borderRightColor: palette.border },
  statNum: { fontSize: 22, fontWeight: '800', color: palette.primary },
  statLabel: { fontSize: 10, color: palette.textSecondary, fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  section: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: palette.text, marginBottom: 14 },
  aboutCard: { backgroundColor: palette.surface, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: palette.border },
  aboutText: { fontSize: 14, color: palette.textSecondary, lineHeight: 21, marginBottom: 10 },
  callBtn: { backgroundColor: palette.bg, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'flex-start' },
  callBtnText: { color: palette.primary, fontWeight: '600', fontSize: 14 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specCard: { backgroundColor: palette.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: palette.border, width: '48%' },
  specTitle: { fontSize: 13, fontWeight: '700', color: palette.text, marginBottom: 4 },
  specDesc: { fontSize: 11, color: palette.textSecondary, lineHeight: 16 },
  locCard: { backgroundColor: palette.surface, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: palette.border, borderLeftWidth: 4, borderLeftColor: palette.primary, marginBottom: 10 },
  locBadge: { alignSelf: 'flex-start', backgroundColor: '#f0fdfa', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 8 },
  locBadgeText: { fontSize: 10, fontWeight: '700', color: palette.primary, textTransform: 'uppercase' },
  locName: { fontSize: 16, fontWeight: '700', color: palette.text, marginBottom: 2 },
  locAddr: { fontSize: 13, color: palette.textSecondary, marginBottom: 6 },
  locHours: { fontSize: 13, color: palette.text, fontWeight: '500' },
  footer: { padding: 20, alignItems: 'center' },
  footerText: { fontSize: 12, color: palette.textSecondary },
});
