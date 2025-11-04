// ====================================================================
// CONFIGURACIÓN DEL SITIO WEB
// ====================================================================

const CONFIG = {
    // OPCIÓN 1: Usar datos estáticos (para GitHub Pages sin backend)
    // Descomenta esta línea para usar data.json:
    dataSource: 'data.json',

    // OPCIÓN 2: Usar API con base de datos real
    // Cuando tengas tu API en un hosting, descomenta esta línea y comenta la anterior:
    // dataSource: 'https://tudominio.com/api/players.php',

    // Configuración de Discord
    discordInvite: 'https://discord.gg/fEYt2VMU',

    // Configuración de skins
    skinAPI: 'https://mc-heads.net/avatar/{name}/50',

    // Otras configuraciones
    serverName: 'VaeBridge',
    serverIP: 'mc.vaebridge.com' // Cambia esto por tu IP real
};

// Exportar configuración para que esté disponible en otros archivos
window.CONFIG = CONFIG;
