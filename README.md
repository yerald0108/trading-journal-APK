# Trading Journal — Documentación Completa

> Aplicación móvil para el registro y análisis de operativa en opciones binarias. Desarrollada con Expo + React Native, base de datos local SQLite, estado global con Zustand y UI adaptable a modo oscuro/claro.

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Base de Datos](#base-de-datos)
7. [Sistema de Temas](#sistema-de-temas)
8. [Estado Global — Zustand](#estado-global--zustand)
9. [Servicios y Lógica de Negocio](#servicios-y-lógica-de-negocio)
10. [Hooks Personalizados](#hooks-personalizados)
11. [Componentes](#componentes)
12. [Pantallas](#pantallas)
13. [Navegación](#navegación)
14. [Animaciones](#animaciones)
15. [Convenciones y Reglas del Proyecto](#convenciones-y-reglas-del-proyecto)
16. [Cómo Escalar la Aplicación](#cómo-escalar-la-aplicación)
17. [Build y Distribución](#build-y-distribución)

---

## Descripción General

Trading Journal es una aplicación móvil diseñada para traders de opciones binarias que necesitan llevar un registro preciso de su operativa. Permite registrar operaciones ganadoras y perdedoras, visualizar estadísticas en tiempo real y analizar el rendimiento por diferentes períodos de tiempo.

### Funcionalidades principales

- Registro de operaciones (ganancia o pérdida) con monto y nota opcional
- Capital actualizado en tiempo real tras cada operación
- Dashboard con resumen diario, tasa de éxito y curva de capital
- Historial filtrable por día, semana, mes y año
- Estadísticas detalladas con gráficos de línea y barras
- Pantalla de ajustes con edición de capital inicial y reset total
- Modo oscuro y modo claro con switch instantáneo
- Feedback háptico al registrar operaciones
- Animaciones de entrada en todas las pantallas
- Persistencia local sin necesidad de internet ni cuenta

---

## Stack Tecnológico

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `expo` | ~54.0.35 | Plataforma base de desarrollo |
| `expo-router` | ~6.0.24 | Navegación basada en archivos |
| `expo-sqlite` | ~16.0.10 | Base de datos local en el dispositivo |
| `expo-linear-gradient` | SDK 54 | Gradientes en componentes visuales |
| `expo-haptics` | SDK 54 | Feedback háptico al registrar operaciones |
| `zustand` | ^5.0.14 | Estado global de la aplicación |
| `react-hook-form` | ^7.54.0 | Manejo de formularios con validación |
| `zod` | ^3.24.0 | Validación de datos con esquemas |
| `@hookform/resolvers` | ^3.9.0 | Conecta Zod con React Hook Form |
| `react-native-safe-area-context` | ~5.6.0 | Respeto de bordes seguros del dispositivo |
| `react-native-screens` | ~4.16.0 | Optimización de pantallas nativas |
| `react-native-gifted-charts` | latest | Gráficos de línea y barras |
| `react-native-svg` | 15.12.1 | Requerido por lucide-react-native |
| `lucide-react-native` | latest | Iconos profesionales SVG |
| `react-native-linear-gradient` | latest | Soporte de gradientes nativos |

---

## Arquitectura del Proyecto

El proyecto sigue una **arquitectura en capas** inspirada en Clean Architecture, adaptada al contexto de React Native:

```
UI (Pantallas y Componentes)
        ↓
Hooks personalizados
        ↓
Store (Zustand — estado global)
        ↓
Services (lógica de negocio pura)
        ↓
Database (repositorios SQLite)
        ↓
SQLite (persistencia local)
```

### Principios aplicados

**Separación de responsabilidades:** Ningún componente de UI toca directamente la base de datos. La cadena es siempre: Componente → Hook → Store → Service/Database.

**Un archivo por responsabilidad:** Cada archivo tiene una única razón de existir. Los repositorios solo hacen queries, los servicios solo calculan, los stores solo manejan estado.

**Barrel exports:** Cada carpeta tiene un `index.ts` que reexporta todo su contenido. Las importaciones siempre se hacen desde el barrel, nunca desde el archivo individual.

**TypeScript estricto:** Todo el proyecto usa tipado estricto. Interfaces y tipos centralizados en `src/types/`. Nada de `any`.

**Alias de rutas:** Se usa el alias `@/` para importar desde la raíz del proyecto. Evita rutas relativas largas como `../../../components`.

---

## Estructura de Carpetas

```
trading-journal/
├── app/                          # Rutas y pantallas (expo-router)
│   ├── (tabs)/                   # Grupo de navegación con tabs
│   │   ├── _layout.tsx           # Configuración de la barra de tabs
│   │   ├── index.tsx             # Dashboard principal
│   │   ├── nueva-operacion.tsx   # Formulario de registro
│   │   ├── historial.tsx         # Lista de operaciones
│   │   ├── estadisticas.tsx      # Gráficos y estadísticas
│   │   └── ajustes.tsx           # Configuración de la app
│   └── _layout.tsx               # Layout raíz: inicializa DB y estado
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes base de UI
│   │   │   ├── AppInput.tsx      # Input con label, prefix y error
│   │   │   ├── AppText.tsx       # Texto con variantes tipográficas
│   │   │   ├── AnimatedCard.tsx  # Card con animación de entrada y press
│   │   │   ├── Badge.tsx         # Etiqueta de color (win/loss/neutral)
│   │   │   ├── Button.tsx        # Botón con variantes y estado de carga
│   │   │   ├── CapitalAnimado.tsx# Número de capital con animación
│   │   │   ├── Card.tsx          # Contenedor con borde y fondo de tema
│   │   │   ├── Divider.tsx       # Línea separadora horizontal
│   │   │   ├── FilaInfo.tsx      # Fila de información con icono y valor
│   │   │   ├── FiltroTab.tsx     # Tabs de filtro (Hoy/Semana/Mes/Año)
│   │   │   ├── GradientCard.tsx  # Card con fondo de gradiente lineal
│   │   │   ├── GraficaBarras.tsx # Gráfico de barras agrupadas
│   │   │   ├── GraficaLinea.tsx  # Gráfico de línea con área
│   │   │   ├── ItemOperacion.tsx # Ítem de lista de operación individual
│   │   │   ├── SwitchRow.tsx     # Fila con switch toggle
│   │   │   ├── TarjetaEstadistica.tsx # Card de estadística con label y valor
│   │   │   └── index.ts          # Barrel de componentes UI
│   │   └── index.ts              # Barrel raíz de componentes
│   ├── constants/                # Valores fijos del proyecto
│   │   ├── colors.ts             # Paletas de colores dark y light
│   │   ├── spacing.ts            # Espaciados, radios y tamaños de iconos
│   │   ├── typography.ts         # Tamaños y pesos de fuente
│   │   └── index.ts             # Barrel de constantes
│   ├── database/                 # Capa de acceso a datos SQLite
│   │   ├── schema.ts             # Inicialización de tablas y migraciones
│   │   ├── configuracion.repository.ts # Queries de capital inicial
│   │   ├── operaciones.repository.ts   # Queries CRUD de operaciones
│   │   └── index.ts              # Barrel de database
│   ├── hooks/                    # Custom hooks de React
│   │   ├── useAnimaciones.ts     # Hooks de animación reutilizables
│   │   ├── useCapital.ts         # Acceso al capital desde el store
│   │   ├── useEstadisticas.ts    # Cálculo de estadísticas por período
│   │   ├── useOperaciones.ts     # CRUD de operaciones desde el store
│   │   ├── useTema.ts            # Acceso al tema activo
│   │   └── index.ts              # Barrel de hooks
│   ├── services/                 # Lógica de negocio pura (sin efectos)
│   │   ├── capital.service.ts    # Cálculo del capital actual
│   │   ├── estadisticas.service.ts # Cálculo de resúmenes y gráficos
│   │   └── index.ts              # Barrel de services
│   ├── store/                    # Estado global con Zustand
│   │   ├── capital.store.ts      # Estado del capital
│   │   ├── operaciones.store.ts  # Estado de las operaciones
│   │   ├── tema.store.ts         # Estado del tema dark/light
│   │   └── index.ts              # Barrel de stores
│   ├── theme/                    # Sistema de temas
│   │   ├── dark.ts               # Objeto del tema oscuro
│   │   ├── light.ts              # Objeto del tema claro
│   │   ├── types.ts              # Tipos del sistema de temas
│   │   └── index.ts              # Barrel de temas
│   └── types/                    # Tipos e interfaces globales
│       ├── operacion.types.ts    # Tipos de operación
│       ├── estadisticas.types.ts # Tipos de estadísticas
│       └── index.ts              # Barrel de tipos
├── assets/
│   └── icon.png                  # Icono de la app
├── .npmrc                        # Configuración de npm (legacy-peer-deps)
├── app.json                      # Configuración de Expo
├── package.json                  # Dependencias y scripts
└── tsconfig.json                 # Configuración de TypeScript
```

---

## Instalación y Configuración

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Expo Go instalado en el dispositivo físico, o emulador Android/iOS configurado
- En Windows: PowerShell o CMD

### Pasos de instalación

**1. Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd trading-journal
```

**2. Instalar dependencias**
```bash
npm install
```

> El archivo `.npmrc` en la raíz ya incluye `legacy-peer-deps=true` para resolver conflictos de versiones entre paquetes de Expo.

**3. Iniciar el servidor de desarrollo**
```bash
npx expo start
```

**4. Abrir en el dispositivo**

Escanea el código QR con Expo Go (Android) o la app de Cámara (iOS), o presiona `a` para abrir el emulador Android.

### Archivos de configuración clave

**`.npmrc`**
```
legacy-peer-deps=true
```
Necesario porque `expo-router` tiene conflictos de versión de `react-dom` con npm. Este flag permite instalar sin errores.

**`tsconfig.json`**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
El alias `@/` permite importar desde la raíz sin rutas relativas.

**`package.json`** — entrada principal
```json
"main": "expo-router/entry"
```

**`app.json`** — configuración de Expo
```json
{
  "expo": {
    "scheme": "trading-journal",
    "plugins": ["expo-router", "expo-sqlite"],
    "experiments": { "typedRoutes": true }
  }
}
```

---

## Base de Datos

La app usa **SQLite local** a través de `expo-sqlite`. No requiere internet ni servidor. Los datos persisten en el dispositivo del usuario.

### Tablas

**`configuracion`** — una sola fila, siempre el id 1
```sql
CREATE TABLE IF NOT EXISTS configuracion (
  id               INTEGER PRIMARY KEY NOT NULL DEFAULT 1,
  capital_inicial  REAL    NOT NULL DEFAULT 0,
  creado_en        TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

**`operaciones`** — una fila por operación registrada
```sql
CREATE TABLE IF NOT EXISTS operaciones (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo  TEXT NOT NULL CHECK(tipo IN ('win', 'loss')),
  monto REAL NOT NULL CHECK(monto > 0),
  fecha TEXT NOT NULL DEFAULT (datetime('now')),
  nota  TEXT
);
```

### Decisión de diseño importante

El capital actual **no se guarda en SQLite**. Solo se guarda el `capital_inicial`. El capital actual se calcula siempre en tiempo real:

```
capital_actual = capital_inicial + suma(wins) - suma(losses)
```

Esto elimina cualquier posibilidad de desincronía entre el capital guardado y las operaciones registradas.

### Migraciones

El archivo `src/database/schema.ts` incluye lógica de migración automática. Si la tabla `configuracion` tiene la columna `capital` (esquema viejo) en lugar de `capital_inicial` (esquema nuevo), la migración la agrega y copia los datos:

```typescript
const columnas = db.getAllSync<{ name: string }>(`PRAGMA table_info(configuracion)`);
const tieneCapital        = columnas.some(c => c.name === 'capital');
const tieneCapitalInicial = columnas.some(c => c.name === 'capital_inicial');

if (tieneCapital && !tieneCapitalInicial) {
  db.execSync(`
    ALTER TABLE configuracion ADD COLUMN capital_inicial REAL NOT NULL DEFAULT 0;
    UPDATE configuracion SET capital_inicial = capital WHERE id = 1;
  `);
}
```

### Para agregar nuevas tablas

1. Agrega el `CREATE TABLE IF NOT EXISTS` en `src/database/schema.ts`
2. Crea un nuevo archivo `src/database/<nombre>.repository.ts` con las queries
3. Expórtalo en `src/database/index.ts`

---

## Sistema de Temas

El sistema de temas permite cambiar entre modo oscuro y claro en tiempo real sin recargar la app.

### Estructura

```
src/constants/colors.ts   → Define COLORS_DARK y COLORS_LIGHT
src/theme/types.ts        → Define los tipos Tema y TemaNombre
src/theme/dark.ts         → Exporta temaDark usando COLORS_DARK
src/theme/light.ts        → Exporta temaLight usando COLORS_LIGHT
src/store/tema.store.ts   → Zustand store con toggleTema y setTema
src/hooks/useTema.ts      → Hook que expone colors, isDark, toggleTema
```

### Cómo usar el tema en un componente

```typescript
import { useTema } from '@/src/hooks';

const MiComponente = () => {
  const { colors, isDark, toggleTema } = useTema();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.textPrimary }}>Hola</Text>
    </View>
  );
};
```

### Cómo agregar un nuevo color al tema

1. Agrega la clave en `COLORS_DARK` en `src/constants/colors.ts`
2. Agrega el mismo nombre con valor diferente en `COLORS_LIGHT`
3. TypeScript automáticamente lo exigirá en ambos objetos gracias al tipo `ColorScheme`

---

## Estado Global — Zustand

Se usan tres stores independientes que se comunican entre sí cuando es necesario.

### `tema.store.ts`

Maneja el tema activo de la app.

```typescript
interface TemaState {
  tema:       Tema;
  toggleTema: () => void;
  setTema:    (nombre: TemaNombre) => void;
}
```

### `capital.store.ts`

Maneja el capital calculado en memoria.

```typescript
interface CapitalState {
  capital:             number;   // capital actual calculado
  capitalInicial:      number;   // capital base persistido en SQLite
  capitalInicializado: boolean;  // flag para saber si ya se cargó
  cargarCapital:       () => void;
  establecerCapital:   (monto: number) => void;
}
```

### `operaciones.store.ts`

Maneja la lista de operaciones y sincroniza el capital al mutar.

```typescript
interface OperacionesState {
  operaciones:       Operacion[];
  cargando:          boolean;
  cargarOperaciones: () => void;
  agregarOperacion:  (input: NuevaOperacionInput) => void;
  eliminarOperacion: (id: number) => void;
}
```

### Sincronización entre stores

Cuando se agrega o elimina una operación, `operaciones.store.ts` actualiza directamente el `capital.store.ts` usando `useCapitalStore.setState()`. Esto garantiza que el capital se actualice en toda la app en tiempo real sin necesidad de recargar ni de efectos adicionales:

```typescript
agregarOperacion: (input) => {
  const nueva       = insertarOperacion(input);
  const operaciones = [nueva, ...get().operaciones];
  const capitalInicial = obtenerCapitalInicial();
  const nuevoCapital   = calcularCapitalActual(capitalInicial, operaciones);

  // Actualiza el capital store directamente
  useCapitalStore.setState({ capital: nuevoCapital });
  set({ operaciones });
},
```

---

## Servicios y Lógica de Negocio

Los servicios son funciones puras que no tienen efectos secundarios. Reciben datos y devuelven resultados calculados. No tocan la base de datos ni el estado global.

### `capital.service.ts`

```typescript
// Calcula el capital actual sumando/restando todas las operaciones
calcularCapitalActual(capitalInicial: number, operaciones: Operacion[]): number

// Calcula la ganancia neta de un conjunto de operaciones
calcularGananciaNeta(operaciones: Operacion[]): number
```

### `estadisticas.service.ts`

```typescript
// Calcula el resumen estadístico de un conjunto de operaciones
calcularResumen(operaciones: Operacion[]): ResumenEstadisticas

// Calcula los puntos de la curva de capital en el tiempo
calcularCurvaCapital(capitalInicial: number, operaciones: Operacion[]): PuntoCapital[]

// Agrupa operaciones por período para el gráfico de barras
calcularDatosBarras(operaciones: Operacion[], periodo: PeriodoEstadisticas): DatosBarra[]
```

### `ResumenEstadisticas`

```typescript
interface ResumenEstadisticas {
  totalOperaciones:      number;
  operacionesGanadoras:  number;
  operacionesPerdedoras: number;
  tasaExito:             number;  // 0-100
  gananciaNeta:          number;  // puede ser negativa
  gananciaBruta:         number;  // solo suma de wins
  perdidaBruta:          number;  // solo suma de losses
  mejorOperacion:        number;
  peorOperacion:         number;
}
```

---

## Hooks Personalizados

Los hooks encapsulan la conexión entre los componentes y el estado/servicios.

### `useTema()`
Expone el tema activo. Úsalo en cualquier componente que necesite colores.
```typescript
const { colors, isDark, nombre, toggleTema, setTema } = useTema();
```

### `useCapital()`
Carga el capital al montar y lo expone.
```typescript
const { capital, capitalInicializado, establecerCapital } = useCapital();
```

### `useOperaciones()`
Carga las operaciones al montar y expone las acciones CRUD.
```typescript
const { operaciones, cargando, agregarOperacion, eliminarOperacion } = useOperaciones();
```

### `useEstadisticas(periodo)`
Calcula estadísticas filtradas por período usando `useMemo`.
```typescript
const { resumen, curvaCapital, operacionesFiltradas } = useEstadisticas('semana');
```
Los períodos disponibles son: `'dia' | 'semana' | 'mes' | 'anio'`.

### `useFadeIn(duracion, delay)`
Animación de entrada con fade + slide desde abajo.
```typescript
const { opacidad, translateY } = useFadeIn(400, 100);

<Animated.View style={{ opacity: opacidad, transform: [{ translateY }] }}>
  {/* contenido */}
</Animated.View>
```

### `useEscalaPress()`
Animación de escala al presionar un elemento.
```typescript
const { escala, alPresionar, alSoltar } = useEscalaPress();
```

### `usePulso()`
Animación de pulso (escala rápida arriba y abajo).
```typescript
const { escala, iniciarPulso } = usePulso();
```

---

## Componentes

Todos los componentes están en `src/components/ui/` y se importan desde `@/src/components`.

### Componentes de layout

**`Card`** — Contenedor con fondo de tema, borde y border radius.
```typescript
<Card style={estiloOpcional} padding={16}>
  {children}
</Card>
```

**`GradientCard`** — Card con fondo de gradiente lineal usando `expo-linear-gradient`.
```typescript
<GradientCard colores={['#1e3a5f', '#0f172a']} padding={24}>
  {children}
</GradientCard>
```

**`AnimatedCard`** — Card con animación de fade-in al montar y escala al presionar.
```typescript
<AnimatedCard delay={200} onPress={handlePress}>
  {children}
</AnimatedCard>
```

**`Divider`** — Línea separadora horizontal.
```typescript
<Divider margen={16} />
```

### Componentes de texto

**`AppText`** — Texto con variantes tipográficas predefinidas.
```typescript
// Variantes: 'titulo' | 'subtitulo' | 'cuerpo' | 'caption' | 'label' | 'numero'
<AppText variante="subtitulo" color={colors.textPrimary} centrado>
  Texto aquí
</AppText>
```

**`CapitalAnimado`** — Número que anima su valor cuando cambia.
```typescript
<CapitalAnimado valor={capital} color="#ffffff" fontSize={40} />
```

### Componentes de formulario

**`AppInput`** — Input estilizado con label, prefijo, estado de foco y error.
```typescript
<AppInput
  label="Monto"
  placeholder="0.00"
  prefix="$"
  keyboardType="decimal-pad"
  value={value}
  onChangeText={onChange}
  error={errors.monto?.message}
/>
```

**`Button`** — Botón con variantes de color y estado de carga.
```typescript
// Variantes: 'primary' | 'win' | 'loss' | 'ghost'
<Button
  texto="Registrar Ganancia"
  onPress={handlePress}
  variante="win"
  cargando={false}
  fullWidth
/>
```

**`SwitchRow`** — Fila con label, descripción e icono para toggles.
```typescript
<SwitchRow
  label="Modo oscuro"
  descripcion="Interfaz con fondo oscuro"
  valor={isDark}
  onChange={toggleTema}
  icono={<Moon size={20} color={colors.primary} />}
/>
```

### Componentes de datos

**`Badge`** — Etiqueta de color semántico pequeña.
```typescript
// Variantes: 'win' | 'loss' | 'neutral'
<Badge variante="win" texto="GANADORA" />
```

**`FiltroTab`** — Barra de tabs para filtrar por período.
```typescript
<FiltroTab periodoActivo={periodo} onChange={setPeriodo} />
```

**`ItemOperacion`** — Ítem de lista para una operación individual con botón de eliminar.
```typescript
<ItemOperacion operacion={operacion} onEliminar={confirmarEliminar} />
```

**`FilaInfo`** — Fila de información con icono, label, valor y flecha opcional.
```typescript
<FilaInfo
  label="Capital actual"
  valor="$150.00"
  icono={<Wallet size={20} color={colors.primary} />}
  onPress={handlePress}   // opcional, agrega flecha
  colorValor={colors.win}
  peligro={false}         // true para color rojo
/>
```

**`TarjetaEstadistica`** — Card compacta con label, valor y subvalor opcional.
```typescript
<TarjetaEstadistica
  label="TASA DE ÉXITO"
  valor="72.5%"
  subvalor="10W / 4L"
  colorValor={colors.win}
/>
```

### Componentes de gráficos

**`GraficaLinea`** — Gráfico de área con línea suavizada, badge de tendencia y rango mín/máx.
```typescript
<GraficaLinea datos={curvaCapital} altura={220} />
// datos: PuntoCapital[] = { fecha: string, capital: number }[]
```

**`GraficaBarras`** — Gráfico de barras agrupadas (ganadoras vs perdedoras) con resumen y leyenda.
```typescript
<GraficaBarras datos={datosBarras} altura={200} />
// datos: DatosBarra[] = { label: string, ganadoras: number, perdedoras: number }[]
```

---

## Pantallas

### `app/_layout.tsx` — Layout raíz

Inicializa la base de datos y carga el capital al arrancar. No muestra UI propia.

### `app/(tabs)/_layout.tsx` — Layout de tabs

Configura la barra de navegación inferior con 5 tabs: Dashboard, Registrar, Historial, Estadísticas y Ajustes.

### `app/(tabs)/index.tsx` — Dashboard

Pantalla principal. Muestra:
- Card de capital con gradiente, badge EN VIVO y cambio del día
- Tasa de éxito y ganancia neta del día
- Card de operaciones ganadoras vs perdedoras con barra de progreso
- Extremos del día (mejor y peor operación)
- Estado vacío cuando no hay operaciones

Usa animaciones escalonadas (delay de 100ms entre cada sección).

### `app/(tabs)/nueva-operacion.tsx` — Registro

Formulario con:
- Selector de tipo WIN/LOSS con feedback visual de color
- Input de monto validado con Zod
- Preview del capital resultante en tiempo real
- Nota opcional
- Feedback háptico diferenciado (éxito para win, advertencia para loss)
- Mensaje de confirmación animado tras guardar

### `app/(tabs)/historial.tsx` — Historial

Lista filtrable de operaciones con:
- Tabs de período (Hoy / Semana / Mes / Año)
- Resumen rápido del período (total ops, tasa, neto)
- Lista con `FlatList` de ítems de operación
- Eliminación con confirmación mediante `Alert`
- Estado vacío cuando no hay operaciones en el período

### `app/(tabs)/estadisticas.tsx` — Estadísticas

Análisis detallado con:
- Tabs de período
- 4 tarjetas de estadísticas (tasa, neto, mejor op, peor op)
- Gráfico de línea con curva de capital total
- Gráfico de barras por período
- Desglose financiero (ganancia bruta, pérdida bruta, neto)

### `app/(tabs)/ajustes.tsx` — Ajustes

Configuración de la app:
- Ver y editar el capital inicial
- Ver el capital actual calculado
- Switch de modo oscuro/claro
- Ver total de operaciones y versión
- Resetear toda la aplicación (elimina todas las operaciones y reinicia el capital)

---

## Navegación

La navegación usa **expo-router** con sistema de archivos. La estructura de carpetas define las rutas automáticamente.

```
app/
├── _layout.tsx         → Layout raíz, siempre activo
└── (tabs)/             → Grupo de tabs (el paréntesis no aparece en la URL)
    ├── _layout.tsx     → Configura la barra de tabs
    ├── index.tsx       → Ruta: / (tab activo por defecto)
    ├── nueva-operacion.tsx → Ruta: /nueva-operacion
    ├── historial.tsx   → Ruta: /historial
    ├── estadisticas.tsx → Ruta: /estadisticas
    └── ajustes.tsx     → Ruta: /ajustes
```

### Para agregar una nueva pantalla

**Opción A — Nueva tab:**
1. Crea `app/(tabs)/nueva-pantalla.tsx`
2. Agrega `<Tabs.Screen name="nueva-pantalla" ... />` en `app/(tabs)/_layout.tsx`

**Opción B — Pantalla modal o de detalle (sin tab):**
1. Crea `app/detalle.tsx` o `app/detalle/[id].tsx` para rutas dinámicas
2. Agrega `<Stack.Screen name="detalle" />` en `app/_layout.tsx`
3. Navega con `router.push('/detalle')` o `router.push(`/detalle/${id}`)`

---

## Animaciones

El sistema de animaciones usa la API nativa `Animated` de React Native, sin librerías externas.

### Hooks disponibles en `src/hooks/useAnimaciones.ts`

**`useFadeIn(duracion, delay)`**
Anima opacidad de 0 a 1 y translateY de 16 a 0. Se usa en todas las pantallas para la entrada escalonada de secciones.

**`useEscalaPress()`**
Escala de 1 a 0.96 al presionar y vuelve a 1 al soltar. Usado en `AnimatedCard`.

**`usePulso()`**
Escala rápida de 1 → 1.08 → 1. Útil para llamar la atención sobre un elemento.

**`useContadorAnimado(valorFinal, duracion)`**
Anima un número de su valor anterior al nuevo. La base del componente `CapitalAnimado`.

### Patrón de uso en pantallas

```typescript
// Al inicio del componente
const { opacidad: opSeccion1, translateY: tySeccion1 } = useFadeIn(400, 0);
const { opacidad: opSeccion2, translateY: tySeccion2 } = useFadeIn(400, 150);

// En el JSX
<Animated.View style={{ opacity: opSeccion1, transform: [{ translateY: tySeccion1 }] }}>
  {/* Contenido de sección 1 */}
</Animated.View>

<Animated.View style={{ opacity: opSeccion2, transform: [{ translateY: tySeccion2 }] }}>
  {/* Contenido de sección 2 */}
</Animated.View>
```

El delay escalonado (0ms, 150ms, 300ms...) crea el efecto cascada donde cada sección aparece después de la anterior.

---

## Convenciones y Reglas del Proyecto

### Nombrado

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | PascalCase | `AppText`, `GradientCard` |
| Hooks | camelCase con `use` | `useTema`, `useCapital` |
| Stores | camelCase con `use` + `Store` | `useTemaStore` |
| Servicios | camelCase con `.service` | `estadisticas.service.ts` |
| Repositorios | camelCase con `.repository` | `operaciones.repository.ts` |
| Tipos | PascalCase con `.types` | `operacion.types.ts` |
| Constantes | SCREAMING_SNAKE_CASE | `SPACING.md`, `FONT_SIZE.lg` |
| Colores | camelCase | `colors.textPrimary`, `colors.winSurface` |

### Importaciones

Siempre importar desde el barrel, nunca desde el archivo individual:

```typescript
// Correcto
import { useTema, useCapital } from '@/src/hooks';
import { Card, AppText, Button } from '@/src/components';
import { SPACING, COLORS_DARK } from '@/src/constants';

// Incorrecto
import { useTema } from '@/src/hooks/useTema';
import { Card } from '@/src/components/ui/Card';
```

**Excepción:** Dentro de la carpeta `ui/`, los componentes se importan entre sí directamente (no desde el barrel) para evitar ciclos de dependencia:

```typescript
// Dentro de ItemOperacion.tsx
import { AppText } from './AppText';   // Correcto
import { Badge } from './Badge';       // Correcto
import { AppText } from '@/src/components'; // Incorrecto — ciclo
```

### Estilos

- Todos los estilos con `StyleSheet.create()`, nunca objetos inline (excepto valores dinámicos del tema)
- Valores dinámicos (colores del tema, anchos calculados) van inline
- Sin números mágicos: siempre usar `SPACING.md`, `RADIUS.lg`, etc.
- Sin colores hardcodeados: siempre usar `colors.xxx` del tema

```typescript
// Correcto
<View style={[styles.container, { backgroundColor: colors.surface }]} />

// Incorrecto
<View style={{ padding: 16, backgroundColor: '#1e293b' }} />
```

---

## Cómo Escalar la Aplicación

### Agregar un nuevo tipo de estadística

1. Agrega el campo en `ResumenEstadisticas` en `src/types/estadisticas.types.ts`
2. Calcula el nuevo campo en `calcularResumen()` en `src/services/estadisticas.service.ts`
3. Muéstralo en `app/(tabs)/estadisticas.tsx` con `TarjetaEstadistica`

### Agregar un nuevo campo a las operaciones

1. Agrega la columna en la tabla SQL en `src/database/schema.ts` con `ALTER TABLE` en la sección de migraciones
2. Agrega el campo en `Operacion` en `src/types/operacion.types.ts`
3. Actualiza `insertarOperacion()` en `src/database/operaciones.repository.ts`
4. Agrega el campo en el formulario de `app/(tabs)/nueva-operacion.tsx`

### Agregar autenticación

1. Instala `expo-local-authentication` para biometría
2. Crea `src/store/auth.store.ts` con el estado de autenticación
3. Crea `app/auth.tsx` como pantalla de login
4. En `app/_layout.tsx`, verifica autenticación antes de mostrar los tabs

### Agregar sincronización en la nube

1. Instala un cliente de base de datos (Supabase, Firebase, etc.)
2. Crea `src/services/sync.service.ts` con la lógica de sincronización
3. Llama al servicio de sync en `agregarOperacion()` y `eliminarOperacion()` del store
4. Agrega indicador de sincronización en el header del Dashboard

### Agregar notificaciones

1. Instala `expo-notifications`
2. Crea `src/services/notificaciones.service.ts`
3. Programa notificaciones diarias para recordar registrar operaciones

### Agregar exportación de datos

1. Instala `expo-sharing` y `expo-file-system`
2. Crea `src/services/exportar.service.ts`
3. Genera un CSV con todas las operaciones
4. Agrega opción en `app/(tabs)/ajustes.tsx`

---

## Build y Distribución

### Build para Android (APK)

El proyecto está configurado para Windows. Asegúrate de tener EAS CLI instalado:

```bash
npm install -g eas-cli
eas login
```

Configura el build:

```bash
eas build:configure
```

Para generar un APK de desarrollo:

```bash
eas build --platform android --profile preview
```

Para generar un APK de producción:

```bash
eas build --platform android --profile production
```

### `eas.json` recomendado

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Variables de entorno

Si en el futuro se agregan APIs externas, usa el sistema de variables de Expo:

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
```

```typescript
// Acceso en el código
const url = process.env.EXPO_PUBLIC_API_URL;
```

---

## Notas Finales para Desarrolladores

**SQLite es síncrono en expo-sqlite v16+.** No uses `await` con `execSync`, `runSync`, `getAllSync` o `getFirstSync`. Son síncronos por diseño y lanzarán error si los tratas como promesas.

**El capital nunca se guarda calculado.** Siempre se recalcula desde `capital_inicial + operaciones`. Si agregas una pantalla que muestra el capital, obtenerlo del `useCapitalStore`, no recalcularlo manualmente.

**Los ciclos de importación en barrel exports son el error más común.** Si ves `Require cycle` en la consola, el componente probablemente importa desde el barrel de su propia carpeta. La solución es importar directamente desde el archivo fuente.

**Para testear la migración de base de datos**, desinstala la app del dispositivo y reinstala. Esto borra la base de datos y crea una nueva desde cero con el esquema actual.

**El alias `@/` requiere que el archivo se encuentre desde la raíz del proyecto.** Si mueves archivos de carpeta, actualiza las importaciones. El editor con TypeScript mostrará errores inmediatamente si algo no resuelve.

---

*Documentación generada para Trading Journal v1.0.0*