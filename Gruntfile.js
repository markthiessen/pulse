// Gruntfile with the configuration of grunt-express and grunt-open. No livereload yet!
module.exports = function(grunt) {

  var settings = require("./settings");
  var port = settings.webserver.port || 3000;
  var liveReloadPort = settings.liveReload.port || 35729;

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  // Configure Grunt 
  grunt.initConfig({
 	watch: {
	    options: {
	    // Start a live reload server on the default port 35729
	      livereload: true,
	    },
	    css: {
	      files: ['public/stylesheets/**']
	    },
	    app: {
	      files: ['public/javascripts/**']
	    },
	    views: {
	    	files:['views/*']
	    },
	    serverjs: {
	      files: ['routes/**', 'tests/*.js'],
	      tasks: ['tests']
	    }
	  },
	nodemon: {
  		dev: {
  			file: 'app.js',
  			ignoredFiles: ['client/**'],
  			watchedExtensions: ['js', 'ejs', 'json'],
  			watchedFolders: ['routes']
  		}
	},
	nodeunit: {
		all: ['tests/*-tests.js']
	},
    open: {
      all: {
        path: 'http://localhost:3000'
      }
    },
    concurrent: {
	    server: ['nodemon', 'watch', 'delayOpen'],
	    options: {
	      logConcurrentOutput: true
	    }
	}
  });
 
 //delay opening browser - usually opens before server running
  grunt.registerTask('delayOpen', 'delay open', function(){
  	var done = this.async();
  	setTimeout(function(){
  		grunt.task.run('open');
  		done();
  	}, 1000);
  });

  grunt.registerTask('server', ['concurrent:server']);
  grunt.registerTask('tests', ['nodeunit:all']);
};