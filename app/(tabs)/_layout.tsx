import { Tabs } from 'expo-router';
import {
  LayoutDashboard,
  List,
  BarChart2,
  Settings,
  Plus,
} from 'lucide-react-native';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTema } from '@/src/hooks';
import { FONT_SIZE } from '@/src/constants';

// Botón FAB central para "Nueva Operación"
function FABButton({ onPress, color }: { onPress: () => void; color: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.fabWrap}
    >
      <View style={[styles.fabBtn, { backgroundColor: color }]}>
        <Plus size={24} color="#fff" strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const { colors } = useTema();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:  colors.surface,
          borderTopColor:   colors.border,
          borderTopWidth:   0.5,
          height:           Platform.OS === 'ios' ? 82 : 68,
          paddingBottom:    Platform.OS === 'ios' ? 24 : 10,
          paddingTop:       10,
          elevation:        0,
        },
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize:   10,
          fontWeight: '600',
          letterSpacing: 0.4,
          marginTop:  2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="historial"
        options={{
          title: 'Trades',
          tabBarIcon: ({ color }) => (
            <List size={22} color={color} />
          ),
        }}
      />

      {/* Tab central — FAB */}
      <Tabs.Screen
        name="nueva-operacion"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <FABButton
              onPress={() => props.onPress?.({} as any)}
              color={colors.primary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => (
            <BarChart2 size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <Settings size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      -20,
  },
  fabBtn: {
    width:         56,
    height:        56,
    borderRadius:  18,
    alignItems:    'center',
    justifyContent:'center',
    shadowColor:   '#7C6FFF',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius:  12,
    elevation:     10,
  },
});