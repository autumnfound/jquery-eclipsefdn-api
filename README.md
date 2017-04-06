# jquery-eclipsefdn-api [![Build Status](https://secure.travis-ci.org/EclipseFdn/jquery-eclipsefdn-api.svg?branch=master)](https://secure.travis-ci.org/EclipseFdn/jquery-eclipsefdn-api.svg)

### About

A jQuery plugin that fetches and display data from various Eclipse Foundation APIs.

## Options

Here's a list of available settings.

```javascript
$("div").eclipseFdnApi({
  username: "cguindon",
  type: "mpFavoritesCount"
});
```

Attribute          | Type        | Default   | Description
---                | ---         | ---       | ---
`apiUrl`    | *String* | `https://api.eclipse.org` | Eclipse Api URL.
`gerritUrl` | *String* | `https://git.eclipse.org/r` | Eclipse Gerrit URL.
`eventUrl`  | *String* | `https://events.eclipse.org/data/EclipseEvents.json` | Eclipse event json feed URL.
`forumsUrl` | *String* | `https://www.eclipse.org/forums` | Eclipse Forums URL.
`marketplaceUrl` | *String* | `https://marketplace.eclipse.org` | Eclipse Marketplace URL.
`errorMsg` | *String* | `<i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i> An unexpected error has occurred.` | Error message for when the ajax request fails.
`gerritUserNotFoundMsg` | *String* | `<i class=\"fa red fa-exclamation-triangle\" aria-hidden=\"true\"></i> An unexpected error has occurred.` | Error message for when a user is not found on Gerrit.
`username`         | *String* | `cguindon` | The username to fetch Eclipse Favorites or Gerrit reviews for.
`currentUsername`         | *String* | `` | The user making the request this page. Useful if content changed if the user is viewing his own page.
`type`             | *String* | | Valid values are `gerritReviews`, `gerritReviewsCount`, `mpFavorites`, `projectsList`, `forumsMsg` and `recentEvents`.
`itemsPerPage` | *Integer* | 20 | Number of fetched items to display per page. 

## Contributing

Check [CONTRIBUTING.md](https://github.com/EclipseFdn/jquery-eclipsefdn-api/blob/master/CONTRIBUTING.md) for more information.

## License

[MIT License](https://github.com/EclipseFdn/jquery-eclipsefdn-api/blob/master/MIT-LICENSE.txt) © Christopher Guindon

Thanks to [https://github.com/jquery-boilerplate/jquery-boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate), MIT License © Zeno Rocha

# jquery-eclipsefdn-igc README
### About

A jQuery plugin to provide OAUTH2 Implicit Grant Flow authorization functionality for API requests to client scripts and plugins

## Options

Here's an example of how to use the client.

```javascript
// set delayed response handlers

// delayed request was completed after authorization, and these were the results
$(document).on("igcRequestComplete", function(event, eventData) {
  if (eventData.clientName === "myScript") {
    // returned result data will be stored in eventData.data
    // you can determine which request you made by checking eventData.requestOptions
  }
});

// delayed request failed
$(document).on("igcRequestFailed", function(event, eventError) {
  if (eventError.clientName === "myScript") {
    // request failed.  the details ajax response is stored in eventError.jqXHR
  }
});

// authorization failed (ie. authorization was denied or there was a validation failed)
$(document).on("igcAuthFailed", function(event, authError) {
  if (authError.clientName === "myScript") {
    // authError.error will show any status code, if available.
    // authError.error_description will contain a test description of what went wrong
    // authError.error_from will indicate which area in the processes the failure occured
  }
});

// initialize the client - any delayed responses will be triggered during initialization
$(document).eclipseFdnIgc({
  clientName: "myScript",
  authURL: "https://accounts.example.com",
  apiURL: "https://api.example.com",
  username: "darmstrong"
});

// make a request
requestOptions = {
  // api service end-point path
  path: "marketplace/favorites/12345",
  method: "PUT",
  cid: "myClientID",
  scope: "scopeToRequest",
  // callbacks are used for non-delayed responses (client already authorized) 
  // for immediate response without broadcasting to all clients
  successCallback: function(data) {
    // we can do something now and call a function script to process the data
  },
  errorCallback: function(jqXHR) {
    // the request failed.  status code and error message is in the jqXHR object
    // it is important to check the response to determine if this is a soft error (action already performed)
    // or if there is something wrong with the request that needs to be corrected before attempting again.
  }
};
// send the request to the eclipseFdnIgc plugin. If the client does not have an authorization token, or it has become expired,
// it will make a request for a new one.
$(document).eclipseFdnIgc.makeRequest(requestOptions);
```

Attribute          | Type        | Default   | Description
---                | ---         | ---       | ---
`clientName`    | *String* | `unknown` | Identifying name for client. Used to separate stored items.
`authUrl` | *String* | `https://accounts.eclipse.org` | Eclipse Authorization base URL.
`apiUrl`  | *String* | `https://api.eclipse.org` | Eclipse API base url.
`redirectUri` | *String* | [location.protocol, "//", location.host, "/site_login_implicit_grant"].join("") | redirect landing page for authorization response. defaults to current site and path of "/site_login_implicit_grant"
`baseStorageName` | *String* | `eclipseIGC` | base name to build storage name from.
`redirectIfValid` | *Boolean* | true | redirect to originating page after validating authorization response
`validateUser` | *Boolean* | true | Validates authorization token matches currently logged in user
`useOpenWin`         | *Boolean* | false | Opens a new window for authorization flow instead of using current window.
`encodeStorage`         | *Boolean* | true | Base64 encode data placed in storage
`userName`             | *String* | '' | currently logged in username, used for validation purposes and to clear items if user logs out or other account is logged in
`completeOnAuthorization`         | *Boolean* | true | finish the request that triggered authorization after completing validation

## License

[MIT License](https://github.com/EclipseFdn/jquery-eclipsefdn-api/blob/master/MIT-LICENSE.txt) © Christopher Guindon

Thanks to [https://github.com/jquery-boilerplate/jquery-boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate), MIT License © Zeno Rocha
