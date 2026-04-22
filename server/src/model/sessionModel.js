"use strict";

const pool = require("../db/dbConnection");

async function createSession(userId, token, expiresAt) {
  const queryText = `
    INSERT INTO user_sessions (user_id, token, expires_at)
    VALUES ($1, $2, $3)
  `;
  await pool.query(queryText, [userId, token, expiresAt]);
}

async function findActiveSessionUserByToken(token) {
  const queryText = `
    SELECT u.id, u.name, u.email
    FROM user_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = $1
      AND (s.expires_at IS NULL OR s.expires_at > NOW())
  `;
  const result = await pool.query(queryText, [token]);
  return result.rows[0] || null;
}

async function deleteSessionByToken(token) {
  const queryText = "DELETE FROM user_sessions WHERE token = $1";
  await pool.query(queryText, [token]);
}

module.exports = {
  createSession,
  findActiveSessionUserByToken,
  deleteSessionByToken,
};

