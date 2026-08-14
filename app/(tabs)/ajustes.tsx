import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wallet,
  Moon,
  Sun,
  Trash2,
  Info,
  TrendingUp,
  RefreshCw,
} from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { useCapital } from '@/src/hooks';
import { useCapitalStore } from '@/src/store';
import { useOperacionesStore } from '@/src/store';
import { obtenerCapitalInicial, establecerCapitalInicial } from '@/src/database';
import { calcularCapitalActual } from '@/src/services';
import {
  AppText,
  Card,
  Divider,
  SwitchRow,
  FilaInfo,
  AppInput,
  Button,
} from '@/src/components';
import { SPACING, ICON_SIZE, RADIUS } from '@/src/constants';

export default function AjustesScreen() {
  const { colors, isDark, toggleTema } = useTema();
  const { capital } = useCapital();
  const [editandoCapital, setEditandoCapital] = useState(false);
  const [nuevoCapital, setNuevoCapital]       = useState('');
  const [errorCapital, setErrorCapital]       = useState('');

  const operaciones    = useOperacionesStore(s => s.operaciones);
  const totalOps       = operaciones.length;
  const capitalInicial = obtenerCapitalInicial();

  const guardarCapital = () => {
    const valor = parseFloat(nuevoCapital);
    if (isNaN(valor) || valor <= 0) {
      setErrorCapital('Ingresa un valor válido mayor a 0');
      return;
    }

    establecerCapitalInicial(valor);
    const nuevoCapitalCalculado = calcularCapitalActual(valor, operaciones);
    useCapitalStore.setState({ capital: nuevoCapitalCalculado, capitalInicial: valor });

    setEditandoCapital(false);
    setNuevoCapital('');
    setErrorCapital('');

    Alert.alert('Listo', 'Capital inicial actualizado correctamente.');
  };

  const confirmarResetear = () => {
    Alert.alert(
      'Resetear aplicación',
      'Esto eliminará TODAS tus operaciones y reiniciará el capital a 0. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text:    'Resetear todo',
          style:   'destructive',
          onPress: resetearApp,
        },
      ]
    );
  };

  const resetearApp = () => {
    establecerCapitalInicial(0);
    useCapitalStore.setState({ capital: 0, capitalInicial: 0 });
    useOperacionesStore.setState({ operaciones: [] });

    const { getDatabase } = require('@/src/database');
    getDatabase().runSync('DELETE FROM operaciones');

    Alert.alert('Reseteado', 'La aplicación ha sido reiniciada.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText variante="label" color={colors.textMuted}>
            TRADING JOURNAL
          </AppText>
          <AppText variante="subtitulo">Ajustes</AppText>
        </View>

        {/* Capital */}
        <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
          CAPITAL
        </AppText>

        <Card>
          <FilaInfo
            label="Capital inicial"
            valor={`$${capitalInicial.toFixed(2)}`}
            icono={<Wallet size={ICON_SIZE.sm} color={colors.primary} />}
          />
          <Divider margen={SPACING.xs} />
          <FilaInfo
            label="Capital actual"
            valor={`$${capital.toFixed(2)}`}
            colorValor={capital >= capitalInicial ? colors.win : colors.loss}
            icono={<TrendingUp size={ICON_SIZE.sm} color={colors.win} />}
          />
          <Divider margen={SPACING.xs} />

          {editandoCapital ? (
            <View style={styles.editCapital}>
              <AppInput
                label="Nuevo capital inicial"
                placeholder="0.00"
                prefix="$"
                keyboardType="decimal-pad"
                value={nuevoCapital}
                onChangeText={(v) => {
                  setNuevoCapital(v);
                  setErrorCapital('');
                }}
                error={errorCapital}
                autoFocus
              />
              <View style={styles.editBotones}>
                <Button
                  texto="Cancelar"
                  onPress={() => {
                    setEditandoCapital(false);
                    setNuevoCapital('');
                    setErrorCapital('');
                  }}
                  variante="ghost"
                  style={styles.botonMitad}
                />
                <Button
                  texto="Guardar"
                  onPress={guardarCapital}
                  variante="primary"
                  style={styles.botonMitad}
                />
              </View>
            </View>
          ) : (
            <FilaInfo
              label="Editar capital inicial"
              icono={<RefreshCw size={ICON_SIZE.sm} color={colors.textSecondary} />}
              onPress={() => {
                setNuevoCapital(capitalInicial.toString());
                setEditandoCapital(true);
              }}
            />
          )}
        </Card>

        {/* Apariencia */}
        <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
          APARIENCIA
        </AppText>

        <Card>
          <SwitchRow
            label="Modo oscuro"
            descripcion="Interfaz con fondo oscuro"
            valor={isDark}
            onChange={toggleTema}
            icono={isDark
              ? <Moon size={ICON_SIZE.sm} color={colors.primary} />
              : <Sun size={ICON_SIZE.sm} color={colors.warning} />
            }
          />
        </Card>

        {/* Estadísticas */}
        <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
          ESTADÍSTICAS
        </AppText>

        <Card>
          <FilaInfo
            label="Total de operaciones"
            valor={`${totalOps}`}
            icono={<Info size={ICON_SIZE.sm} color={colors.textSecondary} />}
          />
          <Divider margen={SPACING.xs} />
          <FilaInfo
            label="Versión de la app"
            valor="1.0.0"
            icono={<Info size={ICON_SIZE.sm} color={colors.textSecondary} />}
          />
        </Card>

        {/* Zona de peligro */}
        <AppText variante="label" color={colors.loss} style={styles.sectionLabel}>
          ZONA DE PELIGRO
        </AppText>

        <Card>
          <FilaInfo
            label="Resetear aplicación"
            icono={<Trash2 size={ICON_SIZE.sm} color={colors.loss} />}
            onPress={confirmarResetear}
            peligro
          />
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding:       SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    marginTop:    SPACING.lg,
    marginBottom: SPACING.sm,
  },
  editCapital: {
    gap:       SPACING.md,
    marginTop: SPACING.sm,
  },
  editBotones: {
    flexDirection: 'row',
    gap:           SPACING.sm,
  },
  botonMitad: {
    flex: 1,
  },
});