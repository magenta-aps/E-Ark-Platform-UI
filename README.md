# EARK Platform UI

EARK Platform UI is a collection of tools for searching and accessing archival information. These tools are presented in a single-page web application that uses the [EARK Python Bridge](https://github.com/magenta-aps/eark-python-bridge) for a backend.

The Access Tools include multiple modules:
* Search module
* Order management
* IP viewing

The modules are all available in the same web user interface (UI) and the UI requires login to access. Logged in users will have different access permissions based on role. End users can only access the search module and IP viewing for IPs made available to them. Archivists have unrestricted access to all the modules.


## Get up and running

1. Clone the project
2. Setup a server
3. Run terminal commands
```
npm update
npm install
gulp build
```
4. [Then read the documentation](/documentation/README.md)
