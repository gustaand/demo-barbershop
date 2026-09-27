# Arquitectura multitenant de la demo

## Flujo principal

Cada ruta aporta un `demoId` a `DemoProvider`:

```text
Ruta
  → DemoProvider(demoId)
    → DemoRepository(demoId)
      → DemoData + DemoAppearance
        → Web pública / Managed / Essential
```

La UI compartida nunca construye claves de almacenamiento. Sólo llama a `updateData`, `updateAppearance` o `reset` desde el contexto.

## Archivos principales

- `src/App.tsx`: rutas oficiales y redirects antiguos.
- `src/types.ts`: dominio compartido y tipos de apariencia.
- `src/store/storage.ts`: única puerta de acceso a `localStorage`.
- `src/store/DemoContext.tsx`: estado reactivo del tenant activo.
- `src/store/PanelThemeContext.tsx`: tema Claro / Oscuro / Sistema de los paneles.
- `src/data/seed.ts`: datos iniciales dinámicos de cada sector.
- `src/config/barberia.ts`: catálogo visual completo de Barbería.
- `src/config/belleza.ts`: catálogo visual completo de Belleza.
- `src/config/index.ts`: registro de sectores y aplicación de presets.
- `src/pages/PublicSite.tsx`: web pública y reserva compartidas.
- `src/pages/panel/`: paneles Managed y Essential compartidos.
- `src/pages/admin/MWAdmin.tsx`: herramienta comercial.
- `src/utils/availability.ts`: cálculo de disponibilidad.

## Aislamiento

`DemoRepository` siempre exige un `DemoId`. Las claves incluyen el tenant y la sección:

```text
mw-demo-v3:<demoId>:data
mw-demo-v3:<demoId>:appearance
```

No existe una operación de actualización sin tenant. Esto reduce el riesgo de escribir datos de Belleza en Barbería o al contrario.

Managed y Essential no tienen almacenes propios: ambos leen la clave del mismo tenant. Así una cita creada en la web aparece en los dos paneles y un precio cambiado en Managed se refleja en la web y en Essential.

## Presets

Un preset aplica una combinación completa:

```text
Color Pack
+ Font Pack
+ Image Pack
+ Hero Variant
+ Visual Settings
```

Después de aplicar el preset, MW Admin puede cambiar cualquiera de los cuatro packs sin restablecer los demás.

Barbería y Belleza exportan catálogos separados. Un componente sólo recibe la configuración del `demoId` activo, de modo que no puede ofrecer opciones del otro sector.

## Tercer sector

Ejemplo conceptual para añadir `masajes`:

1. Añadir `'masajes'` a `DemoId`.
2. Crear `src/config/masajes.ts` con sus textos, labels, packs y presets.
3. Añadir `masajesSeed()` a `src/data/seed.ts`.
4. Registrar `masajesConfig` en `sectorConfigs`.
5. Añadir `/demo/masajes`, `/managed` y `/essential` en `App.tsx`.
6. Añadir el botón sectorial en MW Admin.
7. Incorporar recursos locales bajo `public/images/`.

No hay que copiar `BookingFlow`, `PanelApp`, pantallas de gestión, repositorio ni motor de disponibilidad.

## Límites deliberados

La aplicación sigue siendo una demo comercial. No incluye backend, usuarios reales, pagos, mensajería, almacenamiento remoto ni subida pesada de imágenes. Los packs fotográficos locales evitan superar el límite de `localStorage` y hacen que la presentación sea estable sin conexión a servicios externos.
