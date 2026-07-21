import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { theme, text, radius, space } from '../theme/tokens';

interface Props extends TextInputProps {
  label: string;
}

export function MobileInput({ label, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: space[2] }}>
      <Text style={[text.labelM, { color: theme.fg2 }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.fg3}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          text.bodyM,
          {
            height: 50, borderRadius: radius.m, borderWidth: 1.5, paddingHorizontal: space[4],
            borderColor: focused ? theme.brandPrimary : theme.borderDefault, color: theme.fg1, backgroundColor: theme.bgSurface,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}
