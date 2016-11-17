module.exports = {
    "env": {
        "es6": true,
    },
    "extends": [
      "airbnb-base"
    ],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
      "brace-style": ["warn", "stroustrup"],
      "max-len": ["warn", 120],
      "no-param-reassign": "off",
      "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    }
};
