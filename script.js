// ====================================================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ====================================================================

let fullRankingData = null;
let allPlayersData = {};
let currentFilter = '';
let tierDisplayMode = 'highTier'; // 'highTier' o 'letter'

// Obtener la fuente de datos desde config.js
// Si config.js no está cargado, usar data.json por defecto
const JSON_FILE = window.CONFIG ? window.CONFIG.dataSource : 'data.json';

// ====================================================================
// MAPEO DE TIERS
// ====================================================================

const TIER_MAPPING = {
    'LT5': { letter: 'F', color: '#808080', order: 10 },
    'HT5': { letter: 'D-', color: '#00bfff', order: 9 },
    'LT4': { letter: 'D+', color: '#00ff00', order: 8 },
    'HT4': { letter: 'C-', color: '#7fff00', order: 7 },
    'LT3': { letter: 'C+', color: '#ffff00', order: 6 },
    'HT3': { letter: 'B-', color: '#ffd700', order: 5 },
    'LT2': { letter: 'B+', color: '#ffa500', order: 4 },
    'HT2': { letter: 'A-', color: '#ff8c00', order: 3 },
    'LT1': { letter: 'A+', color: '#ff4500', order: 2 },
    'HT1': { letter: 'S', color: '#ff0000', order: 1 }
};

// ====================================================================
// FUNCIONES AUXILIARES DE TIERS
// ====================================================================

function getTierDisplay(tier) {
    if (!TIER_MAPPING[tier]) return tier;
    return tierDisplayMode === 'highTier' ? tier : TIER_MAPPING[tier].letter;
}

function getTierColor(tier) {
    return TIER_MAPPING[tier]?.color || '#ffffff';
}

function toggleTierDisplay() {
    tierDisplayMode = tierDisplayMode === 'highTier' ? 'letter' : 'highTier';
    const button = document.getElementById('tierToggleBtn');
    if (button) {
        button.textContent = tierDisplayMode === 'highTier' ? 'Ver como Letras' : 'Ver como Tiers';
    }
    // Re-renderizar el ranking con el nuevo modo
    if (fullRankingData) {
        construirRanking(fullRankingData.rankings, allPlayersData, false, null);
    }
}

// ====================================================================
// 1. CARGA DE DATOS PRINCIPAL (ASÍNCRONA)
// ====================================================================

async function cargarYMostrarRankings() {
    try {
        const response = await fetch(JSON_FILE);

        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }

        fullRankingData = await response.json();
        allPlayersData = fullRankingData.players;

        // Inicializa la tabla sin filtro de habilidad (muestra todas las columnas)
        construirRanking(fullRankingData.rankings, allPlayersData, false, null);

    } catch (error) {
        console.error("Error FATAL al cargar el ranking:", error);
        const bodyContainer = document.getElementById('ranking-body');
        if (bodyContainer) {
            bodyContainer.innerHTML = `<p style="padding: 30px; text-align: center; color: #e74c3c;">
                ¡Error! No se pudieron cargar los datos del ranking. (Asegúrate de usar un servidor local).
            </p>`;
        }
    }
}

// ====================================================================
// 2. CONSTRUCCIÓN DEL RANKING (DINÁMICA DE COLUMNAS)
// ====================================================================

function construirRanking(playerIdsToShow, allPlayersData, isFiltered = false, highlightSkill = null) {
    const headerContainer = document.getElementById('ranking-header');
    const bodyContainer = document.getElementById('ranking-body');

    if (headerContainer) headerContainer.innerHTML = '';
    if (bodyContainer) bodyContainer.innerHTML = '';

    if (playerIdsToShow.length === 0) {
        bodyContainer.innerHTML = `<p style="padding: 30px; text-align: center; color: #e74c3c;">
            No se encontraron jugadores que coincidan con el filtro: ${currentFilter || 'Ninguno'}.
        </p>`;
        return;
    }

    function getSkillColorClass(score) {
        if (score >= 8) return 'skill-score-good';
        if (score >= 5) return 'skill-score-avg';
        return 'skill-score-low';
    }

    // --- CONSTRUCCIÓN DE LA CABECERA ---
    if (headerContainer) {
        let skillHeaders = '';
        const allSkills = {
            'bypassing': 'BPASS',
            'pvp': 'PVP',
            'defensa': 'DEF'
        };

        // 1. Define qué headers de habilidad mostrar
        if (highlightSkill && allSkills[highlightSkill]) {
            skillHeaders += `<div class="header-skill single-skill">${allSkills[highlightSkill]}</div>`;
        } else {
            // Muestra TODAS las columnas de habilidad
            skillHeaders = `
                <div class="header-skill">BPASS</div>
                <div class="header-skill">PVP</div>
                <div class="header-skill">DEF</div>
            `;
        }

        headerContainer.innerHTML = `
            <div class="header-rank">#</div>
            <div class="header-avatar"></div>
            <div class="header-info">JUGADOR</div>
            <div class="header-points">ELO</div>
            ${skillHeaders}
            <div class="header-tier">TIER</div>
            <div class="header-badges">INSIGNIAS</div>
        `;
    }

    // --- CONSTRUCCIÓN DEL CUERPO (Filas) ---
    playerIdsToShow.forEach((playerId, index) => {
        const playerDetails = allPlayersData[playerId];

        if (playerDetails) {
            const item = document.createElement('div');
            item.classList.add('ranking-item');
            if (highlightSkill) {
                // Añade una clase a la fila para que el CSS pueda adaptar los anchos
                item.classList.add('single-skill-mode');
            }

            // Verificación de Discord
            const discordStatus = playerDetails.discordVerified
                ? `<span class="discord-verified" title="Verificado en Discord">✓ ${playerDetails.discordTag || ''}</span>`
                : `<span class="discord-not-verified" title="No verificado">✗ No verificado</span>`;

            // Rank, Avatar, Info, ELO...
            item.innerHTML = `
                <div class="rank">${isFiltered ? index + 1 : fullRankingData.rankings.indexOf(playerId) + 1}</div>
                <div class="avatar"><img src="${playerDetails.avatar}" alt="${playerDetails.name}"></div>
                <div class="info">
                    <div class="name">${playerDetails.name}</div>
                    <div>Región: ${playerDetails.region}</div>
                    <div class="discord-status">${discordStatus}</div>
                </div>
                <div class="header-points"><strong>${playerDetails.points}</strong></div>
            `;

            const skills = playerDetails.skills || {};
            let skillCells = '';

            // 2. Define qué celdas de habilidad mostrar
            if (highlightSkill && skills[highlightSkill] !== undefined) {
                // Muestra SOLO la habilidad resaltada
                skillCells += `<div class="skill-col single-skill ${getSkillColorClass(skills[highlightSkill])}">${skills[highlightSkill] || '-'}</div>`;
            } else if (!highlightSkill) {
                // Muestra TODAS las habilidades
                skillCells += `<div class="skill-col ${getSkillColorClass(skills.bypassing || 0)}">${skills.bypassing || '-'}</div>`;
                skillCells += `<div class="skill-col ${getSkillColorClass(skills.pvp || 0)}">${skills.pvp || '-'}</div>`;
                skillCells += `<div class="skill-col ${getSkillColorClass(skills.defensa || 0)}">${skills.defensa || '-'}</div>`;
            }

            item.innerHTML += skillCells;

            // Tier e Insignias
            const tierDisplay = getTierDisplay(playerDetails.tier);
            const tierColor = getTierColor(playerDetails.tier);

            item.innerHTML += `
                <div class="header-tier">
                    <span class="tier" style="background-color: ${tierColor}; color: #1f1f1f; padding: 5px 10px; border-radius: 5px; font-weight: bold;">
                        ${tierDisplay}
                    </span>
                </div>
                <div class="badges header-badges">
                    ${playerDetails.badges.map(b => `<img src="${b.icon}" title="${b.title}">`).join('')}
                </div>
            `;

            bodyContainer.appendChild(item);
        }
    });
}

// ====================================================================
// 3. FUNCIONES DE FILTRADO Y ORDENAMIENTO
// ====================================================================

function filtrarRanking() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (!fullRankingData) return;

    if (searchTerm === '') {
        currentFilter = '';
        construirRanking(fullRankingData.rankings, allPlayersData, false, null);
        return;
    }

    const filteredPlayerIds = fullRankingData.rankings.filter(playerId => {
        const player = allPlayersData[playerId];
        return (
            player.name.toLowerCase().includes(searchTerm) ||
            player.region.toLowerCase().includes(searchTerm)
        );
    });

    currentFilter = searchTerm;
    // Búsqueda por texto: no oculta habilidades (highlightSkill = null)
    construirRanking(filteredPlayerIds, allPlayersData, true, null);
}

// Filtra, ORDENA y pasa el nombre de la habilidad a resaltar
function filtrarPorHabilidad(skillName, minScore) {
    if (!fullRankingData) return;

    // 1. FILTRADO
    const filteredPlayerIds = fullRankingData.rankings.filter(playerId => {
        const player = allPlayersData[playerId];
        const skillScore = player.skills[skillName] || 0;
        return skillScore >= minScore;
    });

    // 2. ORDENAMIENTO POR LA HABILIDAD SELECCIONADA
    const sortedPlayerIds = [...filteredPlayerIds].sort((idA, idB) => {
        const playerA = allPlayersData[idA];
        const playerB = allPlayersData[idB];

        const scoreA = playerA.skills[skillName] || 0;
        const scoreB = playerB.skills[skillName] || 0;

        // Orden descendente (mayor puntuación primero)
        if (scoreA !== scoreB) {
            return scoreB - scoreA;
        }

        // Desempate: Si los puntajes son iguales, usa el orden original del ranking
        return fullRankingData.rankings.indexOf(idA) - fullRankingData.rankings.indexOf(idB);
    });

    currentFilter = `Top ${minScore} en ${skillName}`;
    // Llama a construirRanking con los IDs ORDENADOS y la habilidad a resaltar
    construirRanking(sortedPlayerIds, allPlayersData, true, skillName);
}

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    currentFilter = '';
    construirRanking(fullRankingData.rankings, allPlayersData, false, null);
}

// ====================================================================
// 4. CARGAR TOPS (Para la página tops.html)
// ====================================================================

async function cargarTopsPorCategoria(category) {
    try {
        const response = await fetch(JSON_FILE);

        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Convertir objeto de jugadores a array
        const playersArray = Object.values(data.players);

        // Ordenar según la categoría
        let sortedPlayers = [];
        switch (category) {
            case 'wins':
                sortedPlayers = playersArray.sort((a, b) => b.stats.wins - a.stats.wins);
                break;
            case 'kills':
                sortedPlayers = playersArray.sort((a, b) => b.stats.kills - a.stats.kills);
                break;
            case 'goles':
                sortedPlayers = playersArray.sort((a, b) => b.stats.goles - a.stats.goles);
                break;
            case 'winrate':
                sortedPlayers = playersArray.sort((a, b) => b.stats.winrate - a.stats.winrate);
                break;
            default: // 'general' o points
                sortedPlayers = playersArray.sort((a, b) => b.points - a.points);
        }

        return sortedPlayers;
    } catch (error) {
        console.error("Error al cargar tops:", error);
        return [];
    }
}

function renderTopPlayers(category = 'general') {
    cargarTopsPorCategoria(category).then(players => {
        const container = document.getElementById('tops-container');
        if (!container) return;

        container.innerHTML = '';

        players.forEach((player, index) => {
            const item = document.createElement('div');
            item.classList.add('top-item');

            const tierColor = getTierColor(player.tier);
            const tierDisplay = getTierDisplay(player.tier);

            // Estado de verificación de Discord
            const discordStatus = player.discordVerified
                ? `<div class="discord-verified-badge">✓ Verificado en Discord</div><div class="discord-tag">${player.discordTag || ''}</div>`
                : `<div class="discord-not-verified-badge">✗ No verificado en Discord</div>`;

            let statDisplay = '';
            switch (category) {
                case 'wins':
                    statDisplay = `<div class="stat-value">${player.stats.wins} Victorias</div>`;
                    break;
                case 'kills':
                    statDisplay = `<div class="stat-value">${player.stats.kills} Kills</div>`;
                    break;
                case 'goles':
                    statDisplay = `<div class="stat-value">${player.stats.goles} Goles</div>`;
                    break;
                case 'winrate':
                    statDisplay = `<div class="stat-value">${player.stats.winrate}% Winrate</div>`;
                    break;
                default:
                    statDisplay = `<div class="stat-value">${player.points} ELO</div>`;
            }

            item.innerHTML = `
                <div class="top-rank">#${index + 1}</div>
                <div class="top-avatar">
                    <img src="${player.avatar}" alt="${player.name}">
                </div>
                <div class="top-info">
                    <div class="top-name">${player.name}</div>
                    ${statDisplay}
                    <div class="top-tier" style="background-color: ${tierColor}; color: #1f1f1f; padding: 5px 10px; border-radius: 5px; display: inline-block; font-weight: bold; margin-top: 5px;">
                        ${tierDisplay}
                    </div>
                    <div class="discord-info">
                        ${discordStatus}
                    </div>
                </div>
                <div class="top-stats-detail">
                    <div>Wins: ${player.stats.wins}</div>
                    <div>Kills: ${player.stats.kills}</div>
                    <div>Goles: ${player.stats.goles}</div>
                    <div>Winrate: ${player.stats.winrate}%</div>
                </div>
            `;

            container.appendChild(item);
        });
    });
}

// ====================================================================
// 5. INICIO DE LA APLICACIÓN
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página de clasificación, cargar los rankings
    if (document.getElementById('ranking-body')) {
        cargarYMostrarRankings();
    }

    // Si estamos en la página de tops, cargar los tops
    if (document.getElementById('tops-container')) {
        renderTopPlayers('general');
    }
});
