import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { palette } from '../theme';

const STATUS = {
  pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
  accepted: { bg: '#d1fae5', text: '#065f46', label: 'Accepted' },
  cancelled: { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' },
  done: { bg: '#dbeafe', text: '#1e40af', label: 'Completed' },
  completed: { bg: '#dbeafe', text: '#1e40af', label: 'Completed' },
};

export default function AppointmentCard({ appointment, canCancel, onCancel, isAdmin, onAccept, onComplete, onDelete }) {
  const sc = STATUS[appointment.status] || STATUS.pending;
  const ts = appointment.time_slot ? ' @ ' + appointment.time_slot : '';

  return (
    <View style={s.card}>
      <View style={s.top}>
        <View style={[s.badge, { backgroundColor: sc.bg }]}><Text style={[s.badgeText, { color: sc.text }]}>{sc.label}</Text></View>
        {canCancel && onCancel && (
          <TouchableOpacity style={s.cancelBtn} onPress={onCancel}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
        )}
        {isAdmin && onDelete && (
          <TouchableOpacity style={s.deleteBtn} onPress={onDelete}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
        )}
      </View>
      <Text style={s.name}>{appointment.name}</Text>
      <Text style={s.detail}>{appointment.specialty} — {appointment.location}</Text>
      <Text style={s.detail}>{appointment.phone}  {appointment.requested_date}{ts}</Text>
      <View style={s.actions}>
        {isAdmin && onAccept && (
          <TouchableOpacity style={s.acceptBtn} onPress={onAccept}><Text style={s.acceptText}>Accept</Text></TouchableOpacity>
        )}
        {isAdmin && onComplete && (
          <TouchableOpacity style={s.completeBtn} onPress={onComplete}><Text style={s.completeText}>Mark Done</Text></TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: palette.surface, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: palette.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  name: { fontSize: 15, fontWeight: '700', color: palette.text, marginBottom: 4 },
  detail: { fontSize: 13, color: palette.textSecondary, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  acceptBtn: { backgroundColor: '#d1fae5', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#a7f3d0' },
  acceptText: { fontSize: 13, fontWeight: '600', color: '#065f46' },
  completeBtn: { backgroundColor: '#dbeafe', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe' },
  completeText: { fontSize: 13, fontWeight: '600', color: '#1e40af' },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#fee2e2', borderRadius: 8, borderWidth: 1, borderColor: '#fecaca' },
  cancelText: { fontSize: 12, fontWeight: '600', color: '#991b1b' },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#fee2e2', borderRadius: 8, borderWidth: 1, borderColor: '#fecaca' },
  deleteText: { fontSize: 12, fontWeight: '600', color: '#991b1b' },
});
