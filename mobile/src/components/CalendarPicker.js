import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { palette } from '../theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getNext7() {
  const arr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    arr.push(d);
  }
  return arr;
}

export default function CalendarPicker({ onSelectDate, onSelectTime }) {
  const [dates] = useState(getNext7);
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState(null);

  const TIMES = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

  function pickDate(d) {
    setSelDate(d);
    setSelTime(null);
    onSelectDate?.(d);
  }

  return (
    <View>
      <Text style={s.label}>Select Date</Text>
      <View style={s.row}>
        {dates.map((d, i) => {
          const active = selDate && d.toDateString() === selDate.toDateString();
          return (
            <TouchableOpacity key={i} style={[s.day, active && s.dayActive]} onPress={() => pickDate(d)}>
              <Text style={[s.dayName, active && s.dayTextActive]}>{DAYS[d.getDay()]}</Text>
              <Text style={[s.dayNum, active && s.dayTextActive]}>{d.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selDate && (
        <>
          <Text style={[s.label, { marginTop: 16 }]}>Select Time</Text>
          <View style={s.timeGrid}>
            {TIMES.map((t, i) => (
              <TouchableOpacity key={i} style={[s.timeSlot, selTime === t && s.timeActive]} onPress={() => { setSelTime(t); onSelectTime?.(t); }}>
                <Text style={[s.timeText, selTime === t && s.timeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: palette.text, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 6 },
  day: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border },
  dayActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  dayName: { fontSize: 11, color: palette.textSecondary, fontWeight: '500' },
  dayNum: { fontSize: 16, fontWeight: '700', color: palette.text, marginTop: 2 },
  dayTextActive: { color: '#fff' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeSlot: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border },
  timeActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  timeText: { fontSize: 13, fontWeight: '500', color: palette.text },
  timeTextActive: { color: '#fff' },
});
