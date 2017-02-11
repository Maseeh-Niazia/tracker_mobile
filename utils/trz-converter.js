/*
	trz-converter.js
	Copyright Cameron Carmichael Alonso, 2017. All Rights Reserved.
*/

// Requirements
var fs = require('fs-extra');
var gutil = require('gulp-util'); // We're going to assume user has installed dependencies - this looks nicer for logging
var minimist = require('minimist');
var parser = require('xml2json');
var findKey = require('lodash.findkey');
var replace = require('replace-in-file');
var AdmZip = require('adm-zip');

// Configuration
var compileToPath = "./converted_files";

// Windows-specific modifications
var isWindows = /^win/.test(process.platform);
var splitByChar = "/";
if (isWindows) {
	splitByChar = "\\";
}

// Get input file path from command line params
var parseArgs = minimist(process.argv.slice(2));
var filePath = parseArgs["f"];
var splitFilePath = filePath.split(splitByChar);

// Check this is a string to ensure path parameters have been passed
if (typeof filePath != "string") {
	gutil.log(gutil.colors.red('Error:'), 'invalid file path');
	process.exit();
}

// Ensure file is a *.TRZ (Tracker zip file - contains TRK and frames)
if (!filePath.includes(".trz") && !filePath.includes(".TRZ")) {
	gutil.log(gutil.colors.red('Error:'), 'file must be a Tracker zip file (.trz)');
	process.exit();
}

// Check filepath exists
if (!fs.existsSync(filePath)) {
    gutil.log(gutil.colors.red('Error:'), 'file doesn\'t exist at path');
	process.exit();
}

// Unzip contents of zip
gutil.log(gutil.colors.green("Export"), 'unzipping Tracker file...');
var zip = new AdmZip(filePath);
var newFilePath = filePath.replace(".trz", "-unzipped-temp").replace(".TRZ", "-unzipped-temp");
zip.extractAllTo(newFilePath, true);

// Append Tracker file name to compile path
var fileName = splitFilePath[splitFilePath.length-1].replace("trz", "trk");
compileToPath += "/" + fileName.split(".")[0];

// Ensure compileToPath is created
gutil.log(gutil.colors.green("Export"), 'creating export directory...');
fs.exists(compileToPath.split(splitByChar)[1], function(exists) {
	if (!exists) {
		fs.mkdir(compileToPath.split(splitByChar)[1], function(err) {

		    if ( err ) {
		      gutil.log(gutil.colors.red('Error:'), err);
		      process.exit();
		    }

		});
	}

	gutil.log(gutil.colors.green("Export"), 'files will be exported to:', compileToPath);

	// Copy images to path
	gutil.log(gutil.colors.green("Export"), 'copying video frames...');
	fs.copy(newFilePath + "/videos", compileToPath + "/frames", function (err) {

		if (err) {
			gutil.log(gutil.colors.red('Error:'), 'couldn\'t copy video frames');
			process.exit();
		}

		// Open .trk as JSON
		// it's far easier to work in JSON than XML in Node
		gutil.log(gutil.colors.green("Export"), 'processing .trk file...');
		gutil.log(gutil.colors.green("Export"), 'file at:', newFilePath + "/" + fileName);
		fs.readFile(newFilePath + "/" + fileName, function (err, fileData) {

			if (err) {
				gutil.log(gutil.colors.red('Error:'), 'couldn\'t read .trk file');
				process.exit();
			}

			// Variables to populate to later export
			var config = {};
			var data = {};

			// Convert to JSON
			var jsonData = JSON.parse(parser.toJson(fileData));
			var property = jsonData["object"]["property"];

			// Begin populating config
			config["application"] = {"name": fileName.split(".")[0]};
			config["video"] = {
				height: 350, // minimum height for video
				width: 650 // minimum width for video
			}
			config['rightT'] = {visible: false};
			config['rightB'] = {visible: false};
			config['bottomL'] = {visible: false};
			config['bottomR'] = {visible: false};

			// Populate data
			var videoclip = property[findKey(property, {'name': 'videoclip'})]["object"]["property"];
			var videoProperty = videoclip[findKey(videoclip, {'name': 'video'})]["object"]["property"];
			//parseFloat(videoProperty[findKey(videoProperty, {'name': 'delta_t'})]["$t"])

			// Get name of all frames
			var frames = [];
			var frameFiles = fs.readdirSync(compileToPath + "/frames");

			frameFiles.forEach(file => {
				frames.push("frames" + "/" + file);
			});

			data["video"] = {
			    frameStart: parseInt(videoclip[findKey(videoclip, {'name': 'startframe'})]["$t"]),
			    frameStep: parseInt(videoclip[findKey(videoclip, {'name': 'stepsize'})]["$t"]),
			    frameRate: (1000 / parseInt(videoProperty[findKey(videoProperty, {'name': 'delta_t'})]["$t"])), // fps calculated from delta_t
			    playRate: 1.0, // percentage
			    frameCurrent: 0, // current frame
			    frames: frames,
			    height: parseInt(property[findKey(property, {'name': 'height'})]["$t"]),
				width: parseInt(property[findKey(property, {'name': 'width'})]["$t"]),
			};

			data['matrix'] = {
				xorigin: 176.0,
				yorigin: 82.0,
				angle: 1.2188752351312977,
				xscale: 81.66386719485864,
				yscale: 81.66386719485864
			};

	  		data['axis'] = {
				visible: true
			};

			data['objects'] = [];

			console.log(config);
			console.log("\n");
			console.log(data);

			// Copy template and tracker to directory
			gutil.log(gutil.colors.green("Export"), 'copying tracker.js file...');
			fs.copy("./tracker.js", compileToPath + "/tracker.js", function (err) {

				if (err) {
					gutil.log(gutil.colors.red('Error:'), 'couldn\'t copy tracker');
					process.exit();
				}

				gutil.log(gutil.colors.green("Export"), 'copying index.html file...');
				fs.copy("./utils/tracker_template.html", compileToPath + "/index.html", function (err) {

					if (err) {
						gutil.log(gutil.colors.red('Error:'), 'couldn\'t copy tracker html');
						process.exit();
					}

					// Replace
					const options = {
						files:  compileToPath + "/index.html",
						replace: ['[TRACKER_CONFIG_DICTIONARY]', '[TRACKER_DATA_DICTIONARY]'],
						with: [JSON.stringify(config), JSON.stringify(data)],
						allowEmptyPaths: false,
						encoding: 'utf8',
					};

					gutil.log(gutil.colors.green("Export"), 'replacing placeholders with data...');
					replace.sync(options);

					gutil.log(gutil.colors.green("Export"), 'Completed successfully!');

				});

			});

		});

	})

});
