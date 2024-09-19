sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		onDateChange: function (oEvent) {
			var sValue = oEvent;
			if (!sValue) {
				sValue.replaceAll("/", "-");

				var n = 0;
				for (var i in sValue) {
					if (sValue[i] === "-") {
						n++;
					}
				}
				if (n !== 2) {
					if (sValue.length > 10) {
						var oTextArea = oEvent.getSource();
						oTextArea.setValue('');
						sap.m.MessageToast.show("Please enter valid date.");
					}
					var oTextArea = oEvent.getSource();
					oTextArea.setValue('');
					sap.m.MessageToast.show("Please enter valid date.");
				}
			}

		}

	};

});