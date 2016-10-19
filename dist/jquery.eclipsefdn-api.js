/*
 *  jquery-eclipsefdn-api - v0.0.2
 *  Fetch and display data from various Eclipse Foundation APIs.
 *  https://github.com/EclipseFdn/jquery-eclipsefdn-api
 *
 *  Made by Christopher Guindon
 *  Under MIT License
 *
 *  Thanks to https://github.com/jquery-boilerplate/jquery-boilerplate, MIT License © Zeno Rocha
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
(function($, window, document, undefined) {
	"use strict";

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn"t really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variables rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "eclipseFdnApi",
		defaults = {
			apiUrl: "https://api.eclipse.org",
			gerritUrl: "https://git.eclipse.org/r",
			eventUrl: "https://events.eclipse.org/data/EclipseEvents.json",
			marketplaceUrl: "https://marketplace.eclipse.org",
			username: "cguindon",
			mpFavoritesNodes: [],
			errorMsg: "<i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i> An unexpected error has occurred.",
			gerritUserNotFoundMsg: "<h2 class=\"h3\">Outgoing Reviews</h2>There are no outgoing reviews for this user.<h2 class=\"h3\">Incoming Reviews</h2>There are no incoming reviews for this account.",
			type: ""
		};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don"t want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function() {
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			// you can add more functions like the one below and
			// call them like the example below
			var validTypes = [
				"mpFavorites",
				"mpFavoritesCount",
				"gerritReviews",
				"recentEvents",
			];
			if ($.type(this.settings.type) === "string" && $.inArray(this.settings.type, validTypes) !== -1) {
				this[this.settings.type]();
			}
		},
		dateFormat: function(date) {
			var monthList = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			];

			var dayList = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];

			var fullYear = date.getFullYear();
			var fullMonth = monthList[date.getMonth()];
			var fullDay = dayList[date.getDay()];
			var day = date.getDate();
			var hour = ("0" + (date.getHours())).slice(-2);
			var min = ("0" + (date.getMinutes())).slice(-2);
			var time = fullDay + ", " + fullMonth + " " + day + ", " + fullYear + " - " + hour + ":" + min;
			return time;
		},
		mpFavorites: function() {

			var self = this;
			var nodestr = this.settings.mpFavoritesNodes.join(",");
			var url = this.settings.marketplaceUrl + "/node/" + nodestr + "/api/p";
			$.ajax(url, {
				context: this.element,
				success: function(data) {
					var container = $(this);
					var h2 = $("<h2></h2>").addClass("h3").text("Marketplace Favorites");
					container.append(h2);
					if (data.length === 0) {
						container.append("There are no marketplace favorites for this user.");
						return false;
					}
					else{
						container.append("<div class=\"alert alert-info\" role=\"alert\">" +
								"<label>Use this URL in MPC to install this list of listings: </label>" +
								"<input class=\"text-full form-control form-text\" type=\"text\" readonly value=\"https://marketplace.eclipse.org/user/webdev/favorites\" width=\"100\">" + 
								"</div>");
					}

					var nodes = $("node", data);
					nodes.each(function(index, value) {
						// Extract relevant data from XML
						var node = $(value);
						var shortdescription = node.find("shortdescription").text();
						var title = value.getAttribute("name");
						var timestamp_lastupdated = node.find("changed").text();
						var owner = node.find("owner").text();
						var lastupdated = "Last Updated on " + self.dateFormat(new Date(parseInt(timestamp_lastupdated * 1000))) + " by " + owner;
						var nid =  value.getAttribute("id");
						var listing = $("#mp-listing-template").clone().removeClass("hidden").removeAttr("id");
						var link = $("<a></a>");
						var category = $("category", value);
						var url_listing =  self.settings.marketplaceUrl + "/node/" + nid;
						var image = node.find("image").text();
						var link_listing = link.clone().attr({
							"href": url_listing
						});

						category.each(function(i, v) {
							var catlink = link.clone().attr({
								"href": v.getAttribute("url")
							}).text(v.getAttribute("name"));
							if (category.length !== (i+1)) {
								catlink.append(", ");
							}
							listing.find(".content-categories").append(catlink);
						});

						listing.find(".listing-image").attr({
							"href": url_listing,
							"style": "background:url('" + image + "') no-repeat center;"
						});

						listing.find(".drag").attr({
							"href": self.settings.marketplaceUrl + "/marketplace-client-intro?mpc_install=" + nid,
						});

						listing.find(".listing-title").html(link_listing.clone().text(title));
						listing.find(".content-teaser").html(shortdescription);
						listing.find(".content-last-updated").html(lastupdated );
						container.append(listing);
					});
				},
				error: function() {
					$(this).html(self.settings.errorMsg);
				}
			});
		},
		mpFavoritesCount: function() {
			var self = this;
			var username = this.settings.username;
			var apiUrl = this.settings.apiUrl;
			// Exit if variables are not set.
			if (!username && !api_url) {
				return FALSE;
			}

			// Build api URI.
			var url = apiUrl + "/marketplace/favorites?name=" + username;
			// Execute ajax request
			$.ajax(url, {
				context: this.element,
				success: function(data) {
					$(this).text(data.total_result_count + " fav");
					self.settings.mpFavoritesNodes.length = 0;
					$.each(data.mpc_favorites, function(k, v) {
						self.settings.mpFavoritesNodes.push(v.content_id);
					});
				},
				error: function() {
					$(this).html(self.settings.errorMsg);
				}
			});
		},
		gerritReviews: function() {
			var self = this;
			// Build gerrit urls
			var gerrit_outgoing_url = this.settings.gerritUrl + "/changes/?q=owner:" + this.settings.username + "+status:open";
			var gerrit_incoming_url = this.settings.gerritUrl + "/changes/?q=reviewer:" + this.settings.username + "+status:open+-owner:" + this.settings.username;

			// Fetch data
			gerritRequest(gerrit_outgoing_url, "gerrit-outgoing", "Outgoing Reviews", this.element);
			gerritRequest(gerrit_incoming_url, "gerrit-incoming", "Incoming Reviews", this.element);

			// Execute ajax request
			function gerritRequest(url, id, title, context) {
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
						var container = $(this);
						var h2 = $("<h2></h2>").addClass("h3").text(title);
						container.append(h2);
						if (data.length === 0) {
							container.append("There are no " + title.toLowerCase() + " for this user.");
							return FALSE;
						}
						// Create table
						var table = $("<table></table>").attr({
							"width": "100%",
							"class": "table"
						});
						var tr = $("<tr></tr>");
						var th = $("<th></th>");
						var td = $("<td></td>");
						tr.append(th.clone().text("Subject").attr("width", "70%"));
						tr.append(th.clone().text("Status").attr({
							"width": "18%",
							"class": "text-center"
						}));
						tr.append(th.clone().text("Updated").attr({
							"width": "12%",
							"class": "text-center"
						}));
						table.append(tr);
						// Insert rows in table

						var a = $("<a></a>");
						$.each(data, function(index, value) {
							tr = $("<tr></tr>");
							var merge_conflict = "";
							if (value.mergeable === false) {
								merge_conflict = "Merge Conflict";
								tr.addClass("warning");
							}
							var date = value.updated.substring(0, value.updated.indexOf(" "));
							tr.append(td.clone().html(a.clone().attr({
								"href": self.settings.gerritUrl + "/" + value._number
							}).text(value.subject)).append("<br/>" + value.project));
							tr.append(td.clone().text(merge_conflict).attr("class", "text-center"));
							tr.append(td.clone().text(date).attr("class", "text-center"));
							table.append(tr);
						});
						// append rows to ttable
						container.append(table);
					},
					error: function(data) {
						if (data.status === 400) {
							$(this).html(self.settings.gerritUserNotFoundMsg);
						} else {
							$(this).html(self.settings.errorMsg);
						}
					}
				});
			}
		},
		recentEvents: function() {
			var self = this;
			// compare two dates
			function compareDates(d1, d2) {
				return (d1.dateTime - d2.dateTime);
			}

			// Execute ajax request
			$.ajax(this.settings.eventUrl, {
				context: this.element,
				success: function(data) {
					var today = new Date();
					var upcomingEvents = [];

					// Fetch only upcoming events.
					for (var i in data.events) {
						data.events[i].dateTime = new Date(data.events[i].date);
						if (data.events[i].dateTime >= today) {
							upcomingEvents.push(data.events[i]);
						}
					}

					// Sort upcoming events.
					upcomingEvents.sort(compareDates);

					// Build output
					var list = $("<ul></ul>").attr({
						"class": "nav",
						"style": "margin:0"
					});
					for (var x in upcomingEvents.slice(0, 5)) {
						var ed = upcomingEvents[x].dateTime;

						var formatedDate = self.dateFormat(ed);

						var link = $("<a>").attr({
								"href": upcomingEvents[x].infoLink
							})
							.html(upcomingEvents[x].title + "<br/><small>" + formatedDate + "</small>");
						var item = $("<li></li>").append(link);
						list.append(item);
					}

					// Remove loading
					$(this).children(".loading").remove();

					// Display events
					$(this).append(list);
					var more_link = $("<a>").attr({
						"href": "http://events.eclipse.org",
						"class": "btn btn-simple btn-sm"
					}).text("more");
					$(this).append(more_link);
				},
				error: function() {
					$(this).html(self.settings.errorMsg);
				}
			});
		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" +
					pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);