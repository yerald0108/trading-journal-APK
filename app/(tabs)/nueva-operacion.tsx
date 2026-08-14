import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTema } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import { useCapital } from '@/src/hooks';
import { useFadeIn } from '@/src/hooks';
import { Card, AppText, Button, AppInput, Divider } from '@/src/components';
import { SPACING, ICON_SIZE, RADIUS } from '@/src/constants';
import { TipoOperacion } from '@/src/types';

const esquemaOperacion = z.object({
  monto: z
    .string()
    .min(1, 'El monto es requerido')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Ingresa un monto válido mayor a 0'
    ),
  nota: z.string().optional(),
});

type FormData = z.infer<typeof esquemaOperacion>;

export default function NuevaOperacionScreen() {
  const { colors }                       = useTema();
  const { agregarOperacion }             = useOperaciones();
  const { capital }                      = useCapital();
  const [tipoSeleccionado, setTipo]      = useState<TipoOperacion>('win');
  const [guardando, setGuardando]        = useState(false);
  const [exitoso, setExitoso]            = useState(false);

  const { opacidad: opForm, translateY: tyForm } = useFadeIn(350, 0);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(esquemaOperacion),
    defaultValues: { monto: '', nota: '' },
  });

  const montoActual    = watch('monto');
  const montoNumerico  = parseFloat(montoActual) || 0;
  const capitalResultante =
    tipoSeleccionado === 'win'
      ? capital + montoNumerico
      : capital - montoNumerico;

  const onSubmit = async (data: FormData) => {
    setGuardando(true);
    try {
      if (tipoSeleccionado === 'win') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      agregarOperacion({
        tipo:  tipoSeleccionado,
        monto: parseFloat(data.monto),
        nota:  data.nota || undefined,
      });

      setExitoso(true);
      reset();
      setTimeout(() => setExitoso(false), 2000);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la operación. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{
            opacity:   opForm,
            transform: [{ translateY: tyForm }],
          }}>
            {/* Header */}
            <View style={styles.header}>
              <AppText variante="label" color={colors.textMuted}>
                TRADING JOURNAL
              </AppText>
              <AppText variante="subtitulo">Nueva Operación</AppText>
            </View>

            {/* Capital actual */}
            <Card style={styles.capitalCard}>
              <AppText variante="label" color={colors.textMuted}>
                CAPITAL ACTUAL
              </AppText>
              <AppText variante="subtitulo" color={colors.textPrimary}>
                ${capital.toFixed(2)}
              </AppText>
            </Card>

            {/* Selector de tipo */}
            <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
              RESULTADO DE LA OPERACIÓN
            </AppText>

            <View style={styles.tipoRow}>
              <TouchableOpacity
                style={[
                  styles.tipoBtn,
                  {
                    backgroundColor: tipoSeleccionado === 'win'
                      ? colors.winSurface : colors.surface,
                    borderColor: tipoSeleccionado === 'win'
                      ? colors.win : colors.border,
                  },
                ]}
                onPress={() => setTipo('win')}
                activeOpacity={0.7}
              >
                <TrendingUp
                  size={ICON_SIZE.lg}
                  color={tipoSeleccionado === 'win' ? colors.win : colors.textMuted}
                />
                <AppText
                  variante="label"
                  color={tipoSeleccionado === 'win' ? colors.win : colors.textMuted}
                  style={styles.tipoBtnText}
                >
                  GANANCIA
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tipoBtn,
                  {
                    backgroundColor: tipoSeleccionado === 'loss'
                      ? colors.lossSurface : colors.surface,
                    borderColor: tipoSeleccionado === 'loss'
                      ? colors.loss : colors.border,
                  },
                ]}
                onPress={() => setTipo('loss')}
                activeOpacity={0.7}
              >
                <TrendingDown
                  size={ICON_SIZE.lg}
                  color={tipoSeleccionado === 'loss' ? colors.loss : colors.textMuted}
                />
                <AppText
                  variante="label"
                  color={tipoSeleccionado === 'loss' ? colors.loss : colors.textMuted}
                  style={styles.tipoBtnText}
                >
                  PÉRDIDA
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Monto */}
            <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
              MONTO
            </AppText>

            <Controller
              control={control}
              name="monto"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="¿Cuánto ganaste o perdiste?"
                  placeholder="0.00"
                  prefix="$"
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.monto?.message}
                />
              )}
            />

            {/* Preview del resultado */}
            {montoNumerico > 0 && (
              <Card style={[
                styles.previewCard,
                {
                  borderColor: tipoSeleccionado === 'win'
                    ? colors.win : colors.loss,
                },
              ]}>
                <View style={styles.previewRow}>
                  <AppText variante="caption" color={colors.textMuted}>
                    Capital después de esta op.
                  </AppText>
                  <AppText
                    variante="subtitulo"
                    color={tipoSeleccionado === 'win' ? colors.win : colors.loss}
                  >
                    ${capitalResultante.toFixed(2)}
                  </AppText>
                </View>
                <View style={styles.previewRow}>
                  <AppText variante="caption" color={colors.textMuted}>
                    Diferencia
                  </AppText>
                  <AppText
                    variante="caption"
                    color={tipoSeleccionado === 'win' ? colors.win : colors.loss}
                  >
                    {tipoSeleccionado === 'win' ? '+' : '-'}${montoNumerico.toFixed(2)}
                  </AppText>
                </View>
              </Card>
            )}

            {/* Nota opcional */}
            <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
              NOTA (OPCIONAL)
            </AppText>

            <Controller
              control={control}
              name="nota"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  placeholder="Activo, estrategia, observaciones..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                  style={styles.notaInput}
                />
              )}
            />

            <Divider margen={SPACING.lg} />

            {/* Botón guardar */}
            {exitoso ? (
              <View style={[
                styles.exitoContainer,
                {
                  backgroundColor: colors.winSurface,
                  borderColor:     colors.win,
                },
              ]}>
                <CheckCircle size={ICON_SIZE.md} color={colors.win} />
                <AppText
                  variante="label"
                  color={colors.win}
                  style={{ marginLeft: SPACING.sm }}
                >
                  OPERACIÓN GUARDADA
                </AppText>
              </View>
            ) : (
              <Button
                texto={tipoSeleccionado === 'win'
                  ? 'Registrar Ganancia'
                  : 'Registrar Pérdida'
                }
                onPress={handleSubmit(onSubmit)}
                variante={tipoSeleccionado === 'win' ? 'win' : 'loss'}
                cargando={guardando}
                fullWidth
              />
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
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
  capitalCard: {
    marginBottom:   SPACING.lg,
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  sectionLabel: {
    marginBottom: SPACING.sm,
    marginTop:    SPACING.xs,
  },
  tipoRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
    marginBottom:  SPACING.lg,
  },
  tipoBtn: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: SPACING.lg,
    borderRadius:    RADIUS.lg,
    borderWidth:     2,
    gap:             SPACING.sm,
  },
  tipoBtnText: {
    marginTop: SPACING.xs,
  },
  previewCard: {
    marginTop:    SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth:  1.5,
    gap:          SPACING.xs,
  },
  previewRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  notaInput: {
    height:            90,
    textAlignVertical: 'top',
    paddingTop:        SPACING.sm,
  },
  exitoContainer: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius:   RADIUS.md,
    borderWidth:    1.5,
    minHeight:      52,
  },
});