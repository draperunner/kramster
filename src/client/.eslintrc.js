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
    'no-underscore-dangle': 'off',
    'react/prop-types': ['error', { ignore: ['children', 'params', 'location', 'router'] }],
    'react/require-default-props': 'off'
  }
};
