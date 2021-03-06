'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var isString = require( 'validate.io-string-primitive' );
var copy = require( 'utils-copy' );
var validate = require( './validate.js' );
var defaults = require( './defaults.json' );
var query = require( './query.js' );


// VARIABLES //

var DEFAULT_HTTP_PORT = 80;
var DEFAULT_HTTPS_PORT = 443;


// CREATE ISSUE //

/**
* FUNCTION: createIssue( slug, title, options, clbk )
*	Creates an issue on a Github repository.
*
* @param {String} slug - repository slug
* @param {String} title - issue title
* @param {Object} options - function options
* @param {String} options.token - Github access token
* @param {String} [options.useragent] - user agent string
* @param {String} [options.body=""] - issue content
* @param {String} [options.assignee] - Github username of an assigned user
* @param {Number} [options.milestone] - number of associated milestone
* @param {String[]} [options.labels] - issue labels
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Void}
*/
function createIssue( slug, title, options, clbk ) {
	var opts;
	var err;
	if ( !isString( slug ) ) {
		throw new TypeError( 'invalid input argument. Repository slug must be a string primitive. Value: `' + slug + '`.' );
	}
	if ( !isString( title ) ) {
		throw new TypeError( 'invalid input argument. Issue title must be a string primitive. Value: `' + title + '`.' );
	}
	opts = copy( defaults );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	if ( opts.port === null ) {
		if ( opts.protocol === 'https' ) {
			opts.port = DEFAULT_HTTPS_PORT;
		} else {
			opts.port = DEFAULT_HTTP_PORT;
		}
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
	}
	query( slug, title, opts, done );
	/**
	* FUNCTION: done( error, data, info )
	*	Callback invoked after receiving an API response.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object} data - query data
	* @param {Object} info - response info
	* @returns {Void}
	*/
	function done( error, data, info ) {
		error = error || null;
		data = data || null;
		info = info || null;
		clbk( error, data, info );
	} // end FUNCTION done()
} // end FUNCTION createIssue()


// EXPORTS //

module.exports = createIssue;
