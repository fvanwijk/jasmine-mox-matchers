module.exports = function (config) {
  require('./karma.base.conf')(config);

  // Jasmine 1 matchers cannot be included because this project is using Jasmine 2!

  config.set({
    files: config.files.concat([
      'src/jasmine-mox-matchers-1.x.js'
    ])
  });

};