import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '../../theme/palette';
import Text from '../Text';
import { fontFamily } from '../../theme/typography';

interface HoldCountdownProps {
  expiresAt: string;
  onExpired: () => void;
}

function getSecondsRemaining(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function HoldCountdown({ expiresAt, onExpired }: HoldCountdownProps) {
  const { t } = useTranslation('mobile');
  const [remaining, setRemaining] = useState(() => getSecondsRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = getSecondsRemaining(expiresAt);
      setRemaining(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        onExpired();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const isWarning = remaining > 0 && remaining < 120;
  const bgColor = isWarning ? palette.warningContainer : palette.primaryContainer;
  const textColor = isWarning ? palette.warning : palette.primary;

  if (remaining <= 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name="clock-outline" size={18} color={textColor} />
      <Text
        variant="bodySmall"
        color={textColor}
        style={[{ fontFamily: fontFamily.medium }, styles.text]}
      >
        {t('summary.holdCountdown', { time: formatTime(remaining) })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 0,
    padding: 12,
    paddingHorizontal: 16,
  },
  text: {
    flex: 1,
  },
});
