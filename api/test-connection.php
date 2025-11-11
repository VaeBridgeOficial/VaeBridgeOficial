<?php
// ====================================================================
// ARCHIVO DE PRUEBA PARA DIAGNOSTICAR LA CONEXIÓN
// Accede a este archivo en: http://tudominio.com/api/test-connection.php
// ====================================================================

// Mostrar todos los errores de PHP
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/html; charset=utf-8');

echo "<h1>Prueba de Conexión - VaeBridge</h1>";
echo "<hr>";

// Configuración de la base de datos
$host = 'mia-pg-1002.bloom.host';
$port = 3306;
$dbname = 's99457_VaeBridge';
$username = 'u99457_VsTTtNY1xo';
$password = 'voUOYa8JDQSil2C1IkLQR71o';

echo "<h2>1. Verificando extensión PDO MySQL...</h2>";
if (extension_loaded('pdo_mysql')) {
    echo "✅ <span style='color: green;'>PDO MySQL está instalado</span><br>";
} else {
    echo "❌ <span style='color: red;'>PDO MySQL NO está instalado</span><br>";
    echo "Instala con: <code>sudo apt-get install php-mysql</code> o <code>sudo yum install php-mysqlnd</code><br>";
}

echo "<h2>2. Intentando conectar a la base de datos...</h2>";
echo "Host: <strong>$host:$port</strong><br>";
echo "Base de datos: <strong>$dbname</strong><br>";
echo "Usuario: <strong>$username</strong><br>";
echo "<hr>";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    echo "DSN: <code>$dsn</code><br><br>";

    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ <span style='color: green; font-size: 18px;'><strong>¡CONEXIÓN EXITOSA!</strong></span><br><br>";

    // Probar consulta
    echo "<h2>3. Verificando tablas...</h2>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (count($tables) > 0) {
        echo "✅ Tablas encontradas (" . count($tables) . "):<br>";
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li>$table</li>";
        }
        echo "</ul>";
    } else {
        echo "⚠️ <span style='color: orange;'>No se encontraron tablas en la base de datos</span><br>";
    }

    // Verificar tabla players
    echo "<h2>4. Verificando tabla 'players'...</h2>";
    if (in_array('players', $tables)) {
        echo "✅ Tabla 'players' existe<br>";

        $stmt = $pdo->query("SELECT COUNT(*) as total FROM players");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Total de jugadores: <strong>{$count['total']}</strong><br><br>";

        // Mostrar estructura de la tabla
        echo "<h3>Estructura de la tabla 'players':</h3>";
        $stmt = $pdo->query("DESCRIBE players");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        foreach ($columns as $col) {
            echo "<tr>";
            echo "<td>{$col['Field']}</td>";
            echo "<td>{$col['Type']}</td>";
            echo "<td>{$col['Null']}</td>";
            echo "<td>{$col['Key']}</td>";
            echo "<td>{$col['Default']}</td>";
            echo "</tr>";
        }
        echo "</table>";

    } else {
        echo "❌ <span style='color: red;'>La tabla 'players' NO existe</span><br>";
        echo "Necesitas crear la tabla primero.<br>";
    }

    // Verificar tabla discord_links
    echo "<h2>5. Verificando tabla 'discord_links'...</h2>";
    if (in_array('discord_links', $tables)) {
        echo "✅ Tabla 'discord_links' existe<br>";
    } else {
        echo "⚠️ <span style='color: orange;'>La tabla 'discord_links' NO existe (opcional)</span><br>";
    }

} catch (PDOException $e) {
    echo "❌ <span style='color: red; font-size: 18px;'><strong>ERROR DE CONEXIÓN</strong></span><br><br>";
    echo "<strong>Código de error:</strong> " . $e->getCode() . "<br>";
    echo "<strong>Mensaje:</strong> " . $e->getMessage() . "<br><br>";

    echo "<h3>Posibles soluciones:</h3>";
    echo "<ul>";
    echo "<li>Verifica que el host '<strong>$host</strong>' sea correcto</li>";
    echo "<li>Verifica que el usuario '<strong>$username</strong>' tenga permisos</li>";
    echo "<li>Verifica que la contraseña sea correcta</li>";
    echo "<li>Verifica que la base de datos '<strong>$dbname</strong>' exista</li>";
    echo "<li>Verifica que tu IP esté en la lista de IPs permitidas en Bloom.host</li>";
    echo "<li>Si usas firewall, abre el puerto $port</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<p><small>VaeBridge - Test de conexión v1.0</small></p>";
?>
