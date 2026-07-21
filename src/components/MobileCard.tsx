import React from 'react';
import { View, ViewStyle } from 'react-native';
import { theme, radius, space, shadow } from '../theme/tokens';

export function MobileCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        { backgroundColor: theme.bgSurface, borderRadius: radius.l, padding: space[4], borderWidth: 1, borderColor: theme.borderSubtle },
        shadow.s, style,
      ]}
    >
      {children}
    </View>
  );
}
