sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/FLP",
	"./WorklistJourney",
	"./NavigationJourney",
	"./NotFoundJourney",
	"./ObjectJourney",
	"./FLPIntegrationJourney"
], function (Opa5, FLP) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new FLP(),
		assertions: new FLP(),
		viewNamespace: "com.comparisonpattern.Test_ComparisonPattern.view.",
		autoWait: true
	});

});
