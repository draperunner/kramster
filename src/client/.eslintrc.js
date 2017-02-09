module.exports = {
  'extends': 'airbnb',
  'env': {
    'browser': true,
  },
  'globals': {
    'renderMathInElement': false,
  },
  'rules': {
    'max-len': ['warn', 120],
    'react/prop-types': ['error', { ignore: ['params', 'location'] }]
  }
};
