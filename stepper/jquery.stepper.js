(function($)
{
    /*
    Numeric Stepper jQuery plugin
    
    Licensed under MIT:
    
    Copyright (c) Luciano Longo
    
    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
    $.fn.stepper = function( options )
    {
        var _defaults = {
            type: 'float',                  // or 'int'
            floatPrecission: 2,             // decimal precission
            ui: true,                       // +/- buttons
            allowWheel: true,               // mouse wheel
            allowArrows: true,              // keyboar arrows (up, down)
            arrowStep: 1,                   // ammount to increment with arrow keys
            wheelStep: 1,                   // ammount to increment with mouse wheel
            limit: [null, null],            // [min, max] limit
            preventWheelAcceleration: true, // In some systems, like OS X, the wheel has acceleration, enable this option to prevent it
            incrementButton: '&blacktriangle;',
            decrementButton: '&blacktriangledown;',
            
            // Events
            onStep: null,   // fn( [number] val, [bool] up )
            onWheel: null,  // fn( [number] val, [bool] up )
            onArrow: null,  // fn( [number] val, [bool] up )
            onButton: null, // fn( [number] val, [bool] up )
            onKeyUp: null   // fn( [number] val )
        };
        
        return $(this).each(function()
        {
            var $data = $(this).data();
                delete $data.stepper;

            var _options = $.extend({}, _defaults, options, $data),
                $this = $(this),
                $wrap = $('<div class="stepper-wrap"/>');

            if( $this.data('stepper') )
                return;
            
            $wrap.insertAfter( $this );
            $this.appendTo( $wrap );

            /* API */
            
            $this.stepper = (function()
            {
                return {
                    limit: _limit,
                    decimalRound: _decimal_round,
                    onStep: function( callback ) { _options.onStep = callback; },
                    onWheel: function( callback ) { _options.onWheel = callback; },
                    onArrow: function( callback ) { _options.onArrow = callback; },
                    onButton: function( callback ) { _options.onButton = callback; },
                    onKeyUp: function( callback ) { _options.onKeyUp = callback; }
                };
            })();

            $this.data('stepper', $this.stepper);
            
            /* UI */
            
            if( _options.ui )
            {
                var $btnWrap = $('<div class="stepper-btn-wrap"/>').appendTo( $wrap ),
                    $btnUp   = $('<a class="stepper-btn-up">'+_options.incrementButton+'</a>').appendTo( $btnWrap ),
                    $btnDown = $('<a class="stepper-btn-dwn">'+_options.decrementButton+'</a>').appendTo( $btnWrap );
                
                $wrap.css({
                    'margin-top': $this.css('margin-top'),
                    'margin-left': $this.css('margin-left'),
                    'margin-bottom': $this.css('margin-bottom'),
                    'margin-right': $btnWrap.outerWidth() + parseInt( $this.css('margin-right') )
                });

                $this.css('margin', 0);

                var stepInterval;
                
                $btnUp.mousedown(function(e)
                {
                    e.preventDefault();
                    
                    var val = _step( _options.arrowStep );
                        _evt('Button', [val, true]);
                });
                
                $btnDown.mousedown(function(e)
                {
                    e.preventDefault();
                    
                    var val = _step( -_options.arrowStep );
                        _evt('Button', [val, false]);
                });
                
                $(document).mouseup(function()
                {
                    clearInterval( stepInterval );
                });
            }
            
            
            /* Events */
            
            if( _options.allowWheel )
            {
                $wrap.bind('DOMMouseScroll', _handleWheel);
                $wrap.bind('mousewheel', _handleWheel);
            }
            
            $wrap.keydown(function(e)
            {
                var key = e.which,
                    val = $this.val();
                
                if( _options.allowArrows )
                    switch( key )
                    {
                        // Up arrow
                        case 38:
                            val = _step( _options.arrowStep );
                            _evt('Arrow', [val, true]);
                        break;

                        // Down arrow
                        case 40:
                            val = _step( -_options.arrowStep );
                            _evt('Arrow', [val, false]);
                        break;
                    }
                
                // Only arrow keys, misc modifier chars and numbers and period (including keypad)
                if( ( key < 37 && key > 40 ) || ( key > 57 && key < 91 ) || ( key > 105 && key != 110 && key != 190 ) )
                    e.preventDefault();
                
                // Allow only one peroid and only if float is enabled
                if( _options.type == 'float' && $.inArray( key, [ 110, 190 ] ) != -1 && val.indexOf('.') != -1 )
                    e.preventDefault();
            }).keyup(function(e)
            {
                _evt('KeyUp', [$this.val()] );
            });
            
            function _handleWheel(e)
            {
                // Prevent actual page scrolling
                e.preventDefault();
                
                var d,
                    evt = e.originalEvent;

                if( evt.wheelDelta )
                    d = evt.wheelDelta / 120;
                else if( evt.detail )
                    d = -evt.detail / 3;

                if( d )
                {
                    if( _options.preventWheelAcceleration )
                        d = d < 0 ? -1 : 1;
                    
                    var val = _step( _options.wheelStep * d );
                    
                    _evt('Wheel', [val, d > 0]);
                }
            }
            
            function _step( step )
            {
                if( ! $this.val() )
                    $this.val( 0 );

                var typeCast = _options.type == 'int' ? parseInt : parseFloat,
                    val      = _limit( typeCast( $this.val() ) + step );
                    
                $this.val( val );
                
                _evt('Step', [val, step > 0]);
                
                return val;
            }
            
            function _evt( name, args )
            {
                var callback = _options['on'+name];

                if( typeof callback == 'function' )
                    callback.apply( $this, args );
            }

            function _limit( num )
            {
                var min = _options.limit[0],
                    max = _options.limit[1];
                
                if( min !== null && num < min )
                    num = min;
                else if( max !== null && num > max )
                    num = max;
                
                return _decimal_round( num );
            }
            
            function _decimal_round( num, precission )
            {
                if( typeof precission == 'undefined' )
                    precission =  _options.floatPrecission;
                
                var pow = Math.pow(10, precission);
                num = Math.round( num * pow ) / pow;
                
                return num;
            }
        });
    }
})(jQuery);