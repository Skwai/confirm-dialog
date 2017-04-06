module.exports = function(config) {
  config.set({
    preprocessors: {
      'test/**/*.js': ['babel']
    },
    frameworks: ['mocha', 'chai', 'es6-shim'],
    browsers: ['PhantomJS'],
    files: [
      'dist/*.js',
      'test/*.js'
    ]
  });
};