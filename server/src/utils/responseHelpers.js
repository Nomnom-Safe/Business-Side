// utils/responseHelpers.js

/**
 * Sends a 200 OK response with a success flag and data payload.
 * @param {object} res - Express response object
 * @param {any} data - Data to send in the response
 */
const ok = (res, data) => res.status(200).json({ success: true, data });

/**
 * Sends a 201 Created response with a success flag and data payload.
 * @param {object} res - Express response object
 * @param {any} data - Data to send in the response
 */
const created = (res, data) => res.status(201).json({ success: true, data });

/**
 * Sends a 200 OK response with a success flag and a message.
 * @param {object} res - Express response object
 * @param {string} msg - Message to send in the response
 */
const message = (res, msg) =>
	res.status(200).json({ success: true, message: msg });

module.exports = { ok, created, message };
