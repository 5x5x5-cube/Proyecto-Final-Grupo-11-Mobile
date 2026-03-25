import React from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../theme/palette';

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
          {title && <Text style={styles.title}>{title}</Text>}
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
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
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
    maxHeight: '60%',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionSelected: {
    backgroundColor: palette.primaryContainer,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
  },
  optionTextSelected: {
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.primary,
  },
});
