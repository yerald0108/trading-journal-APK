import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { useCapital } from '@/src/hooks';
import { useEstadisticas } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import { useFadeIn } from '@/src/hooks';
import {
  Card,
  AppText,
  Badge,
  Divider,
  GradientCard,
  CapitalAnimado,
} from '@/src/components';
import { SPACING, ICON_SIZE, RADIUS } from '@/src/constants';

const RADIUS_VALUE = 10;

export default function DashboardScreen() {
  const { colors, isDark, toggleTema } = useTema();
  const { capital }                    = useCapital();
  const { operaciones }                = useOperaciones();
  const { resumen }                    = useEstadisticas('dia');

  const { opacidad: opHeader,  translateY: tyHeader  } = useFadeIn(400, 0);
  const { opacidad: opCapital, translateY: tyCapital  } = useFadeIn(400, 100);
  const { opacidad: opStats,   translateY: tyStats    } = useFadeIn(400, 200);
  const { opacidad: opOps,     translateY: tyOps      } = useFadeIn(400, 300);

  const gananciaNeta = resumen.gananciaNeta;
  const esPositivo   = gananciaNeta >= 0;

  const gradienteCapital: [string, string] = isDark
    ? ['#1e3a5f', '#0f172a']
    : ['#1d4ed8', '#3b82f6'];

  const formatearMoneda = (valor: number): string => {
    const abs   = Math.abs(valor);
    const signo = valor < 0 ? '-' : valor > 0 ? '+' : '';
    return `${signo}$${abs.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={{
          opacity:   opHeader,
          transform: [{ translateY: tyHeader }],
        }}>
          <View style={styles.header}>
            <View>
              <AppText variante="label" color={colors.textMuted}>
                TRADING JOURNAL
              </AppText>
              <AppText variante="subtitulo">Dashboard</AppText>
            </View>
            <TouchableOpacity
              style={[styles.themeBtn, {
                backgroundColor: colors.surface,
                borderColor:     colors.border,
              }]}
              onPress={toggleTema}
              activeOpacity={0.7}
            >
              {isDark
                ? <Sun  size={ICON_SIZE.md} color={colors.textSecondary} />
                : <Moon size={ICON_SIZE.md} color={colors.textSecondary} />
              }
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Card de capital con gradiente */}
        <Animated.View style={{
          opacity:   opCapital,
          transform: [{ translateY: tyCapital }],
        }}>
          <GradientCard
            colores={gradienteCapital}
            style={styles.capitalCard}
            padding={SPACING.lg}
          >
            <View style={styles.capitalTop}>
              <View style={styles.capitalLabel}>
                <View style={styles.capitalDot} />
                <AppText variante="label" color="rgba(255,255,255,0.7)">
                  CAPITAL ACTUAL
                </AppText>
              </View>
              <View style={[styles.activityBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Activity size={12} color="rgba(255,255,255,0.8)" />
                <AppText variante="label" color="rgba(255,255,255,0.8)">
                  EN VIVO
                </AppText>
              </View>
            </View>

            <CapitalAnimado
              valor={capital}
              color="#ffffff"
              fontSize={40}
            />

            <View style={styles.capitalFooter}>
              <View style={[
                styles.capitalCambio,
                { backgroundColor: 'rgba(255,255,255,0.12)' },
              ]}>
                {esPositivo
                  ? <ArrowUpRight   size={14} color="#86efac" />
                  : <ArrowDownRight size={14} color="#fca5a5" />
                }
                <AppText
                  variante="caption"
                  color={esPositivo ? '#86efac' : '#fca5a5'}
                >
                  {formatearMoneda(gananciaNeta)} hoy
                </AppText>
              </View>
              <AppText variante="caption" color="rgba(255,255,255,0.5)">
                {operaciones.length} op{operaciones.length !== 1 ? 's' : ''} en total
              </AppText>
            </View>
          </GradientCard>
        </Animated.View>

        {/* Stats rápidas */}
        <Animated.View style={{
          opacity:   opStats,
          transform: [{ translateY: tyStats }],
        }}>
          <View style={styles.statsRow}>
            {/* Tasa de éxito */}
            <Card style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: colors.surfaceElevated }]}>
                  <Target size={ICON_SIZE.sm} color={colors.primary} />
                </View>
              </View>
              <AppText variante="label" color={colors.textMuted} style={styles.statLabel}>
                TASA ÉXITO
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
                {resumen.totalOperaciones === 0
                  ? 'Sin ops hoy'
                  : `${resumen.totalOperaciones} op${resumen.totalOperaciones !== 1 ? 's' : ''} hoy`
                }
              </AppText>
            </Card>

            {/* Ganancia neta hoy */}
            <Card style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: colors.surfaceElevated }]}>
                  {gananciaNeta >= 0
                    ? <TrendingUp   size={ICON_SIZE.sm} color={colors.win}  />
                    : <TrendingDown size={ICON_SIZE.sm} color={colors.loss} />
                  }
                </View>
              </View>
              <AppText variante="label" color={colors.textMuted} style={styles.statLabel}>
                NETO HOY
              </AppText>
              <AppText
                variante="subtitulo"
                color={gananciaNeta >= 0 ? colors.win : colors.loss}
              >
                {formatearMoneda(gananciaNeta)}
              </AppText>
              <AppText variante="caption" color={colors.textMuted}>
                {gananciaNeta >= 0 ? 'Sesión positiva' : 'Sesión negativa'}
              </AppText>
            </Card>
          </View>
        </Animated.View>

        {/* Operaciones del día */}
        <Animated.View style={{
          opacity:   opOps,
          transform: [{ translateY: tyOps }],
        }}>
          <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
            OPERACIONES DE HOY
          </AppText>

          <Card style={styles.opsCard}>
            <View style={styles.opsRow}>

              {/* Ganadoras */}
              <View style={styles.opsStat}>
                <View style={[styles.opsIconWrap, { backgroundColor: colors.winSurface }]}>
                  <TrendingUp size={ICON_SIZE.md} color={colors.win} />
                </View>
                <AppText variante="titulo" color={colors.win}>
                  {resumen.operacionesGanadoras}
                </AppText>
                <Badge variante="win" texto="GANADORAS" />
              </View>

              {/* Separador VS */}
              <View style={styles.opsSeparador}>
                <View style={[styles.lineaVertical, { backgroundColor: colors.border }]} />
                <View style={[styles.vsCircle, {
                  backgroundColor: colors.surfaceElevated,
                  borderColor:     colors.border,
                }]}>
                  <AppText variante="label" color={colors.textMuted}>VS</AppText>
                </View>
                <View style={[styles.lineaVertical, { backgroundColor: colors.border }]} />
              </View>

              {/* Perdedoras */}
              <View style={styles.opsStat}>
                <View style={[styles.opsIconWrap, { backgroundColor: colors.lossSurface }]}>
                  <TrendingDown size={ICON_SIZE.md} color={colors.loss} />
                </View>
                <AppText variante="titulo" color={colors.loss}>
                  {resumen.operacionesPerdedoras}
                </AppText>
                <Badge variante="loss" texto="PERDEDORAS" />
              </View>
            </View>

            {/* Barra de progreso */}
            {resumen.totalOperaciones > 0 && (
              <>
                <Divider margen={SPACING.md} />
                <View style={styles.progressWrap}>
                  <View style={[styles.progressBar, { backgroundColor: colors.lossSurface }]}>
                    <View style={[styles.progressFill, {
                      backgroundColor: colors.win,
                      width:           `${resumen.tasaExito}%`,
                    }]} />
                  </View>
                  <View style={styles.progressLabels}>
                    <AppText variante="caption" color={colors.win}>
                      {resumen.tasaExito.toFixed(1)}% éxito
                    </AppText>
                    <AppText variante="caption" color={colors.loss}>
                      {(100 - resumen.tasaExito).toFixed(1)}% pérdida
                    </AppText>
                  </View>
                </View>
              </>
            )}
          </Card>

          {/* Extremos del día */}
          {resumen.totalOperaciones > 0 && (
            <>
              <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
                EXTREMOS DE HOY
              </AppText>
              <View style={styles.statsRow}>
                <Card style={[styles.statCard, { borderLeftWidth: 3, borderLeftColor: colors.win }]}>
                  <AppText variante="label" color={colors.textMuted}>
                    MEJOR OP.
                  </AppText>
                  <AppText variante="subtitulo" color={colors.win}>
                    +${resumen.mejorOperacion.toFixed(2)}
                  </AppText>
                </Card>
                <Card style={[styles.statCard, { borderLeftWidth: 3, borderLeftColor: colors.loss }]}>
                  <AppText variante="label" color={colors.textMuted}>
                    PEOR OP.
                  </AppText>
                  <AppText variante="subtitulo" color={colors.loss}>
                    -${resumen.peorOperacion.toFixed(2)}
                  </AppText>
                </Card>
              </View>
            </>
          )}

          {/* Estado vacío */}
          {operaciones.length === 0 && (
            <Card style={styles.emptyCard}>
              <View style={[styles.emptyIconWrap, { backgroundColor: colors.surfaceElevated }]}>
                <Activity size={ICON_SIZE.xl} color={colors.textMuted} />
              </View>
              <AppText variante="subtitulo" centrado color={colors.textSecondary}>
                Sin operaciones aún
              </AppText>
              <AppText
                variante="caption"
                centrado
                color={colors.textMuted}
                style={styles.emptyDesc}
              >
                Registra tu primera operación para comenzar a ver tus estadísticas
              </AppText>
            </Card>
          )}
        </Animated.View>

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
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING.lg,
  },
  themeBtn: {
    width:          40,
    height:         40,
    borderRadius:   20,
    borderWidth:    1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  capitalCard: {
    marginBottom: SPACING.md,
  },
  capitalTop: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING.sm,
  },
  capitalLabel: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
  capitalDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: '#86efac',
  },
  activityBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: SPACING.sm,
    paddingVertical:   3,
    borderRadius:      RADIUS.full,
  },
  capitalFooter: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginTop:      SPACING.md,
  },
  capitalCambio: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: SPACING.sm,
    paddingVertical:   4,
    borderRadius:      RADIUS.full,
  },
  statsRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
    marginBottom:  SPACING.md,
  },
  statCard: {
    flex: 1,
    gap:  SPACING.xs,
  },
  statHeader: {
    marginBottom: SPACING.xs,
  },
  statIcon: {
    width:          36,
    height:         36,
    borderRadius:   RADIUS_VALUE,
    alignItems:     'center',
    justifyContent: 'center',
  },
  statLabel: {
    marginTop: SPACING.xs,
  },
  sectionLabel: {
    marginBottom: SPACING.sm,
    marginTop:    SPACING.xs,
  },
  opsCard: {
    marginBottom: SPACING.md,
  },
  opsRow: {
    flexDirection:  'row',
    alignItems:     'stretch',
    justifyContent: 'space-around',
  },
  opsStat: {
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    flex:            1,
    paddingVertical: SPACING.sm,
  },
  opsIconWrap: {
    width:          52,
    height:         52,
    borderRadius:   RADIUS.lg,
    alignItems:     'center',
    justifyContent: 'center',
    alignSelf:      'center',
  },
  opsSeparador: {
    alignItems:    'center',
    gap:           SPACING.xs,
    width:         40,
  },
  lineaVertical: {
    width:     1,
    flex:      1,
    maxHeight: 24,
  },
  vsCircle: {
    width:          28,
    height:         28,
    borderRadius:   14,
    borderWidth:    1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  progressWrap: {
    gap: SPACING.xs,
  },
  progressBar: {
    height:       8,
    borderRadius: 4,
    overflow:     'hidden',
  },
  progressFill: {
    height:       '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection:  'row',
    justifyContent: 'space-between',
  },
  emptyCard: {
    padding:    SPACING.xl,
    alignItems: 'center',
    gap:        SPACING.md,
    marginTop:  SPACING.sm,
  },
  emptyIconWrap: {
    width:          72,
    height:         72,
    borderRadius:   RADIUS.xl,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   SPACING.sm,
  },
  emptyDesc: {
    marginTop:  SPACING.xs,
    lineHeight: 20,
    maxWidth:   260,
  },
});