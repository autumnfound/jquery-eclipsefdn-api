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
      forumsUrl: "https://www.eclipse.org/forums",
      marketplaceUrl: "https://marketplace.eclipse.org",
      username: "cguindon",
      currentUser: "",
      contentPlaceholder: null,
      errorMsg: "<i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i> An unexpected error has occurred.",
      gerritUserNotFoundMsg: "<h2 class=\"h3\">Outgoing Reviews</h2>There are no outgoing reviews for this user.<h2 class=\"h3\">Incoming Reviews</h2>There are no incoming reviews for this account.",
      type: "",
      itemsPerPage: 10
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
        "gerritReviews",
        "recentEvents",
        "forumsMsg",
        "gerritReviewCount",
        "projectsList"
      ];
      if ($.type(this.settings.type) === "string" && $.inArray(this.settings.type, validTypes) !== -1) {
        this[this.settings.type]();
      }
    },
    projectsList: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      // Exit if variables are not set.
      if (!username && !api_url) {
        return false;
      }

      // Build api URI.
      var url = apiUrl + "/account/profile/" + username + "/projects";
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data) {

          var project_count = Object.keys(data).length;
          if (project_count === undefined) {
            project_count = 0;
          }
          $(this).attr({
            "href": "https://projects.eclipse.org/users/" + username,
          });

          $(this).children("strong").text(project_count + self.plurialString(" project", project_count));


          // Exit now if contentPlaceholder is not defined
          if (!(self.settings.contentPlaceholder instanceof jQuery)) {
            return false;
          }

          var container = $(self.settings.contentPlaceholder);
          var a = $("<a></a>");

          container.append($("<h2></h2>").addClass("h3").text("Eclipse Projects"));
          container.append("<p>Projects are the organizational unit for open source " +
          "development work at the Eclipse Foundation. Projects have developers " +
          "(committers), source code repositories, build servers, downloads, " +
          "and other resources. The Eclipse Foundation's open source projects " +
          "are governed by the <a href=\"https://eclipse.org/projects/dev_process/\">Eclipse Development Process</a>.</p>");
          
          if (project_count === 0) {
            container.append("<div class=\"alert alert-warning\" role=\"alert\">" +
              "This user is not involved in any Eclipse Projectsit ." +
              "</div>");
            return false;
          }

          // Create table
          var table = $("<table></table>").attr({
            "width": "100%",
            "class": "table"
          });

          var tr = $("<tr></tr>");
          var th = $("<th></th>");
          var td = $("<td></td>");

          tr.append(th.clone().text("Project").attr("width", "85%"));

          tr.append(th.clone().text("Relation").attr({
            "width": "15%",
            "class": "text-center"
          }));

          table.append(tr);
          // Insert rows in table
          $.each(data, function(index, value) {
            var roles = [];
            var projectName = "";
            var activeDate = "";
            $.each(value, function(i, v) {
              roles.push(v.Relation.Description);
              projectName = v.ProjectName;
              activeDate = v.ActiveDate;
              if (v.url !== "") {
                projectName = a.clone().attr({
                  "href": v.url
                }).text(projectName);
              }
            });
            tr = $("<tr></tr>");
            // Replies column
            tr.append(td.clone().html(projectName).append("<br/><small>Since: " + self.dateFormat(new Date(activeDate)) + "</small>"));
            tr.append(td.clone().text(roles.join(", ")).attr("class", "text-center"));
            table.append(tr);
          });

          // append rows to ttable
          container.append(table);

        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });
    },
    forumsMsg: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      // Exit if variables are not set.
      if (!username && !api_url) {
        return false;
      }

      // Build api URI.
      var url = apiUrl + "/account/profile/" + username + "/forum";
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data) {
          var user_msg_count = 0;
          if (data.posted_msg_count !== undefined) {
            user_msg_count = data.posted_msg_count;
            $(this).attr({
              "href": self.settings.forumsUrl + "/index.php/sp/" + data.id + "/",
            });
          }

          $(this).children("strong").text(user_msg_count + self.plurialString(" topic", user_msg_count));

          // Exit now if contentPlaceholder is not defined
          if (!(self.settings.contentPlaceholder instanceof jQuery)) {
            return false;
          }

          var container = $(self.settings.contentPlaceholder);
          var a = $("<a></a>");

          container.append($("<h2></h2>").addClass("h3").text("Eclipse Forums"));
          container.append($("<p></p>").append("The Eclipse forums are your way of communicating with the community " +
            "of people developing and using Eclipse-based tools hosted at Eclipse.org. " +
            "Please stick to technical issues - and remember, no confidential information - " +
            "these are public forums!"));

          var more_forums_link = a.clone().attr({
            "href": self.settings.forumsUrl,
            "class": "btn btn-primary btn-sm",
            "style": "display:block"
          }).html("<i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i> More");

          if (data.length === 0) {
            container.append("<div class=\"alert alert-warning\" role=\"alert\">" +
              "This user does not have any activities on Eclipse Forums." +
              "</div>");
            container.append(more_forums_link);
            return false;
          }

          // Create table
          var table = $("<table></table>").attr({
            "width": "100%",
            "class": "table"
          });

          var tr = $("<tr></tr>");
          var th = $("<th></th>");
          var td = $("<td></td>");

          if (self.settings.currentUser === self.settings.username) {
            tr.append(th.clone().attr("width", "8%"));
          }

          tr.append(th.clone().text("Topics").attr("width", "50%"));
          tr.append(th.clone().text("Replies").attr({
            "width": "8%",
            "class": "text-center"
          }));

          tr.append(th.clone().text("Views").attr({
            "width": "8%",
            "class": "text-center"
          }));

          tr.append(th.clone().text("Last message").attr({
            "class": "text-center"
          }));

          table.append(tr);
          // Insert rows in table

          $.each(data.posts, function(index, value) {
            var request_data = {
              forum_id: value.thread_forum_id,
              forum_name: value.forum_name,
              forum_cat_id: value.forum_name,
              forum_cat_name: value.cat_name,
              root_subject: value.root_msg_subject,
              current_user_last_post_timestamp: value.msg_group_post_stamp,
              current_user_last_post_subject: value.last_user_msg_subject,
              thread_id: value.msg_thread_id,
              thread_reply_count: value.thread_replies,
              thread_views_count: value.thread_views,
              thread_last_post_date: value.thread_last_post_date,
              last_message_timestamp: value.last_msg_post_stamp,
              last_message_poster_id: value.last_msg_poster_id,
              last_message_poster_alias: value.last_poster_alias,
              last_message_last_view: value.read_last_view,
              current_user_id: data.id
            };
            more_forums_link.attr({
              "href": self.settings.forumsUrl + "/index.php/sp/" + request_data.current_user_id + "/",
            });

            tr = $("<tr></tr>");

            // Link to forum
            var forumLink = a.clone().attr({
              "href": self.settings.forumsUrl + "/index.php/f/" + request_data.forum_id + "/"
            }).text(request_data.forum_name);

            // Link to category
            var catLink = a.clone().attr({
              "href": self.settings.forumsUrl + "/index.php/i/" + request_data.forum_cat_id + "/"
            }).text(request_data.forum_cat_name);

            // Concatenate  category and form link
            var forum_cat_link = $("<small></small>").append("<br/>")
              .append(catLink)
              .append(" &gt; ")
              .append(forumLink)
              .append(" &gt; ")
              .append(request_data.root_subject)
              .append("<br>Posted on " + self.dateFormat(new Date(parseInt(request_data.current_user_last_post_timestamp * 1000))));
            var read_icon = "fa fa-envelope-open-o";
            // Add warning class to row if the user did not see the message
            if (self.settings.currentUser === self.settings.username &&
              request_data.last_message_last_view < request_data.thread_last_post_date &&
              request_data.last_message_poster_id !== request_data.current_user_id) {
              tr.addClass("warning");
              read_icon = "fa fa-envelope-o";
            }

            if (self.settings.currentUser === self.settings.username) {
              tr.append(td.clone().html("<i class=\"" + read_icon + "\" aria-hidden=\"true\"></i>").attr("class", "text-center"));
            }

            // Topic column
            tr.append(td.clone().html(a.clone().attr({
                  "href": self.settings.forumsUrl + "/index.php/t/" + request_data.thread_id + "/"
                })
                .text(request_data.current_user_last_post_subject))
              .append(forum_cat_link)
            );

            // Replies column
            tr.append(td.clone().text(request_data.thread_reply_count).attr("class", "text-center"));

            // Views column
            tr.append(td.clone().text(request_data.thread_views_count).attr("class", "text-center"));

            // Last message column
            var last_message = $("<small></small>").append(self.dateFormat(new Date(parseInt(request_data.last_message_timestamp * 1000)))).append("<br/> By: ").append(a.clone().attr({
              "href": self.settings.forumsUrl + "/index.php/sp/" + request_data.last_message_poster_id + "/"
            }).text(request_data.last_message_poster_alias));
            tr.append(td.clone().html(last_message).attr("class", "text-center"));

            table.append(tr);
          });

          // append rows to ttable
          container.append(table);

          // append read more link
          container.append(more_forums_link);
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });
    },
    mpFavorites: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      // Exit if variables are not set.
      if (!username && !api_url) {
        return false;
      }

      // Add content if contentPlaceholder is defined
      if (self.settings.contentPlaceholder instanceof jQuery) {
        var container = $(self.settings.contentPlaceholder);
        var more_marketplace_link = $("<a></a>").attr({
          "href": self.settings.marketplaceUrl + "/user/" + username + "/favorites",
          "class": "btn btn-primary btn-sm",
          "style": "display:block"
        }).html("<i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i> More");
        container.append($("<h2></h2>").addClass("h3").text("Eclipse Marketplace Favorites"));
        container.append($("<p></p>").append("Eclipse Marketplace is the source for " +
          "Eclipse-based solutions, products and add-on features. " +
          "Thousands of developers visit Marketplace on a monthly " +
          "basis to find new and innovative solutions. Solution providers " +
          "are encouraged to list their products on Marketplace to " +
          "gain exposure to the Eclipse developer community."));
      }
      // Build api URI.
      var url = apiUrl + "/marketplace/favorites?name=" + username;
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data) {
          $(this).children("strong").text(data.total_result_count + self.plurialString(" favorite", data.total_result_count));

          // Exit now if container is not defined
          if (typeof container === "undefined") {
            return false;
          }
          // separating from nodes for time being so I retain total count for initial pagination
          var nodes = [];
          $.each(data.mpc_favorites, function(k, v) {
            nodes.push(v.content_id);
          });

          if (nodes.length === 0) {
            container.append("<div class=\"alert alert-warning\" role=\"alert\">" +
              "There are no marketplace favorites for this user." +
              "</div>");
            container.append(more_marketplace_link);
            return false;
          }
          // break down the nodestr by itemsPerPage and store in element data for later
          var nodestrs = [];
          var page = 1;
          var counter = 1;
          nodestrs[page] = [];
          $.each(nodes, function(index, value) {
            nodestrs[page].push(value);
            if (++counter > self.settings.itemsPerPage) {
              page++;
              counter = 1;
              nodestrs[page] = [];
            }
          });

          // set the fetch favorites as custom event
          container.on("fetchFavoritesEvent", fetchFavorites);
          container.append("<div class=\"alert alert-info\" role=\"alert\">" +
            "<label>Copy this URL and paste it into MPC to install this list of favorites in your workspace: </label>" +
            "<input class=\"text-full form-control form-text\" type=\"text\" readonly value=\"https://marketplace.eclipse.org/user/" + self.settings.username +
            "/favorites\" width=\"100\">" +
            "</div>");
          container.append("<div id=\"mpfavorites-list\"></div>");
          // store the nodestrs for later fetching
          container.find("#mpfavorites-list").data("nodestrs", nodestrs);
          getFavoritesByNodes(nodestrs[1].join());
          container.append(self.getPaginationBar(nodes.length, "mpfavorites-list"));
          container.append(more_marketplace_link);
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });

      function getFavoritesByNodes(nodestr) {
        var url = self.settings.marketplaceUrl + "/node/" + nodestr + "/api/p";
        $.ajax(url, {
          context: self.element,
          success: function(data) {
            var listingContainer = $("#mpfavorites-list");
            var nodes = $("node", data);
            nodes.each(function(index, value) {
              // Extract relevant data from XML
              var node = $(value);
              var shortdescription = node.find("shortdescription").text();
              var title = value.getAttribute("name");
              var timestamp_lastupdated = node.find("changed").text();
              var owner = node.find("owner").text();
              var lastupdated = "Last Updated on " + self.dateFormat(new Date(parseInt(timestamp_lastupdated * 1000))) + " by " + owner;
              var nid = value.getAttribute("id");
              var listing = $("#mp-listing-template").clone().removeClass("hidden").removeAttr("id");
              var link = $("<a></a>");
              var category = $("category", value);
              var url_listing = self.settings.marketplaceUrl + "/node/" + nid;
              var image = node.find("image").text();
              var link_listing = link.clone().attr({
                "href": url_listing
              });

              category.each(function(i, v) {
                var catlink = link.clone().attr({
                  "href": v.getAttribute("url")
                }).text(v.getAttribute("name"));
                if (category.length !== (i + 1)) {
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
              listing.find(".content-last-updated").html(lastupdated);
              listingContainer.append(listing);
            });
          },
          error: function() {
            $(this).html(self.settings.errorMsg);
          }
        });
      }

      function fetchFavorites(event, nodestr) {
        getFavoritesByNodes(nodestr);
      }
    },
    gerritReviewCount: function() {
      var self = this;
      var username = this.settings.username;
      var apiUrl = this.settings.apiUrl;
      var url = apiUrl + "/account/profile/" + username + "/gerrit";
      // Execute ajax request
      $.ajax(url, {
        context: this.element,
        success: function(data) {
          var count = data.merged_changes_count;
          $(this).children("strong").text(count + self.plurialString(" review", count));
          if (count > 0) {
            $(this).attr({
              "href": self.settings.gerritUrl + "/#/q/owner:" + self.settings.username
            });
          }
        },
        error: function() {
          $(this).html(self.settings.errorMsg);
        }
      });
    },
    gerritReviews: function() {
      var self = this;
      // Build gerrit url
      var gerrit_url = this.settings.gerritUrl + "/changes/?q=owner:" + this.settings.username +
        "+status:open&q=reviewer:" + this.settings.username + "+status:open+-owner:" + this.settings.username + "&pp=0";

      $(this.element).append($("<h2>Eclipse Gerrit</h2>").addClass("h3"));
      $(this.element).append("<p>Gerrit is a web based code review system, facilitating " +
        "online code reviews for projects using the Git version control system.</p>");
      // Fetch data
      gerritRequest(gerrit_url);

      function gerritRequest(url) {
        var pagesize = 100;
        var skip = 0;
        var errorCondition = false;
        var labels = [
          ["gerrit-outgoing", []],
          ["gerrit-incoming", []]
        ];

        $(self.element).on("drawTableEvent", drawOutput);
        // get all pages of data
        getAllPages(url, pagesize, skip);

        function drawOutput() {
          // table id's and to determine section title
          $.each(labels, function(index, value) {
            var title = "";
            switch (value[0]) {
              case "gerrit-outgoing":
                title = "Outgoing Reviews";
                break;
              case "gerrit-incoming":
                title = "Incoming Reviews";
                break;
            }
            var h2 = $("<h4></h4>").addClass("h4").text(title);
            $(self.element).append(h2);
            if (value[1].length === 0) {
              // this result array is empty
              $(self.element).append("<div class=\"alert alert-warning\" role=\"alert\">" +
                "There are no " + title.toLowerCase() + " for this user." +
                "</div>");
              return;
            }
            $(self.element).append(buildGerritTable(value[0], value[1]));
            $(self.element).append(self.getPaginationBar(value[1].length, value[0]));
          });

          var more_gerritlink = $("<a></a>").attr({
            "href": self.settings.gerritUrl + "/#/q/owner:" + self.settings.username,
            "class": "btn btn-primary btn-sm",
            "style": "display:block"
          }).html("<i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i> More");
          $(self.element).append(more_gerritlink);

          function buildGerritTable(id, data) {
            // Create table
            var table = $("<table></table>").attr({
              "width": "100%",
              "class": "table",
              "id": id
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
            return table;
          }
        }

        function getAllPages(url, pagesize, skip) {
          pagesize = (typeof(pagesize) !== "undefined") ? pagesize : 100;
          skip = (typeof(skip) !== "undefined") ? skip : 0;
          url += "&start=" + skip + "&n=" + pagesize;

          return $.ajax(url, {
            dataType: "gerrit_XSSI",
            context: self.element,
            converters: {
              "text gerrit_XSSI": function(result) {
                var lines = result.substring(result.indexOf("\n") + 1);
                return jQuery.parseJSON(lines);
              }
            },
            success: function(data) {
              var lastElement1 = Object;
              var lastElement2 = Object;

              if (data[0].length !== 0) {
                $.merge(labels[0][1], data[0]);
                lastElement1 = data[0][data[0].length - 1];
              }
              if (data[1].length !== 0) {
                $.merge(labels[1][1], data[1]);
                lastElement2 = data[1][data[1].length - 1];
              }
              if (("_more_changes" in lastElement1 && lastElement1._more_changes === true) ||
                ("_more_changes" in lastElement2 && lastElement2._more_changes === true)) {
                getAllPages(url, pagesize, skip + pagesize);
              } else {
                $(self.element).trigger("drawTableEvent");
              }
            },
            error: function(data) {
              if (data.status === 400) {
                $(this).html(self.settings.gerritUserNotFoundMsg);
              } else {
                $(this).html(self.settings.errorMsg);
              }
              errorCondition = true;
            }
          });
        }
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
    },
    plurialString: function(string, count) {
      if (count > 1) {
        string += "s";
      }
      return string;
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
    getPaginationBar: function(totalItems, elementID) {
      var self = this;
      if (typeof(totalItems) === "undefined") {
        totalItems = 1;
      }
      if (totalItems <= 0 || totalItems <= self.settings.itemsPerPage) {
        // nothing to do or everything fits on single page
        return;
      }
      //initialize to first page
      var activePageNum = 1;
      var pageNav = $("<nav></nav>").attr({
        "arial-label": "Page navigation",
        "id": elementID + "-pager"
      }).addClass("text-center");
      var totalPages = getMaxPages();
      var ul = drawPageNums(totalPages, activePageNum, elementID);
      pageNav.append(ul);
      // create cache
      if (typeof($("#" + elementID).data("pageCache")) === "undefined") {
        cachePages();
      }
      return pageNav;

      function drawPageNums(numPages, currentPageNum, elementID) {
        var li = $("<li></li>");
        var a = $("<a></a>");
        var span = $("<span></span>");
        var ul = $("<ul></ul>").addClass("pagination");
        if (typeof(elementID) !== "undefined") {
          ul.attr({
            "data-eclipseFdnApi-elementID": elementID
          });
        }
        var showEllipses = false;
        var ellipses = "";
        var minRange = 1;
        var maxRange = numPages;
        // cap it at 9
        if (numPages > 9) {
          minRange = numPages - 8;
          if (currentPageNum <= minRange + 4) {
            maxRange = 9;
            minRange = 1;
          } else if (currentPageNum <= numPages - 4) {
            minRange = currentPageNum - 4;
            maxRange = currentPageNum + 4;
          }
          showEllipses = true;
          ellipses = li.clone().append(
            span.clone().attr({
              "aria-hidden": "true",
              "onclick": "return false;"
            }).html("...")
          ).addClass("pager-ellipses disabled");
        }
        var clickEvent = function() {
          var $this = $(this);
          var toPageNum = $this.attr("data-goto-page");
          var parentUL = $this.parents(".pagination").eq(0);
          var elementID = parentUL.data("eclipsefdnapiElementid");
          $("#" + elementID).trigger("changePageEvent", [toPageNum]);
        };
        if (currentPageNum !== 1) {
          ul.append(li.clone().addClass("pager-first").html(
            a.clone().attr({
              "href": "#",
              "aria-label": "First",
              "onclick": "return false;",
              "data-goto-page": "1"
            }).on("click", clickEvent).append(
              span.clone().attr({
                "aria-hidden": "true"
              }).html("<< first")
            )
          ));
          ul.append(li.clone().html(
            a.clone().attr({
              "href": "#",
              "aria-label": "Previous",
              "onclick": "return false;",
              "data-goto-page": parseInt(currentPageNum - 1)
            }).on("click", clickEvent).append(
              span.clone().attr({
                "aria-hidden": "true"
              }).html("< previous")
            )
          ));
          if (showEllipses === true && minRange > 1) {
            ul.append(ellipses.clone());
          }
        }
        // write out page #'s
        var i;
        for (i = minRange; i <= maxRange; i++) {
          var pager = li.clone();
          var pagerLink = a.clone().attr({
            "href": "#",
            "title": "Go to page " + parseInt(i),
            "onclick": "return false;",
            "data-goto-page": parseInt(i)
          }).text(parseInt(i)).on("click", clickEvent);
          if (currentPageNum === i) {
            pager.addClass("active");
          }
          pager.html(pagerLink);
          ul.append(pager);
        }
        if (currentPageNum < numPages) {
          // close the pager if not at end of index
          if (showEllipses === true && maxRange < numPages) {
            ul.append(ellipses.clone());
          }
          ul.append(li.clone().html(
            a.clone().attr({
              "href": "#",
              "aria-label": "Next",
              "title": "Go to next page",
              "onclick": "return false;",
              "data-goto-page": parseInt(currentPageNum + 1)
            }).on("click", clickEvent).append(
              span.clone().attr({
                "aria-hidden": "true"
              }).html("next >")
            )
          ));
          ul.append(li.clone().addClass("pager-last").html(
            a.clone().attr({
              "href": "#",
              "aria-label": "Last",
              "title": "Go to last page",
              "onclick": "return false;",
              "data-goto-page": parseInt(numPages)
            }).on("click", clickEvent).append(
              span.clone().attr({
                "aria-hidden": "true"
              }).html("last >>")
            )
          ));
        }
        return ul;
      }

      function getMaxPages() {
        return Math.ceil(totalItems / self.settings.itemsPerPage);
      }

      function cachePages() {
        var theElement = $("#" + elementID);
        var pageCache = [];
        var pageCacheType;
        var counter = 0;
        var pageNum = 0;
        var page = [];
        var data;
        if (theElement.is("table")) {
          // get the table rows
          data = theElement.find("tr");
          pageCacheType = "table";
          pageCache = buildPageCache(data);
        } else if (theElement.is("div") && elementID === "mpfavorites-list") {
          // nothing to cache yet, container & cache fills as needed
          pageCacheType = "nodes";
        }

        theElement.data("pageCache", pageCache);
        theElement.data("pageCacheType", pageCacheType);
        theElement.data("pageCacheTotalPages", totalPages);
        theElement.on("changePageEvent", changePage);

        switch (pageCacheType) {
          case "table":
            // trigger redraw of first page
            theElement.trigger("changePageEvent", [1]);
            break;
        }

        function buildPageCache(data) {
          var theCache = [];
          $.each(data, function(index, value) {
            if (pageCacheType === "table" && index === 0) {
              // check if it's a table heading
              if ($(value).children().first().is("th")) {
                // it's the heading
                theCache[0] = value;
                return;
              }
            }
            if (counter === self.settings.itemsPerPage) {
              counter = 0;
              pageNum++;
              theCache[pageNum] = page;
              page = [];
            }
            page[counter] = value;
            counter++;
          });
          if (page.length > 0) {
            // ended on uneven page
            theCache[++pageNum] = page;
          }
          return theCache;
        }
      }

      function changePage(event, gotoPageNum) {
        var element = $(event.currentTarget);
        var pageType = element.data("pageCacheType");
        var pageCache = element.data("pageCache");
        var totalPages = element.data("pageCacheTotalPages");
        // get the pager
        var elementID = element.attr("id");
        var nav = $("#" + elementID + "-pager");
        var currentPage = nav.data("currentPage");
        if (typeof(currentPage) === "undefined" || currentPage === null) {
          currentPage = 1;
          nav.data("currentPage", currentPage);
        }
        if (typeof(gotoPageNum) === "undefined") {
          // something is wrong.  set it to 1
          gotoPageNum = 1;
        }
        // comes in as string
        gotoPageNum = parseInt(gotoPageNum);
        switch (pageType) {
          case "table":
            element.empty();
            // inject the heading
            element.append(pageCache[0]);
            $.each(pageCache[gotoPageNum], function(index, value) {
              element.append(value);
            });
            break;
          case "nodes":
            // add current page to cache if not there
            if (typeof(pageCache[currentPage]) === "undefined") {
              var data = element.find(".node");
              pageCache[currentPage] = data;
              element.data("pageCache", pageCache);
            }
            element.empty();
            // if gotoPage isn't already cached, fetch it.
            if (typeof(pageCache[gotoPageNum]) === "undefined") {
              var nodestrs = element.data("nodestrs")[gotoPageNum].join();
              element.trigger("fetchFavoritesEvent", [nodestrs]);
              break;
            }
            $.each(pageCache[gotoPageNum], function(index, value) {
              element.append(value);
            });
            break;
        }

        if (currentPage !== gotoPageNum) {
          var newUL = drawPageNums(totalPages, gotoPageNum, elementID);
          //Replace the pager bar with updated layout
          nav.find("ul").replaceWith(newUL);
          nav.data("currentPage", gotoPageNum);
        }
      }
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