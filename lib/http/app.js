import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

const app = express();
// Middlewares
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Public static files
app.use(express.static("public"));
// Babel assets
const builderConfig = require("../../webpack.config");
const builder = webpack(Object.assign({
    devtool: "cheap-module-source-map"
}, builderConfig));
app.use(webpackDevMiddleware(
    builder,
    {
        publicPath: builderConfig.output.publicPath
    }
));

export default app;
