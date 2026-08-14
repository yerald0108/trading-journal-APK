import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { SPACING, FONT_SIZE, RADIUS } from '@/src/constants';
import { PuntoCapital } from '@/src/types';

interface GraficaLineaProps {
  datos:   PuntoCapital[];
  altura?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GraficaLinea = ({ datos, altura = 220 }: GraficaLineaProps) => {
  const { colors, isDark } = useTema();

  if (datos.length < 2) {
    return (
      <View style={[styles.vacio, { height: altura }]}>
        <View style={[styles.vacioIconWrap, { backgroundColor: colors.surfaceElevated }]}>
          <AppText variante="subtitulo" color={colors.textMuted} centrado>
            ~
          </AppText>
        </View>
        <AppText variante="caption" color={colors.textMuted} centrado>
          Necesitas al menos 2 operaciones{'\n'}para ver la curva de capital
        </AppText>
      </View>
    );
  }

  const valores          = datos.map(p => p.capital);
  const minValor         = Math.min(...valores);
  const maxValor         = Math.max(...valores);
  const rango            = maxValor - minValor;
  const tendenciaPositiva = datos[datos.length - 1].capital >= datos[0].capital;
  const colorLinea       = tendenciaPositiva ? colors.win : colors.loss;
  const colorFondo       = tendenciaPositiva ? colors.winSurface : colors.lossSurface;

  const datosGrafica = datos.map((punto, index) => ({
    value:           punto.capital,
    hideDataPoint:   datos.length > 15 && index !== 0 && index !== datos.length - 1,
    customDataPoint: () => null,
  }));

  const paddingVertical = rango === 0 ? 20 : 0;
  const maxConPadding   = maxValor + (rango === 0 ? 10 : rango * 0.15);
  const minConPadding   = minValor - (rango === 0 ? 10 : rango * 0.15);

  return (
    <View style={styles.container}>
      {/* Indicador de tendencia */}
      <View style={styles.tendenciaRow}>
        <View style={[
          styles.tendenciaBadge,
          { backgroundColor: tendenciaPositiva ? colors.winSurface : colors.lossSurface },
        ]}>
          <AppText
            variante="label"
            color={tendenciaPositiva ? colors.win : colors.loss}
          >
            {tendenciaPositiva ? 'TENDENCIA ALCISTA' : 'TENDENCIA BAJISTA'}
          </AppText>
        </View>
        <AppText variante="caption" color={colors.textMuted}>
          {datos.length} puntos
        </AppText>
      </View>

      <LineChart
        data={datosGrafica}
        width={SCREEN_WIDTH - SPACING.md * 6}
        height={altura}
        color={colorLinea}
        thickness={2.5}
        startFillColor={colorLinea}
        endFillColor={colors.surface}
        startOpacity={isDark ? 0.3 : 0.2}
        endOpacity={0.01}
        areaChart
        curved
        dataPointsColor={colorLinea}
        dataPointsRadius={5}
        dataPointsWidth={2}
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
        backgroundColor={colors.surface}
        maxValue={maxConPadding}
        mostNegativeValue={minConPadding}
        noOfSections={4}
        yAxisLabelPrefix="$"
        isAnimated
        animationDuration={800}
        hideOrigin
        yAxisLabelWidth={55}
      />

      {/* Mínimo y máximo */}
      <View style={styles.rangoRow}>
        <View style={styles.rangoItem}>
          <AppText variante="label" color={colors.textMuted}>MÍN.</AppText>
          <AppText variante="caption" color={colors.loss}>
            ${minValor.toFixed(2)}
          </AppText>
        </View>
        <View style={styles.rangoItem}>
          <AppText variante="label" color={colors.textMuted}>MÁX.</AppText>
          <AppText variante="caption" color={colors.win}>
            ${maxValor.toFixed(2)}
          </AppText>
        </View>
        <View style={styles.rangoItem}>
          <AppText variante="label" color={colors.textMuted}>ACTUAL</AppText>
          <AppText
            variante="caption"
            color={tendenciaPositiva ? colors.win : colors.loss}
          >
            ${datos[datos.length - 1].capital.toFixed(2)}
          </AppText>
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
    gap:            SPACING.md,
    padding:        SPACING.lg,
  },
  vacioIconWrap: {
    width:          56,
    height:         56,
    borderRadius:   RADIUS.xl,
    alignItems:     'center',
    justifyContent: 'center',
  },
  tendenciaRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingHorizontal: SPACING.xs,
  },
  tendenciaBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical:   4,
    borderRadius:      RADIUS.full,
  },
  rangoRow: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    paddingTop:     SPACING.sm,
    borderTopWidth: 1,
  },
  rangoItem: {
    alignItems: 'center',
    gap:        2,
  },
});