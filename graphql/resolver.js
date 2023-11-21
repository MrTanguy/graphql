const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: 'graphql'
});

const resolver = {
    games: async ({ page = 1, genre, platform, studio }) => {
        try {
            // Gestion des filtres
            let whereClause = '';
            const params = [];

            if (genre) {
                whereClause += ' AND game.id IN (SELECT gameId FROM gameGenre INNER JOIN genre ON gameGenre.genreId = genre.id WHERE genre.name LIKE ?)';
                params.push(`%${genre}%`);
            }

            if (platform) {
                whereClause += ' AND game.id IN (SELECT gameId FROM gamePlatform INNER JOIN platform ON gamePlatform.platformId = platform.id WHERE platform.name LIKE ?)';
                params.push(`%${platform}%`);
            }

            if (studio) {
                whereClause += ' AND game.id IN (SELECT gameId FROM gameStudio INNER JOIN studio ON gameStudio.studioId = studio.id WHERE studio.name LIKE ?)';
                params.push(`%${studio}%`);
            }

            const limit = 15;

            const sql = `
            SELECT 
                game.*, 
                GROUP_CONCAT(DISTINCT genre.name) as genres,
                GROUP_CONCAT(DISTINCT editor.name) as editors,
                GROUP_CONCAT(DISTINCT editor.id) as editorsId
            FROM game
            LEFT JOIN gameGenre ON game.id = gameGenre.gameId
            LEFT JOIN genre ON gameGenre.genreId = genre.id
            LEFT JOIN gameEditor ON game.id = gameEditor.gameId
            LEFT JOIN editor ON gameEditor.editorId = editor.id
            WHERE 1 ${whereClause}
            GROUP BY game.id
            LIMIT ? OFFSET ?
            `;

            const [rows] = await pool.execute(sql, [...params, limit, (page - 1) * limit]);

            const results = rows.map((game) => {

                const formattedGenres = game.genres ? game.genres.split(',') : [];   

                const formattedEditors = game.editors ? game.editors.split(',') : [];
                const editorsArray = formattedEditors.map((value, i) => {
                    const editorName = value.trim(); 
                    const editorId = game.editorsId.split(',')[i];
                    return { id: editorId, name: editorName };
                });
            
                return {
                    ...game,
                    genres: formattedGenres,
                    editors: editorsArray, 
                };
            });
              
            // Gestion de la partie infos
            const countSql = `SELECT COUNT(*) as count FROM game WHERE 1 ${whereClause}`;
            const [countRows] = await pool.execute(countSql, params);
            const totalCount = countRows[0].count;

            const totalPages = Math.ceil(totalCount / limit);
            const nextPage = page < totalPages ? page + 1 : null;
            const previousPage = page > 1 ? page - 1 : null;

            return {
                infos: {
                    count: totalCount,
                    pages: totalPages,
                    nextPage: nextPage,
                    previousPage: previousPage,
                },
                results: results
            };
        } catch (error) {
          console.error("Error fetching games:", error);
          throw new Error("Internal server error");
        }
    },
    game: async ({ id }) => {
        try {
            const sql = `
            SELECT 
                game.*,
                GROUP_CONCAT(DISTINCT genre.name) as genres,
                GROUP_CONCAT(DISTINCT editor.name) as editors,
                GROUP_CONCAT(DISTINCT editor.id) as editorsId,
                GROUP_CONCAT(DISTINCT studio.name) as studios,
                GROUP_CONCAT(DISTINCT studio.id) as studiosId,
                GROUP_CONCAT(DISTINCT platform.name) as platforms
            FROM game
            LEFT JOIN gameGenre ON game.id = gameGenre.gameId
            LEFT JOIN genre ON gameGenre.genreId = genre.id
            LEFT JOIN gameEditor ON game.id = gameEditor.gameId
            LEFT JOIN editor ON gameEditor.editorId = editor.id
            LEFT JOIN gameStudio ON game.id = gameStudio.gameId
            LEFT JOIN studio ON gameStudio.studioId = studio.id
            LEFT JOIN gamePlatform ON game.id = gamePlatform.gameId
            LEFT JOIN platform ON gamePlatform.platformId = platform.id
            WHERE game.id = ?            
            `

            const [rows] = await pool.execute(sql, [id]);

            const formattedEditors = rows[0].editors ? rows[0].editors.split(',') : [];
            const editorsArray = formattedEditors.map((value, i) => {
                const editorName = value.trim();
                const editorId = rows[0].editorsId ? rows[0].editorsId.split(',')[i] : "";
                return { id: editorId, name: editorName };
            });

            const formattedStudios = rows[0].studios ? rows[0].studios.split(',') : [];
            const studiosArray = formattedStudios.map((value, i) => {
                const studioName = value.trim();
                const studioId = rows[0].studiosId ? rows[0].studiosId.split(',')[i]: "";
                return { id: studioId, name: studioName };
            });

            return {
                id: rows[0].id,
                name: rows[0].name,
                publicationDate: rows[0].publicationDate,
                genres: rows[0].genres ? rows[0].genres.split(',') : [],
                editors: editorsArray,
                studios: studiosArray,
                platform: rows[0].platforms ? rows[0].platforms.split(',') : []
            }

        } catch (error) {
            console.error("Error fetching game:", error);
            throw new Error("Internal server error");
        }
    },
    editors: async ({ page = 1 }) => {
        try {
            const limit = 15;
            const offset = (page - 1) * limit;
    
            const sql = `
                SELECT 
                    editor.id,
                    editor.name,
                    GROUP_CONCAT(DISTINCT game.id) as gameIds,
                    GROUP_CONCAT(DISTINCT game.name) as gameNames
                FROM editor
                LEFT JOIN gameEditor ON editor.id = gameEditor.editorId
                LEFT JOIN game ON gameEditor.gameId = game.id
                GROUP BY editor.id
                LIMIT ? OFFSET ?
            `;
    
            const [rows] = await pool.execute(sql, [limit, offset]);
    
            const countSql = `SELECT COUNT(*) as count FROM editor`;
            const [countRows] = await pool.execute(countSql);
            const totalCount = countRows[0].count;
    
            const totalPages = Math.ceil(totalCount / limit);
            const nextPage = page < totalPages ? page + 1 : null;
            const previousPage = page > 1 ? page - 1 : null;
    
            const results = rows.map((editor) => {
                const gameIds = editor.gameIds ? editor.gameIds.split(',') : [];
                const gameNames = editor.gameNames ? editor.gameNames.split(',') : [];
    
                const games = gameIds.map((id, index) => ({
                    id: id,
                    name: gameNames[index],
                }));
    
                return {
                    id: editor.id,
                    name: editor.name,
                    games: games,
                };
            });
    
            return {
                infos: {
                    count: totalCount,
                    pages: totalPages,
                    nextPage: nextPage,
                    previousPage: previousPage,
                },
                results: results,
            };
        } catch (error) {
            console.error("Error fetching editors:", error);
            throw new Error("Internal server error");
        }
    },    
    editor: async ({ id }) => {
        try {
            const sql = `
                SELECT 
                editor.id,
                editor.name,
                GROUP_CONCAT(DISTINCT game.name) as gameNames,
                GROUP_CONCAT(DISTINCT game.id) as gameIds
                FROM editor
                LEFT JOIN gameEditor ON editor.id = gameEditor.editorId
                LEFT JOIN game ON gameEditor.gameId = game.id
                WHERE editor.id = ?
            `;
            const [rows] = await pool.execute(sql, [id]);
        
            if (rows.length === 0) {
                throw new Error(`Editor with id ${id} not found`);
            }
    
            const games = rows[0].gameNames ? rows[0].gameNames.split(',').map((name, i) => ({
                id: rows[0].gameIds.split(',')[i],
                name: name.trim(),
            })) : [];
        
            return {
                id: rows[0].id,
                name: rows[0].name,
                games: games,
            };
        } catch (error) {
            console.error("Error fetching editor:", error);
            throw new Error("Internal server error");
        }
    },
    studios: async ({ page = 1 }) => {
        try {
            const limit = 15;
            const offset = (page - 1) * limit;
    
            const sql = `
                SELECT 
                    studio.id,
                    studio.name,
                    GROUP_CONCAT(DISTINCT game.id) as gameIds,
                    GROUP_CONCAT(DISTINCT game.name) as gameNames
                FROM studio
                LEFT JOIN gameStudio ON studio.id = gameStudio.studioId
                LEFT JOIN game ON gameStudio.gameId = game.id
                GROUP BY studio.id
                LIMIT ? OFFSET ?
            `;
            const [rows] = await pool.execute(sql, [limit, offset]);
    
            const countSql = `SELECT COUNT(*) as count FROM studio`;
            const [countRows] = await pool.execute(countSql);
            const totalCount = countRows[0].count;
    
            const totalPages = Math.ceil(totalCount / limit);
            const nextPage = page < totalPages ? page + 1 : null;
            const previousPage = page > 1 ? page - 1 : null;
    
            const formattedResults = rows.map((studio) => ({
                id: studio.id,
                name: studio.name,
                games: studio.gameIds ? studio.gameIds.split(',').map((gameId, i) => ({
                    id: gameId.trim(),
                    name: studio.gameNames.split(',')[i].trim(),
                })) : [],
            }));
    
            return {
                infos: {
                    count: totalCount,
                    pages: totalPages,
                    nextPage: nextPage,
                    previousPage: previousPage,
                },
                results: formattedResults,
            };
        } catch (error) {
            console.error("Error fetching studios:", error);
            throw new Error("Internal server error");
        }
    },
    studio: async ({ id }) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM studio WHERE id = ?', [id]);

            return rows[0]; 
        } catch (error) {
            console.error("Error fetching studio:", error);
            throw new Error("Internal server error");
        }
    },
};

module.exports = resolver;
