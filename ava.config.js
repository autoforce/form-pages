export default {
    files: [
        "test/**/*.test.js"
    ],
    concurrency: 3,
    verbose: true,
    require: [
        "@babel/register"
    ]
};
