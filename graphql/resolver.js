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
                // Traitement des genres
                const formattedGenres = game.genres ? game.genres.split(',') : [];
            
                // Traitement des éditeurs
                const formattedEditors = game.editors ? game.editors.split(',') : [];
            
                // Mapping pour créer un tableau d'objets
                const editorsArray = formattedEditors.map((value, i) => {
                    const editorName = value.trim(); // Assurez-vous que le nom de l'éditeur n'est pas nul
                    const editorId = game.editorsId.split(',')[i];
                    return { id: editorId, name: editorName };
                });
            
                return {
                    ...game,
                    genres: formattedGenres, // Assurez-vous que "genres" est un tableau
                    editors: editorsArray,  // Assurez-vous que "editors" est un tableau
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
            const [rows] = await pool.execute('SELECT * FROM game WHERE id = ?', [id]);

            return rows[0]; 
        } catch (error) {
            console.error("Error fetching game:", error);
            throw new Error("Internal server error");
        }
    },
    editors: async ({ page }) => {
        try {
            const limit = 15; 

            const sql = `SELECT * FROM editor LIMIT ?`;
            const [rows] = await pool.execute(sql, [limit]);

            const countSql = `SELECT COUNT(*) as count FROM editor`;
            const [countRows] = await pool.execute(countSql);
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
            results: rows,
            };
        } catch (error) {
          console.error("Error fetching games:", error);
          throw new Error("Internal server error");
        }
    },
    editor: async ({ id }) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM editor WHERE id = ?', [id]);

            return rows[0]; 
        } catch (error) {
            console.error("Error fetching editor:", error);
            throw new Error("Internal server error");
        }
    },
    studios: async ({ page }) => {
        try {
            const limit = 15; 

            const sql = `SELECT * FROM studio LIMIT ?`;
            const [rows] = await pool.execute(sql, [limit]);

            const countSql = `SELECT COUNT(*) as count FROM studio`;
            const [countRows] = await pool.execute(countSql);
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
            results: rows,
            };
        } catch (error) {
          console.error("Error fetching games:", error);
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
