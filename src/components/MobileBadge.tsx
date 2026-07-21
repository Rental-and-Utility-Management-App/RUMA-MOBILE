import React from 'react';
import { View, Text } from 'react-native';
import { theme, text, radius, space } from '../theme/tokens';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'brand';

const toneMap: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: theme.bgSunken, fg: theme.fg2 },
  success: { bg: theme.successTint, fg: theme.success },
  warning: { bg: theme.warningTint, fg: theme.warning },
  danger: { bg: theme.dangerTint, fg: theme.danger },
  brand: { bg: theme.brandPrimaryTint, fg: theme.brandPrimaryActive },
};

export function MobileBadge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const c = toneMap[tone];
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: space[3], paddingVertical: 5, borderRadius: radius.pill, alignSelf: 'flex-start' }}>
      <Text style={[text.labelS, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

export function invoiceTone(status: string): Tone {
  if (status === 'paid') return 'success';
  if (status === 'partial') return 'warning';
  if (status === 'unpaid') return 'danger';
  if (status === 'cancelled') return 'neutral';
  return 'neutral';
}

export function roomPaymentTone(status: string): Tone {
  if (status === 'paid') return 'success';
  if (status === 'partial' || status === 'draft') return 'warning';
  if (status === 'unpaid') return 'danger';
  return 'neutral';
}

export function contractTone(status: string): Tone {
  if (status === 'active') return 'success';
  if (status === 'ended' || status === 'cancelled') return 'neutral';
  if (status === 'terminated') return 'danger';
  return 'neutral';
}
