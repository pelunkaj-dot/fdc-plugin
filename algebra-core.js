/* Algebra public core: exact identities and goal-sensitive validation.
   Kept at the original URL for existing integrations. */
(function(root){'use strict';const M=typeof module!=='undefined'?require('./vyrazy-math.js'):root.ExpressionMath;
const api={parse:M.parse,polynomial:M.poly,equivalent:(a,b)=>{try{return M.equal(M.poly(M.parse(a)),M.poly(M.parse(b)))}catch{return false}},classify:M.classify};
if(typeof module!=='undefined')module.exports=api;root.AlgebraCore=api;})(globalThis);
