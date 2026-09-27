# Marques Works · Demo comercial multitenant

Demo local, mobile-first y sin backend para presentar dos productos comerciales distintos con un único motor técnico:

- Barbería: web pública + panel Managed + panel Essential.
- Belleza / Estética: web pública + panel Managed + panel Essential.
- MW Admin: preparación rápida de las dos demos mediante presets seguros.

Los datos se guardan exclusivamente en `localStorage`. No utiliza Supabase, Prisma, NestJS, PostgreSQL, APIs ni autenticación real.

## Instalación

Requisitos:

- Node.js 20.19 o superior.
- pnpm 10 o superior.

```bash
pnpm install
pnpm dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Rutas

### Barbería

- `/demo/barberia`
- `/demo/barberia/managed`
- `/demo/barberia/essential`

### Belleza

- `/demo/belleza`
- `/demo/belleza/managed`
- `/demo/belleza/essential`

### Marques Works

- `/demo/mwadmin`

Las rutas antiguas redirigen a Barbería:

- `/demo`
- `/demo/managed`
- `/demo/essential`

## Credenciales de demostración

```text
Email: marquesworks.mw@gmail.com
Contraseña: mw2026
```

El login es ficticio y utiliza `sessionStorage`. No representa seguridad de producción.

## Funcionamiento de los tenants

`barberia` y `belleza` tienen estados independientes. Cada tenant conserva por separado:

- servicios y precios;
- profesionales y asignación de servicios;
- reservas;
- horarios y excepciones;
- galería y solicitudes;
- datos del negocio;
- nombre, claim, preset y apariencia.

Dentro de un tenant, la web pública, Managed y Essential utilizan los mismos datos. La diferencia entre planes es únicamente de permisos: Managed edita la operativa; Essential la consulta y solicita cambios.

## Claves de localStorage

La UI no accede directamente a `localStorage`. Toda la persistencia pasa por `src/store/storage.ts`.

```text
mw-demo-v3:barberia:data
mw-demo-v3:barberia:appearance
mw-demo-v3:belleza:data
mw-demo-v3:belleza:appearance
mw-demo-v3:panel-theme
```

La aplicación migra la antigua demo `mw-demo-v2` a Barbería la primera vez que se abre, si todavía no existen datos V3.

## Datos y apariencia

`DemoData` contiene la operativa: servicios, profesionales, reservas, horarios, excepciones, galería, solicitudes y contacto.

`DemoAppearance` contiene la presentación: nombre comercial, claim, preset, packs, Hero, logo y ajustes visuales.

Cambiar un preset o un pack no borra reservas ni modifica horarios. Editar servicios o citas no restablece la apariencia.

## Presets

Barbería se define en `src/config/barberia.ts`:

- Dark Heritage
- Modern Wood
- Urban Black
- Clean Barber

Belleza se define en `src/config/belleza.ts`:

- Nude Elegant
- Sage Natural
- Soft Luxury
- Clean Beauty

Los catálogos son distintos y MW Admin sólo muestra las opciones del tenant seleccionado.

## Añadir un nuevo preset

1. Abre el archivo de configuración del sector.
2. Añade, si hace falta, un `ColorPack`, `FontPack`, `ImagePack` o `HeroVariant`.
3. Añade un elemento a `presets` referenciando sus IDs.
4. Define sus `visual settings`: radios, sombras, espaciado, botones, cards, tratamiento de imagen y layouts.
5. Ejecuta `pnpm typecheck`, `pnpm lint` y `pnpm build`.

No hace falta modificar MW Admin: los controles se generan desde el catálogo del sector.

## Añadir un tercer sector

La guía detallada está en `docs/ARQUITECTURA_MULTITENANT.md`. En resumen:

1. Amplía `DemoId`.
2. Crea una configuración sectorial nueva.
3. Añade su seed inicial.
4. Registra la configuración en `src/config/index.ts`.
5. Declara las tres rutas en `src/App.tsx`.

El motor de reservas, los paneles, la persistencia y MW Admin se reutilizan; no se duplica la aplicación.

## Paneles

### Managed

- Resumen de hoy, pendientes, próxima cita y semana.
- Agenda diaria/semanal y reserva manual.
- Estados: confirmar, completar, no-show y cancelar.
- Servicios, precios, duración y asignación de profesionales.
- Horario general e individual.
- Vacaciones, cierres, bloqueos y horarios excepcionales.
- Galería, datos del negocio y solicitudes.

### Essential

- Misma agenda y mismas reservas del tenant.
- Creación y gestión de citas.
- Servicios, horarios, profesionales, galería y datos en lectura.
- Bloqueo visual y acceso a Solicitudes para cambios gestionados.

## MW Admin

Permite, sin tocar código:

- seleccionar Barbería o Belleza;
- cambiar nombre, claim y datos rápidos;
- aplicar un preset completo;
- ajustar color, fuentes, imágenes y Hero de forma individual;
- elegir el estilo del logo;
- abrir web, Managed y Essential;
- restablecer únicamente el tenant seleccionado.

## Reservas

El motor compartido comprueba:

- horario del negocio;
- horario del profesional;
- servicios asignados al profesional;
- vacaciones, cierres y bloqueos;
- citas existentes y duración completa del servicio.

Una reserva web o manual bloquea el hueco. Cancelarla lo libera. La confirmación permite descargar un archivo `.ics`.

## Vercel

`vercel.json` incluye la reescritura SPA necesaria para abrir o refrescar todas las rutas profundas.

Configuración recomendada:

```text
Framework Preset: Vite
Build Command: pnpm build
Output Directory: dist
```

## Comprobaciones

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Todas las fotografías están dentro de `public/images/`; la demo no depende de URLs externas.
