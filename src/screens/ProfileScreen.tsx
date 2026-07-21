import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { theme, text, space, radius } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge } from '../components/MobileBadge';
import { MobileInput } from '../components/MobileInput';
import { MobileButton } from '../components/MobileButton';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [changing, setChanging] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [busy, setBusy] = useState(false);

  async function onChangePassword() {
    if (!oldPw || newPw.length < 6) { Alert.alert('Invalid', 'New password must be at least 6 characters.'); return; }
    setBusy(true);
    try {
      await authApi.changePassword(oldPw, newPw);
      Alert.alert('Success', 'Password changed.');
      setOldPw(''); setNewPw(''); setChanging(false);
    } catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setBusy(false); }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <MobileCard style={{ gap: space[2] }}>
        <Text style={[text.displayS, { color: theme.fg1 }]}>{user?.full_name}</Text>
        <Text style={[text.bodyS, { color: theme.fg2 }]}>{user?.phone}{user?.email ? ` · ${user.email}` : ''}</Text>
        <MobileBadge label={user?.role || ''} tone="brand" />
      </MobileCard>

      {changing ? (
        <MobileCard style={{ gap: space[4] }}>
          <MobileInput label="Current password" value={oldPw} onChangeText={setOldPw} secureTextEntry />
          <MobileInput label="New password" value={newPw} onChangeText={setNewPw} secureTextEntry />
          <View style={{ flexDirection: 'row', gap: space[3] }}>
            <MobileButton title="Cancel" variant="secondary" onPress={() => setChanging(false)} style={{ flex: 1 }} />
            <MobileButton title="Save" onPress={onChangePassword} loading={busy} style={{ flex: 1 }} />
          </View>
        </MobileCard>
      ) : (
        <Pressable onPress={() => setChanging(true)} style={{ backgroundColor: theme.bgSurface, borderRadius: radius.l, padding: space[4], borderWidth: 1, borderColor: theme.borderSubtle }}>
          <Text style={[text.labelM, { color: theme.fg1 }]}>Change password</Text>
        </Pressable>
      )}

      <MobileButton title="Log out" variant="danger" onPress={logout} />
    </ScrollView>
  );
}
