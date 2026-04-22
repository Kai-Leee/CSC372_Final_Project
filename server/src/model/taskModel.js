"use strict";

const pool = require("../db/dbConnection");

async function getTasksByUserId(userId) {
    const queryText = `
        SELECT id,
               user_id,
               title,
               notes,
               category,
               priority,
               due_date,
               completed,
               created_at,
               updated_at
        FROM tasks
        WHERE user_id = $1
        ORDER BY completed ASC, due_date ASC NULLS LAST, created_at DESC
    `;
    const result = await pool.query(queryText, [userId]);
    return result.rows;
}

async function getTaskByIdForUser(taskId, userId) {
    const queryText = `
        SELECT id,
               user_id,
               title,
               notes,
               category,
               priority,
               due_date,
               completed,
               created_at,
               updated_at
        FROM tasks
        WHERE id = $1
          AND user_id = $2
    `;
    const result = await pool.query(queryText, [taskId, userId]);
    return result.rows[0] || null;
}

async function createTaskForUser(userId, payload) {
    const queryText = `
        INSERT INTO tasks (user_id, title, notes, category, priority, due_date)
        VALUES ($1, $2, $3, $4, $5,
                $6) RETURNING id, user_id, title, notes, category, priority, due_date, completed, created_at, updated_at
    `;
    const values = [
        userId,
        payload.title.trim(),
        (payload.notes || "").trim(),
        (payload.category || "personal").toLowerCase(),
        (payload.priority || "medium").toLowerCase(),
        payload.dueDate || null,
    ];
    const result = await pool.query(queryText, values);
    return result.rows[0];
}

async function updateTaskForUser(taskId, userId, payload, currentTask) {
    const nextTitle = (payload.title ?? currentTask.title).trim();
    const queryText = `
        UPDATE tasks
        SET title      = $1,
            notes      = $2,
            category   = $3,
            priority   = $4,
            due_date   = $5,
            completed  = $6,
            updated_at = NOW()
        WHERE id = $7
          AND user_id = $8 RETURNING id, user_id, title, notes, category, priority, due_date, completed, created_at, updated_at
    `;
    const values = [
        nextTitle,
        (payload.notes ?? currentTask.notes ?? "").trim(),
        (payload.category ?? currentTask.category ?? "personal").toLowerCase(),
        (payload.priority ?? currentTask.priority ?? "medium").toLowerCase(),
        payload.dueDate ?? currentTask.due_date ?? null,
        typeof payload.completed === "boolean"
            ? payload.completed
            : currentTask.completed,
        taskId,
        userId,
    ];
    const result = await pool.query(queryText, values);
    return result.rows[0];
}

async function deleteTaskForUser(taskId, userId) {
    const queryText = "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id";
    const result = await pool.query(queryText, [taskId, userId]);
    return result.rows[0] || null;
}

module.exports = {
    getTasksByUserId,
    getTaskByIdForUser,
    createTaskForUser,
    updateTaskForUser,
    deleteTaskForUser,
};

