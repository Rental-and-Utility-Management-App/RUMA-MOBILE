import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, text } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UnitsScreen from '../screens/UnitsScreen';
import UnitDetailScreen from '../screens/UnitDetailScreen';
import BillingScreen from '../screens/BillingScreen';
import InvoiceDetailScreen from '../screens/InvoiceDetailScreen';
import ContractsScreen from '../screens/ContractsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const UnitsStack = createNativeStackNavigator();
const BillingStack = createNativeStackNavigator();
const ContractsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: theme.bgSurface },
  headerTintColor: theme.fg1,
  headerTitleStyle: text.labelM,
  headerShadowVisible: false,
  animation: 'slide_from_right' as const,
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 24, lineHeight: 28, color: focused ? theme.brandPrimary : theme.fg3 }}>{label}</Text>;
}

// Every tab is wrapped in its own native-stack navigator so all headers
// render through the same native renderer (keeps them visually identical)
// and so pushing a detail screen gets the native slide animation.
function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={headerOptions}>
      <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Tổng quan' }} />
    </DashboardStack.Navigator>
  );
}

function UnitsStackScreen() {
  return (
    <UnitsStack.Navigator screenOptions={headerOptions}>
      <UnitsStack.Screen name="UnitsList" component={UnitsScreen} options={{ title: 'Phòng' }} />
      <UnitsStack.Screen name="UnitDetail" component={UnitDetailScreen} options={{ title: 'Chi tiết phòng' }} />
    </UnitsStack.Navigator>
  );
}

function BillingStackScreen() {
  return (
    <BillingStack.Navigator screenOptions={headerOptions}>
      <BillingStack.Screen name="BillingList" component={BillingScreen} options={{ title: 'Hóa đơn' }} />
      <BillingStack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} options={{ title: 'Chi tiết hóa đơn' }} />
    </BillingStack.Navigator>
  );
}

function ContractsStackScreen() {
  return (
    <ContractsStack.Navigator screenOptions={headerOptions}>
      <ContractsStack.Screen name="ContractsHome" component={ContractsScreen} options={{ title: 'Hợp đồng' }} />
    </ContractsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={headerOptions}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
    </ProfileStack.Navigator>
  );
}

function AppTabs() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isManager = user?.role === 'manager';
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.brandPrimary,
        tabBarInactiveTintColor: theme.fg3,
        tabBarStyle: {
          backgroundColor: theme.bgSurface,
          borderTopColor: theme.borderSubtle,
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        component={DashboardStackScreen}
        options={{ tabBarLabel: 'Tổng quan', tabBarIcon: ({ focused }) => <TabIcon label="●" focused={focused} /> }}
      />
      {isManager ? (
        <Tabs.Screen
          name="Units"
          component={UnitsStackScreen}
          options={{ tabBarLabel: 'Phòng', tabBarIcon: ({ focused }) => <TabIcon label="▦" focused={focused} /> }}
        />
      ) : null}
      <Tabs.Screen
        name="Billing"
        component={BillingStackScreen}
        options={{ tabBarLabel: 'Hóa đơn', tabBarIcon: ({ focused }) => <TabIcon label="$" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Contracts"
        component={ContractsStackScreen}
        options={{ tabBarLabel: 'Hợp đồng', tabBarIcon: ({ focused }) => <TabIcon label="≡" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{ tabBarLabel: 'Hồ sơ', tabBarIcon: ({ focused }) => <TabIcon label="◎" focused={focused} /> }}
      />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user ? (
          <RootStack.Screen name="App" component={AppTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
