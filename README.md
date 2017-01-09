# EARK Platform UI

EARK Platform UI is a collection of tools for searching and accessing archival information. These tools are presented in a single-page web application that uses the [EARK Python Bridge](https://github.com/magenta-aps/eark-python-bridge) for a backend.

The Access Tools include multiple modules:
* Search module
* Order management
* IP viewing

The modules are all available in the same web user interface (UI) and the UI requires login to access. Logged in users will have different access permissions based on role. End users can only access the search module and IP viewing for IPs made available to them. Archivists have unrestricted access to all the modules.


## Get up and running

We assume you already have EARK Python Bridge installed and running as a backend. [Read the docs](https://github.com/magenta-aps/eark-python-bridge) to learn more.
We also assume you have [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed and running.

1. Clone the GitHub project. You can do it with a terminal command:
```
$ git clone https://github.com/magenta-aps/E-Ark-Platform-UI.git
```

2. Wire the EARK Platform UI to the backend by changing the proxy settings in the [gulpfile.js.](/gulpfile.js)

3. Browse to the project folder and build the project using npm and [gulp](http://gulpjs.com/):
```
/E-Ark-Platform-UI/$ npm update
/E-Ark-Platform-UI/$ npm install
/E-Ark-Platform-UI/$ gulp build
```

4. Set up hosting for your project files and point it to /E-Ark-Platform-UI/index.html

5. Open a web browser and point it to the URL where your project is hosted. Consult your backend provider to get usernames and passwords for login.


## Learn more

[Read the documentation](/documentation/README.md) for this project to learn more about customization options like adding translations.
