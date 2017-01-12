# TRANSLATIONS IN THE UI

Translations make use of Angular Translate module (https://angular-translate.github.io/).


## How translations work in EARK-Platform-UI

If you want to add translatable text in a view file, you need to add an expression with the 'translate' filter attached.
Say you have a template file at app/src/something/view/someView.html and your code looks like this:
```
<md-button>This needs translating</md-button>
```
You would make the button text translatable like this:
```
<md-button>{{ 'COMMON.THIS_NEEDS_TRANSLATING' | translate }}</md-button>
```

You'll notice that this example puts the translatable string in the 'COMMON' namespace. All translatable strings are put
into namespaces. 'COMMON' being the one used for common strings like 'OK', 'Cancel', etc. Other namespaces include
'DOCUMENT', and so on. You will typically have a namespace that relates to the app.module you are working with.

Translatable strings can also be added programmatically. See the [Angular translate docs](https://angular-translate.github.io/docs/#/api) for details.

Your basic translation files are located in:
```
/app/src/i18n/en.json
```
These are the base translations files including translations in the 'COMMON' namespace (amongst other things). Additionally, most modules have their own translations with different namespaces.
Example: For the 'Order' module, you'll find correspondig translation files in `/app/src/order/i18n/`.
```
/app/src/order/i18n/en-order.json
```

## Adding a new translation


### Make a copy of an existing translation.

From the project directory, do a search of JSON-files in directories named i18n. You should get a list of translation files for all modules in the system.
```
/app/src/i18n/en.json
/app/src/header/i18n/en-header.json
/app/src/ipiew/i18n/en-ipview.json
/app/src/order/i18n/en-order.json
/app/src/order_management/i18n/en-orderman.json
```
etc ...

Copy all the JSON files and change their name by modifying the 'en' prefix to reflect the target language code. If you wanted to add a Danish translation, you'd add copies and name them with the 'da' prefix like so:
```
/app/src/i18n/en.json
/app/src/i18n/da.json
/app/src/header/i18n/en-header.json
/app/src/header/i18n/da-header.json
/app/src/ipiew/i18n/en-ipview.json
/app/src/ipiew/i18n/da-ipview.json
/app/src/order/i18n/en-order.json
/app/src/order/i18n/da-order.json
/app/src/order_management/i18n/en-orderman.json
/app/src/order_management/i18n/da-orderman.json
```
etc ...


### Translate texts

Open the new translation files in a text editor and replace the translated text with your own translations. Here is an example from the new da-header.json:
```
{
    "HEADER":{
        "TITLE": "Access Software",
        "SHOW_MENU": "Show menu",
        "LOGOUT": "Logout"
    }
}

... becomes ...

{
    "HEADER":{
        "TITLE": "Adgangssoftware",
        "SHOW_MENU": "Vis menu",
        "LOGOUT": "Log ud"
    }
}
```

### Register translation

Open `/app/src/i18n/translations.module.js` and add an entry in the `defineLangs` variable for your translation.
Here is an example where we've registered English and Danish translations:
```
var defineLangs = [
    {
        title: 'English (US)',
        code: 'en',
        locale: 'en_US'
    },
    {
        title: 'Dansk',
        code: 'da',
        locale: 'da_DK'
    }
];
```

### Rebuild Angular app

Save your changes and run the gulp build terminal command from the project directory.
```
gulp build
```
Depending on your server-setup, you should how be able to browse to the EARK Platform UI and refresh your browser. Depending on your browser's language settings, you should see the translation in action.
The language picker in the UI header will now have your new translation as an available option.
