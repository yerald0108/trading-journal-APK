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
import { TrendingUp, TrendingDown, CheckCircle2, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTema } from '@/src/hooks';
import { useOperaciones } from '@/src/hooks';
import { useCapital } from '@/src/hooks';
import { useFadeIn } from '@/src/hooks';
import { AppText, AppInput, Button } from '@/src/components';
import { SPACING, RADIUS } from '@/src/constants';
import { TipoOperacion } from '@/src/types';

const esquema = z.object({
  monto: z
    .string()
    .min(1, 'El monto es requerido')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Ingresa un monto válido mayor a 0'
    ),
  nota: z.string().optional(),
});

type FormData = z.infer<typeof esquema>;

export default function NuevaOperacionScreen() {
  const { colors, isDark }               = useTema();
  const { agregarOperacion }             = useOperaciones();
  const { capital }                      = useCapital();
  const [tipo, setTipo]                  = useState<TipoOperacion>('win');
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
    resolver: zodResolver(esquema),
    defaultValues: { monto: '', nota: '' },
  });

  const montoActual   = watch('monto');
  const montoNum      = parseFloat(montoActual) || 0;
  const capitalFinal  = tipo === 'win' ? capital + montoNum : capital - montoNum;
  const diferencia    = tipo === 'win' ? montoNum : -montoNum;
  const pct           = capital > 0 ? (Math.abs(diferencia) / capital) * 100 : 0;

  const onSubmit = async (data: FormData) => {
    setGuardando(true);
    try {
      await Haptics.notificationAsync(
        tipo === 'win'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );
      agregarOperacion({
        tipo,
        monto: parseFloat(data.monto),
        nota:  data.nota || undefined,
      });
      setExitoso(true);
      reset();
      setTimeout(() => setExitoso(false), 2500);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la operación.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: opForm, transform: [{ translateY: tyForm }] }}>

            {/* ── HEADER ── */}
            <View style={styles.header}>
              <View>
                <AppText variante="label" color={colors.textMuted}>
                  TRADING JOURNAL
                </AppText>
                <AppText variante="subtitulo" color={colors.textPrimary}>
                  Nueva Operación
                </AppText>
              </View>
              <View style={[styles.iconWrap, { backgroundColor: colors.primarySurface }]}>
                <Sparkles size={20} color={colors.primary} />
              </View>
            </View>

            {/* ── CARD CAPITAL ACTUAL ── */}
            <View style={[styles.capitalCard, {
              backgroundColor: colors.surface,
              borderColor:     colors.border,
            }]}>
              <AppText variante="label" color={colors.textMuted}>
                CAPITAL ACTUAL
              </AppText>
              <AppText variante="subtitulo" color={colors.textPrimary}>
                ${capital.toFixed(2)}
              </AppText>
            </View>

            {/* ── SELECTOR TIPO ── */}
            <AppText variante="label" color={colors.textMuted} style={styles.sectionLabel}>
              RESULTADO
            </AppText>

            <View style={styles.tipoRow}>
              {/* GANANCIA */}
              <TouchableOpacity
                style={[styles.tipoBtn, {
                  borderColor: tipo === 'win' ? colors.win : colors.border,
                  backgroundColor: tipo === 'win'
                    ? colors.winSurface
                    : colors.surface,
                }]}
                onPress={() => setTipo('win')}
                activeOpacity={0.75}
              >
                {tipo === 'win' && (
                  <LinearGradient
                    colors={['rgba(45,212,160,0.08)', 'transparent']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                )}
                <View style={[styles.tipoBtnIcon, {
                  backgroundColor: tipo === 'win'
                    ? 'rgba(45,212,160,0.20)'
                    : colors.surfaceElevated,
                }]}>
                  <TrendingUp
                    size={22}
                    color={tipo === 'win' ? colors.win : colors.textMuted}
                  />
                </View>
                <AppText
                  variante="label"
                  color={tipo === 'win' ? colors.win : colors.textMuted}
                >
                  GANANCIA
                </AppText>
              </TouchableOpacity>

              {/* PÉRDIDA */}
              <TouchableOpacity
                style={[styles.tipoBtn, {
                  borderColor: tipo === 'loss' ? colors.loss : colors.border,
                  backgroundColor: tipo === 'loss'
                    ? colors.lossSurface
                    : colors.surface,
                }]}
                onPress={() => setTipo('loss')}
                activeOpacity={0.75}
              >
                {tipo === 'loss' && (
                  <LinearGradient
                    colors={['rgba(240,98,146,0.08)', 'transparent']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                )}
                <View style={[styles.tipoBtnIcon, {
                  backgroundColor: tipo === 'loss'
                    ? 'rgba(240,98,146,0.20)'
                    : colors.surfaceElevated,
                }]}>
                  <TrendingDown
                    size={22}
                    color={tipo === 'loss' ? colors.loss : colors.textMuted}
                  />
                </View>
                <AppText
                  variante="label"
                  color={tipo === 'loss' ? colors.loss : colors.textMuted}
                >
                  PÉRDIDA
                </AppText>
              </TouchableOpacity>
            </View>

            {/* ── MONTO ── */}
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

            {/* ── PREVIEW RESULTADO ── */}
            {montoNum > 0 && (
              <View style={[styles.previewCard, {
                backgroundColor: colors.surface,
                borderColor:     tipo === 'win' ? colors.win : colors.loss,
              }]}>
                {/* Fila capital final */}
                <View style={styles.previewRow}>
                  <AppText variante="caption" color={colors.textMuted}>
                    Capital después
                  </AppText>
                  <AppText
                    variante="subtitulo"
                    color={tipo === 'win' ? colors.win : colors.loss}
                  >
                    ${capitalFinal.toFixed(2)}
                  </AppText>
                </View>

                {/* Divisor */}
                <View style={[styles.previewDivider, { backgroundColor: colors.border }]} />

                {/* Fila diferencia y % */}
                <View style={styles.previewRow}>
                  <AppText variante="caption" color={colors.textMuted}>
                    Diferencia
                  </AppText>
                  <View style={styles.previewRight}>
                    <AppText
                      variante="caption"
                      color={tipo === 'win' ? colors.win : colors.loss}
                    >
                      {tipo === 'win' ? '+' : '-'}${montoNum.toFixed(2)}
                    </AppText>
                    <View style={[styles.pctBadge, {
                      backgroundColor: tipo === 'win'
                        ? colors.winSurface
                        : colors.lossSurface,
                    }]}>
                      <AppText
                        variante="label"
                        color={tipo === 'win' ? colors.win : colors.loss}
                      >
                        {pct.toFixed(1)}%
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* ── NOTA ── */}
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

            {/* ── BOTÓN GUARDAR ── */}
            <View style={styles.btnWrap}>
              {exitoso ? (
                <View style={[styles.exitoCard, {
                  backgroundColor: colors.winSurface,
                  borderColor:     colors.win,
                }]}>
                  <CheckCircle2 size={20} color={colors.win} />
                  <AppText variante="label" color={colors.win}>
                    OPERACIÓN GUARDADA
                  </AppText>
                </View>
              ) : (
                <Button
                  texto={tipo === 'win' ? 'Registrar Ganancia' : 'Registrar Pérdida'}
                  onPress={handleSubmit(onSubmit)}
                  variante={tipo === 'win' ? 'win' : 'loss'}
                  cargando={guardando}
                  fullWidth
                />
              )}
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  flex:    { flex: 1 },
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
  iconWrap: {
    width:          42,
    height:         42,
    borderRadius:   14,
    alignItems:     'center',
    justifyContent: 'center',
  },

  capitalCard: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    borderRadius:   16,
    borderWidth:    0.5,
    padding:        SPACING.md,
    marginBottom:   SPACING.lg,
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
    borderRadius:    18,
    borderWidth:     1.5,
    gap:             SPACING.sm,
    overflow:        'hidden',
  },
  tipoBtnIcon: {
    width:          48,
    height:         48,
    borderRadius:   14,
    alignItems:     'center',
    justifyContent: 'center',
  },

  previewCard: {
    borderRadius:  14,
    borderWidth:   1.5,
    padding:       SPACING.md,
    marginTop:     SPACING.sm,
    marginBottom:  SPACING.md,
    gap:           SPACING.sm,
  },
  previewRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  previewRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
  previewDivider: {
    height: 0.5,
  },
  pctBadge: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      6,
  },

  notaInput: {
    height:            90,
    textAlignVertical: 'top',
    paddingTop:        SPACING.sm,
  },

  btnWrap: {
    marginTop: SPACING.lg,
  },
  exitoCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius:    14,
    borderWidth:     1.5,
  },
});