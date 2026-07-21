import React from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, text, space, radius } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge } from '../components/MobileBadge';
import { MobileButton } from '../components/MobileButton';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../utils/i18n';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  function onLogout() {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <MobileCard style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
        <Avatar uri={user?.avatar_url} name={user?.full_name} size={64} />
        <View style={{ gap: space[2], flex: 1 }}>
          <Text style={[text.displayS, { color: theme.fg1 }]}>{user?.full_name}</Text>
          <Text style={[text.bodyS, { color: theme.fg2 }]}>{user?.phone}{user?.email ? ` · ${user.email}` : ''}</Text>
          <MobileBadge label={roleLabel(user?.role)} tone="brand" />
        </View>
      </MobileCard>

      <Pressable onPress={() => navigation.navigate('ChangePassword')} style={{ backgroundColor: theme.bgSurface, borderRadius: radius.l, padding: space[4], borderWidth: 1, borderColor: theme.borderSubtle }}>
        <Text style={[text.labelM, { color: theme.fg1 }]}>Đổi mật khẩu</Text>
      </Pressable>

      <MobileButton title="Đăng xuất" variant="danger" onPress={onLogout} />
    </ScrollView>
  );
}
