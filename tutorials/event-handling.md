# Event handling
In this tutorial we are going to configure a form and listen to the events
related to Form Pages.

## Let's code
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Demo form</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="form-pages.js"></script>
  <link rel="stylesheet" href="form-pages.css">
</head>

<body>
  <h1 class="text-center">Demo pageable form</h1>
  <div class="container">
    <div class="col-12 col-sm-4 offset-sm-4">
      <form class="pageable-form">
        <div class="form-pages__page">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" name="name" />
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" class="form-control" name="email" />
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-sm-6 col-12">
                <button class="btn w-100 btn-primary form-pages__prev-button">
                  Prev
                </button>
              </div>
              <div class="col-sm-6 col-12">
                <button class="btn w-100 btn-primary form-pages__next-button">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="form-pages__page">
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" class="form-control" name="tel" />
          </div>
          <div class="form-group">
            <input type="submit" class="btn btn-primary" value="Submit my form!" />
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-sm-6 col-12">
                <button class="btn w-100 btn-primary form-pages__prev-button">
                  Prev
                </button>
              </div>
              <div class="col-sm-6 col-12">
                <button class="btn w-100 btn-primary form-pages__next-button">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <script>
    $(function () {
      var $pageableForm = $('.pageable-form');
      // FormPages events contains data about the current page.
      $pageableForm.formPages({
        // Listening events using callback options.
        onNextPage: function (e) {
          console.log("onNextPage", e);
        },
        onPrevPage: function (e) {
          console.log("onPrevPage", e);
        },
        onInitialized: function(instance) {
          console.log("onInitialized", instance);
        }
      });

      // Listening events using `on` function.
      $pageableForm.on('next.page.fp', function () {
        console.log('next.page.fp');
      });
      $pageableForm.on('prev.page.fp', function () {
        console.log('prev.page.fp');
      });
      $pageableForm.on('initialized.fp.page', function () {
        console.log('prev.page.fp');
      });
    });
  </script>
  <style>
    .pageable-form {
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
    }

    .form-pages__page {
      display: flex;
      flex-direction: column;
    }

    .form-pages__page>.form-group:last-child {
      margin-top: auto;
    }
  </style>
</body>

</html>
```

## Events explanations
The plugin have a method `trigger` very similar to jQuery's. This methods
receives the `eventName` and the `params` you would like to pass to the event.

`params` are **always** merged with the default data passed to the event which are:

### Default event data
These parameters are **always** in the events payload:
- `currentPageIndex`: The index of the current page
- `currentPageElement`: The jQuery object representing the active page


### Initialization events
#### `onInitialized`
Called when the plugin initialization process is finished.

##### Received data:
- `instance`: The FormPages instance

### Movement events
Called when the form pages move in some direction.
By design, these events **are not** triggered when the movement is out of
bounds. e.g. Moving to the next page when already in the last one, or moving to
a negative index, since the index `0` is the first page.


#### `next.page.fp`
##### Associated callback: `onNextPage`
Called when the form moves to the next page.

#### `prev.page.fp`
##### Associated callback: `onPrevPage`
Called when the form moves to the previous page.

#### `moved.fp`
##### Associated callback: `onMovedPage`
Called when the form moves to any direction.

## Tips
### Recalculate adaptive form container height
Sometimes it's useful to recalculate your form's container height lets say, when
you use a plugin to validate it and it add labels below the invalid fields.
To do so, the only thing you need to do is to trigger the event
`recalculate-height.fp` from your plugin's instance.

```javascript
var myForm = $('.myForm');
myForm.formPages();
myForm.trigger('recalculate-height.fp');
```

### Validating current page
When using [jQuery Validation Plugin](https://jqueryvalidation.org/) you can do a partial validation of your form. This is usually combined with the hability to move to the next page or not. This could be an implementation in such case:

```javascript
var myForm = $('.myForm');
myForm.validate({
  /* Your validation rules. */
});

myForm.formPages({
  // Calling the `valid` method in a set of fields will validate only that set of
  // fields, not the entire form.

  // Using this approach to validate all the form would break the plugin's
  // behavior, since some following pages could have invalid fields and
  // `shouldMoveForwards` would return `false`
  shouldMoveForwards() {
    return this.getCurrentPageElement()
      .find("input")
      .valid();
  }
});
```