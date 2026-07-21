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
    if (!phone || !password) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại và mật khẩu.'); return; }
    setLoading(true);
    try { await login(phone.trim(), password); }
    catch (e: any) { Alert.alert('Đăng nhập thất bại', e.message); }
    finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.bgPage }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: space[6] }} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: space[8], gap: space[2] }}>
          <Text style={[text.displayL, { color: theme.brandPrimaryActive, fontFamily: font.display }]}>RUMA</Text>
          <Text style={[text.bodyM, { color: theme.fg2 }]}>Quản lý phòng trọ & hóa đơn</Text>
        </View>
        <View style={{ gap: space[4] }}>
          <MobileInput label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoCapitalize="none" placeholder="VD: 0912345678" />
          <MobileInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          <MobileButton title="Đăng nhập" onPress={onSubmit} loading={loading} style={{ marginTop: space[2] }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
