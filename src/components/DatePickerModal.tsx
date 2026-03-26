import React from 'react';
import { View, Pressable, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '@/theme/palette';
import Text from './Text';
import { styles } from './DatePickerModal.styles';

interface DateOption {
  key: string;
  label: string;
  date: string; // ISO string
}

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  options: DateOption[];
  selected: string;
  onSelect: (dateIso: string) => void;
  title?: string;
}

export default function DatePickerModal({
  visible,
  onClose,
  options,
  selected,
  onSelect,
  title,
}: DatePickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          {title && (
            <Text variant="subtitle" color={palette.onSurface} style={styles.title}>
              {title}
            </Text>
          )}
          <FlatList
            data={options}
            keyExtractor={item => item.key}
            renderItem={({ item }) => {
              const isSelected = item.date === selected;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item.date);
                    onClose();
                  }}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <Text
                    variant={isSelected ? 'label' : 'body'}
                    color={isSelected ? palette.primary : palette.onSurface}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <MaterialCommunityIcons name="check" size={18} color={palette.primary} />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
}
