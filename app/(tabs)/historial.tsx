import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Trash2,
} from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import { useEstadisticas } from '@/src/hooks';
import { AppText, FiltroTab } from '@/src/components';
import { SPACING } from '@/src/constants';
import { PeriodoEstadisticas, Operacion } from '@/src/types';

export default function HistorialScreen() {
  const { colors }                            = useTema();
  const { eliminarOperacion }                 = useOperaciones();
  const [periodo, setPeriodo]                 = useState<PeriodoEstadisticas>('dia');
  const { resumen, operacionesFiltradas }     = useEstadisticas(periodo);

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

  const renderTrade = ({ item }: { item: Operacion }) => {
    const esWin = item.tipo === 'win';
    const fecha = new Date(item.fecha);
    const dia   = fecha.toLocaleDateString('es', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
    });
    const hora  = fecha.toLocaleTimeString('es', {
      hour:   '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.tradeCard, {
        backgroundColor: colors.surface,
        borderColor:     colors.border,
        borderLeftColor: esWin ? colors.win : colors.loss,
      }]}>
        {/* Ícono + info */}
        <View style={styles.tradeLeft}>
          <View style={[styles.tradeIcon, {
            backgroundColor: esWin ? colors.winSurface : colors.lossSurface,
          }]}>
            {esWin
              ? <TrendingUp   size={18} color={colors.win}  />
              : <TrendingDown size={18} color={colors.loss} />
            }
          </View>

          <View style={styles.tradeInfo}>
            <AppText variante="cuerpo" color={colors.textPrimary}>
              {esWin ? 'Ganancia' : 'Pérdida'}
            </AppText>
            {item.nota ? (
              <AppText variante="caption" color={colors.textMuted}>
                {item.nota}
              </AppText>
            ) : null}
            <AppText variante="caption" color={colors.textMuted}>
              {dia} · {hora}
            </AppText>
          </View>
        </View>

        {/* Monto + eliminar */}
        <View style={styles.tradeRight}>
          <AppText
            variante="subtitulo"
            color={esWin ? colors.win : colors.loss}
          >
            {esWin ? '+' : '-'}${item.monto.toFixed(2)}
          </AppText>
          <TouchableOpacity
            onPress={() => confirmarEliminar(item.id)}
            style={[styles.deleteBtn, { backgroundColor: colors.lossSurface }]}
            activeOpacity={0.7}
          >
            <Trash2 size={14} color={colors.loss} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <AppText variante="label" color={colors.textMuted}>
              TRADING JOURNAL
            </AppText>
            <AppText variante="subtitulo" color={colors.textPrimary}>
              Historial
            </AppText>
          </View>
        </View>

        {/* ── FILTRO ── */}
        <FiltroTab periodoActivo={periodo} onChange={setPeriodo} />

        {/* ── MÉTRICAS RÁPIDAS ── */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
            <AppText variante="label" color={colors.textMuted}>
              OPS
            </AppText>
            <AppText variante="subtitulo" color={colors.textPrimary}>
              {resumen.totalOperaciones}
            </AppText>
          </View>

          <View style={[styles.metricCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
            <AppText variante="label" color={colors.textMuted}>
              WIN RATE
            </AppText>
            <AppText
              variante="subtitulo"
              color={
                resumen.tasaExito >= 60 ? colors.win :
                resumen.tasaExito >= 40 ? colors.warning :
                resumen.totalOperaciones === 0 ? colors.textSecondary :
                colors.loss
              }
            >
              {resumen.tasaExito.toFixed(1)}%
            </AppText>
          </View>

          <View style={[styles.metricCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
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
          </View>
        </View>

        {/* ── BARRA WIN/LOSS ── */}
        {resumen.totalOperaciones > 0 && (
          <View style={[styles.progressCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
            <View style={styles.progressLabels}>
              <View style={styles.progressLabelLeft}>
                <View style={[styles.labelDot, { backgroundColor: colors.win }]} />
                <AppText variante="caption" color={colors.win}>
                  {resumen.operacionesGanadoras} ganadoras
                </AppText>
              </View>
              <View style={styles.progressLabelRight}>
                <AppText variante="caption" color={colors.loss}>
                  {resumen.operacionesPerdedoras} perdedoras
                </AppText>
                <View style={[styles.labelDot, { backgroundColor: colors.loss }]} />
              </View>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.lossSurface }]}>
              <View style={[styles.progressFill, {
                backgroundColor: colors.win,
                width:           `${resumen.tasaExito}%`,
              }]} />
            </View>
          </View>
        )}

        {/* ── LISTA ── */}
        <FlatList
          data={operacionesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTrade}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceElevated }]}>
                <ClipboardList size={32} color={colors.textMuted} />
              </View>
              <AppText
                variante="subtitulo"
                color={colors.textSecondary}
                centrado
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
  safe:      { flex: 1 },
  container: {
    flex:    1,
    padding: SPACING.md,
  },

  header: {
    marginBottom: SPACING.lg,
  },

  metricsRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
    marginTop:     SPACING.md,
    marginBottom:  SPACING.sm,
  },
  metricCard: {
    flex:         1,
    borderRadius: 14,
    borderWidth:  0.5,
    padding:      SPACING.md,
    gap:          4,
  },

  progressCard: {
    borderRadius:  14,
    borderWidth:   0.5,
    padding:       SPACING.md,
    marginBottom:  SPACING.sm,
    gap:           8,
  },
  progressLabels: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  progressLabelLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  progressLabelRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  labelDot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  progressTrack: {
    height:       6,
    borderRadius: 3,
    overflow:     'hidden',
  },
  progressFill: {
    height:       '100%',
    borderRadius: 3,
  },

  lista: {
    paddingTop:    SPACING.sm,
    paddingBottom: 100,
  },

  // Trade card
  tradeCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    borderRadius:    14,
    borderWidth:     0.5,
    borderLeftWidth: 3,
    padding:         SPACING.md,
    marginBottom:    SPACING.sm,
  },
  tradeLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
    flex:          1,
  },
  tradeIcon: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     'center',
    justifyContent: 'center',
  },
  tradeInfo: {
    flex: 1,
    gap:  2,
  },
  tradeRight: {
    alignItems: 'flex-end',
    gap:        SPACING.xs,
  },
  deleteBtn: {
    width:          28,
    height:         28,
    borderRadius:   8,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // Empty
  emptyWrap: {
    alignItems:  'center',
    paddingTop:  SPACING.xxl,
    gap:         SPACING.sm,
  },
  emptyIcon: {
    width:          72,
    height:         72,
    borderRadius:   22,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   SPACING.sm,
  },
});