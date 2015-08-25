/*
 * Numeric Stepper jQuery plugin v1.5
 * 
 * Licensed under the MIT License:
 * 
 * Copyright (c) Luciano Longo
 * https://github.com/xFlatlinex/Numeric-Stepper
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
!function(e){e.fn.stepper=function(n){var t={allowArrows:!0,allowWheel:!0,arrowStep:1,decrementButton:"-",incrementButton:"+",limit:[null,null],precision:2,preventWheelAcceleration:!0,type:"int",ui:!0,wheelStep:1,onStep:null,onWheel:null,onArrow:null,onButton:null,onKeyUp:null};return e(this).each(function(){function r(e){e.preventDefault();var n,t=e.originalEvent?e.originalEvent:e;if(n=t.wheelDelta?t.wheelDelta/120:t.detail?-t.detail/3:t.deltaY?-t.deltaY/3:0){g.preventWheelAcceleration&&(n=0>n?-1:1);var r=o(g.wheelStep*n);a("Wheel",[r,n>0])}}function o(e){y.val()||y.val(0);var n="int"==g.type?parseInt:parseFloat,t=i(n(y.val())+e);return y.val(t),a("Step",[t,e>0]),t}function a(e,n){var t=g["on"+e];"function"==typeof t&&t.apply(y,n)}function i(e){var n=g.limit[0],t=g.limit[1];return null!==n&&n>e?e=n:null!==t&&e>t&&(e=t),"int"==g.type?e:l(e)}function l(e,n){"undefined"==typeof n&&(n=g.precision);var t=Math.pow(10,n);return(Math.round(e*t)/t).toFixed(n)}function u(e){return e>36&&41>e}function p(e){return 8==e}function c(e){return 110==e||190==e}function f(e){return 46==e}function s(e){return 35==e}function v(e){return 13==e}function d(e){return 36==e}function w(e){return e>47&&58>e||e>95&&106>e}function h(e){return 9==e}var m=e(this).data();delete m.stepper;var g=e.extend({},t,n,m),y=e(this),S=e('<div class="stepper-wrap"/>');if(!y.data("stepper")){if(S.insertAfter(y),y.appendTo(S),y.stepper=function(){return{limit:i,decimalRound:l,onStep:function(e){g.onStep=e},onWheel:function(e){g.onWheel=e},onArrow:function(e){g.onArrow=e},onButton:function(e){g.onButton=e},onKeyUp:function(e){g.onKeyUp=e}}}(),y.data("stepper",y.stepper),g.ui){var A=e('<div class="stepper-btn-wrap"/>').appendTo(S),D=e('<a class="stepper-btn-up">'+g.incrementButton+"</a>").appendTo(A),b=e('<a class="stepper-btn-dwn">'+g.decrementButton+"</a>").appendTo(A);S.css({"margin-top":y.css("margin-top"),"margin-left":y.css("margin-left"),"margin-bottom":y.css("margin-bottom"),"margin-right":A.outerWidth()+parseInt(y.css("margin-right"))}),y.css("margin",0);var B;D.mousedown(function(e){e.preventDefault();var n=o(g.arrowStep);a("Button",[n,!0])}),b.mousedown(function(e){e.preventDefault();var n=o(-g.arrowStep);a("Button",[n,!1])}),e(document).mouseup(function(){clearInterval(B)})}g.allowWheel&&S.bind("DOMMouseScroll mousewheel wheel",r),S.keydown(function(e){var n=e.which,t=y.val();if(g.allowArrows)switch(n){case 38:t=o(g.arrowStep),a("Arrow",[t,!0]);break;case 40:t=o(-g.arrowStep),a("Arrow",[t,!1])}u(n)||p(n)||c(n)||f(n)||s(n)||v(n)||d(n)||w(n)||h(n)||e.preventDefault(),"float"==g.type&&c(n)&&-1!=t.indexOf(".")?e.preventDefault():"float"!=g.type&&c(n)&&e.preventDefault(),t=parseFloat(t+String.fromCharCode(n)),t!=i(t)&&e.preventDefault()}).keyup(function(){a("KeyUp",[y.val()])})}})}}(jQuery);
