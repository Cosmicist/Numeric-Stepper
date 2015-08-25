;
(function($) {
  /*
   * Numeric Stepper jQuery plugin v1.5
   *
   * Licensed under MIT:
   *
   * Copyright (c) Luciano Longo
   *
   * Permission is hereby granted, free of charge, to any person obtaining a
   * copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to permit
   * persons to whom the Software is furnished to do so, subject to the
   * following conditions:
   *
   * The above copyright notice and this permission notice shall be included
   * in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
   * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
   * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
   * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
   * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
   * USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  $.fn.stepper = function(options) {
    var _defaults = {
      allowArrows : true, // keyboard arrows (up, down)
      allowWheel : true, // mouse wheel
      arrowStep : 1, // amount to increment with arrow keys
      decrementButton : '-',
      incrementButton : '+',
      limit : [ null, null ], // [min, max] limit
      precision : 2, // decimal precision
      preventWheelAcceleration : true, // On some systems, like OS X, the wheel has acceleration. Enable this option to prevent it
      type : 'int', // or 'float'
      ui : true, // +/- buttons
      wheelStep : 1, // amount to increment with mouse wheel

      // Events
      onStep : null, // fn( [number] val, [bool] up )
      onWheel : null, // fn( [number] val, [bool] up )
      onArrow : null, // fn( [number] val, [bool] up )
      onButton : null, // fn( [number] val, [bool] up )
      onKeyUp : null
    };

    return $(this).each(
            function() {
              var $data = $(this).data();
              delete $data.stepper;

              var _options = $.extend({}, _defaults, options, $data), $this = $(this), $wrap = $('<div class="stepper-wrap"/>');

              if ($this.data('stepper'))
                return;

              $wrap.insertAfter($this);
              $this.appendTo($wrap);

              /* API */

              $this.stepper = (function() {
                return {
                  limit : _limit,
                  decimalRound : _decimal_round,
                  onStep : function(callback) {
                    _options.onStep = callback;
                  },
                  onWheel : function(callback) {
                    _options.onWheel = callback;
                  },
                  onArrow : function(callback) {
                    _options.onArrow = callback;
                  },
                  onButton : function(callback) {
                    _options.onButton = callback;
                  },
                  onKeyUp : function(callback) {
                    _options.onKeyUp = callback;
                  }
                };
              })();

              $this.data('stepper', $this.stepper);

              /* UI */

              if (_options.ui) {
                var $btnWrap = $('<div class="stepper-btn-wrap"/>').appendTo(
                    $wrap), $btnUp = $(
                    '<a class="stepper-btn-up">' + _options.incrementButton
                        + '</a>').appendTo($btnWrap), $btnDown = $(
                    '<a class="stepper-btn-dwn">' + _options.decrementButton
                        + '</a>').appendTo($btnWrap);

                $wrap.css({
                  'margin-top' : $this.css('margin-top'),
                  'margin-left' : $this.css('margin-left'),
                  'margin-bottom' : $this.css('margin-bottom'),
                  'margin-right' : $btnWrap.outerWidth()
                      + parseInt($this.css('margin-right'))
                });

                $this.css('margin', 0);

                var stepInterval;

                $btnUp.mousedown(function(e) {
                  e.preventDefault();

                  var val = _step(_options.arrowStep);
                  _evt('Button', [ val, true ]);
                });

                $btnDown.mousedown(function(e) {
                  e.preventDefault();

                  var val = _step(-_options.arrowStep);
                  _evt('Button', [ val, false ]);
                });

                $(document).mouseup(function() {
                  clearInterval(stepInterval);
                });
              }

              /* Events */

              if (_options.allowWheel) $wrap.bind('DOMMouseScroll mousewheel wheel', _handleWheel);

              $wrap.keydown(function(e) {
                    var key = e.which, val = $this.val();
                    if (_options.allowArrows)
                      switch (key) {
                      // Up arrow
                      case 38:
                        val = _step(_options.arrowStep);
                        _evt('Arrow', [ val, true ]);
                        break;

                      // Down arrow
                      case 40:
                        val = _step(-_options.arrowStep);
                        _evt('Arrow', [ val, false ]);
                        break;
                      }

                    // Allow only arrow keys, misc modifier chars and
                    // numbers and period (including keypad)
                    if (!isArrow(key)
                      && !isBackspace(key)
                      && !isDecimal(key)
                      && !isDelete(key)
                      && !isEnd(key)
                      && !isEnter(key)
                      && !isHome(key)
                      && !isNumber(key)
                      && !isTab(key))
                      e.preventDefault();

                    // Allow only one period if float is enabled
                    if (_options.type == "float" && isDecimal(key) && val.indexOf('.') != -1) e.preventDefault();
                    // Do not allow period if float is not enabled
                    else if (_options.type != "float" && isDecimal(key)) e.preventDefault();

                    // Allow only if the value is within limits
                    val = parseFloat(val + String.fromCharCode(key));
                    if (val != _limit(val)) e.preventDefault();
                  }).keyup(function(e) {
                _evt('KeyUp', [ $this.val() ]);
              });

              function _handleWheel(e) {
                // Prevent actual page scrolling
                e.preventDefault();

                var d, evt = e.originalEvent ? e.originalEvent : e;

                if (evt.wheelDelta) d = evt.wheelDelta / 120;
                else if (evt.detail) d = -evt.detail / 3;
                else if (evt.deltaY) d = -evt.deltaY / 3;
                else d = 0;

                if (d) {
                  if (_options.preventWheelAcceleration) d = d < 0 ? -1 : 1;

                  var val = _step(_options.wheelStep * d);

                  _evt('Wheel', [ val, d > 0 ]);
                }
              }

              function _step(step) {
                if (!$this.val()) $this.val(0);

                var typeCast = _options.type == 'int' ? parseInt : parseFloat, val = _limit(typeCast($this.val()) + step);

                $this.val(val);

                _evt('Step', [ val, step > 0 ]);

                return val;
              }

              function _evt(name, args) {
                var callback = _options['on' + name];

                if (typeof callback == 'function')
                  callback.apply($this, args);
              }

              function _limit(num) {
                var min = _options.limit[0], max = _options.limit[1];

                if (min !== null && num < min)
                  num = min;
                else if (max !== null && num > max)
                  num = max;

                return _options.type == 'int' ? num : _decimal_round(num);
              }

              function _decimal_round(num, precision) {
                if (typeof (precision) == 'undefined') {
                  precision = _options.precision;
                }

                var pow = Math.pow(10, precision);

                return (Math.round(num * pow) / pow).toFixed(precision);
              }

              function isArrow(key) { return key > 36 && key < 41; }
              function isBackspace(key) { return key == 8; }
              function isDecimal(key) { return key == 110 || key == 190; }
              function isDelete(key) { return key == 46; }
              function isEnd(key) { return key == 35; }
              function isEnter(key) { return key == 13; }
              function isHome(key) { return key == 36; }
              function isNumber(key) { return (key > 47 && key < 58) || (key > 95 && key < 106); }
              function isTab(key) { return key == 9; }
            });
  }
})(jQuery);
