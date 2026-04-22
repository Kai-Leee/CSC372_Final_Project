"use strict";

const pool = require("../db/dbConnection");

async function createUser(name, email, passwordHash) {
  const queryText = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, LOWER($2), $3)
    RETURNING id, name, email
  `;
  const values = [name.trim(), email, passwordHash];
  const result = await pool.query(queryText, values);
  return result.rows[0];
}

async function findUserForLoginByEmail(email) {
  const queryText = `
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = LOWER($1)
  `;
  const result = await pool.query(queryText, [email]);
  return result.rows[0] || null;
}

async function findUserById(id) {
  const queryText = "SELECT id, name, email FROM users WHERE id = $1";
  const result = await pool.query(queryText, [id]);
  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findUserForLoginByEmail,
  findUserById,
};

