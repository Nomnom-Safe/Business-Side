// Legacy Mongoose model removed.
// Routes now use Firestore services. If you see an import of this file,
// replace it with the appropriate service in `src/services`.

module.exports = new Proxy(
	{},
	{
		get() {
			throw new Error(
				'Legacy model `User` removed. Use ../services/userService instead.',
			);
		},
	},
);
