# jquery-eclipse-api [![Build Status](https://secure.travis-ci.org/EclipseFdn/jquery-eclipse-api.svg?branch=master)](https://secure.travis-ci.org/EclipseFdn/jquery-eclipse-api.svg)

### About

A jQuery plugin that fetches and display data from various Eclipse Foundation APIs.

## Options

Here's a list of available settings.

```javascript
$("div").eclipseApi({
  username: "cguindon",
  type: "mpFavoritesCount"
});
```

Attribute          | Type        | Default   | Description
---                | ---         | ---       | ---
`eclipseApiUrl`    | *String* | `https://api.eclipse.org` | Eclipse Api URL.
`eclipseGerritUrl` | *String* | `https://git.eclipse.org/r` | Eclipse Gerrit URL.
`eclipseEventUrl`  | *String* | `https://events.eclipse.org/data/EclipseEvents.json` | Eclipse event json feed URL.
`username`         | *String* | `cguindon` | The username to fetch Eclipse Favorites or Gerrit reviews for.
`type`             | *String* | | The type of date to fetch. Valid values include mpFavoritesCount, gerritReviews and recentEvents.


## Contributing

Check [CONTRIBUTING.md](https://github.com/EclipseFdn/jquery-eclipse-api/blob/master/CONTRIBUTING.md) for more information.

## License

[MIT License](https://github.com/EclipseFdn/jquery-eclipse-api/blob/master/MIT-LICENSE.txt) © Christopher Guindon

Thanks to [https://github.com/jquery-boilerplate/jquery-boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate), MIT License © Zeno Rocha
