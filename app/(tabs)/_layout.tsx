import { Tabs } from 'expo-router';
import { LayoutDashboard, PlusCircle, List, BarChart2 } from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { FONT_SIZE, ICON_SIZE } from '@/src/constants';
import { Settings } from 'lucide-react-native';

export default function TabsLayout() {
  const { colors } = useTema();

  return (
    <Tabs
      screenOptions={{
        headerShown:            false,
        tabBarStyle: {
          backgroundColor:      colors.surface,
          borderTopColor:       colors.border,
          borderTopWidth:       1,
          height:               64,
          paddingBottom:        10,
          paddingTop:           8,
        },
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize:   FONT_SIZE.xs,
          fontWeight: '500',
          marginTop:  2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={ICON_SIZE.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nueva-operacion"
        options={{
          title: 'Registrar',
          tabBarIcon: ({ color }) => (
            <PlusCircle size={ICON_SIZE.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => (
            <List size={ICON_SIZE.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color }) => (
            <BarChart2 size={ICON_SIZE.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <Settings size={ICON_SIZE.md} color={color} />
          ),
        }}
      />
    </Tabs>
    
  );
}