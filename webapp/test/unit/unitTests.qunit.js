/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/comparisonpattern/Test_ComparisonPattern/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});