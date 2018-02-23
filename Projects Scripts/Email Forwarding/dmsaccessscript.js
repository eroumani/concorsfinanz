var DmsAccessScript = {

	init : function () {

		// Register steps
		GLOBAL.step( {
			stFindNextDocument: DmsAccessScript.findNextDocument
		});
		GLOBAL.step( {
			stDownloadDocument: DmsAccessScript.downloadDocument
		});
		GLOBAL.step( {
			stExtractDocument: DmsAccessScript.extractDocument
		});
		GLOBAL.step( {
			stGetAdditionalInfo: DmsAccessScript.getAdditionalInfo
		});
		GLOBAL.step( {
			stArchiveDocument: DmsAccessScript.archiveDocument
		});
		GLOBAL.step( {
			stDeleteDocumentInDms: DmsAccessScript.deleteDocumentInDms
		});
		GLOBAL.step( {
			stFailedDoc: DmsAccessScript.FailedDoc
		});
	},

	findNextDocument : function (ev, sc, st) {
			
		// Navigate to the queue
		var data = sc.data;
		sc.data.fileName = "";
		sc.data.customerName = "";
		if (!DMSApp.pCreditQueue.exist()) {

			// We are not in the queue page. So first go pack to start and navigate from there
			if (!DMSApp.pMain.exist()) {
//				var currentPage = null;
//				if (DMSApp.pCreditInbox.exist())
//					currentPage = DMSApp.pCreditInbox;
//				if (DMSApp.pCreditQueue.exist())
//					currentPage = DMSApp.pCreditQueue;
//				if (DMSApp.pAdditionalInfo.exist())
//					currentPage = DMSApp.pAdditionalInfo;
//				if (DMSApp.pGeneralTab.exist())
//					currentPage = DMSApp.pGeneralTab;
//				if (currentPage == null) {
//					showPopup("ACHTUNG", "Bitte auf Startseite des DMS navigieren und noch einmal versuchen.", e.popup.icon32.warning, e.popup.color.Orange);
//					Logger.error("Bitte auf Startseite des DMS navigieren und noch einmal versuchen.");
//					sc.endScenario();
//					return ;
//				} else {
//					currentPage.navigate("https://dmsprod.ctlm.de/dckb/dckbCredit.do");
//				}
				DMSApp.currentPage.navigate("https://dmsprod.ctlm.de/dckb/dckbCredit.do");
					//DMSApp.pMain.start();
			}

			DMSApp.pMain.wait(function () {

				DMSApp.pMain.btCreditInbox.click();
				DMSApp.pCreditInbox.wait(function () {

					DMSApp.pCreditInbox.btInbox.click();
				})
			});
		}

		DMSApp.pCreditQueue.wait(function () {

			if (DMSApp.pCreditQueue.btCheck.count() == 0) {
				showPopup("Fertig", "Alle Dokumente wurden verarbeitet.", e.popup.icon32.ok, e.popup.color.Green);
				Logger.info("Alle Dokumente wurden verarbeitet.");
				data.stopRequest = true;
				sc.endScenario();
				return ;
			}

			sc.data.docName = DMSApp.pCreditQueue.lbDocLabel.i(0).get();
			sc.data.docDate = DMSApp.pCreditQueue.lbDate.i(0).get().substring(0, 8);
			sc.data.progress = "Nächstes Dokument:<br />" + sc.data.docName + " (" + sc.data.docDate + ")";
			showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
			Logger.info("Nächstes Dokument: ->" + sc.data.docName + " (" + sc.data.docDate + ")");

			st.endStep();//GLOBAL.steps.stDownloadDocument);

		});
	},


	downloadDocument: function (ev, sc, st) {

		var data = sc.data;
		var downloadFolder = "C:\\Users\\" + ctx.options.userName + "\\Downloads\\";
		var downloadFile = downloadFolder + "Export.zip";
		var unzipDir = downloadFolder + "export";

		// .zip still here? Delete!
		if (ctx.fso.file.exist(downloadFile)) {
			ctx.fso.file.remove(downloadFile);
		}

		// Still here? Error!
		if (ctx.fso.file.exist(downloadFile)) {
			throw "Could not delete " + downloadFile;
		}

		// The folder to extract to - clear it.
		if (ctx.fso.folder.exist(unzipDir)) {
			ctx.fso.file.deleteInFolder(unzipDir);
		}

		DMSApp.pCreditQueue.btCheck.i(0).click();

		// After this click, all properties of the pCreditQueue are "undefined", so we wait for them to come up again.
		ctx.polling( {
			delay: 100,
			nbMax: 50,
			test: function () {
				return DMSApp.pCreditQueue.btExport && DMSApp.pCreditQueue.btExport.exist()
			},
			done: function () {

				// And wait a bit more - only this combination seems to work stable.
				ctx.wait(function () {

					DMSApp.pCreditQueue.btExport.click();
					//Wait for the file to appear
					ctx.polling( {
						delay: 500,
						nbMax: 10,
						test: function () {
							return ctx.fso.file.exist(downloadFile);
						},
						done: function () {
							sc.data.downloadFile = downloadFile;
							sc.data.unzipDir = unzipDir;
							sc.data.progress = sc.data.progress + "<br/>" + sc.data.downloadFile;
							showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
							Logger.info("download file " + sc.data.downloadFile);
							sc.endStep();//stExtractDocument);
						},
						fail: function () {
							Logger.error("Unable to download file " + downloadFile);
							throw "Unable to download file " + downloadFile;
						}
					});

				}, 1500);
			},
			fail: function () {
				Logger.error("Unable to download file " + downloadFile + ". Button not there");
				throw "Unable to download file " + downloadFile + ". Button not there";
			}

		});
	},

	extractDocument: function (ev, sc, st) {

		ctx.fso.file.unzip(sc.data.downloadFile, sc.data.unzipDir);
		var enumerator = ctx.fso.folder.getFileCollection(sc.data.unzipDir);
		enumerator.moveFirst();
		sc.data.fileName = enumerator.item().Path;
		sc.data.progress = sc.data.progress + "<br/>" + sc.data.fileName;
		showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
		Logger.info("extract Document" + sc.data.fileName);
		st.endStep();//GLOBAL.steps.stGetAdditionalInfo);

	},

	getAdditionalInfo: function (ev, sc, st) {
		//DMSApp.pCreditQueue.activate();
		
			sc.data.failedDoc = false;
			DMSApp.pCreditQueue.btDetails.i(0).click();
			
			ctx.log("wait load pGeneralTab");
			DMSApp.pGeneralTab.wait(function () {
				DMSApp.pGeneralTab.activate();
				ctx.log("wait 1s");
				ctx.wait(function () {

					showPopup("Weiter", sc.data.progress + " GET ", e.popup.icon32.info, e.popup.color.Blue);
					Logger.info("Get Additional Info");
					// Customer "0" does not exist
					if (DMSApp.pGeneralTab.edCustomerNumber.get().trim() == "0") {
						ctx.log("Customer 0");
						Logger.debug("CUSTOMER Number 0");
						sc.data.customerName = "NN";
						sc.data.progress = sc.data.progress + "<br/>NO CUSTOMER";
						showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
						Logger.info("NO CUSTOMER");
						sc.endStep();//stSendMail);
						return ;
					}

					ctx.log("wait load pAdditionalInfo");
					Logger.debug("wait load pAdditionalInfo");
					DMSApp.pGeneralTab.btZusatzinfo.click();
					
					DMSApp.pAdditionalInfo.wait(function () {
						DMSApp.pAdditionalInfo.activate();
						if(DMSApp.pAdditionalInfo.oNoKundNr.exist()==false){
						Logger.debug("On additional info tab");

						sc.data.customerName = DMSApp.pAdditionalInfo.lbCustomerNam.get().trim();
						sc.data.progress = sc.data.progress + "<br/>" + sc.data.customerName;
						showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
						Logger.info("Customer Name " + sc.data.customerName);
						
						DMSApp.pAdditionalInfo.btGeneral.click();
						ctx.log("wait load pGeneralTab");
						
						DMSApp.pGeneralTab.wait(function () {
							DMSApp.pGeneralTab.activate();
							ctx.log("Back on general tab");
							Logger.debug("Back on general tab");
							sc.endStep();//stSendMail);
						});
					}else{
						ctx.log("No info on additionalInfo page");
						Logger.debug("No info on additionalInfo page");

						sc.data.customerName = "NN";
						sc.data.progress = sc.data.progress + "<br/>NO CUSTOMER INFO";
						showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
						Logger.info("NO CUSTOMER INFO");

						DMSApp.pAdditionalInfo.btGeneral.click();
						ctx.log("wait load pGeneralTab");
						DMSApp.pGeneralTab.wait(function () {
							DMSApp.pGeneralTab.activate();
							ctx.log("Back on general tab");
							Logger.debug("Back on general tab");
							sc.endStep();//stSendMail);
						});
					}
					});
					
//					DMSApp.pAdditionalInfoBis.wait(function () {
//						DMSApp.pAdditionalInfoBis.activate();
//						ctx.log("No info on additionalInfo page");
//						Logger.debug("No info on additionalInfo page", "", "");

//						sc.data.customerName = "NN";
//						sc.data.progress = sc.data.progress + "<br/>NO CUSTOMER INFO";
//						showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
//						Logger.info("NO CUSTOMER INFO", sc.data.fileName, sc.data.customerName);

//						DMSApp.pAdditionalInfoBis.btGeneral.click();
//						ctx.log("wait load pGeneralTab");
//						DMSApp.pGeneralTab.wait(function () {
//							DMSApp.pGeneralTab.activate();
//							ctx.log("Back on general tab");
//							Logger.debug("Back on general tab", sc.data.fileName, sc.data.customerName);
//							sc.endStep();//stSendMail);
//						});

//					});

				}, 2000);
			});
		
	},

	archiveDocument: function (ev, sc, st) {
		var destination = "C:\\Users\\" + ctx.options.userName + "\\Desktop\\Archive\\"  + "_" + ctx.fso.file.getFileName(sc.data.fileName);
		ctx.fso.file.move(sc.data.fileName, destination);

		sc.data.progress = sc.data.progress + "<br/>Moved file to archive";
		showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
		Logger.info("Moved file to archive");
		sc.endStep();//stDeleteDocumentInDms);
	},

	deleteDocumentInDms: function (ev, sc, st) {
		ChromeApp.pRequester.wait(function () {
			
			ctx.wait(function () {
				ChromeApp.pRequester.activate();
				ChromeApp.pRequester.btOK.click();
				DMSApp.pCreditQueue.wait(function () {

					ChromeApp.pRequester.waitClose(function () {
						sc.data.progress = sc.data.progress + "<br/>Moved document to trash";
						showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
						Logger.info("Moved document to trash");
						sc.endStep();//stSaveAudit);
					});
				});
			}, 500);
		});

		try {
			DMSApp.pGeneralTab.btMoveToTrash.click();
		} catch (ex) {
			// this always gives a timeout because the "click" is blocked by the requester. But continues anyways
		}
	},

	FailedDoc: function (ev, sc, st) {
		if (sc.data.failedDoc != true) st.endStep();
		else {
			var destination = "C:\\Users\\" + ctx.options.userName + "\\Desktop\\Archive\\FailedDocs\\" + ctx.fso.file.getFileName(sc.data.fileName);
			ctx.fso.file.move(sc.data.fileName, destination);

			sc.data.progress = sc.data.progress + "<br/>Moved file to archive";
			showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
			Logger.info("Moved file to failedDoc");
			sc.endStep(GLOBAL.steps.stDeleteDocumentInDms);
		}
	}

}
