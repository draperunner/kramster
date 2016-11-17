module.exports = {
  "plugins": [
    "angular"
  ],
  "extends": "angular",
  "env": {
    "browser": true,
  },
  "globals": {
    "renderMathInElement": false,
  },
  "rules": {
    "angular/di": ["error", "array"],
  }
};
