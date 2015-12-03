var _ = require("lodash");
var url = require('url');
var storage = require('node-persist');
storage.initSync();

var entries = storage.valuesWithKeyMatch('host_');
var sorted = _.sortBy(entries, function(n) {
  return n.count;
}).reverse();

var topTen = _.take(sorted, 10);

console.log(topTen.map(function(item){
  return " * " + item.host +" used "+item.count + " times";
}));