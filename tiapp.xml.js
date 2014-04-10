var fs = require('fs'),
	path = require('path'),
	xmldom = require('xmldom');

module.exports = Tiapp;

/**
 * Creates a new Tiapp object
 * @constructor
 *
 * @example
 * // Create a Tiapp object.
 * var tiapp = new Tiapp();
 *
 * @example
 * // Create a Tiapp object from an explicit file path.
 * var tiapp = new Tiapp('/path/to/tiapp.xml');
 *
 * @param {String} [file] Path to the tiapp.xml file to load. If one is not provided,
 *                        {@link Tiapp#find|find()} will attempt to find and load one automatically.
 *
 * @property {Object} doc XML document object, generated by {@link Tiapp#parse|parse()}. Generally you'll
 *                        use the Tiapp API and won't access this directly. If you need it, though, it is
 *                        available. Its usage can be found at https://github.com/jindw/xmldom.
 * @property {String} file Path to the tiapp.xml file. Setting `file` will call {@link Tiapp#parse|parse()}.
 */
function Tiapp(file) {

	// get and validate file
	if (typeof file !== 'undefined' && !isString(file)) {
		throw new Error('Bad argument. If defined, file must be a string.');
	}
	file = file || this.find();

	// define file
	Object.defineProperty(this, 'file', {
		configurable: true,
		enumerable: true,
		writable: false,
		value: file
	});

	// load file, if we have one
	if (this.file) {
		this.load(this.file);
	}
}

/**
 * Parses the given file as a tiapp.xml file and updates the Tiapp object. If a file is not
 * provided, {@link Tiapp#find|find()} will attempt to find one automatically. The file is
 * validated, read, and then {@link Tiapp#parse|parse()} is called.
 *
 * @param {String} [file] Path to the tiapp.xml file
 */
Tiapp.prototype.load = function parse(file) {

	// make sure we have a file
	file = file || this.find();
	if (!file || (file && !fs.existsSync(file))) {
		throw new Error('tiapp.xml not found');
	}

	// redefine file
	Object.defineProperty(this, 'file', {
		configurable: true,
		enumerable: true,
		writable: false,
		value: file
	});

	// parse the file
	this.parse(fs.readFileSync(file, 'utf8'));
};

/**
 * Parses the given string as xml and updates the current Tiapp object.
 *
 * @param {String} [xml] XML string to be parsed, presumedly a tiapp.xml
 */
Tiapp.prototype.parse = function parse(xml) {

	// make sure xml is a string
	if (!xml || !isString(xml)) {
		throw new Error('Bad argument. xml must be a string.');
	}

	// parse the xml
	this.doc = new xmldom.DOMParser().parseFromString(xml);
};

/**
 * Determines the location of the tiapp.xml file. It will search the current directory,
 * and all other directories higher in the view hierarchy, in order. If it does not find
 * a tiapp.xml in any of these directories, null is returned.
 *
 * @returns {String|null} The location of the tiapp.xml file, or null if not found.
 */

Tiapp.prototype.find = function find() {
	var cwd = process.cwd(),
		parts = cwd.split(path.sep);

	for (var i = 1, len = parts.len; i <= len; i++) {
		var p = path.join.apply(null, parts.slice(0, len-i).concat('tiapp.xml'));
		console.log(p);
	}
};

function isString(o) {
	return Object.prototype.toString.call(o) === '[object String]';
}
