/* Numeric page uses the same exact parser and family UI as algebra pages.
   Loaded after vyrazy-math.js, vyrazy-content.js and vyrazy-city.js. */
'use strict';
if (!window.ExpressionMath || !window.ExpressionContent) throw Error('Chybí matematické jádro.');
