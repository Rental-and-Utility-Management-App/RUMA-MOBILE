import React from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, Text, useWindowDimensions } from 'react-native';
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
import ContractDetailScreen from '../screens/ContractDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

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

// react-navigation v6 bottom-tabs switches tabs instantly with no transition
// (that only shipped in v7). This slides each tab's content in from the left
// or right — whichever side matches the tab it's coming from — on focus,
// without needing that major-version upgrade.
const TabOrderContext = React.createContext<React.RefObject<number> | null>(null);

function SlideScreen({ index, children }: { index: number; children: React.ReactNode }) {
  const isFocused = useIsFocused();
  const prevIndexRef = React.useContext(TabOrderContext)!;
  const { width } = useWindowDimensions();
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isFocused) {
      const prev = prevIndexRef.current;
      const from = index > prev ? width : index < prev ? -width : 0;
      translateX.setValue(from);
      Animated.timing(translateX, { toValue: 0, duration: 240, useNativeDriver: true }).start();
      prevIndexRef.current = index;
    }
  }, [isFocused]);

  return <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>{children}</Animated.View>;
}

// Every tab is wrapped in its own native-stack navigator so all headers
// render through the same native renderer (keeps them visually identical)
// and so pushing a detail screen gets the native slide animation.
function DashboardStackScreen() {
  return (
    <SlideScreen index={0}>
      <DashboardStack.Navigator screenOptions={headerOptions}>
        <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Tổng quan' }} />
      </DashboardStack.Navigator>
    </SlideScreen>
  );
}

function UnitsStackScreen() {
  return (
    <SlideScreen index={1}>
      <UnitsStack.Navigator screenOptions={headerOptions}>
        <UnitsStack.Screen name="UnitsList" component={UnitsScreen} options={{ title: 'Phòng' }} />
        <UnitsStack.Screen name="UnitDetail" component={UnitDetailScreen} options={{ title: 'Chi tiết phòng' }} />
      </UnitsStack.Navigator>
    </SlideScreen>
  );
}

function BillingStackScreen() {
  return (
    <SlideScreen index={2}>
      <BillingStack.Navigator screenOptions={headerOptions}>
        <BillingStack.Screen name="BillingList" component={BillingScreen} options={{ title: 'Hóa đơn' }} />
        <BillingStack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} options={{ title: 'Chi tiết hóa đơn' }} />
      </BillingStack.Navigator>
    </SlideScreen>
  );
}

function ContractsStackScreen() {
  return (
    <SlideScreen index={3}>
      <ContractsStack.Navigator screenOptions={headerOptions}>
        <ContractsStack.Screen name="ContractsHome" component={ContractsScreen} options={{ title: 'Hợp đồng' }} />
        <ContractsStack.Screen name="ContractDetail" component={ContractDetailScreen} options={{ title: 'Chi tiết hợp đồng' }} />
      </ContractsStack.Navigator>
    </SlideScreen>
  );
}

function ProfileStackScreen() {
  return (
    <SlideScreen index={4}>
      <ProfileStack.Navigator screenOptions={headerOptions}>
        <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
        <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Đổi mật khẩu' }} />
      </ProfileStack.Navigator>
    </SlideScreen>
  );
}

function AppTabs() {
  const insets = useSafeAreaInsets();
  const prevIndexRef = React.useRef(0);
  return (
    <TabOrderContext.Provider value={prevIndexRef}>
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
        <Tabs.Screen
          name="Units"
          component={UnitsStackScreen}
          options={{ tabBarLabel: 'Phòng', tabBarIcon: ({ focused }) => <TabIcon label="▦" focused={focused} /> }}
        />
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
    </TabOrderContext.Provider>
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
