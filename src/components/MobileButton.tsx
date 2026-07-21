import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { theme, text, radius, space } from '../theme/tokens';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function MobileButton({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const bg = {
    primary: theme.brandPrimary, secondary: theme.bgSurface, ghost: 'transparent', danger: theme.danger,
  }[variant];
  const fg = variant === 'secondary' || variant === 'ghost' ? theme.fg1 : theme.fgOnDark;
  const border = variant === 'secondary' ? theme.borderDefault : 'transparent';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[text.labelM, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50, borderRadius: radius.m, borderWidth: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: space[5],
  },
});
