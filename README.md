# jQuery Eclipse Dashboard [![Build Status](https://secure.travis-ci.org/eclipsefnd/jquery-eclipse-dashboard.svg?branch=master)](https://secure.travis-ci.org/eclipsefnd/jquery-eclipse-dashboard)

### A jump-start for jQuery plugins development

A jQuery plugin that fetches data for the [Eclipse User Profile](https://accounts.eclipse.org/user/9) website.

## Options

Here's a list of available settings.

```javascript
$("div").eclipseDashboard({
  eclipseApiUrl: "https://api.eclipse.org",
  eclipseGerritUrl: "https://git.eclipse.org/r",
  eclipseEventUrl: "https://events.eclipse.org/data/EclipseEvents.json",
  username: "cguindon",
  action: "mpFavorites"
});
```

Attribute          | Type        | Default   | Description
---                | ---         | ---       | ---
`eclipseApiUrl`    | *String* | `https://api.eclipse.org` | Eclipse Api URL.
`eclipseGerritUrl` | *String* | `https://git.eclipse.org/r` | Eclipse Gerrit URL.
`eclipseEventUrl`  | *String* | `https://events.eclipse.org/data/EclipseEvents.json` | Eclipse event json feed URL.
`username`         | *String* | `cguindon` | The username to fetch Eclipse Favorites or Gerrit reviews for.
`type`             | *String* | `mpFavorites` | The type of date to fetch. Valid values include mpFavorites, gerritReviews and eclipseEvents.


## Contributing

Check [CONTRIBUTING.md](https://github.com/jquery-boilerplate/boilerplate/blob/master/CONTRIBUTING.md) for more information.

## License

[MIT License](https://opensource.org/licenses/MIT) © Christopher Guindon

Thanks to [https://github.com/jquery-boilerplate/jquery-boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate), MIT License © Zeno Rocha
