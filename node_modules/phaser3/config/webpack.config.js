'use strict';

const webpack = require('webpack');
const exec = require('child_process').exec;
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
    mode: 'development',

    context: `${__dirname}/../src/`,

    entry: {
        phaser: './phaser.js'
    },

    output: {
        path: `${__dirname}/../build/`,
        filename: '[name].js',
        library: 'Phaser',
        libraryTarget: 'umd',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // string
        devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]', // string
        umdNamedDefine: true,
        globalObject: 'this'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: true,
                    keep_fnames: true,
                    safari10: false,
                },
            }),
        ],
    },


    performance: { hints: false },

    plugins: [
        new webpack.DefinePlugin({
            "typeof CANVAS_RENDERER": JSON.stringify(true),
            "typeof WEBGL_RENDERER": JSON.stringify(true),
            "typeof EXPERIMENTAL": JSON.stringify(true),
            // "typeof PLUGIN_3D": JSON.stringify(false),
            // "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
            // "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
            "typeof FEATURE_SOUND": JSON.stringify(true)
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    exec('node scripts/copy-to-examples.js', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
            }
        }
    ],

    devtool: 'source-map'
};
