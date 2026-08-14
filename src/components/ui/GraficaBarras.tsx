import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { SPACING, FONT_SIZE, RADIUS } from '@/src/constants';

export interface DatosBarra {
  label:      string;
  ganadoras:  number;
  perdedoras: number;
}

interface GraficaBarrasProps {
  datos:   DatosBarra[];
  altura?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GraficaBarras = ({ datos, altura = 200 }: GraficaBarrasProps) => {
  const { colors } = useTema();

  if (datos.length === 0) {
    return (
      <View style={[styles.vacio, { height: altura }]}>
        <AppText variante="caption" color={colors.textMuted} centrado>
          Sin datos para mostrar en este período
        </AppText>
      </View>
    );
  }

  const totalGanadoras  = datos.reduce((s, d) => s + d.ganadoras,  0);
  const totalPerdedoras = datos.reduce((s, d) => s + d.perdedoras, 0);
  const totalOps        = totalGanadoras + totalPerdedoras;

  const datosGrafica = datos.flatMap((d) => [
    {
      value:      d.ganadoras,
      label:      d.label,
      frontColor: colors.win,
      spacing:    4,
      labelTextStyle: {
        color:    colors.textMuted,
        fontSize: FONT_SIZE.xs,
      },
    },
    {
      value:      d.perdedoras,
      frontColor: colors.loss,
      spacing:    datos.length > 5 ? 8 : 14,
    },
  ]);

  return (
    <View style={styles.container}>
      {/* Resumen arriba */}
      <View style={styles.resumenRow}>
        <View style={[styles.resumenItem, { backgroundColor: colors.winSurface }]}>
          <AppText variante="subtitulo" color={colors.win}>
            {totalGanadoras}
          </AppText>
          <AppText variante="label" color={colors.win}>
            GANADORAS
          </AppText>
        </View>
        <View style={[styles.resumenItem, { backgroundColor: colors.lossSurface }]}>
          <AppText variante="subtitulo" color={colors.loss}>
            {totalPerdedoras}
          </AppText>
          <AppText variante="label" color={colors.loss}>
            PERDEDORAS
          </AppText>
        </View>
        <View style={[styles.resumenItem, { backgroundColor: colors.surfaceElevated }]}>
          <AppText variante="subtitulo" color={colors.textPrimary}>
            {totalOps}
          </AppText>
          <AppText variante="label" color={colors.textMuted}>
            TOTAL
          </AppText>
        </View>
      </View>

      <BarChart
        data={datosGrafica}
        width={SCREEN_WIDTH - SPACING.md * 6}
        height={altura}
        barWidth={datos.length > 5 ? 14 : 20}
        xAxisColor={colors.border}
        yAxisColor={colors.border}
        yAxisTextStyle={{
          color:    colors.textMuted,
          fontSize: FONT_SIZE.xs,
        }}
        xAxisLabelTextStyle={{
          color:    colors.textMuted,
          fontSize: FONT_SIZE.xs,
        }}
        rulesColor={colors.border}
        rulesType="dashed"
        dashWidth={4}
        dashGap={8}
        noOfSections={4}
        backgroundColor={colors.surface}
        isAnimated
        animationDuration={600}
        roundedTop
        yAxisLabelWidth={30}
        hideOrigin
      />

      {/* Leyenda */}
      <View style={styles.leyenda}>
        <View style={styles.leyendaItem}>
          <View style={[styles.leyendaDot, { backgroundColor: colors.win }]} />
          <AppText variante="caption" color={colors.textMuted}>Ganadoras</AppText>
        </View>
        <View style={styles.leyendaDot2} />
        <View style={styles.leyendaItem}>
          <View style={[styles.leyendaDot, { backgroundColor: colors.loss }]} />
          <AppText variante="caption" color={colors.textMuted}>Perdedoras</AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  vacio: {
    alignItems:     'center',
    justifyContent: 'center',
    padding:        SPACING.lg,
  },
  resumenRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
  },
  resumenItem: {
    flex:           1,
    alignItems:     'center',
    paddingVertical: SPACING.sm,
    borderRadius:   RADIUS.md,
    gap:            2,
  },
  leyenda: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    gap:            SPACING.md,
    paddingTop:     SPACING.sm,
    borderTopWidth: 1,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
  leyendaDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  leyendaDot2: {
    width:           1,
    height:          16,
    backgroundColor: '#334155',
  },
});