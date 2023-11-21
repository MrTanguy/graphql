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

            const sql = `SELECT * FROM game WHERE 1${whereClause} LIMIT ? OFFSET ?`;
            const [rows] = await pool.execute(sql, [...params, limit, (page - 1) * limit]);

            const results = rows.map((game) => {
                return {
                    ...game,
                };
            });

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
