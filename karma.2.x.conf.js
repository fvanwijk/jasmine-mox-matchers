module.exports = function (config) {
  require('./karma.base.conf')(config);

  config.set({
    files: config.files.concat([
      'src/jasmine-mox-matchers-2.x.js'
    ])
  });

};