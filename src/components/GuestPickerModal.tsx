import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../theme/palette';

interface GuestPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: number;
  onChange: (count: number) => void;
  title?: string;
  doneLabel?: string;
}

export default function GuestPickerModal({ visible, onClose, value, onChange, title, doneLabel = 'OK' }: GuestPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.counterRow}>
            <Pressable
              style={[styles.counterBtn, value <= 1 && styles.counterBtnDisabled]}
              onPress={() => value > 1 && onChange(value - 1)}
              disabled={value <= 1}
            >
              <MaterialCommunityIcons name="minus" size={20} color={value <= 1 ? palette.outlineVariant : palette.onSurface} />
            </Pressable>
            <Text style={styles.counterValue}>{value}</Text>
            <Pressable
              style={[styles.counterBtn, value >= 10 && styles.counterBtnDisabled]}
              onPress={() => value < 10 && onChange(value + 1)}
              disabled={value >= 10}
            >
              <MaterialCommunityIcons name="plus" size={20} color={value >= 10 ? palette.outlineVariant : palette.onSurface} />
            </Pressable>
          </View>
          <Pressable style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneText}>{doneLabel}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 20,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: palette.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: {
    opacity: 0.4,
  },
  counterValue: {
    fontSize: 28,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: palette.onSurface,
    minWidth: 40,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: '#fff',
  },
});
