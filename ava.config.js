export default {
    files: [
        "tests/**/*.test.js"
    ],
    concurrency: 3,
    verbose: true,
    require: [
        "@babel/register"
    ]
};
