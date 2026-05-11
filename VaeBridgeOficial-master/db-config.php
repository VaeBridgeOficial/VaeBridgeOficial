<?php
/**
 * ====================================================================
 * CONFIGURACIÓN DE BASE DE DATOS - VAEBRIDGE
 * ====================================================================
 *
 * Instrucciones de uso:
 * 1. Rellena los datos de tu base de datos MySQL
 * 2. Sube este archivo a tu servidor VPS
 * 3. Asegúrate de que este archivo esté en la raíz del proyecto
 *
 * IMPORTANTE: Nunca compartas este archivo públicamente
 * ====================================================================
 */

// =================== CONFIGURACIÓN DE BASE DE DATOS ===================

// Host de la base de datos (usualmente 'localhost')
define('DB_HOST', 'mia-pg-1002.bloom.host');

// Nombre de la base de datos
define('DB_NAME', 's99457_VaeBridge');

// Usuario de la base de datos
define('DB_USER', 'u99457_VsTTtNY1xo');

// Contraseña de la base de datos
define('DB_PASS', 'voUOYa8JDQSil2C1IkLQR71o');

// Puerto de MySQL (usualmente 3306)
define('DB_PORT', '3306');

// Charset de la base de datos
define('DB_CHARSET', 'utf8mb4');


// =================== CONFIGURACIÓN DE LITEBANS ===================

// Si usas LiteBans, configura estos datos
// (La tabla de LiteBans puede estar en la misma u otra base de datos)

define('LITEBANS_DB_HOST', 'mia-pg-1002.bloom.host');
define('LITEBANS_DB_NAME', 's99457_Litebans');
define('LITEBANS_DB_USER', 'u99457_cnBUh1ustT');
define('LITEBANS_DB_PASS', 'L12McWwqnDqWxgxVj5DojjGk');
define('LITEBANS_DB_PORT', '3306');


// =================== FUNCIONES DE CONEXIÓN ===================

/**
 * Obtener conexión a la base de datos principal
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        die("Error de conexión a la base de datos: " . $e->getMessage());
    }
}

/**
 * Obtener conexión a la base de datos de LiteBans
 */
function getLiteBansConnection() {
    try {
        $dsn = "mysql:host=" . LITEBANS_DB_HOST . ";port=" . LITEBANS_DB_PORT . ";dbname=" . LITEBANS_DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, LITEBANS_DB_USER, LITEBANS_DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        die("Error de conexión a LiteBans: " . $e->getMessage());
    }
}

/**
 * Probar conexión a la base de datos
 */
function testConnection() {
    try {
        $pdo = getDBConnection();
        echo "Conexión exitosa a la base de datos principal<br>";

        $litebans = getLiteBansConnection();
        echo "Conexión exitosa a LiteBans<br>";

        return true;
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
        return false;
    }
}

// Descomentar la siguiente línea para probar la conexión
// testConnection();

?>
