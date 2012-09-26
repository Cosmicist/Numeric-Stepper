# Numeric Stepper Plug-in for jQuery

Simple and highly customizable jQuery plug-in Turns a text input into a numeric
stepper.

[Read the full docs here](http://xflatlinex.github.com/Numeric-Stepper/)

## Usage

Include the css and js file in your site and call `.stepper()` on the input(s)
you want the numeric stepper to be rendered.

```html
<link rel="stylesheet" href="stepper/jquery.stepper.css"/>
<script type="text/javascript" src="stepper/jquery.stepper.js"></script>
```

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