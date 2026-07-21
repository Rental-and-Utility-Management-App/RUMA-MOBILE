import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
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
const UnitsStack = createNativeStackNavigator();
const BillingStack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: theme.bgSurface },
  headerTintColor: theme.fg1,
  headerTitleStyle: text.labelM,
  headerShadowVisible: false,
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 11, color: focused ? theme.brandPrimary : theme.fg3 }}>{label}</Text>;
}

function UnitsStackScreen() {
  return (
    <UnitsStack.Navigator screenOptions={headerOptions}>
      <UnitsStack.Screen name="UnitsList" component={UnitsScreen} options={{ title: 'Units' }} />
      <UnitsStack.Screen name="UnitDetail" component={UnitDetailScreen} options={{ title: 'Unit detail' }} />
    </UnitsStack.Navigator>
  );
}

function BillingStackScreen() {
  return (
    <BillingStack.Navigator screenOptions={headerOptions}>
      <BillingStack.Screen name="BillingList" component={BillingScreen} options={{ title: 'Billing' }} />
      <BillingStack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} options={{ title: 'Invoice' }} />
    </BillingStack.Navigator>
  );
}

function AppTabs() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.brandPrimary,
        tabBarInactiveTintColor: theme.fg3,
        tabBarStyle: { backgroundColor: theme.bgSurface, borderTopColor: theme.borderSubtle },
      }}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="●" focused={focused} /> }} />
      {isManager ? (
        <Tabs.Screen name="Units" component={UnitsStackScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="▦" focused={focused} /> }} />
      ) : null}
      <Tabs.Screen name="Billing" component={BillingStackScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="$" focused={focused} /> }} />
      <Tabs.Screen name="Contracts" component={ContractsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="≡" focused={focused} /> }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="◎" focused={focused} /> }} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={AppTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
