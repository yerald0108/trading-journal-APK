import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClipboardList } from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import { useEstadisticas } from '@/src/hooks';
import {
  AppText,
  Card,
  FiltroTab,
  ItemOperacion,
  Divider,
} from '@/src/components';
import { SPACING, ICON_SIZE } from '@/src/constants';
import { PeriodoEstadisticas } from '@/src/types';

export default function HistorialScreen() {
  const { colors } = useTema();
  const { eliminarOperacion } = useOperaciones();
  const [periodo, setPeriodo] = useState<PeriodoEstadisticas>('dia');
  const { resumen, operacionesFiltradas } = useEstadisticas(periodo);

  const confirmarEliminar = (id: number) => {
    Alert.alert(
      'Eliminar operación',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text:    'Eliminar',
          style:   'destructive',
          onPress: () => eliminarOperacion(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <AppText variante="label" color={colors.textMuted}>
            TRADING JOURNAL
          </AppText>
          <AppText variante="subtitulo">Historial</AppText>
        </View>

        {/* Filtro de período */}
        <FiltroTab periodoActivo={periodo} onChange={setPeriodo} />

        {/* Resumen rápido del período */}
        <View style={styles.resumenRow}>
          <Card style={styles.resumenCard}>
            <AppText variante="label" color={colors.textMuted}>
              OPERACIONES
            </AppText>
            <AppText variante="subtitulo" color={colors.textPrimary}>
              {resumen.totalOperaciones}
            </AppText>
          </Card>

          <Card style={styles.resumenCard}>
            <AppText variante="label" color={colors.textMuted}>
              TASA ÉXITO
            </AppText>
            <AppText
              variante="subtitulo"
              color={
                resumen.tasaExito >= 60 ? colors.win :
                resumen.tasaExito >= 40 ? colors.warning :
                colors.loss
              }
            >
              {resumen.tasaExito.toFixed(1)}%
            </AppText>
          </Card>

          <Card style={styles.resumenCard}>
            <AppText variante="label" color={colors.textMuted}>
              NETO
            </AppText>
            <AppText
              variante="subtitulo"
              color={resumen.gananciaNeta >= 0 ? colors.win : colors.loss}
            >
              {resumen.gananciaNeta >= 0 ? '+' : ''}
              ${resumen.gananciaNeta.toFixed(2)}
            </AppText>
          </Card>
        </View>

        <Divider margen={SPACING.sm} />

        {/* Lista de operaciones */}
        <FlatList
          data={operacionesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ItemOperacion
              operacion={item}
              onEliminar={confirmarEliminar}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ClipboardList
                size={ICON_SIZE.xl}
                color={colors.textMuted}
              />
              <AppText
                variante="subtitulo"
                color={colors.textSecondary}
                centrado
                style={styles.emptyTitulo}
              >
                Sin operaciones
              </AppText>
              <AppText
                variante="caption"
                color={colors.textMuted}
                centrado
              >
                No hay operaciones registradas en este período
              </AppText>
            </View>
          }
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex:    1,
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  resumenRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
    marginTop:     SPACING.md,
    marginBottom:  SPACING.sm,
  },
  resumenCard: {
    flex: 1,
    gap:  SPACING.xs,
  },
  lista: {
    paddingTop:    SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems:     'center',
    justifyContent: 'center',
    paddingTop:     SPACING.xxl,
    gap:            SPACING.sm,
  },
  emptyTitulo: {
    marginTop: SPACING.md,
  },
});