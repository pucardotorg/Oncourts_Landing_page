console.log("=== testglobalconfig.js LOADED ===");
console.log("Source: Loaded from local path /globalconfig/testglobalconfig.js");
console.log("Timestamp:", new Date().toISOString());

var globalConfigs = (function () {
  console.log("=== globalConfigs IIFE executing ===");
})();
