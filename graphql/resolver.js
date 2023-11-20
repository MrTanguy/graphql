const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: 'graphql'
});

const resolver = {
    games: async ({ page, genre, platform, studio }) => {
        try {
            // Construire la clause WHERE en fonction des paramètres fournis
            let whereClause = '';
            const params = [];

            if (genre) {
            whereClause += ' AND genre = ?';
            params.push(genre);
            }

            if (platform) {
            whereClause += ' AND platform = ?';
            params.push(platform);
            }

            if (studio) {
            whereClause += ' AND studio = ?';
            params.push(studio);
            }

            // Calculer les limites de pagination
            const limit = 15; // Nombre d'éléments par page

            // Requête SQL pour récupérer les jeux avec pagination et filtres
            const sql = `SELECT * FROM game WHERE 1 ${whereClause} LIMIT ?`;
            const [rows] = await pool.execute(sql, [...params, limit]);

            // Requête pour obtenir le nombre total de jeux
            const countSql = `SELECT COUNT(*) as count FROM game WHERE 1 ${whereClause}`;
            const [countRows] = await pool.execute(countSql, params);
            const totalCount = countRows[0].count;

            // Calculer les informations de pagination
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
            const limit = 1; 

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
