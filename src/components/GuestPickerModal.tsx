import React from 'react';
import { View, Pressable, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '@/theme/palette';
import Text from './Text';
import { styles } from './GuestPickerModal.styles';

interface GuestPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: number;
  onChange: (count: number) => void;
  title?: string;
  doneLabel?: string;
}

export default function GuestPickerModal({
  visible,
  onClose,
  value,
  onChange,
  title,
  doneLabel = 'OK',
}: GuestPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          {title && (
            <Text variant="subtitle" color={palette.onSurface} style={styles.title}>
              {title}
            </Text>
          )}
          <View style={styles.counterRow}>
            <Pressable
              style={[styles.counterBtn, value <= 1 && styles.counterBtnDisabled]}
              onPress={() => value > 1 && onChange(value - 1)}
              disabled={value <= 1}
            >
              <MaterialCommunityIcons
                name="minus"
                size={20}
                color={value <= 1 ? palette.outlineVariant : palette.onSurface}
              />
            </Pressable>
            <Text
              variant="h1"
              color={palette.onSurface}
              style={{ minWidth: 40, textAlign: 'center' }}
            >
              {value}
            </Text>
            <Pressable
              style={[styles.counterBtn, value >= 10 && styles.counterBtnDisabled]}
              onPress={() => value < 10 && onChange(value + 1)}
              disabled={value >= 10}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={value >= 10 ? palette.outlineVariant : palette.onSurface}
              />
            </Pressable>
          </View>
          <Pressable style={styles.doneButton} onPress={onClose}>
            <Text variant="button" color={palette.onPrimary}>
              {doneLabel}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
