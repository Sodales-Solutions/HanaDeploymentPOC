sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.comparisonpattern.Test_ComparisonPattern.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				// iOriginalBusyDelay,
				// oTable = this.byId("table");

				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				// iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				// // keeps the search state
				// this._aTableSearchState = [];

				// Model used to manipulate control states
				oViewModel = new JSONModel({
					worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay: 0,

					"pagesCount": 4,
					"aCardsData": [{
						"title": "Roadster",
						"subtitle": "Mens Fashion",
						"Supplier": "Myntra",
						"MainCategory": "Clothes",
						"Category": "T-Shirts",
						"width": "28",
						"hieght": "38",
						"weigth": "200"
					}, {
						"title": "Wrong",
						"subtitle": "Mens Fashion",
						"Supplier": "Flipkart",
						"MainCategory": "Clothes",
						"Category": "Jeans",
						"width": "30",
						"hieght": "40",
						"weigth": "300"
					}, {
						"title": "Puma",
						"subtitle": "Mens Fashion",
						"Supplier": "Amazon",
						"MainCategory": "Clothes",
						"Category": "T-Shirts",
						"width": "32",
						"hieght": "42",
						"weigth": "500"
					}, {
						"title": "Puma",
						"subtitle": "Mens Fashion",
						"Supplier": "Amazon",
						"MainCategory": "Clothes",
						"Category": "T-Shirts",
						"width": "32",
						"hieght": "42",
						"weigth": "500"
					}],
					"BidApplicantsNew": [{
						"title": "Supplier",
						"value": [{
							"text": "Myntra",
							"discription": "Available"

						}, {
							"text": "Flipkart",
							"discription": "Available"
						}]
					}, {
						"title": "Main Category",
						"value": [{
							"text": "Clothes",
							"discription": "Available"
						}, {
							"text": "Clothes",
							"discription": "Available"
						}]
					}, {
						"title": "Category",
						"value": [{
							"text": "T-Shirts",
							"discription": "Available"
						}, {
							"text": "Jeans",
							"discription": "Available"
						}]
					}, {
						"title": "Width (cm)",
						"value": [{
							"text": "28",
							"discription": "Available"
						}, {
							"text": "30",
							"discription": "Available"
						}]
					}],
					"dMaxDate": new Date()
				});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			// oTable.attachEventOnce("updateFinished", function(){
			// 	// Restore original busy indicator delay for worklist's table
			// 	oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			// });
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#ComparisonPattern-display"
			}, true);

			this._oCarouselSnapped = this.getView().byId("carousel-snapped");
			this._oCarouselExpanded = this.getView().byId("carousel-expanded");
			this._oDynamicPage = this.getView().byId("dynamic-page");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("CategoryID", FilterOperator.EQ, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("CategoryID")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		onStateChange: function (oEvent) {

		},
		onPageChanged: function (oEvent) {
			var aActivePages = oEvent.getParameter("activePages"),
				oViewModel = this.getView().getModel("worklistView"),
				aCardsData = oViewModel.getProperty("/aCardsData"),
				aBidApplicantsNew = oViewModel.getProperty("/BidApplicantsNew");
			aBidApplicantsNew[0].value = [];
			aBidApplicantsNew[1].value = [];
			aBidApplicantsNew[2].value = [];
			aBidApplicantsNew[3].value = [];

			for (var i in aActivePages) {
				aBidApplicantsNew[0].value.push({
					"text": aCardsData[aActivePages[i]].Supplier,
					"discription": "Available"
				});
			}
			for (var i in aActivePages) {
				aBidApplicantsNew[1].value.push({
					"text": aCardsData[aActivePages[i]].MainCategory,
					"discription": "Available"
				});
			}
			for (var i in aActivePages) {
				aBidApplicantsNew[2].value.push({
					"text": aCardsData[aActivePages[i]].Category,
					"discription": "Available"
				});
			}
			for (var i in aActivePages) {
				aBidApplicantsNew[3].value.push({
					"text": aCardsData[aActivePages[i]].width,
					"discription": "Available"
				});
			}

			oViewModel.setProperty("/BidApplicantsNew", aBidApplicantsNew);

		},

		onPressOpenDetails: function () {

			var dd = {
				content: [{
					columns: [{
						text: 'Grievance Management\n Step - File for Step 2',
						bold: true,
						fontSize: 15,
						color: '#183f6e'
					}]
				}],
				styles: {
					tableOne: {

						fontSize: 12,
						bold: true,
						margin: [0, 0, 0, 10],
						alignment: 'right',
					}
				}
			}

			pdfMake.createPdf(dd).open();

		},
		
		
		onDateChange: function (oEvent) {
			var sValue = oEvent.getParameter('value');
			sValue.replaceAll("/", "-");
			
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM-yyyy",
				UTC: true
			});
			sValue = oDateFormat.format(new Date(sValue));
			
			var n = 0;
			for (var i in sValue) {
				if (sValue[i] === "-") {
					n++;
				}
			}
			
			if (n !== 2) {
				if (sValue.length > 10 || sValue.length < 8) {
					var oTextArea = oEvent.getSource();
					oTextArea.setValue('');
					sap.m.MessageToast.show("Please enter valid date.");
				}
				var oTextArea = oEvent.getSource();
				oTextArea.setValue('');
				sap.m.MessageToast.show("Please enter valid date.");
			}

			if (new Date() < new Date(sValue)) {
				var oTextArea = oEvent.getSource();
				oTextArea.setValue('');
				sap.m.MessageToast.show("Please enter valid date.");
			} else {

			}

			// var regex = /[^\d]/g;
			// var regeXs = /([^\d]+[^\s]*-)/g;
			// var result = regex.test(sValue);
			// var result1 = regeXs.test(sValue);
			// if (result === true || result1 === true) {
			// 	if (sValue[0] === ' ') { // or use sValue.match(/^ /)
			// 		oEvent.getSource().setValue(sValue.trimStart());
			// 		sap.m.MessageToast.show("Space character is not allowed.");
			// 	}
			// 	var oTextArea = oEvent.getSource(),
			// 		iValueLength = oTextArea.getValue().length;
			// 	// iMaxLength = oTextArea.getMaxLength();
			// } else {
			// 	var oTextArea = oEvent.getSource(),
			// 		iValueLength = oTextArea.getValue().length;
			// 	// iMaxLength = oTextArea.getMaxLength();
			// 	oTextArea.setValue('');
			// }
			

			// // JSON sample data
			// var classData = {
			// 	className: "Coding 101",
			// 	id: 800,
			// 	startdate: "2017-12-31T23:59:59.000"
			// };

			// // convert JSON date to JS date object and format via moment for UI5 consumption
			// classData.startdateraw = new Date(classData.startdate);
			// classData.startdatefmt = moment(classData.startdateraw).format('YYYY-MM-DD-HH-mm-ss');

			// // create JSON model instance
			// var oModel = new sap.ui.model.json.JSONModel();

			// // set the data for the model
			// oModel.setData(classData);

			// // set model to core.
			// sap.ui.getCore().setModel(oModel);

			// // Enable validation !!
			// sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);

			// this.getView().byId("startDate").attachValidationError(function () {

			// 	alert('Validation error fires - hoorah')

			// })
		}

	});
});