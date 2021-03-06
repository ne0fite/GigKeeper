# GigKeeper

## Setup

1. Run `./install.sh`
1. Create a database and user for the application using your favorite client
1. Run `sql/GigKeeper-schema.sql` on the new database
1. Customize the values in `config/config.json`
1. Run `gulp db:seed:data` to populate the database with test data.

See the `config/config.json.sample` for example config JSON.

## Environment Variable Alternative

As an alternative to the `config.json` described above, you can provide environment-specific configuration in system environment variables. Environment variables take precedence over the `config.json` variables.

The `config.json` file works well with local development. However, environment variables are the preferred approach to a hosted solution.

<table>
<thead>
<tr><th>Name</th><th>Description</th><th>Default</th></tr>
</thead>
<tbody>
<tr><td>NODE_ENV</td><td>The node environment (development, stage, production)</td><td>development</td></tr>
<tr><td>UI_PROTOCOL</td><td>UI web server protocol</td><td>http</td></tr>
<tr><td>UI_HOST</td><td>UI web server host</td><td>localhost</td></tr>
<tr><td>UI_PORT</td><td>UI web server port</td><td>8001</td></tr>
<tr><td>SERVER_PROTOCOL</td><td>Web server protocol</td><td>http</td></tr>
<tr><td>SERVER_HOST</td><td>Web server host</td><td>localhost</td></tr>
<tr><td>SERVER_PORT</td><td>Web server port</td><td>8000</td></tr>
<tr><td>SERVER_EXTERNAL_PORT</td><td>Web server external port -- use when proxying node</td><td>8000</td></tr>
<tr><td>JWT_SECRET</td><td>JSON Web Token secret key</td><td>NeverShareYourSecret</td></tr>
<tr><td>DB_HOST</td><td>Database host name</td><td>localhost</td></tr>
<tr><td>DB_PORT</td><td>Database host port</td><td>5432</td></tr>
<tr><td>DB_DIALECT</td><td>Database host dialect</td><td>postgres</td></tr>
<tr><td>DB_NAME</td><td>Database name</td><td>gigkeeper</td></tr>
<tr><td>DB_USER</td><td>Database username</td><td>gigkeeper</td></tr>
<tr><td>DB_PASS</td><td>Database password</td><td>gigkeeper</td></tr>
<tr><td>DB_LOGGING</td><td>Set to true to log SQL commands to the console</td><td>false</td></tr>
<tr><td>SMTP_ENABLED</td><td>Set to true to enable sending email</td><td>false</td></tr>
<tr><td>SMTP_FROM_ADDRESS</td><td>Email address that all system emails will come from</td><td></td></tr>
<tr><td>SMTP_SINGLE_ADDRESS</td><td>Set to an email address to send all emails to a single address</td><td></td></tr>
<tr><td>SMTP_SERVICE</td><td>SMTP service supported by nodemailer</td><td>gmail</td></tr>
<tr><td>SMTP_USER</td><td>SMTP username</td><td></td></tr>
<tr><td>SMTP_PASS</td><td>SMTP password</td><td></td></tr>
<tr><td>GOOGLE_MAPS_API_KEY</td><td>Google Maps API key</td><td></td></tr>
</tbody>
</table>

See the list of nodemailer's [well know services](https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json) for the SMTP service.

To generate a cryptographically strong JWT secret:

```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

Go to [Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key) to generate an API key.

## Schema Migration

Future updates may have a different schema than what you have installed. To prevent losing data, migrate the schema:

```
gulp db:migrate
```

If you are migrating anything other than the development environmnet, pass an `env` argument:

```
gulp db:migrate --env production
```

## Usage

Start up the server with:

```gulp```

Wait until you see the [BS] message that says it is serving files from www.

## Tests

Once the database is seeded with test fixtures, you can run the lab tests with:

```gulp test```

## Getting Started

Once you have the application installed and configured, time to create an initial profile and user and get logged in. Execute the following gulp task to create a new profile:

```
gulp profile:create --email <email address> --password <password>
```

This will create a new profile and user with the specified email and password.

Navigate to the home page (i.e., http://localhost:8000) and log in with the email and password used above.

Navigate to My Account > My Profile to update your email address or password, as needed.

Navigate to My Gigs > Settings to setup your homebase location and gig defaults.

Navigate to My Gigs > Contractors to add contractors. These are the companies or people who book you to to gigs and pay you cheddar.

Navigate to My Gigs > Tags to add tags that you will use to categorize your gigs (i.e., Wedding, Private Party, Charitable Event, etc.).

Finally, navigate to My Gigs > Gigs and start adding gigs!

## Support

Submit an issue at <https://github.com/ne0fite/GigKeeper/issues> to request enhancements or report a bug.

Pull requests are always welcome!

## License

Copyright (C) 2017 Phoenix Bright Software, LLC

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
