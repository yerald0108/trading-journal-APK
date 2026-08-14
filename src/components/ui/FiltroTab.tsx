import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { SPACING, RADIUS } from '@/src/constants';
import { PeriodoEstadisticas } from '@/src/types';

interface FiltroTabProps {
  periodoActivo: PeriodoEstadisticas;
  onChange:      (periodo: PeriodoEstadisticas) => void;
}

const FILTROS: { label: string; valor: PeriodoEstadisticas }[] = [
  { label: 'Hoy',    valor: 'dia'    },
  { label: 'Semana', valor: 'semana' },
  { label: 'Mes',    valor: 'mes'    },
  { label: 'Año',    valor: 'anio'   },
];

export const FiltroTab = ({ periodoActivo, onChange }: FiltroTabProps) => {
  const { colors } = useTema();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {FILTROS.map((filtro) => {
        const activo = filtro.valor === periodoActivo;
        return (
          <TouchableOpacity
            key={filtro.valor}
            style={[
              styles.tab,
              activo && { backgroundColor: colors.primary },
            ]}
            onPress={() => onChange(filtro.valor)}
            activeOpacity={0.7}
          >
            <AppText
              variante="label"
              color={activo ? colors.white : colors.textMuted}
            >
              {filtro.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius:  RADIUS.md,
    borderWidth:   1,
    padding:       SPACING.xs / 2,
    gap:           SPACING.xs / 2,
  },
  tab: {
    flex:           1,
    paddingVertical: SPACING.sm,
    borderRadius:   RADIUS.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
});