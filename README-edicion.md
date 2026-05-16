# README-edicion

Propósito
--------
Este archivo documenta los primeros pasos para limpiar y dividir el proyecto `agroproyect` sin romper la lógica existente.

Estructura del proyecto
----------------------
- `index.html` — Entrada principal de la app (UI + lógica antigua). No modificar IDs ni nombres de funciones globales sin revisar usos.
- `css/` — Estilos: `styles.css`, `components.css`.
- `js/core/` — Módulos centrales: `constants.js`, `storage.js`, `app.js`.
- `js/utils/` — Utilidades: `helpers.js`.
- `index_files/` — Recursos externos (no editar `xlsx.full.min.js`).

Reglas y restricciones (resumen)
--------------------------------
1. No cambiar IDs de HTML existentes.
2. No cambiar nombres de funciones globales sin revisar dónde se usan.
3. No cambiar las claves de `localStorage` mencionadas en el encargo.
4. No editar `index_files/xlsx.full.min.js`.
5. Hacer refactor incremental: una sección a la vez.
6. Antes de mover una función, comprobar duplicados en `index.html` y `js/core`.

Plan breve (próximos pasos)
--------------------------
1. Crear respaldo (copia) del proyecto antes de cambios mayores.
2. Arreglar variables CSS faltantes (ya aplicadas en `css/styles.css`).
3. Mejorar layout y diseño solo desde CSS en primera fase.
4. Diseñar módulos JS y mover funciones una a una, probando entre cada movimiento.
5. Documentar funciones duplicadas antes de eliminar.

Notas sobre lo hecho ahora
-------------------------
- Añadidas variables CSS de compatibilidad en `:root` (por ejemplo `--brand`, `--muted`, `--accent`).
- No se han cambiado IDs ni lógica JavaScript en esta pasada inicial (solo ajustes puntuales previos solicitados).

Cómo proceder
-------------
- Para respaldo rápido: crear una rama en git o copiar la carpeta `agroproyect` a `agroproyect-backup-YYYYMMDD`.
- Para la siguiente tarea: refinar `css/components.css` y ajustar colores/contrastes.

Contacto
--------
Si quieres que proceda con la copia de seguridad y la primera refactorización de JS en módulos, dime y lo hago paso a paso.
