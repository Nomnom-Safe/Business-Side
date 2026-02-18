// server/src/utils/asyncHandler.js
module.exports = function asyncHandler(fn) {
	return function (req, res, next) {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
