<?php
// ====================================================================
// ARCHIVO DE CONFIGURACIÓN DE LA BASE DE DATOS
// Copia este archivo como config.php y configura tus credenciales
// ====================================================================

// IMPORTANTE: Nunca subas config.php a un repositorio público
// Añade config.php a tu .gitignore

return [
    'database' => [
        'host' => 'mia-pg-1002.bloom.host',
        'port' => 3306,
        'dbname' => 's99457_VaeBridge',
        'username' => 'u99457_VsTTtNY1xo',
        'password' => 'voUOYa8JDQSil2C1IkLQR71o'
    ],

    // Configuraciones adicionales
    'api' => [
        'enable_cors' => true,
        'cache_duration' => 60, // segundos
        'max_players' => 100
    ],

    // APIs externas
    'minecraft' => [
        'skin_api' => 'https://mc-heads.net/avatar/{name}/50',
        'skin_api_fallback' => 'https://crafatar.com/avatars/{uuid}?size=50'
    ]
];
?>
