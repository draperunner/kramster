module.exports = {
    'env': {
        'es6': true,
    },
    'extends': [
      'airbnb-base'
    ],
    'parserOptions': {
      'sourceType': 'module'
    },
    'rules': {
      'brace-style': ['warn', 'stroustrup'],
      'jsx-a11y/no-static-element-interactions': 'off',
      'max-len': ['warn', 120],
      'no-param-reassign': 'off',
      'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    }
};
