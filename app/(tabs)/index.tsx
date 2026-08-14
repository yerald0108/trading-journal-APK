import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
} from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { useCapital } from '@/src/hooks';
import { useEstadisticas } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import { useFadeIn } from '@/src/hooks';
import {
  Card,
  AppText,
  CapitalAnimado,
} from '@/src/components';
import { SPACING, ICON_SIZE, RADIUS } from '@/src/constants';

const formatMoney = (valor: number): string => {
  const abs   = Math.abs(valor);
  const signo = valor < 0 ? '-' : valor > 0 ? '+' : '';
  return `${signo}$${abs.toFixed(2)}`;
};

export default function DashboardScreen() {
  const { colors, isDark, toggleTema } = useTema();
  const { capital }                    = useCapital();
  const { operaciones }                = useOperaciones();
  const { resumen }                    = useEstadisticas('dia');

  const { opacidad: opHeader,  translateY: tyHeader  } = useFadeIn(400, 0);
  const { opacidad: opCapital, translateY: tyCapital  } = useFadeIn(400, 80);
  const { opacidad: opStats,   translateY: tyStats    } = useFadeIn(400, 160);
  const { opacidad: opRecent,  translateY: tyRecent   } = useFadeIn(400, 240);

  const gananciaNeta = resumen.gananciaNeta;
  const esPositivo   = gananciaNeta >= 0;
  const winRate      = resumen.tasaExito;

  // Últimas 3 operaciones
  const recientes = [...operaciones]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ── */}
        <Animated.View style={{ opacity: opHeader, transform: [{ translateY: tyHeader }] }}>
          <View style={styles.header}>
            <View>
              <AppText variante="label" color={colors.textMuted}>
                TRADING JOURNAL
              </AppText>
              <AppText variante="subtitulo" color={colors.textPrimary}>
                Dashboard
              </AppText>
            </View>
            <TouchableOpacity
              style={[styles.themeBtn, {
                backgroundColor: colors.surface,
                borderColor:     colors.borderStrong,
              }]}
              onPress={toggleTema}
              activeOpacity={0.7}
            >
              {isDark
                ? <Sun  size={18} color={colors.textSecondary} />
                : <Moon size={18} color={colors.textSecondary} />
              }
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── CARD CAPITAL ── */}
        <Animated.View style={{ opacity: opCapital, transform: [{ translateY: tyCapital }] }}>
          <LinearGradient
            colors={isDark
              ? ['#1A1040', '#0B0C10']
              : ['#5B4FCC', '#7C6FFF']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.capitalCard}
          >
            {/* Badge EN VIVO */}
            <View style={styles.capitalTop}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <AppText variante="label" color="rgba(255,255,255,0.75)">
                  EN VIVO
                </AppText>
              </View>
              <AppText variante="label" color="rgba(255,255,255,0.45)">
                {operaciones.length} ops totales
              </AppText>
            </View>

            {/* Monto capital */}
            <View style={styles.capitalMid}>
              <AppText variante="label" color="rgba(255,255,255,0.55)" style={styles.capitalLabel}>
                CAPITAL ACTUAL
              </AppText>
              <CapitalAnimado
                valor={capital}
                color="#FFFFFF"
                fontSize={42}
              />
            </View>

            {/* Footer — cambio del día */}
            <View style={styles.capitalFooter}>
              <View style={[styles.changePill, {
                backgroundColor: esPositivo
                  ? 'rgba(45,212,160,0.20)'
                  : 'rgba(240,98,146,0.20)',
              }]}>
                {esPositivo
                  ? <ArrowUpRight   size={14} color="#2DD4A0" />
                  : <ArrowDownRight size={14} color="#F06292" />
                }
                <AppText
                  variante="caption"
                  color={esPositivo ? '#2DD4A0' : '#F06292'}
                >
                  {formatMoney(gananciaNeta)} hoy
                </AppText>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── MÉTRICAS 2x2 ── */}
        <Animated.View style={{ opacity: opStats, transform: [{ translateY: tyStats }] }}>
          <View style={styles.grid}>

            {/* Win rate */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.metricIcon, { backgroundColor: colors.primarySurface }]}>
                <Target size={16} color={colors.primary} />
              </View>
              <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
                WIN RATE
              </AppText>
              <AppText
                variante="subtitulo"
                color={
                  winRate >= 60 ? colors.win :
                  winRate >= 40 ? colors.warning :
                  resumen.totalOperaciones === 0 ? colors.textSecondary :
                  colors.loss
                }
              >
                {winRate.toFixed(1)}%
              </AppText>
            </View>

            {/* Neto hoy */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.metricIcon, {
                backgroundColor: esPositivo ? colors.winSurface : colors.lossSurface,
              }]}>
                {esPositivo
                  ? <TrendingUp   size={16} color={colors.win}  />
                  : <TrendingDown size={16} color={colors.loss} />
                }
              </View>
              <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
                NETO HOY
              </AppText>
              <AppText
                variante="subtitulo"
                color={esPositivo ? colors.win : colors.loss}
              >
                {formatMoney(gananciaNeta)}
              </AppText>
            </View>

            {/* Ganadoras */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.metricIcon, { backgroundColor: colors.winSurface }]}>
                <Trophy size={16} color={colors.win} />
              </View>
              <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
                GANADORAS
              </AppText>
              <AppText variante="subtitulo" color={colors.win}>
                {resumen.operacionesGanadoras}
              </AppText>
            </View>

            {/* Perdedoras */}
            <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.metricIcon, { backgroundColor: colors.lossSurface }]}>
                <Zap size={16} color={colors.loss} />
              </View>
              <AppText variante="label" color={colors.textMuted} style={styles.metricLabel}>
                PERDEDORAS
              </AppText>
              <AppText variante="subtitulo" color={colors.loss}>
                {resumen.operacionesPerdedoras}
              </AppText>
            </View>

          </View>
        </Animated.View>

        {/* ── BARRA DE PROGRESO WIN/LOSS ── */}
        {resumen.totalOperaciones > 0 && (
          <Animated.View style={{ opacity: opStats, transform: [{ translateY: tyStats }] }}>
            <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.progressHeader}>
                <AppText variante="caption" color={colors.win}>
                  {winRate.toFixed(1)}% éxito
                </AppText>
                <AppText variante="caption" color={colors.loss}>
                  {(100 - winRate).toFixed(1)}% pérdida
                </AppText>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: colors.lossSurface }]}>
                <View style={[styles.progressFill, {
                  backgroundColor: colors.win,
                  width: `${winRate}%`,
                }]} />
              </View>
            </View>
          </Animated.View>
        )}

        {/* ── OPERACIONES RECIENTES ── */}
        <Animated.View style={{ opacity: opRecent, transform: [{ translateY: tyRecent }] }}>
          <View style={styles.sectionHeader}>
            <AppText variante="label" color={colors.textMuted}>
              OPERACIONES RECIENTES
            </AppText>
          </View>

          {recientes.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceElevated }]}>
                <Zap size={28} color={colors.textMuted} />
              </View>
              <AppText variante="subtitulo" centrado color={colors.textSecondary}>
                Sin operaciones aún
              </AppText>
              <AppText variante="caption" centrado color={colors.textMuted} style={styles.emptyDesc}>
                Toca el botón + para registrar tu primera operación
              </AppText>
            </View>
          ) : (
            recientes.map((op, i) => {
              const esWin  = op.tipo === 'win';
              const fecha  = new Date(op.fecha);
              const hora   = fecha.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
              const dia    = fecha.toLocaleDateString('es', { day: '2-digit', month: 'short' });

              return (
                <View
                  key={op.id}
                  style={[styles.tradeRow, {
                    backgroundColor: colors.surface,
                    borderColor:     colors.border,
                    borderLeftColor: esWin ? colors.win : colors.loss,
                  }]}
                >
                  <View style={[styles.tradeIcon, {
                    backgroundColor: esWin ? colors.winSurface : colors.lossSurface,
                  }]}>
                    {esWin
                      ? <TrendingUp   size={16} color={colors.win}  />
                      : <TrendingDown size={16} color={colors.loss} />
                    }
                  </View>

                  <View style={styles.tradeInfo}>
                    <AppText variante="cuerpo" color={colors.textPrimary}>
                      {esWin ? 'Ganancia' : 'Pérdida'}
                    </AppText>
                    {op.nota ? (
                      <AppText variante="caption" color={colors.textMuted}>
                        {op.nota}
                      </AppText>
                    ) : (
                      <AppText variante="caption" color={colors.textMuted}>
                        {dia} · {hora}
                      </AppText>
                    )}
                  </View>

                  <AppText
                    variante="subtitulo"
                    color={esWin ? colors.win : colors.loss}
                  >
                    {esWin ? '+' : '-'}${op.monto.toFixed(2)}
                  </AppText>
                </View>
              );
            })
          )}
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    padding:       SPACING.md,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING.lg,
  },
  themeBtn: {
    width:          38,
    height:         38,
    borderRadius:   12,
    borderWidth:    0.5,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // Capital card
  capitalCard: {
    borderRadius:  20,
    padding:       SPACING.lg,
    marginBottom:  SPACING.md,
  },
  capitalTop: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING.md,
  },
  liveBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    backgroundColor:   'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      100,
  },
  liveDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: '#2DD4A0',
  },
  capitalMid: {
    marginBottom: SPACING.md,
  },
  capitalLabel: {
    marginBottom: 4,
  },
  capitalFooter: {
    flexDirection: 'row',
  },
  changePill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      100,
  },

  // Grid métricas
  grid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            SPACING.sm,
    marginBottom:   SPACING.sm,
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

  // Barra progreso
  progressCard: {
    borderRadius:  14,
    borderWidth:   0.5,
    padding:       SPACING.md,
    marginBottom:  SPACING.md,
    gap:           8,
  },
  progressHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
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

  // Recientes
  sectionHeader: {
    marginBottom: SPACING.sm,
    marginTop:    SPACING.xs,
  },
  tradeRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING.sm,
    borderRadius:   14,
    borderWidth:    0.5,
    borderLeftWidth: 3,
    padding:        SPACING.md,
    marginBottom:   SPACING.sm,
  },
  tradeIcon: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
  },
  tradeInfo: {
    flex: 1,
    gap:  2,
  },

  // Empty state
  emptyCard: {
    borderRadius: 16,
    borderWidth:  0.5,
    padding:      SPACING.xl,
    alignItems:   'center',
    gap:          SPACING.sm,
  },
  emptyIcon: {
    width:          64,
    height:         64,
    borderRadius:   20,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   SPACING.sm,
  },
  emptyDesc: {
    lineHeight: 20,
    maxWidth:   240,
  },
});