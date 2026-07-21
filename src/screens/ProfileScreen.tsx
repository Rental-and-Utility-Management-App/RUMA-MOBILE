import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { theme, text, space, radius } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge } from '../components/MobileBadge';
import { MobileInput } from '../components/MobileInput';
import { MobileButton } from '../components/MobileButton';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';
import { roleLabel } from '../utils/i18n';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [changing, setChanging] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [busy, setBusy] = useState(false);

  function onChangePassword() {
    if (!oldPw || newPw.length < 6) { Alert.alert('Không hợp lệ', 'Mật khẩu mới phải có ít nhất 6 ký tự.'); return; }
    Alert.alert('Đổi mật khẩu', 'Xác nhận đổi sang mật khẩu mới?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xác nhận', onPress: async () => {
        setBusy(true);
        try {
          await authApi.changePassword(oldPw, newPw);
          Alert.alert('Thành công', 'Đã đổi mật khẩu.');
          setOldPw(''); setNewPw(''); setChanging(false);
        } catch (e: any) { Alert.alert('Thất bại', e.message); }
        finally { setBusy(false); }
      }},
    ]);
  }

  function onLogout() {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <MobileCard style={{ gap: space[2] }}>
        <Text style={[text.displayS, { color: theme.fg1 }]}>{user?.full_name}</Text>
        <Text style={[text.bodyS, { color: theme.fg2 }]}>{user?.phone}{user?.email ? ` · ${user.email}` : ''}</Text>
        <MobileBadge label={roleLabel(user?.role)} tone="brand" />
      </MobileCard>

      {changing ? (
        <MobileCard style={{ gap: space[4] }}>
          <MobileInput label="Mật khẩu hiện tại" value={oldPw} onChangeText={setOldPw} secureTextEntry />
          <MobileInput label="Mật khẩu mới" value={newPw} onChangeText={setNewPw} secureTextEntry />
          <View style={{ flexDirection: 'row', gap: space[3] }}>
            <MobileButton title="Hủy" variant="secondary" onPress={() => setChanging(false)} style={{ flex: 1 }} />
            <MobileButton title="Lưu" onPress={onChangePassword} loading={busy} style={{ flex: 1 }} />
          </View>
        </MobileCard>
      ) : (
        <Pressable onPress={() => setChanging(true)} style={{ backgroundColor: theme.bgSurface, borderRadius: radius.l, padding: space[4], borderWidth: 1, borderColor: theme.borderSubtle }}>
          <Text style={[text.labelM, { color: theme.fg1 }]}>Đổi mật khẩu</Text>
        </Pressable>
      )}

      <MobileButton title="Đăng xuất" variant="danger" onPress={onLogout} />
    </ScrollView>
  );
}
