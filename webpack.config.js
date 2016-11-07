"use strict";

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    context: path.resolve("./src"),
    entry: {
        "vendor": [ "jquery", "three" ],
        "bridge": [ "./examples/bridge/index.js", "./examples/bridge/res/index.less" ],
        "simple-cube": [ "./examples/simple-cube/index.js", "./examples/simple-cube/res/index.less" ]
    },
    resolve: {
        alias: {
            "mx3d": path.resolve("./src/mx3d"),
            "THREE": path.resolve("./src/THREE"),
            "normalize.less": path.resolve("./src/normalize/res/normalize.less")
        }
    },
    output: {
        path: path.resolve("./public/assets"),
        publicPath: "/assets/",
        filename: "[name]/index.js"
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
                loader: "css-loader!less-loader"
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./[name]/res/index.css"),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "THREE": "three"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.js",
            minChunks: Infinity
        }),
    ]
};
