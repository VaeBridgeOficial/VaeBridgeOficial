// ====================================================================
// CONFIGURACIÓN DEL SITIO WEB - VAEBRIDGE
// ====================================================================
//
// INSTRUCCIONES:
// 1. Para usar LOCALMENTE con datos de prueba: deja 'dataSource' como 'data.json'
// 2. Para conectar a tu BASE DE DATOS en el VPS:
//    - Sube el archivo 'db-config.php' a tu VPS
//    - Configura los datos de tu base de datos en 'db-config.php'
//    - Cambia 'dataSource' a 'api/players.php'
//    - Sube todos los archivos a tu VPS
// 3. Cambia 'serverIP' por tu IP real de Minecraft
//
// ====================================================================

const CONFIG = {
    // =================== FUENTE DE DATOS ===================

    // OPCIÓN 1: Usar datos estáticos (para pruebas locales)
    dataSource: 'api/players.php',

    // OPCIÓN 2: Usar API con base de datos real (cuando subas al VPS)
    // Descomentar la siguiente línea y comentar la anterior:
    // dataSource: 'api/players.php',

    // =================== CONFIGURACIÓN DEL SERVIDOR ===================

    // IP del servidor de Minecraft
    serverIP: 'vaebridge.minecraft.best',

    // Nombre del servidor
    serverName: 'VaeBridge',

    // =================== CONFIGURACIÓN DE DISCORD ===================

    // Link de invitación de Discord
    discordInvite: 'https://discord.gg/fEYt2VMU',

    // =================== CONFIGURACIÓN DE SKINS ===================

    // API para obtener skins de Minecraft
    skinAPI: 'https://mc-heads.net/avatar/{name}/50',

    // =================== OTRAS CONFIGURACIONES ===================

    // Actualizar datos cada X segundos (0 = no actualizar automáticamente)
    autoRefreshInterval: 0,

    // Mostrar modo debug en consola
    debugMode: false
};

// Exportar configuración para que esté disponible en otros archivos
window.CONFIG = CONFIG;

// Log de configuración en modo debug
if (CONFIG.debugMode) {
    console.log('VaeBridge Config:', CONFIG);
}