module.exports = {
  'extends': 'airbnb',
  'env': {
    'browser': true,
  },
  'globals': {
    'renderMathInElement': false,
  },
  'rules': {
    'jsx-a11y/no-static-element-interactions': 'off',
    'max-len': ['warn', 120],
    'react/prop-types': ['error', { ignore: ['params', 'location', 'router'] }]
  }
};
