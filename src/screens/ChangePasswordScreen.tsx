import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, space } from '../theme/tokens';
import { MobileInput } from '../components/MobileInput';
import { MobileButton } from '../components/MobileButton';
import * as authApi from '../api/auth';

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [busy, setBusy] = useState(false);

  function onSave() {
    if (!oldPw || newPw.length < 6) { Alert.alert('Không hợp lệ', 'Mật khẩu mới phải có ít nhất 6 ký tự.'); return; }
    Alert.alert('Đổi mật khẩu', 'Xác nhận đổi sang mật khẩu mới?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xác nhận', onPress: async () => {
        setBusy(true);
        try {
          await authApi.changePassword(oldPw, newPw);
          Alert.alert('Thành công', 'Đã đổi mật khẩu.');
          navigation.goBack();
        } catch (e: any) { Alert.alert('Thất bại', e.message); }
        finally { setBusy(false); }
      }},
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgPage, padding: space[5], gap: space[4] }}>
      <MobileInput label="Mật khẩu hiện tại" value={oldPw} onChangeText={setOldPw} secureTextEntry />
      <MobileInput label="Mật khẩu mới" value={newPw} onChangeText={setNewPw} secureTextEntry />
      <MobileButton title="Lưu" onPress={onSave} loading={busy} />
    </View>
  );
}
