import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { theme, text, space, font } from '../theme/tokens';
import { MobileInput } from '../components/MobileInput';
import { MobileButton } from '../components/MobileButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!phone || !password) { Alert.alert('Missing info', 'Enter phone and password.'); return; }
    setLoading(true);
    try { await login(phone.trim(), password); }
    catch (e: any) { Alert.alert('Login failed', e.message); }
    finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.bgPage }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: space[6] }} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: space[8], gap: space[2] }}>
          <Text style={[text.displayL, { color: theme.brandPrimaryActive, fontFamily: font.display }]}>RUMA</Text>
          <Text style={[text.bodyM, { color: theme.fg2 }]}>Rental & Utility Management</Text>
        </View>
        <View style={{ gap: space[4] }}>
          <MobileInput label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoCapitalize="none" placeholder="e.g. 0912345678" />
          <MobileInput label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          <MobileButton title="Log in" onPress={onSubmit} loading={loading} style={{ marginTop: space[2] }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
