# Numeric Stepper Plug-in for jQuery

Simple and highly customizable jQuery plug-in Turns a text input into a numeric
stepper.

## Settings

Every options can be overriden by using it's html5 data attribute equivalent,
allowing you to have completely different steppers with one global call.

Here's a comprehensive list of all the options.

_The option type appears before each option and default values apper next. If an
option can have multiple values, the default one will be in bold._

* string **type** _**"float"**/"int"_  
  This option indicates whether the input will accept decimal values or just
  integers.
* int **floatPrecission** _**2**_  
  Indicates the floating point precission for decimals. A value of 2 may result
  in a value like 2.14274 to be shown as 2.14.
* bool **ui** _**true**_
  Whether to show the up/down buttons next to the input.
* bool **allowWheel** _**true**_
  Allow mouse wheel to increment/decrement number.
* bool **allowArrows** _**true**_
  Allow keyboard up/down arrows to increment/decrement number.
* number **arrowStep** _**1**_
  The increment/decrement for keyboard arrows.
* number **wheelStep** _**1**_
  The increment/decrement for mouse wheel.
* array **limit** _**[]**_
  The min and max numbers allowed by the input expressed as an array.  
  E.g: `[-5,5]` would only allow a range of numbers between -5 and 5.
* array **preventWheelAcceleration** _**true**_
  In some systems, like OS X, the wheel has acceleration, and this may cause
  extremeply high increments, enable this option to prevent this.

### HTML5 settings

All of the options explained above can be set on a per-input basis as it's HTML5
data attribute equivalent, i.e., prepend "data-" and camelization becomes
hyphenation.

**E.g:**

```html
<input type="text" data-wheel-step="2">
```

#### Caveat

With the `data-limit` option, though, there's a caveat you should be aware of:
If you intend to only set one limit (being min or max), in JavaScript you could
just leave a value blank, like so `limit: [0,]` this would set the min limit to 0 with
no max limit. But to achieve the same thing with the attribute, you **must**
explicitly set both limits, this means that to leave a limit unset you must
set it to `null` like this `data-limit="[0,null]"`.

### Hooks/Events

As of now, the plugin does not trigger any events but hooks/callbacks can be
registered by passing them as options in the settings.  
Real event triggering is planned to be implemented in the somewhat-near future.

All the callbacks, with the exception of _onKeyUp_, receive the number value and
a boolean (up) indicating whether it was an increment or not.  
The _onKeyUp_ callback will receive the "up" parameter in the future.

These are all hooks supported up to the current version:

* onStep ( _number_ value, _bool_ up )
  Fired each time the value is changed by the buttons, arrow keys or mouse
  wheel.  
* onWheel ( _number_ value, _bool_ up )
  Fired each time the value is changed by the buttons, arrow keys or mouse
  wheel.
* onArrow ( _number_ value, _bool_ up )
* onButton ( _number_ value, _bool_ up )
* onKeyUp ( _number_ value )

## Usage

### Default Settings

```javascript
$('.numeric').stepper();
```

### Custom settings

```javascript
$('.numeric').stepper({
    type: 'float'       // Allow floating point numbers
    wheel_step:1,       // Wheel increment is 1
    arrow_step: 0.5,    // Up/Down arrows increment is 0.5
    limit: [0,],         // No negative values
    onStep: function( val, up )
    {
        // do something here...
    }
});
```