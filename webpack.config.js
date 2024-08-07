const path = require("path");

module.exports = {
	entry: {
		main: "./src/backend/main.ts",
		popup: "./src/frontend/popup.ts",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "production",
};
