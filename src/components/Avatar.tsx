import React from 'react';
import { Image, Text, View } from 'react-native';
import { theme, font } from '../theme/tokens';

export function Avatar({ uri, name, size = 44 }: { uri?: string | null; name?: string; size?: number }) {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.bgSunken }} />;
  }
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.brandPrimaryTint, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: font.display, fontSize: size * 0.42, color: theme.brandPrimaryActive }}>{initial}</Text>
    </View>
  );
}
