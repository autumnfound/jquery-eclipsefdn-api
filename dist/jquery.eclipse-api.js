/*
 *  jquery-eclipse-api - v0.0.1
 *  Fetch and display data from various Eclipse Foundation APIs.
 *  https://github.com/EclipseFdn/jquery-eclipse-api
 *
 *  Made by Christopher Guindon
 *  Under MIT License
 *
 *  Thanks to https://github.com/jquery-boilerplate/jquery-boilerplate, MIT License © Zeno Rocha
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {
	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn"t really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "eclipseApi",
			defaults = {
				eclipseApiUrl: "https://api.eclipse.org",
				eclipseGerritUrl: "https://git.eclipse.org/r",
				eclipseEventUrl: "https://events.eclipse.org/data/EclipseEvents.json",
				username: "cguindon",
				type: ""
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don"t want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				var validTypes = [
					"mpFavorites",
					"gerritReviews",
					"eclipseEvents"
				];
				if ($.type(this.settings.type) === "string" && $.inArray(this.settings.type, validTypes) !== -1) {
					this[this.settings.type]();
				}
			},
			mpFavorites: function() {
				var username = this.settings.username;
				var eclipseApiUrl = this.settings.eclipseApiUrl;
				// Exit if variables are not set.
				if (!username && !api_url) {
					return FALSE;
				}
				
				// Build api URI.
				var url = eclipseApiUrl + "/marketplace/favorites?name=" + username;
				// Execute ajax request
				$.ajax(url, {
					context: this.element,
					success: function(data) {
						$(this).text(data.total_result_count + " fav");
					},
					error: function() {
						$(this).html("<i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i>");
					}
				});
			},
			gerritReviews: function() {
				// Build gerrit urls
				var gerrit_outgoing_url = this.settings.eclipseGerritUrl + "/changes/?q=owner:" + this.settings.username + "+status:open";
				var gerrit_incoming_url = this.settings.eclipseGerritUrl + "/changes/?q=reviewer:" + this.settings.username + "+status:open+-owner:" + this.settings.username;

				// Fetch data
				gerritRequest(gerrit_outgoing_url, "gerrit-outgoing", "Outgoing Reviews", this.element);
				gerritRequest(gerrit_incoming_url, "gerrit-incoming", "Incoming Reviews", this.element);

				// Execute ajax request
				function gerritRequest(url, id, title, context){

				$.ajax(url, {
					dataType: "gerrit_XSSI",
					context: context,
					converters: {
						"text gerrit_XSSI": function(result) {
							var lines = result.substring(result.indexOf("\n") + 1);
							return jQuery.parseJSON(lines);
						}
					},
					success: function(data) {
						var container = $(this).hide();
						var h2 = $("<h2></h2>").addClass("h3").text(title);
						container.append(h2);
						if (data.length === 0) {
							container.append("There are no " + title.toLowerCase() + " for this user.").fadeIn(1000);
							return FALSE;
						}
						// Create table
						var table = $("<table></table>").attr({"width": "100%", "class": "table"});
						var tr = $("<tr></tr>");
						var th = $("<th></th>");
						tr.append(th.clone().text("Subject").attr("width", "70%"));
						tr.append(th.clone().text("Status").attr({"width": "18%", "class": "text-center"}));
						tr.append(th.clone().text("Updated").attr({"width": "12%", "class": "text-center"}));
						table.append(tr);
						// Insert rows in table
						$.each(data, function(index, value) {
							var tr = $("<tr></tr>");
							var merge_conflict = "";
							if (value.mergeable === false) {
								merge_conflict = "Merge Conflict";
								tr.addClass("warning");
							}
							var date = value.updated.substring(0, value.updated.indexOf(" "));
							tr.append("<td><a href=\"https://git.eclipse.org/r/#/c/"+ value._number +"\">" + value.subject + "</a><br/>"+value.project+"</td>");
							tr.append("<td class=\"text-center\">" + merge_conflict + "</td>");
							tr.append("<td class=\"text-center\">" + date + "</td>");
							table.append(tr);
						});
						// append rows to ttable
							container.append(table).fadeIn(1000);
						},
						error: function(data) {
							if (data.status === 400) {
								$(this).html("<h2 class=\"h3\">Outgoing Reviews</h2>There are no outgoing reviews for this user.<h2 class=\"h3\">Incoming Reviews</h2>There are no incoming reviews for this account.");
							}
							else{
								$(this).html("<strong><i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i> An unexpected error has occurred.</strong>");
							}
						}
					});
				}
			},
			eclipseEvents: function() {
				// compare two dates
				function compareDates (d1, d2) {
					return (d1.dateTime - d2.dateTime);
				}

				// Execute ajax request
				$.ajax(this.settings.eclipseEventUrl, {
					context: this.element,
					success: function(data) {
						var today = new Date();
						var upcomingEvents = [];

						// Fetch only upcoming events.
						for (var i in data.events) {
							data.events[i].dateTime = new Date (data.events[i].date);
							if (data.events[i].dateTime >= today) {
								upcomingEvents.push(data.events[i]);
							}
						}

						// Sort upcoming events.
						upcomingEvents.sort(compareDates);
						
						// Build output
						var list = $("<ul>").attr({"class": "nav", "style": "margin:0"});
						for (var x in upcomingEvents.slice(0, 5)) {
							var ed = upcomingEvents[x].dateTime;
							var formatedDate = ed.getFullYear() + "-" + 
							("0" + (ed.getMonth()+1)).slice(-2) + "-" + 
							("0" + ed.getDate()).slice(-2);
							var link = $("<a>").attr({ "href":	upcomingEvents[x].infoLink})
							.html(upcomingEvents[x].title	+ "<br/><small>" + formatedDate + "</small>");
							var item = $("<li>").append(link);
							list.append(item);
						}

						// Remove loading
						$(this).children(".loading").remove();

						// Display events
						$(this).append(list);
						var more_link = $("<a>").attr({"href": "http://events.eclipse.org", "class": "btn btn-simple btn-sm"}).text("more");
						$(this).append(more_link);
					},
					error: function() {
						$(this).html("<strong><i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i>	An unexpected error has occurred.</strong>");
					}
				});
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );