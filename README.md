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
`username`         | *String* | `cguindon` | The username to fetch Eclipse Favorites or Gerrit reviews for.
`type`             | *String* | | Valid values are `mpFavoritesCount`, `gerritReviews` and `recentEvents`.


## Contributing

Check [CONTRIBUTING.md](https://github.com/EclipseFdn/jquery-eclipsefdn-api/blob/master/CONTRIBUTING.md) for more information.

## License

[MIT License](https://github.com/EclipseFdn/jquery-eclipsefdn-api/blob/master/MIT-LICENSE.txt) © Christopher Guindon

Thanks to [https://github.com/jquery-boilerplate/jquery-boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate), MIT License © Zeno Rocha
