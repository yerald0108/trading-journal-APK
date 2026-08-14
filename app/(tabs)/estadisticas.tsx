import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTema } from '@/src/hooks';
import { useEstadisticas } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import {
  AppText,
  Card,
  FiltroTab,
  GraficaLinea,
  GraficaBarras,
  TarjetaEstadistica,
  Divider,
} from '@/src/components';
import { SPACING } from '@/src/constants';
import { PeriodoEstadisticas } from '@/src/types';
import { calcularDatosBarras } from '@/src/services';

export default function EstadisticasScreen() {
  const { colors } = useTema();
  const [periodo, setPeriodo] = useState<PeriodoEstadisticas>('semana');
  const { resumen, curvaCapital, operacionesFiltradas } = useEstadisticas(periodo);
  const { operaciones } = useOperaciones();
  const datosBarras = calcularDatosBarras(operacionesFiltradas, periodo);

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
          <AppText variante="subtitulo">Estadísticas</AppText>
        </View>

        {/* Filtro */}
        <FiltroTab periodoActivo={periodo} onChange={setPeriodo} />

        {/* Tarjetas resumen */}
        <View style={styles.tarjetasRow}>
          <TarjetaEstadistica
            label="TASA DE ÉXITO"
            valor={`${resumen.tasaExito.toFixed(1)}%`}
            subvalor={`${resumen.operacionesGanadoras}W / ${resumen.operacionesPerdedoras}L`}
            colorValor={
              resumen.tasaExito >= 60 ? colors.win :
              resumen.tasaExito >= 40 ? colors.warning :
              colors.loss
            }
          />
          <TarjetaEstadistica
            label="GANANCIA NETA"
            valor={`${resumen.gananciaNeta >= 0 ? '+' : ''}$${resumen.gananciaNeta.toFixed(2)}`}
            subvalor={`${resumen.totalOperaciones} operaciones`}
            colorValor={resumen.gananciaNeta >= 0 ? colors.win : colors.loss}
          />
        </View>

        <View style={styles.tarjetasRow}>
          <TarjetaEstadistica
            label="MEJOR OP."
            valor={`+$${resumen.mejorOperacion.toFixed(2)}`}
            colorValor={colors.win}
          />
          <TarjetaEstadistica
            label="PEOR OP."
            valor={`-$${resumen.peorOperacion.toFixed(2)}`}
            colorValor={colors.loss}
          />
        </View>

        <Divider margen={SPACING.lg} />

        {/* Curva de capital */}
        <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
          CURVA DE CAPITAL
        </AppText>

        <Card style={styles.graficaCard}>
          <GraficaLinea datos={curvaCapital} altura={200} />
        </Card>

        <Divider margen={SPACING.lg} />

        {/* Gráfica de barras */}
        <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
          OPERACIONES POR PERÍODO
        </AppText>

        <Card style={styles.graficaCard}>
          <GraficaBarras datos={datosBarras} altura={200} />
        </Card>

        <Divider margen={SPACING.lg} />

        {/* Desglose financiero */}
        <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
          DESGLOSE FINANCIERO
        </AppText>

        <Card style={styles.desgloseCard}>
          <View style={styles.desgloseRow}>
            <AppText variante="caption" color={colors.textMuted}>
              Ganancia bruta
            </AppText>
            <AppText variante="cuerpo" color={colors.win}>
              +${resumen.gananciaBruta.toFixed(2)}
            </AppText>
          </View>

          <Divider margen={SPACING.sm} />

          <View style={styles.desgloseRow}>
            <AppText variante="caption" color={colors.textMuted}>
              Pérdida bruta
            </AppText>
            <AppText variante="cuerpo" color={colors.loss}>
              -${resumen.perdidaBruta.toFixed(2)}
            </AppText>
          </View>

          <Divider margen={SPACING.sm} />

          <View style={styles.desgloseRow}>
            <AppText variante="cuerpo" color={colors.textPrimary}>
              Resultado neto
            </AppText>
            <AppText
              variante="subtitulo"
              color={resumen.gananciaNeta >= 0 ? colors.win : colors.loss}
            >
              {resumen.gananciaNeta >= 0 ? '+' : ''}
              ${resumen.gananciaNeta.toFixed(2)}
            </AppText>
          </View>
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
  tarjetasRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
    marginTop:     SPACING.md,
  },
  sectionLabel: {
    marginBottom: SPACING.sm,
  },
  graficaCard: {
    padding: SPACING.sm,
  },
  desgloseCard: {
    gap: SPACING.xs,
  },
  desgloseRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
});