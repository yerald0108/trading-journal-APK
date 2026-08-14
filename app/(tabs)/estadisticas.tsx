import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
} from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { useEstadisticas } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import { AppText, FiltroTab, GraficaLinea, GraficaBarras } from '@/src/components';
import { SPACING } from '@/src/constants';
import { PeriodoEstadisticas } from '@/src/types';
import { calcularDatosBarras } from '@/src/services';

export default function EstadisticasScreen() {
  const { colors }    = useTema();
  const [periodo, setPeriodo] = useState<PeriodoEstadisticas>('semana');
  const { resumen, curvaCapital, operacionesFiltradas } = useEstadisticas(periodo);
  const { operaciones } = useOperaciones();
  const datosBarras = calcularDatosBarras(operacionesFiltradas, periodo);

  const profitFactor = resumen.perdidaBruta > 0
    ? (resumen.gananciaBruta / resumen.perdidaBruta).toFixed(2)
    : resumen.gananciaBruta > 0 ? '∞' : '0';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <AppText variante="label" color={colors.textMuted}>
              TRADING JOURNAL
            </AppText>
            <AppText variante="subtitulo" color={colors.textPrimary}>
              Analytics
            </AppText>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: colors.primarySurface }]}>
            <BarChart2 size={20} color={colors.primary} />
          </View>
        </View>

        {/* ── FILTRO ── */}
        <FiltroTab periodoActivo={periodo} onChange={setPeriodo} />

        {/* ── MÉTRICAS PRINCIPALES ── */}
        <View style={styles.grid}>

          <View style={[styles.metricCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primarySurface }]}>
              <Target size={16} color={colors.primary} />
            </View>
            <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
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
            <AppText variante="caption" color={colors.textMuted}>
              {resumen.operacionesGanadoras}W · {resumen.operacionesPerdedoras}L
            </AppText>
          </View>

          <View style={[styles.metricCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
            <View style={[styles.metricIcon, {
              backgroundColor: resumen.gananciaNeta >= 0
                ? colors.winSurface
                : colors.lossSurface,
            }]}>
              {resumen.gananciaNeta >= 0
                ? <TrendingUp   size={16} color={colors.win}  />
                : <TrendingDown size={16} color={colors.loss} />
              }
            </View>
            <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
              GANANCIA NETA
            </AppText>
            <AppText
              variante="subtitulo"
              color={resumen.gananciaNeta >= 0 ? colors.win : colors.loss}
            >
              {resumen.gananciaNeta >= 0 ? '+' : ''}${resumen.gananciaNeta.toFixed(2)}
            </AppText>
            <AppText variante="caption" color={colors.textMuted}>
              {resumen.totalOperaciones} operaciones
            </AppText>
          </View>

          <View style={[styles.metricCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
            <View style={[styles.metricIcon, { backgroundColor: colors.winSurface }]}>
              <Award size={16} color={colors.win} />
            </View>
            <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
              MEJOR OP.
            </AppText>
            <AppText variante="subtitulo" color={colors.win}>
              +${resumen.mejorOperacion.toFixed(2)}
            </AppText>
            <AppText variante="caption" color={colors.textMuted}>
              mejor trade
            </AppText>
          </View>

          <View style={[styles.metricCard, {
            backgroundColor: colors.surface,
            borderColor:     colors.border,
          }]}>
            <View style={[styles.metricIcon, { backgroundColor: colors.lossSurface }]}>
              <TrendingDown size={16} color={colors.loss} />
            </View>
            <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
              PEOR OP.
            </AppText>
            <AppText variante="subtitulo" color={colors.loss}>
              -${resumen.peorOperacion.toFixed(2)}
            </AppText>
            <AppText variante="caption" color={colors.textMuted}>
              peor trade
            </AppText>
          </View>

        </View>

        {/* ── CURVA DE CAPITAL ── */}
        <View style={styles.sectionHeader}>
          <AppText variante="label" color={colors.textMuted}>
            CURVA DE CAPITAL
          </AppText>
        </View>

        <View style={[styles.chartCard, {
          backgroundColor: colors.surface,
          borderColor:     colors.border,
        }]}>
          <GraficaLinea datos={curvaCapital} altura={200} />
        </View>

        {/* ── BARRAS POR PERÍODO ── */}
        <View style={styles.sectionHeader}>
          <AppText variante="label" color={colors.textMuted}>
            OPERACIONES POR PERÍODO
          </AppText>
        </View>

        <View style={[styles.chartCard, {
          backgroundColor: colors.surface,
          borderColor:     colors.border,
        }]}>
          <GraficaBarras datos={datosBarras} altura={200} />
        </View>

        {/* ── DESGLOSE FINANCIERO ── */}
        <View style={styles.sectionHeader}>
          <AppText variante="label" color={colors.textMuted}>
            DESGLOSE FINANCIERO
          </AppText>
        </View>

        <View style={[styles.desgloseCard, {
          backgroundColor: colors.surface,
          borderColor:     colors.border,
        }]}>

          {/* Ganancia bruta */}
          <View style={styles.desgloseRow}>
            <View style={styles.desgloseLeft}>
              <View style={[styles.desgloseDot, { backgroundColor: colors.win }]} />
              <AppText variante="caption" color={colors.textSecondary}>
                Ganancia bruta
              </AppText>
            </View>
            <AppText variante="cuerpo" color={colors.win}>
              +${resumen.gananciaBruta.toFixed(2)}
            </AppText>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Pérdida bruta */}
          <View style={styles.desgloseRow}>
            <View style={styles.desgloseLeft}>
              <View style={[styles.desgloseDot, { backgroundColor: colors.loss }]} />
              <AppText variante="caption" color={colors.textSecondary}>
                Pérdida bruta
              </AppText>
            </View>
            <AppText variante="cuerpo" color={colors.loss}>
              -${resumen.perdidaBruta.toFixed(2)}
            </AppText>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Profit factor */}
          <View style={styles.desgloseRow}>
            <View style={styles.desgloseLeft}>
              <View style={[styles.desgloseDot, { backgroundColor: colors.primary }]} />
              <AppText variante="caption" color={colors.textSecondary}>
                Profit factor
              </AppText>
            </View>
            <AppText variante="cuerpo" color={colors.primary}>
              {profitFactor}
            </AppText>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Resultado neto */}
          <View style={[styles.desgloseRow, styles.desgloseRowFinal]}>
            <AppText variante="cuerpo" color={colors.textPrimary}>
              Resultado neto
            </AppText>
            <AppText
              variante="subtitulo"
              color={resumen.gananciaNeta >= 0 ? colors.win : colors.loss}
            >
              {resumen.gananciaNeta >= 0 ? '+' : ''}${resumen.gananciaNeta.toFixed(2)}
            </AppText>
          </View>

        </View>

        {/* ── BARRA VISUAL WIN/LOSS ── */}
        {resumen.totalOperaciones > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <AppText variante="label" color={colors.textMuted}>
                DISTRIBUCIÓN
              </AppText>
            </View>

            <View style={[styles.distCard, {
              backgroundColor: colors.surface,
              borderColor:     colors.border,
            }]}>
              <View style={styles.distRow}>
                <View style={styles.distSide}>
                  <AppText variante="subtitulo" color={colors.win}>
                    {resumen.operacionesGanadoras}
                  </AppText>
                  <AppText variante="caption" color={colors.textMuted}>
                    ganadoras
                  </AppText>
                </View>

                <View style={styles.distBarWrap}>
                  <View style={[styles.distTrack, { backgroundColor: colors.lossSurface }]}>
                    <View style={[styles.distFill, {
                      backgroundColor: colors.win,
                      width:           `${resumen.tasaExito}%`,
                    }]} />
                  </View>
                  <AppText variante="label" color={colors.textMuted} style={styles.distPct}>
                    {resumen.tasaExito.toFixed(0)}%
                  </AppText>
                </View>

                <View style={[styles.distSide, styles.distSideRight]}>
                  <AppText variante="subtitulo" color={colors.loss}>
                    {resumen.operacionesPerdedoras}
                  </AppText>
                  <AppText variante="caption" color={colors.textMuted}>
                    perdedoras
                  </AppText>
                </View>
              </View>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { flex: 1 },
  content: {
    padding:       SPACING.md,
    paddingBottom: 100,
  },

  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING.lg,
  },
  headerIcon: {
    width:          42,
    height:         42,
    borderRadius:   14,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // Grid 2x2
  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           SPACING.sm,
    marginTop:     SPACING.md,
    marginBottom:  SPACING.md,
  },
  metricCard: {
    width:        '47.5%',
    borderRadius: 16,
    borderWidth:  0.5,
    padding:      SPACING.md,
    gap:          4,
  },
  metricIcon: {
    width:          34,
    height:         34,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   4,
  },
  metricLabel: {
    marginBottom: 2,
  },

  sectionHeader: {
    marginTop:    SPACING.md,
    marginBottom: SPACING.sm,
  },

  chartCard: {
    borderRadius: 16,
    borderWidth:  0.5,
    padding:      SPACING.sm,
    overflow:     'hidden',
  },

  // Desglose
  desgloseCard: {
    borderRadius: 16,
    borderWidth:  0.5,
    overflow:     'hidden',
  },
  desgloseRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    padding:        SPACING.md,
  },
  desgloseRowFinal: {
    paddingTop: SPACING.md,
  },
  desgloseLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
  },
  desgloseDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  divider: {
    height:          0.5,
    marginHorizontal: SPACING.md,
  },

  // Distribución
  distCard: {
    borderRadius: 16,
    borderWidth:  0.5,
    padding:      SPACING.md,
  },
  distRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
  },
  distSide: {
    alignItems: 'flex-start',
    minWidth:   50,
  },
  distSideRight: {
    alignItems: 'flex-end',
  },
  distBarWrap: {
    flex:  1,
    gap:   4,
  },
  distTrack: {
    height:       8,
    borderRadius: 4,
    overflow:     'hidden',
  },
  distFill: {
    height:       '100%',
    borderRadius: 4,
  },
  distPct: {
    textAlign: 'center',
  },
});