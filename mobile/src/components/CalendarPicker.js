import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const DAY_MAP = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };

export default function CalendarPicker({ availableDays, selectedDate, onSelectDate }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const avail = (availableDays || []).map(d => DAY_MAP[d]).filter(n => n !== undefined);

  function isAvailable(d) {
    if (d < today) return false;
    if (avail.length && avail.indexOf(d.getDay()) === -1) return false;
    return true;
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<View key={'e'+i} style={styles.dayCell} />);

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    const key = dt.toDateString();
    const availClass = isAvailable(dt);
    const isSelected = selectedDate && selectedDate.toDateString() === key;
    const isToday = dt.toDateString() === today.toDateString();
    cells.push(
      <TouchableOpacity
        key={key}
        style={[
          styles.dayCell,
          !availClass && styles.disabledDay,
          isSelected && styles.selectedDay,
          isToday && styles.todayDay
        ]}
        disabled={!availClass}
        onPress={() => onSelectDate(dt)}
      >
        <Text style={[
          styles.dayText,
          !availClass && styles.disabledText,
          isSelected && styles.selectedText,
          isToday && styles.todayText
        ]}>{d}</Text>
      </TouchableOpacity>
    );
  }

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)); }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrow}><Text>{'<'}</Text></TouchableOpacity>
        <Text style={styles.monthLabel}>{MONTHS[month]} {year}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.arrow}><Text>{'>'}</Text></TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {DAYS.map(d => <View key={d} style={styles.dayCell}><Text style={styles.dayName}>{d}</Text></View>)}
        {cells}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#dde4ed' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  arrow: { padding: 8 },
  monthLabel: { fontWeight: '700', fontSize: 15, color: '#162840' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: 6 },
  dayName: { fontSize: 11, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  dayText: { fontSize: 13, color: '#1a2a3a' },
  disabledDay: { opacity: 0.35 },
  disabledText: { color: '#c4cfd9' },
  selectedDay: { backgroundColor: '#0a8a7e', borderRadius: 20 },
  selectedText: { color: '#fff', fontWeight: '700' },
  todayDay: { borderWidth: 2, borderColor: '#0a8a7e', borderRadius: 20 },
  todayText: { fontWeight: '700' },
});
