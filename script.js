// ====================================================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ====================================================================

let fullRankingData = null; 
let allPlayersData = {}; 
let currentFilter = ''; 

const JSON_FILE = 'data.json'; 


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
            ${skillHeaders} <div class="header-tier">TIER</div>
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

            // Rank, Avatar, Info, ELO... 
            item.innerHTML = `
                <div class="rank">${isFiltered ? index + 1 : fullRankingData.rankings.indexOf(playerId) + 1}</div>
                <div class="avatar"><img src="${playerDetails.avatar}" alt="${playerDetails.name}"></div>
                <div class="info">
                    <div class="name">${playerDetails.name}</div>
                    <div>Región: ${playerDetails.region}</div>
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
            item.innerHTML += `
                <div class="header-tier"><span class="tier tier-${playerDetails.tier}">${playerDetails.tier}</span></div>
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
// 4. VALIDACIÓN DE FORMULARIO (ELIMINADA)
// La validación se gestionará con HTML5 'required' y el servicio de formularios.
// ====================================================================


// ====================================================================
// 5. INICIO DE LA APLICACIÓN
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página de clasificación, cargar los rankings
    if (document.getElementById('ranking-body')) {
        cargarYMostrarRankings();
    }
    
    // NOTA: La validación del formulario de 'informacion.html' ya NO está aquí.
    // El envío se gestiona por el atributo 'action' del formulario en el HTML.
});
