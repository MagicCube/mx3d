"use strict";

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    context: path.resolve("./src"),
    entry: [ "babel-polyfill", "./index.js" ],
    resolve: {
        alias: {
            "mx3d": path.resolve("./src/mx3d"),
            "bridge3d": path.resolve("./src/bridge3d"),
            "normalize.css": path.resolve("./node_modules/normalize.css/normalize.css")
        }
    },
    output: {
        path: path.resolve("./public/assets"),
        publicPath: "/assets/",
        filename: "bridge3d.js",
        library: "bridge3d"
    },
    devServer: {
        contentBase: path.resolve("./public")
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    "babel-loader"
                ]
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./res/index.css"),
        new webpack.ProvidePlugin({
            "THREE": "three",
            "TWEEN": "tween.js"
        })
    ]
};
