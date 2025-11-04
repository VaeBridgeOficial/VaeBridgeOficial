<?php
// ====================================================================
// API PARA OBTENER DATOS DE JUGADORES
// Este archivo se conecta a la base de datos MySQL y devuelve los
// datos de los jugadores en formato JSON para la página web
// ====================================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuración de la base de datos (misma que el plugin y el bot)
$host = 'mia-pg-1002.bloom.host';
$port = 3306;
$dbname = 's99457_VaeBridge';
$username = 'u99457_VsTTtNY1xo';
$password = 'voUOYa8JDQSil2C1IkLQR71o';

try {
    // Conexión a la base de datos
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener todos los jugadores con sus estadísticas
    $stmt = $pdo->query("
        SELECT
            p.uuid,
            p.name,
            p.wins,
            p.losses,
            p.kills,
            p.deaths,
            p.goals as goles,
            p.points_scored,
            p.tier_test_rank,
            d.discord_id,
            d.discord_username
        FROM players p
        LEFT JOIN discord_links d ON p.uuid = d.minecraft_uuid
        ORDER BY p.wins DESC
    ");

    $players = [];
    $index = 1;

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $playerId = 'player' . $index;

        // Calcular winrate
        $totalGames = $row['wins'] + $row['losses'];
        $winrate = $totalGames > 0 ? round(($row['wins'] / $totalGames) * 100, 1) : 0;

        // Determinar región (por defecto NA, esto debería venir de la DB)
        $region = 'NA'; // Puedes agregar este campo a la base de datos

        // Calcular ELO/puntos (puedes usar points_scored o calcular basado en wins)
        $points = $row['wins'] * 10 + $row['kills'] * 2 + $row['goles'] * 5;

        // Tier del tier test o calcular uno por defecto
        $tier = $row['tier_test_rank'] ?? 'LT5';

        // Verificación de Discord
        $discordVerified = !empty($row['discord_id']);
        $discordTag = $discordVerified ? $row['discord_username'] : null;

        // Construir objeto del jugador
        $players[$playerId] = [
            'name' => $row['name'],
            'region' => $region,
            'points' => $points,
            'tier' => $tier,
            'avatar' => "https://mc-heads.net/avatar/{$row['name']}/50",
            'discordVerified' => $discordVerified,
            'discordTag' => $discordTag,
            'badges' => [], // Puedes agregar lógica para badges
            'skills' => [
                'bypassing' => rand(5, 10), // Calcular o agregar a la DB
                'pvp' => rand(5, 10),
                'defensa' => rand(5, 10)
            ],
            'stats' => [
                'wins' => (int)$row['wins'],
                'losses' => (int)$row['losses'],
                'kills' => (int)$row['kills'],
                'deaths' => (int)$row['deaths'],
                'goles' => (int)$row['goles'],
                'winrate' => $winrate
            ]
        ];

        $index++;
    }

    // Crear array de rankings ordenado por puntos
    $rankings = array_keys($players);
    usort($rankings, function($a, $b) use ($players) {
        return $players[$b]['points'] - $players[$a]['points'];
    });

    // Respuesta final
    $response = [
        'rankings' => $rankings,
        'players' => $players
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error de conexión a la base de datos',
        'message' => $e->getMessage()
    ]);
}
?>
