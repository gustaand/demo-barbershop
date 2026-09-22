# MW BarberShop · Demo funcional

Demo comercial local de Marques Works para enseñar el flujo completo de una barbería:

`Web pública → reserva sin registro → panel → gestión operativa → web actualizada`

No utiliza backend ni servicios externos. Los datos, citas y cambios se guardan en el `localStorage` del navegador.

## Requisitos

- Node.js 20.19 o superior
- pnpm 10 o superior

## Instalación

```bash
pnpm install
pnpm dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

## Rutas

- Web pública: `http://localhost:5173/demo`
- Panel Managed: `http://localhost:5173/demo/managed`
- Panel Essential: `http://localhost:5173/demo/essential`

## Credenciales de los paneles

```text
Email: marquesworks.mw@gmail.com
Contraseña: mw2026
```

El acceso es ficticio y existe únicamente para presentar esta demo local. No representa una autenticación segura de producción.

## Diferencia entre planes

### Essential

- Pantalla inicial con el resumen y todas las citas de hoy.
- Agenda unificada con vistas diaria y semanal.
- Gestión del estado de las citas y creación de reservas desde la propia agenda.
- Consulta directa de los horarios desde la navegación principal.
- Servicios, trabajadores, horarios y datos en modo lectura.
- Solicitudes de cambios a Marques Works.

### Managed

Incluye lo anterior y permite editar directamente:

- Servicios, precios, duración y asignación de profesionales.
- Horarios generales e individuales.
- Disponibilidad del equipo.
- Vacaciones, cierres, bloqueos y horarios excepcionales.
- Galería y datos públicos del negocio.
- Solicitudes especiales a Marques Works.

Los cambios operativos se reflejan de inmediato en la disponibilidad de la web pública.

## Restablecer la demo

1. Entra en uno de los paneles.
2. Abre **Más → Configuración** en móvil o **Configuración** en el menú lateral de escritorio.
3. Pulsa **Restablecer datos** y confirma.

Esto elimina todos los cambios de esta demo en el navegador y vuelve a cargar datos iniciales con fechas cercanas al día actual.

## Comprobaciones técnicas

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

## Notas de la demo

- No hay Supabase, API, base de datos, pagos ni mensajería real.
- Todas las fotografías y el logotipo negro/dorado están incluidos en `public/images` y no dependen de servicios externos.
- `Añadir al calendario` descarga un archivo `.ics` válido.
- Cancelar una cita libera su horario.
- Las citas manuales bloquean el horario público igual que las creadas por el cliente.
- El tema claro/oscuro/sistema afecta únicamente al panel; la web pública conserva su estilo oscuro.
