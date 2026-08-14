import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TrendingUp, TrendingDown, Trash2, FileText } from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { Badge } from './Badge';
import { SPACING, ICON_SIZE, RADIUS } from '@/src/constants';
import { Operacion } from '@/src/types';

interface ItemOperacionProps {
  operacion:  Operacion;
  onEliminar: (id: number) => void;
}

const formatearFecha = (isoString: string): string => {
  const fecha = new Date(isoString);
  return fecha.toLocaleDateString('es-ES', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
  });
};

const formatearHora = (isoString: string): string => {
  const fecha = new Date(isoString);
  return fecha.toLocaleTimeString('es-ES', {
    hour:   '2-digit',
    minute: '2-digit',
  });
};

export const ItemOperacion = ({ operacion, onEliminar }: ItemOperacionProps) => {
  const { colors } = useTema();

  const esGanadora = operacion.tipo === 'win';

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderColor:     colors.border,
        borderLeftColor: esGanadora ? colors.win : colors.loss,
      },
    ]}>
      {/* Icono y tipo */}
      <View style={[
        styles.iconContainer,
        { backgroundColor: esGanadora ? colors.winSurface : colors.lossSurface },
      ]}>
        {esGanadora
          ? <TrendingUp size={ICON_SIZE.md} color={colors.win} />
          : <TrendingDown size={ICON_SIZE.md} color={colors.loss} />
        }
      </View>

      {/* Información */}
      <View style={styles.info}>
        <View style={styles.infoTop}>
          <Badge
            variante={esGanadora ? 'win' : 'loss'}
            texto={esGanadora ? 'GANANCIA' : 'PÉRDIDA'}
          />
          <AppText variante="caption" color={colors.textMuted}>
            {formatearHora(operacion.fecha)}
          </AppText>
        </View>

        <AppText
          variante="subtitulo"
          color={esGanadora ? colors.win : colors.loss}
          style={styles.monto}
        >
          {esGanadora ? '+' : '-'}${operacion.monto.toFixed(2)}
        </AppText>

        {operacion.nota && (
          <View style={styles.notaRow}>
            <FileText size={ICON_SIZE.sm} color={colors.textMuted} />
            <AppText
              variante="caption"
              color={colors.textMuted}
              style={styles.nota}
            >
              {operacion.nota}
            </AppText>
          </View>
        )}

        <AppText variante="caption" color={colors.textMuted}>
          {formatearFecha(operacion.fecha)}
        </AppText>
      </View>

      {/* Botón eliminar */}
      <TouchableOpacity
        style={[styles.deleteBtn, { backgroundColor: colors.surfaceElevated }]}
        onPress={() => onEliminar(operacion.id)}
        activeOpacity={0.7}
      >
        <Trash2 size={ICON_SIZE.sm} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    borderRadius:   RADIUS.md,
    borderWidth:    1,
    borderLeftWidth: 4,
    padding:        SPACING.md,
    gap:            SPACING.md,
    marginBottom:   SPACING.sm,
  },
  iconContainer: {
    width:          44,
    height:         44,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap:  SPACING.xs,
  },
  infoTop: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  monto: {
    marginVertical: SPACING.xs / 2,
  },
  notaRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
  nota: {
    flex: 1,
  },
  deleteBtn: {
    width:          36,
    height:         36,
    borderRadius:   RADIUS.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
});