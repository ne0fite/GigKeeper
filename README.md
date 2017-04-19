# GigKeeper

## Setup

1. Run `./install.sh`
1. Create a database and user for the application using phpMyAdmin or whatever you prefer
1. Run **./sql/GigKeeper-schema.sql** on the new database
1. Customize the values in **config/config.json**

## Environment Variable Alternative

Alternatively, you can provide environment-specific configuration in system environment variables. Environment variables take precedence over the `config.json` variables.

The `config.json` file works well with local development. However, environment variables are the preferred approach to a hosted solution.

<table>
<thead>
<tr><th>Name</th><th>Description</th><th>Default</th></tr>
</thead>
<tbody>
<tr><td>NODE_ENV</td><td>The node environment (development, stage, production)</td><td>development</td></tr>
<tr><td>SERVER_HOST</td><td>Web server host</td><td>localhost</td></tr>
<tr><td>SERVER_PORT</td><td>Web server port</td><td>8000</td></tr>
<tr><td>COOKIE_NAME</td><td>Session cookie name</td><td>gigkeeper-session</td></tr>
<tr><td>COOKIE_SECRET</td><td>Session cookie secret</td><td>tempdevcookieneedstobecreated123</td></tr>
<tr><td>DB_HOST</td><td>Database host name</td><td>localhost</td></tr>
<tr><td>DB_PORT</td><td>Database host port</td><td>3306</td></tr>
<tr><td>DB_DIALECT</td><td>Database host dialect</td><td>mysql</td></tr>
<tr><td>DB_NAME</td><td>Database name</td><td>gigkeeper</td></tr>
<tr><td>DB_USER</td><td>Database username</td><td>gigkeeper</td></tr>
<tr><td>DB_PASS</td><td>Database password</td><td>gigkeeper</td></tr>
<tr><td>GOOGLE_MAPS_API_KEY</td><td>Google Maps API key</td><td></td></tr>
</tbody>
</table>

The cookie secret is a 32-character hash. Go to the [Online Random Hash Generator](http://md5.my-addr.com/online_random_md5_hash_generator-and-md5_random_hash.php) to generate a random MD5 hash.

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

Note you will need to install [Sequelize](https://www.npmjs.com/package/sequelize) globally for this to work:

```
npm install sequelize -g
```

## Usage

```./start.sh```

## Getting Started

Once you have the application installed and configured, time to create an initial profile and user and get logged in. _For now_, this is done with SQL. Log in to the database with your favorite client and execute the following SQL:

```
insert into profiles set
    id="af357ec6-999b-4414-948e-37e2d73c31ff",
    createdAt=now(),
    updatedAt=now();
    
insert into users set
    id="4d3a1d69-f7b5-4d71-9c10-1e764b8819fb",
    profileId="af357ec6-999b-4414-948e-37e2d73c31ff",
    email="<your email address",
    password="$2a$10$AUdoEZF0lOQdvUt6VCHv1OnqAZ2WOZeDDVinthvFIhjfD/H8esHSi",
    active=1,
    createdAt=now(),
    updatedAt=now();
```

Use the [Online UUID Generator](https://www.uuidgenerator.net/) to generate your own UUID's or the [Online Bcrypt Hash Generator](http://bcrypthashgenerator.apphb.com/) to generate your own password if you desire.

This will create a new profile and user with the password `password`.

Navigate to the home page (i.e., http://localhost:8000) and log in. From there you can change your password under My Account > My Profile.

Navigate to My Gigs > Contractors to add contractors. These are the companies or people who book you to to gigs and pay you cheddar.

Navigate to My Gigs > Tags to add tags that you will use to categorize your gigs (i.e., Wedding, Private Party, Charitable Event, etc.).

Finally, navigate to My Gigs > Gigs and start adding gigs!
