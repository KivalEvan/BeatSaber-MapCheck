const path = require('path');

module.exports = {
    entry: ['./src/ts'],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // optimization: {
    //     providedExports: false,
    // },
};
