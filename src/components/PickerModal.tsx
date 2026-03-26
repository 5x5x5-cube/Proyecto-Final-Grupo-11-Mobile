import React from 'react';
import { View, Pressable, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '@/theme/palette';
import Text from './Text';
import { styles } from './PickerModal.styles';

interface PickerModalProps<T extends string> {
  visible: boolean;
  onClose: () => void;
  options: { key: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  title?: string;
}

export default function PickerModal<T extends string>({
  visible,
  onClose,
  options,
  selected,
  onSelect,
  title,
}: PickerModalProps<T>) {
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
              const isSelected = item.key === selected;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item.key);
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
