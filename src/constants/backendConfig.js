module.exports = {
	httpCodes: {
		internalServerError: 500,
		notFound: 404,
		success: 200,
		badRequest: 400
	},
	httpColorCodes: {
		internalServerError: 31,
		badRequest: 33,
		multipleChoices: 36,
		success: 32
	},
	mysql: {
		local: {
			host: "127.0.0.1",
			user: "root",
			password: "",
			database: "ecommerce"
		},
		prod: {
			host: "relevel-ecommerce.cvyl0jb1nhb0.ap-south-1.rds.amazonaws.com",
			user: "relevel",
			password: "Ecommerce#2021",
			database: "ecommercedb"
		}
	},
	userType: {
		user: 1,
		vendor: 2
	}
};