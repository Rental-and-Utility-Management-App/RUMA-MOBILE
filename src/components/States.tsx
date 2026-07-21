import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { theme, text, space } from '../theme/tokens';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[3] }}>
      <ActivityIndicator color={theme.brandPrimary} />
      <Text style={[text.bodyS, { color: theme.fg3 }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[2], padding: space[7] }}>
      <Text style={[text.bodyL, { color: theme.fg2, textAlign: 'center' }]}>{title}</Text>
      {subtitle ? <Text style={[text.bodyS, { color: theme.fg3, textAlign: 'center' }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[3], padding: space[7] }}>
      <Text style={[text.bodyM, { color: theme.danger, textAlign: 'center' }]}>{message}</Text>
      {onRetry ? (
        <Text onPress={onRetry} style={[text.labelM, { color: theme.brandPrimary }]}>Try again</Text>
      ) : null}
    </View>
  );
}
