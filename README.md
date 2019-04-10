# Form Pages

This plugin is useful to paginate your forms. You'll find here events to detect
when the pages change, callbacks, and metadata about the state of the plugin.

This plugin requires jQuery to work properly.

## Instalation
Using Yarn:

```
$ yarn add form-pages
```

## Usage

1. `require`, `import` or add the library to your HTML.
2. Include the `dist/from-pages.css` style to your page.
3. Setup your markup:

Form Pages works based on some markup to separate the pages and control buttons.
The markup classes can be found at the
[documentation](./global.html#FormPagesOptions). This same classes can be
changed as you wish, just remember to change it on the style.

Build your markup to match the classes configured in the plugin.

In the case below, we have a form that has two pages.
```html
<form class="pageable-form">
    <div class="form-pages__page"> <!-- This class separates the forms pages -->
        <!-- The content you want -->
    </div>
    <div class="form-pages__page">
        <!-- The content you want -->
    </div>
</form>
```

Call the script to initialize the plugin:
```javascript
$('.pageable-form').formPages();
```

This is all you need to make your paginated form work.
Check the options, events e methods [here](https://autoforce.github.io/form-pages/FormPages.html).