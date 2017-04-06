module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'es6-shim'],
    browsers: ['PhantomJS'],
    files: [
      'dist/*.js',
      'test/*.js'
    ]
  });
};