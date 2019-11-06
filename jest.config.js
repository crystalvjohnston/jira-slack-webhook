module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/testConfig/fileTransformer.js"
    },
    testRegex: "tests/.*\\.(test|spec)\\.(jsx?|tsx?)$",
    verbose: true,
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1"
    },

};
