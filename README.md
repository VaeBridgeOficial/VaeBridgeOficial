# VaeBridge Ranking System

Sistema de ranking completo para el servidor VaeBridge con integración entre plugin de Minecraft, bot de Discord y sitio web.

## 🎨 Características

- **Diseño moderno y estético** con gradientes animados y efectos visuales
- **Sistema de tiers actualizado** con formato LT/HT (Low Tier / High Tier)
- **Botón de cambio de vista** entre formato LT/HT y letras (F, D, C, B, A, S)
- **Página de tops** con múltiples categorías (General, Wins, Kills, Goles, Winrate)
- **Verificación de Discord** con indicadores visuales
- **API backend** para integración con base de datos MySQL
- **Skins de Minecraft** usando API de mc-heads.net
- **Responsive design** para móviles y tablets

## 📋 Estructura de Archivos

```
VaeBridgeOficial-main/
├── index.html              # Página de inicio
├── clasificacion.html      # Página de clasificación/ranking
├── tops.html               # Página de tops por categorías
├── informacion.html        # Página de información y contacto
├── script.js               # JavaScript principal
├── data.json               # Datos de ejemplo (reemplazar con API)
├── logo.png                # Logo del servidor
├── api/
│   └── players.php         # API para obtener datos de la DB
└── README.md               # Este archivo
```

## 🚀 Instalación

### 1. Configuración del Sitio Web

1. Sube todos los archivos a tu servidor web
2. Asegúrate de que tu servidor soporte PHP (para la API)
3. Configura los permisos de escritura si es necesario

### 2. Configuración de la Base de Datos

El sistema ya está configurado para usar la base de datos existente:

- **Host:** mia-pg-1002.bloom.host
- **Puerto:** 3306
- **Base de datos:** s99457_VaeBridge
- **Usuario:** u99457_VsTTtNY1xo

⚠️ **IMPORTANTE:** Por razones de seguridad, considera mover las credenciales de la base de datos a un archivo de configuración separado fuera del directorio público.

### 3. Integración con el Plugin TheBridge-main

El plugin ya está configurado para usar la misma base de datos. Los datos de los jugadores se actualizan automáticamente cuando:

- Un jugador gana una partida
- Un jugador anota un gol
- Un jugador consigue kills
- Se completa una partida

### 4. Integración con BridgeStatsBot (Discord)

El bot de Discord actualiza automáticamente los tiers cuando se ejecuta el comando `/tiertest`. El sistema funciona así:

1. Un moderador ejecuta `/tiertest` en Discord
2. El bot actualiza el tier en la tabla `players` (campo `tier_test_rank`)
3. El sitio web muestra el tier actualizado la próxima vez que se carga

## 🔧 Configuración del Sistema de Tiers

### Mapeo de Tiers

El sistema usa el siguiente mapeo de tiers:

| Tier | Letra | Color | Descripción |
|------|-------|-------|-------------|
| HT1  | S     | Rojo  | High Tier 1 - Élite |
| LT1  | A+    | Naranja Rojizo | Low Tier 1 |
| HT2  | A-    | Naranja Oscuro | High Tier 2 |
| LT2  | B+    | Naranja | Low Tier 2 |
| HT3  | B-    | Dorado | High Tier 3 |
| LT3  | C+    | Amarillo | Low Tier 3 |
| HT4  | C-    | Verde Lima | High Tier 4 |
| LT4  | D+    | Verde | Low Tier 4 |
| HT5  | D-    | Azul Cielo | High Tier 5 |
| LT5  | F     | Gris | Low Tier 5 - Principiante |

### Botón de Cambio de Vista

Los usuarios pueden alternar entre dos vistas:
- **Vista High Tier (por defecto):** Muestra LT5, HT5, LT4, etc.
- **Vista de Letras:** Muestra F, D-, D+, C-, C+, B-, B+, A-, A+, S

## 📊 Uso de la API

### Endpoint: `/api/players.php`

Devuelve todos los jugadores con sus estadísticas en formato JSON.

**Ejemplo de respuesta:**

```json
{
  "rankings": ["player1", "player2", "player3"],
  "players": {
    "player1": {
      "name": "PlayerName",
      "region": "NA",
      "points": 2850,
      "tier": "HT1",
      "avatar": "https://mc-heads.net/avatar/PlayerName/50",
      "discordVerified": true,
      "discordTag": "PlayerName#0001",
      "badges": [],
      "skills": {
        "bypassing": 10,
        "pvp": 9,
        "defensa": 8
      },
      "stats": {
        "wins": 485,
        "losses": 102,
        "kills": 3240,
        "deaths": 890,
        "goles": 1850,
        "winrate": 82.6
      }
    }
  }
}
```

### Usar la API en lugar de data.json

Para usar datos en tiempo real de la base de datos, actualiza `script.js`:

```javascript
// Cambiar esta línea:
const JSON_FILE = 'data.json';

// Por esta:
const JSON_FILE = 'api/players.php';
```

## 🎮 Soporte para Skins

El sistema usa la API de [mc-heads.net](https://mc-heads.net) para mostrar las skins de los jugadores:

```
https://mc-heads.net/avatar/{nombre_jugador}/50
```

### Soporte para Servidor No Premium

Si tu servidor usa SkinRestorer o similar:

1. Asegúrate de que SkinRestorer esté configurado correctamente
2. Los jugadores deben usar `/skin set <nombre>` para aplicar una skin
3. mc-heads.net buscará la skin asociada al nombre

Si tienes problemas con las skins, considera:
- Usar la API de Crafatar: `https://crafatar.com/avatars/{uuid}`
- Implementar tu propio sistema de caché de skins
- Usar imágenes predeterminadas para jugadores sin skin

## 🔗 Verificación de Discord

### Configuración

Para vincular cuentas de Minecraft con Discord:

1. Los jugadores usan `/link <nombre_minecraft>` en Discord
2. El bot guarda la vinculación en la tabla `discord_links`
3. El sitio web muestra el estado de verificación automáticamente

### Base de Datos

Tabla `discord_links`:
```sql
CREATE TABLE discord_links (
    discord_id VARCHAR(20) PRIMARY KEY,
    minecraft_uuid VARCHAR(36) NOT NULL,
    discord_username VARCHAR(100),
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Páginas del Sitio

### Página de Inicio (index.html)
- Descripción del servidor
- Enlace a clasificación
- Diseño con fondo animado

### Página de Clasificación (clasificacion.html)
- Tabla completa de jugadores
- Filtros por habilidad (Bypassing, PVP, Defensa)
- Búsqueda por nombre/región
- Botón para cambiar vista de tiers
- Muestra verificación de Discord

### Página de Tops (tops.html)
- Top General (por ELO)
- Top Victorias
- Top Kills
- Top Goles
- Top Winrate
- Efectos especiales para top 3

### Página de Información (informacion.html)
- Información sobre el servidor
- Formulario de contacto
- Sugerencias de jugadores

## 🛠️ Personalización

### Cambiar Colores

Edita las variables CSS en cada archivo HTML:

```css
/* Colores principales */
--primary-color: #3498db;    /* Azul */
--secondary-color: #e74c3c;  /* Rojo */
--background-dark: #0f0c29;  /* Morado oscuro */
```

### Añadir Badges

En `data.json` o la API, añade badges a los jugadores:

```json
"badges": [
  {
    "title": "Winner",
    "icon": "https://img.icons8.com/color/48/000000/trophy.png"
  }
]
```

### Modificar Habilidades

Las habilidades se calculan automáticamente, pero puedes modificar el cálculo en `api/players.php`:

```php
'skills' => [
    'bypassing' => calcularBypassing($row),
    'pvp' => calcularPVP($row),
    'defensa' => calcularDefensa($row)
]
```

## 📱 Responsive Design

El sitio es completamente responsive y se adapta a:
- 🖥️ Escritorio (1920px+)
- 💻 Laptop (1280px+)
- 📱 Tablet (768px+)
- 📱 Móvil (320px+)

## 🔒 Seguridad

### Recomendaciones:

1. **Mueve las credenciales de la base de datos** a un archivo `.env` fuera del directorio público
2. **Usa HTTPS** para todas las conexiones
3. **Valida y sanitiza** todas las entradas de usuario
4. **Implementa rate limiting** en la API
5. **Usa consultas preparadas** (ya implementadas en el PHP)

## 🐛 Solución de Problemas

### La página no carga datos

1. Verifica que el archivo `data.json` o `api/players.php` sea accesible
2. Abre la consola del navegador (F12) para ver errores
3. Verifica que el servidor web tenga acceso a la base de datos

### Las skins no se muestran

1. Verifica la URL de la API de mc-heads.net
2. Asegúrate de que el nombre del jugador sea correcto
3. Considera usar una imagen por defecto para jugadores sin skin

### El tier toggle no funciona

1. Verifica que `script.js` esté cargando correctamente
2. Asegúrate de que `toggleTierDisplay()` esté definida
3. Revisa la consola del navegador para errores de JavaScript

## 📞 Soporte

Para reportar problemas o sugerencias:
- Discord: https://discord.gg/fEYt2VMU
- Usa el formulario de contacto en la página de Información

## 📝 Licencia

Este proyecto es privado y está desarrollado específicamente para VaeBridge.

---

**Desarrollado con ❤️ para VaeBridge**
*Última actualización: 2025*
