var DmsAccessScript = {
	TabEcomFolders : ["D_HG_IN_ECOM", "D_HG_IN_ECOM_SPEZIAL", "D_HG_IN_ECOM_NBB", "D_HG_IN_ECOM_KURZ", "D_HG_IN_ECOM_TRAVEL"],
	Counter:0,
	CountEcomDocs:- 1,
	CountAnfr:0,
	PageNr:0,
	CountPopups:0,
	DisplayedPopup:60,
	objSearchNrDMS : {
		AnfrNrTab : []
	},
	QES_VERTRAG: "QES Vertrag",
	BEM_POS: "POS",
	BEM_ECOM: "ECOM",
	is_good:true,
	ECOM_BEMERKUNG: "Bearb. Ratanet abgeschlossen",
	//List Postkörbe
	DMS_POSTKOBES: [
		 "D_HG_IN_R2D2", "D_HG_IN_BWGM", "D_HG_IN_EMAIL", "D_HG_IN_KLAMOE", "D_HG_IN_KLAMOE_KRIEGER",
	"D_HG_IN_POCO", "D_HG_IN_REAL", "D_HG_IN_ROLLER", "D_HG_IN_SOLO", "D_HG_IN_POS_NBB",
	"D_HG_IN_ECOM", "D_HG_IN_ECOM_KURZ", "D_HG_IN_ECOM_TRAVEL", "D_HG_IN_ECOM_NBB", "D_HG_IN_ECOM_SPEZIAL", "D_HG_IN_KLAMOE_LUTZ"

	],
	//for test
	/*DMS_POSTKOBES: ["D_HG_IN", "D_HG_IN_ECOM", "D_HG_IN_ECOM_KURZ", "D_HG_IN_ECOM_TRAVEL", "D_HG_IN_ECOM_NBB",
	 "D_HG_IN_BWGM", "D_HG_IN_EMAIL", "D_HG_IN_KLAMOE", "D_HG_IN_KLAMOE_KRIEGER",
		"D_HG_IN_POCO",	"D_HG_IN_REAL",	"D_HG_IN_ROLLER",	"D_HG_IN_SOLO",	"D_HG_IN_POS_NBB"
	],*/
	ECOM_POSTKOBES: ["D_HG_IN_ECOM", "D_HG_IN_ECOM_KURZ", "D_HG_IN_ECOM_TRAVEL", "D_HG_IN_ECOM_NBB", "D_HG_IN_ECOM_SPEZIAL"
	],
	POS_POSTKOBES: ["D_HG_IN_R2D2", "D_HG_IN_BWGM", "D_HG_IN_EMAIL", "D_HG_IN_KLAMOE", "D_HG_IN_KLAMOE_KRIEGER",
	"D_HG_IN_POCO", "D_HG_IN_REAL", "D_HG_IN_ROLLER", "D_HG_IN_SOLO", "D_HG_IN_POS_NBB", "D_HG_IN_KLAMOE_LUTZ"
	],
	//current Postköbe
	SC_POSTKOBE: "D_HG_IN_R2D2",
	//for test
	//SC_POSTKOBE: "D_HG_IN_ECOM",
	//counter scenario/Postköbe
	SC_POSTKOBE_INX:0,
	KARTEN_VERTRAG : ["ECD", "ECF", "MCD"],
	//list dokumenttyp -> POS case
	DOKUMENTTYPEN:["Vertrag HG Karte", "Vertrag HG BWGM", "Vertrag HG BWGM Bicontract",
	"Vertrag HG BWGM Bicontract Zahlpause", "Vertrag HG BWGM Zielverkauf", "Vertrag HG CAM"
		, "Vertrag HG CAM Zielverkauf", "Vertrag HG CortallConsors", "Vertrag HG Metro", "Vertrag HG BWGM Dispo+"
		 , "Vertrag HG BWGM Zielverkauf Dispo+", "Vertrag HG Dispo+", "Vertrag HG POCO 0% 3 Monaten", "QES Vertrag"
		, "QES Auflagen", "Reject", "QES-Vertrag"
		],
	//totalpages in dms list
	totalpages : 1,
	//curr page in dms table
	currPageIndx:0,
	//Trace directory
	TraceDir: "C:\\Contextor\\Archive\\",
	//Error directory
	ErrorDir : "C:\\Contextor\\Archive\\",
	//Log directory
	LogDir : "C:\\Contextor\\Archive\\",
	//NBB postboxes
	NBB_POSTKOBES : ["D_HG_IN_ECOM_NBB", "D_HG_IN_POS_NBB"],
	//Counter of successful cases
	Stopper_Counter:0,
	//Stopper flag
	Stopper_Flag:300,

	init : function () {

		// Register steps
		GLOBAL.step( {
			stSearchInDMS: DmsAccessScript.SearchInDMS
		});
		GLOBAL.step( {
			stSortInDMS: DmsAccessScript.SortInDMS
		});
		GLOBAL.step( {
			stCheckBemerkung: DmsAccessScript.CheckBemerkung
		});
		GLOBAL.step( {
			stGoToPageTable: DmsAccessScript.GoToPageTable
		});

		GLOBAL.step( {
			stSearchNrDMS: DmsAccessScript.SearchNrDMS
		});
		GLOBAL.step( {
			stCheckKundenNr: DmsAccessScript.CheckKundenNr
		});
		GLOBAL.step( {
			stCheckDokumenttyp: DmsAccessScript.CheckDokumenttyp
		});
		GLOBAL.step( {
			stNavigateInDMS: DmsAccessScript.NavigateInDMS
		});
		GLOBAL.step( {
			stAddRemarkInDms: DmsAccessScript.AddRemarkInDms
		});
		GLOBAL.step( {
			stAddTraces: DmsAccessScript.AddTraces
		});
		GLOBAL.step( {
			stMoveCreditakte: DmsAccessScript.MoveCreditakte
		});
		GLOBAL.step( {
			stToNextAntrag: DmsAccessScript.ToNextAntrag
		});

		GLOBAL.step( {
			stStartDMS: DmsAccessScript.StartDMS
		});
		GLOBAL.step( {
			stGetNrDMS: DmsAccessScript.GetNrDMS
		});
		GLOBAL.step( {
			stChangeBemDMS: DmsAccessScript.ChangeBemDMS
		});
		GLOBAL.step( {
			stToNext: DmsAccessScript.ToNext
		});
		GLOBAL.step( {
			stUpdateTotalpages: DmsAccessScript.UpdateTotalpages
		});
		GLOBAL.step( {
			stFilterInDMS: DmsAccessScript.FilterInDMS
		});
		GLOBAL.step( {
			stArchiveInDMS: DmsAccessScript.ArchiveInDMS
		});
		GLOBAL.step( {
			stArchiveInDMSBis: DmsAccessScript.ArchiveInDMSBis
		});


	},
	//Go to next Antrag after a successful case
	ToNextAntrag : function (ev, sc, st) {
		var data = sc.data;
		var popupgood = false
		st.disableTimeout();
		ctx.log("---Stopper_Counter= " + DmsAccessScript.Stopper_Counter);
		if (DmsAccessScript.Stopper_Counter < DmsAccessScript.Stopper_Flag) {
			Logger(data.anfragNr, "SUCCESSFUL CASE counter: " + DmsAccessScript.Stopper_Counter);
			if (ctx.popup('pTooltip').exist()) ctx.popup('pTooltip').close();
			st.endStep(GLOBAL.steps.stSearchInDMS);
		}
		else {
			var popup = ctx.popup('pPopup' + data.anfragNr + DmsAccessScript.currPageIndx + DmsAccessScript.Counter).init( {
				title: 'Bestätigungsbox',
				template:e.popup.bootbox.YesNo,
				CX: 500,
				CY: 150,
				message: '' + sc.data.progress + '<hr/><br/>Fertig mit Anfrag nr: ' + data.anfragNr + '<br/>Wie möchten Sie fortfahren?<br/>',
				icon: e.popup.icon32.info
			});
			popup.open();
			appendTraceInfo(data.anfragNr, "Fertig mit Anfrag nr: " + data.anfragNr);
			Logger(data.anfragNr, "Fertig mit Anfrag nr: " + data.anfragNr);
			Logger(data.anfragNr, "SUCCESSFUL CASE (max) counter:  " + DmsAccessScript.Stopper_Counter);
			popup.waitResult(function (res) {
				if (res == e.popup.button.Yes) {
					DmsAccessScript.Stopper_Counter = 0;
					ctx.log("proceed");
					if (ctx.popup('pTooltip').exist()) ctx.popup('pTooltip').close();
					popupgood = true;
					st.endStep(GLOBAL.steps.stSearchInDMS);
				} else if (res == e.popup.button.No) {
					popupgood = true;
					DmsAccessScript.Stopper_Counter = 0;
					ctx.log("end scenario");
					if (ctx.popup('pTooltip').exist()) ctx.popup('pTooltip').close();
					sc.data.stopRequest = true;
					if (DmsAccessScript.currPageIndx> 0) DmsAccessScript.is_good = false;
					//sc.endScenario();
					st.endStep(GLOBAL.steps.stDisconnectSession);
				}
			});
		}


	},
	//Navigate to the current postbox in DMS
	NavigateInDMS : function (ev, sc, st) {
		try {
			// Navigate to the queue
			var data = sc.data;
			DMSApp.pECMInbox.start();
			DMSApp.pMain.wait(function () {
				Logger(data.anfragNr, "Item oDHGINECOM exist : " + DMSApp.pMain.oDHGINECOM.exist() + " Page pMain exist=" + DMSApp.pMain.exist());
				DMSApp.pMain.oDHGINECOM.click();
			});

			DMSApp.pECMInbox.wait(function () {
				function navigateTo(element, obj) {
					console.log("CONTEXTOR callback of the function injected in the browser");
					console.log(element, obj);

					var items = document.querySelectorAll("span.feact>span");
					for (var i = 0; i< items.length; i++) {
						if (items[i].textContent.trim() == obj) {
							console.log(0, items[i].textContent);
							items[i].click();
						}
					}
				}
				Logger("", "Inject function navigateTo");
				DMSApp.pECMInbox.injectFunction(navigateTo);
				Logger("", "navigate to " + DmsAccessScript.SC_POSTKOBE + " exec script navigateTo ,item oCurrentPostkorb exists=" + DMSApp.pECMInbox.oCurrentPostkorb.exist() + " Page pECMInbox exist=" + DMSApp.pECMInbox.exist());
				DMSApp.pECMInbox.oCurrentPostkorb.execScript("navigateTo", DmsAccessScript.SC_POSTKOBE);

				DMSApp.pECMInbox.events.LOAD.on(function () {
					if (DMSApp.pECMInbox.oCurrentPostkorb.get().trim() == DmsAccessScript.SC_POSTKOBE) {
						sc.data.progress = "Postkörbe " + DmsAccessScript.SC_POSTKOBE + " öffnen";
						Logger("", "Postkörbe " + DmsAccessScript.SC_POSTKOBE + " öffnen");
						st.endStep(GLOBAL.steps.stSortInDMS);
					}

				});

			});
		}catch (err) {
			ctx.log("ERROR inject function navigateTo : " + err);
			Logger(data.anfragNr, "ERROR inject function navigateTo : " + err);
			ctx.wait(function () {
				st.endStep(GLOBAL.steps.stNavigateInDMS);
			}, 1000);
		}
	},
	//Sort the contracts by Date in DMS list
	SortInDMS : function (ev, sc, st) {
		var data = sc.data;
		DMSApp.pECMInbox.wait(function () {
			if (DMSApp.pECMInbox.oDate.exist()) DMSApp.pECMInbox.oDate.click();
			else st.endStep(GLOBAL.steps.stFilterInDMS);
			DMSApp.pECMInbox.events.LOAD.on(function () {
				DMSApp.pECMInbox.activate();
				st.endStep(GLOBAL.steps.stFilterInDMS);
			});
		});
	},
	//Filter the data in DMS
	FilterInDMS : function (ev, sc, st) {
		// get data from previous steps
		var data = sc.data;
		DMSApp.pECMInbox.wait(function () {
			var testToGo = false;
			data.poscorb = DMSApp.pECMInbox.oCurrentPostkorb.get();
			//the current postbox is ECOM
			if (isInArray(data.poscorb, DmsAccessScript.ECOM_POSTKOBES)) {
				Logger("", "set up filters  in ECOM mailbox ");
				DMSApp.pECMInbox.oDocType.setFocus();
				DMSApp.pECMInbox.oDocType.set(DmsAccessScript.QES_VERTRAG);
				DMSApp.pECMInbox.oEeSuch.setFocus();
				DMSApp.pECMInbox.oEeSuch.set("9");
				DMSApp.pECMInbox.oWV.setFocus();
				DMSApp.pECMInbox.oWV.set("10");
				DMSApp.pECMInbox.oFilter.setFocus();
				if (isInArray(data.poscorb, DmsAccessScript.NBB_POSTKOBES)) DMSApp.pECMInbox.oFilter.set("10"); else DMSApp.pECMInbox.oFilter.set("30");
				DMSApp.pECMInbox.oBtnSearch.click();
				testToGo = true;
				data.curPostType = "ECOM";
			}
			else {
				Logger("", "set up filters  in  POS mailbox ");
				DMSApp.pECMInbox.oDocType.setFocus();
				DMSApp.pECMInbox.oDocType.set("");
				DMSApp.pECMInbox.oEeSuch.setFocus();
				DMSApp.pECMInbox.oEeSuch.set("9");
				DMSApp.pECMInbox.oWV.setFocus();
				DMSApp.pECMInbox.oWV.set("10");
				DMSApp.pECMInbox.oFilter.setFocus();
				if (isInArray(data.poscorb, DmsAccessScript.NBB_POSTKOBES)) DMSApp.pECMInbox.oFilter.set("10"); else DMSApp.pECMInbox.oFilter.set("30");
				DMSApp.pECMInbox.oBtnSearch.click();
				testToGo = true;
				data.curPostType = "POS";
			}
			//click button edit 
			DMSApp.pECMInbox.events.LOAD.on(function () {
				if (testToGo == true && (DmsAccessScript.is_good == true || DmsAccessScript.currPageIndx == 0)) {
					Logger("", "Calculate totalpages ");
					if (DMSApp.pECMInbox.oPagination.exist() && DMSApp.pECMInbox.oPagination.get().indexOf("von") >= 0) {
						DmsAccessScript.totalpages = Math.ceil(parseInt(DMSApp.pECMInbox.oPagination.get().split("von")[1].trim()) / 20);
						DmsAccessScript.currPageIndx = 0;
						Logger("", "Pagination exists ->Calculate totalpages = " + DmsAccessScript.totalpages);
					}
					else {
						DmsAccessScript.totalpages = 1;
						DmsAccessScript.currPageIndx = 0;
						Logger("", "Pagination does not exist -> totalpages = " + DmsAccessScript.totalpages);
					}
					st.endStep(GLOBAL.steps.stSearchInDMS);
				} else if (testToGo == true && DmsAccessScript.is_good == false && DmsAccessScript.currPageIndx> 0) {
					waitUntilExist(DMSApp.pECMInbox.oAnfrNr.i(0), function () {
						DmsAccessScript.is_good = true;
						Logger("", "issue happened , table loaded");
						st.endStep(GLOBAL.steps.stGoToPageTable);
					});
				}
			});
		});
	},
	//Go to the current page in contracts list ->  an issue occured and the robot restarted
	GoToPageTable : function (ev, sc, st) {
		if (DmsAccessScript.totalpages> 15) {
			Logger("", "more than 15,navigate to the right page = " + (DmsAccessScript.currPageIndx + 1));
			waitUntilExist(DMSApp.pECMInbox.oGoPageTable, function () {
				DMSApp.pECMInbox.oGoPageTable.setFocus();
				var p_indx = DmsAccessScript.currPageIndx + 1;
				DMSApp.pECMInbox.oGoPageTable.set(p_indx);
				//DMSApp.pECMInbox.btGoPageTable.click();
				DMSApp.pECMInbox.execScript('doPage("/inbox/dckbCreditQueueHG.do?ctrl=inboxTable&action=Page&param","goPage_table", 323,' + p_indx + ');');
			});
		}else {
			Logger("", "less than 15, navigate to the right page= " + (DmsAccessScript.currPageIndx + 1));

			function goToPageInTable(element, obj) {
				console.log("go to right page");
				console.log(element, obj);
				var items = document.querySelectorAll("a[title='Seite'] > span");
				for (var i = 0; i< items.length; i++) {
					if (items[i].textContent.trim() == obj) {
						console.log(0, items[i].textContent);
						items[i].click();
					}
				}
			}

			Logger("", "Inject function goToPageInTable");
			DMSApp.pECMInbox.injectFunction(goToPageInTable);
			Logger("", "exec script goToPageInTable to go to page= " + (DmsAccessScript.currPageIndx + 1));
			DMSApp.pECMInbox.oCurrentPostkorb.execScript("goToPageInTable", (DmsAccessScript.currPageIndx + 1));

		}
		var testToGo = true
		DMSApp.pECMInbox.events.LOAD.on(function () {
			Logger("", "Go to search in DMS");
			if (testToGo == true) {
				waitUntilExist(DMSApp.pECMInbox.oAnfrNr.i(0), function () {
					st.endStep(GLOBAL.steps.stSearchInDMS);
				});
				//st.endStep(GLOBAL.steps.stSearchInDMS);
			}
		});
	},
	//Check if all contracts in a page/postbox are done
	SearchInDMS : function (ev, sc, st) {
		// Navigate to the queue
		var data = sc.data;
		var btnNextpageClicked = false;
		sc.data.progress = "";
		ctx.log("curreent pos " + data.poscorb);
		DMSApp.pECMInbox.activate();
		if (DMSApp.pECMInbox.oAnfrNr.i(0).exist() == false) {
			//DmsAccessScript.SC_POSTKOBE_INX+=1;
			if (DmsAccessScript.SC_POSTKOBE_INX >= DmsAccessScript.DMS_POSTKOBES.length - 1) {
				sc.data.stopRequest = true;
			}
			//if(ctx.popup('pTooltip').exist()) ctx.popup('pTooltip').close();
			sc.data.progress = sc.data.progress + "Keine Anträge gefunden";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			//appendTraceInfo(sc.data.anfragNr,sc.data.progress );
			Logger(" ", "Keine Anträge gefunden");
			//sc.endScenario();
			st.endStep(GLOBAL.steps.stDisconnectSession);
		}
		else if (DmsAccessScript.Counter >= DMSApp.pECMInbox.oAnfrNr.count()) {
			DmsAccessScript.currPageIndx = DmsAccessScript.currPageIndx + 1;
			if (DmsAccessScript.currPageIndx < DmsAccessScript.totalpages) {

				//DMSApp.pECMInbox.oBtnNxtPg.click();
				waitUntilExist(DMSApp.pECMInbox.oBtnNxtPg, function () {
					Logger(" ", "Go to current page indx in Table " + DmsAccessScript.currPageIndx);
					Logger(" ", "oBtnNxtPg exists " + DMSApp.pECMInbox.oBtnNxtPg.exist() + "oGoPageTable input page exists " + DMSApp.pECMInbox.oGoPageTable.exist());
					DMSApp.pECMInbox.oBtnNxtPg.click();
				});
				DmsAccessScript.Counter = 0;
				DMSApp.pECMInbox.events.LOAD.on(function () {
					Logger(sc.data.anfragNr, "pECMInbox load event received");
					if (DmsAccessScript.Counter == 0) {
						waitUntilExist(DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter), function () {
							st.endStep(GLOBAL.steps.stCheckBemerkung);
						});
					}
				});
			}else {
				//DmsAccessScript.SC_POSTKOBE_INX+=1;
				if (DmsAccessScript.SC_POSTKOBE_INX >= DmsAccessScript.DMS_POSTKOBES.length - 1) {
					sc.data.stopRequest = true;
				}
				//sc.endScenario();
				st.endStep(GLOBAL.steps.stDisconnectSession);
			}
		}else {
			DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.Counter).setFocus();
			data.anfragNr = DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.Counter).get();
			sc.data.progress = sc.data.progress + "mit dem Antrag Nr : " + DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.Counter).get();
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(sc.data.anfragNr, "mit dem Antrag Nr : " + DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.Counter).get());
			Logger(sc.data.anfragNr, "mit dem Antrag Nr : " + DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.Counter).get());
			if (DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter).exist())
				sc.endStep(GLOBAL.steps.stCheckBemerkung);
		}
	},

	//Check contract bemerkung in DMS 
	CheckBemerkung: function (ev, sc, st) {
		var data = sc.data;
		var poscorb = "" + data.poscorb;

		if (DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter).exist()) {
			data.remark = DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter).getAttribute("title");
			sc.data.progress = sc.data.progress + "<br/>Bemerkungsfeld prüfen : " + data.curPostType + "-Antrag";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(sc.data.anfragNr, "Bemerkungsfeld prüfen : " + data.curPostType + "-Antrag");
			Logger(sc.data.anfragNr, "Bemerkungsfeld prüfen : " + data.curPostType + "-Antrag Bemerkung = " + data.remark);
			// ECOM postcorb
			if (isInArray(poscorb, DmsAccessScript.ECOM_POSTKOBES)) {

				//Bem is good
				if (data.remark.toLowerCase() == DmsAccessScript.ECOM_BEMERKUNG.toLowerCase()) {
					st.endStep(GLOBAL.steps.stCheckKundenNr);
				} //Bem is not good
				else {
					DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
					st.endStep(GLOBAL.steps.stSearchInDMS);//st.endStep(GLOBAL.steps.stToNextAntrag);

				}

			}
			// POS postcorb
			else if (isInArray(poscorb, DmsAccessScript.POS_POSTKOBES)) {
				//Bem is good
				if (data.remark.trim() == "") {
					////ctx.log("POS empty remark go checkDoctype");
					st.endStep(GLOBAL.steps.stCheckDokumenttyp);
				} //Bem is not good
				else {
					////ctx.log("POS not empty remark");
					DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
					//st.endStep(GLOBAL.steps.stToNextAntrag);
					st.endStep(GLOBAL.steps.stSearchInDMS);
				}
			}
		}

	},


	CheckKundenNr: function (ev, sc, st) {
		var data = sc.data;
		var poscorb = data.poscorb;
		var kundenNr;
		try {
			kundenNr = DMSApp.pECMInbox.oKundenNr.i(DmsAccessScript.Counter).get();

			////ctx.log("----- checkkundu num "+DMSApp.pECMInbox.oKundenNr.i(DmsAccessScript.Counter).get());
			sc.data.progress = sc.data.progress + "<br/>Spalten prüfen: Kunden Nr: " + kundenNr;
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(sc.data.anfragNr, "Spalten prüfen: Kunden Nr: " + kundenNr);
			Logger(sc.data.anfragNr, "Spalten prüfen: Kunden Nr: " + kundenNr);
			// ECOM postcorb
			if (kundenNr.length == 10 && DMSApp.pECMInbox.oEe.i(DmsAccessScript.Counter).get() == "9") {
				//if(  DMSApp.pECMInbox.oKundenNr.i(DmsAccessScript.Counter).get().length==10  ){
				DMSApp.pECMInbox.oAnfrDat.i(DmsAccessScript.Counter).setFocus();
				data.anfragDat = DMSApp.pECMInbox.oAnfrDat.i(DmsAccessScript.Counter).get();
				DMSApp.pECMInbox.oHandlNr.i(DmsAccessScript.Counter).setFocus();
				data.handlerNr = DMSApp.pECMInbox.oHandlNr.i(DmsAccessScript.Counter).get();
				DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.Counter).setFocus();
				data.anfragNr = DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.Counter).get();

				////ctx.log("?????? anfNr "+data.anfragNr +"?????? anfDat "+data.anfragDat+"?????? hndNr "+data.handlerNr);
				sc.data.progress = sc.data.progress + "<br/>KD ist 10 stellig";
				//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
				appendTraceInfo(sc.data.anfragNr, "KD ist 10 stellig");
				Logger(sc.data.anfragNr, "KD ist 10 stellig");
				if (isInArray(DMSApp.pECMInbox.oProd.i(DmsAccessScript.Counter).get().trim(), DmsAccessScript.KARTEN_VERTRAG)) {
					Logger(sc.data.anfragNr, "Karten Vertrag, Prod = " + DMSApp.pECMInbox.oProd.i(DmsAccessScript.Counter).get().trim());
					data.typeVertrag = "Karten Vertrag";
				}
				else {
					Logger(sc.data.anfragNr, "Kredit Vertrag, Prod = " + DMSApp.pECMInbox.oProd.i(DmsAccessScript.Counter).get().trim());
					data.typeVertrag = "Kredit Vertrag";
				}
				st.endStep(GLOBAL.steps.stAntageOffnen);

				//////for test
				/*data.Note= "Antrag ohne Auflage";
									data.endEteration==false;
								////ctx.log("Antrag ohne Auflage  Add bermerkung");
								st.endStep(GLOBAL.steps.AddRemarkInDms);*/
				/////
			}
			else {

				////ctx.log("+++ checkkundennr");
				sc.data.progress = sc.data.progress + "<br/>KD ist nicht 10 stellig";
				//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
				appendTraceInfo(sc.data.anfragNr, "KD ist nicht 10 stellig");
				Logger(sc.data.anfragNr, "KD ist nicht 10 stellig");
				DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
				//st.endStep(GLOBAL.steps.stToNextAntrag);
				st.endStep(GLOBAL.steps.stSearchInDMS);
			}

		} catch (err) {
			ctx.log("ERROR getting oKundenN: " + err);
			Logger(data.anfragNr, "ERROR getting oKundenNr: " + err);
			ctx.wait(function () {
				st.endStep(GLOBAL.steps.stCheckKundenNr);
			}, 1000);
		}
	},

	//Check doctype
	CheckDokumenttyp: function (ev, sc, st) {
		var data = sc.data;
		var poscorb = data.poscorb;
		sc.data.progress = sc.data.progress + "<br/>Dokumenttyp prüfen : " + DMSApp.pECMInbox.oDocLabel.i(DmsAccessScript.Counter).get();
		//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
		appendTraceInfo(sc.data.anfragNr, "Dokumenttyp prüfen : " + DMSApp.pECMInbox.oDocLabel.i(DmsAccessScript.Counter).get());
		Logger(sc.data.anfragNr, "Dokumenttyp prüfen : " + DMSApp.pECMInbox.oDocLabel.i(DmsAccessScript.Counter).get());
		if (isInArray(DMSApp.pECMInbox.oDocLabel.i(DmsAccessScript.Counter).get(), DmsAccessScript.DOKUMENTTYPEN)) {
			sc.data.progress = sc.data.progress + "<br/>In bearb. DokTypen ";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(sc.data.anfragNr, "In bearb. DokTypen ");
			Logger(sc.data.anfragNr, "In bearb. DokTypen ");
			st.endStep(GLOBAL.steps.stCheckKundenNr);
		}
		else {
			sc.data.progress = sc.data.progress + "<br/>Nicht in bearb. DokTypen ";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(sc.data.anfragNr, "Nicht in bearb. DokTypen ");
			Logger(sc.data.anfragNr, "Nicht in bearb. DokTypen ");
			DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
			st.endStep(GLOBAL.steps.stSearchInDMS);
		}
	},
	//Archive contract in DMS part 1
	ArchiveInDMS: function (ev, sc, st) {
		var data = sc.data;
		sc.data.progress = sc.data.progress + "<br/>In das Archiv verschoben";
		appendTraceInfo(sc.data.anfragNr, "In das Archiv verschoben");
		Logger(sc.data.anfragNr, "In das Archiv verschoben");
		DMSApp.pECMInbox.wait(function () {
			DMSApp.pECMInbox.btCheck.i(DmsAccessScript.Counter).setFocus();
			DMSApp.pECMInbox.btCheck.i(DmsAccessScript.Counter).click();
			DMSApp.pECMInbox.events.LOAD.on(function () {
				st.endStep(GLOBAL.steps.stArchiveInDMSBis);
			});
		});
	},
	//Archive contract in DMS part 2
	ArchiveInDMSBis: function (ev, sc, st) {
		var data = sc.data;
		DMSApp.pECMInbox.oBtnArchive.setFocus();
		DMSApp.pECMInbox.oBtnArchive.click();
		DMSApp.pECMInbox.events.LOAD.on(function () {
			appendTraceInfo(sc.data.anfragNr, "Vertrag ist archiviert");
			Logger(sc.data.anfragNr, "Vertrag ist archiviert");
			waitUntilExist(DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter), function () {
				st.endStep(GLOBAL.steps.stUpdateTotalpages);
			});
		});

	},
	//Add remark in DMS
	AddRemarkInDms : function (ev, sc, st) {
		var data = sc.data;
		//data.endEteration boolean, go to next anfrag num
		/*////for test///
		data.Note = "Antrag nicht finanziert";
		data.endEteration = false;
		data.curPostType = "ECOM";*/
		//////
		var poscorb = data.poscorb;
		sc.data.progress = sc.data.progress + "<br/>Bemerkung in DMS eintragen";
		//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
		appendTraceInfo(sc.data.anfragNr, "Bemerkung in DMS eintragen");
		Logger(sc.data.anfragNr, "Bemerkung in DMS eintragen data.endEteration=" + data.endEteration + "  data.Note" + data.Note);
		//bemerkung to add
		var notice = data.curPostType + "-" + data.Note;

		//POS --->No comment to add
		if (data.curPostType == "POS") {
			sc.data.progress = sc.data.progress + "<br/>Bemerkung trägt nicht in DMS ein : Postköbe " + data.curPostType;
			if (data.endEteration == true) {
				DMSApp.pECMInbox.wait(function () {
					DMSApp.pECMInbox.btInfo.i(DmsAccessScript.Counter).setFocus();
					DMSApp.pECMInbox.btInfo.i(DmsAccessScript.Counter).click();
					DMSApp.pGeneralTab.wait(function () {
						ctx.log("add bemerk " + notice + " item exist " + DMSApp.pGeneralTab.oNotice.exist());
						DMSApp.pGeneralTab.oNotice.setFocus();
						DMSApp.pGeneralTab.oNotice.set(notice);
						DMSApp.pGeneralTab.oBtnSaveBack.setFocus();
						DMSApp.pGeneralTab.oBtnSaveBack.click();
						sc.data.progress = sc.data.progress + "<br/>Bemerkung ist  \"" + notice + " \"";
						DMSApp.pECMInbox.wait(function () {
							DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
							//st.endStep(GLOBAL.steps.stToNextAntrag);
							st.endStep(GLOBAL.steps.stSearchInDMS);
						});
					});
				});

				//				DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
				//				//st.endStep(GLOBAL.steps.stToNextAntrag);
				//				st.endStep(GLOBAL.steps.stSearchInDMS);
			}
			else DMSApp.pECMInbox.wait(function () {
				waitUntilExist(DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter), function () {
					st.endStep(GLOBAL.steps.stMoveCreditakte);
				});
			});
		} //ECOM --> add bemerkung if data.endEteration=true
		else
			DMSApp.pECMInbox.wait(function () {
			DMSApp.pECMInbox.btInfo.i(DmsAccessScript.Counter).setFocus();
			DMSApp.pECMInbox.btInfo.i(DmsAccessScript.Counter).click();
			DMSApp.pGeneralTab.wait(function () {
				ctx.log("add bemerk " + notice + " item exist " + DMSApp.pGeneralTab.oNotice.exist());
				DMSApp.pGeneralTab.oNotice.setFocus();
				DMSApp.pGeneralTab.oNotice.set(notice);
				DMSApp.pGeneralTab.oBtnSaveBack.setFocus();
				DMSApp.pGeneralTab.oBtnSaveBack.click();
				sc.data.progress = sc.data.progress + "<br/>Bemerkung ist  \"" + notice + " \"";
				//go the next contract
				if (data.endEteration == true) {
					DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
					DMSApp.pECMInbox.wait(function () {
						//st.endStep(GLOBAL.steps.stToNextAntrag);
						st.endStep(GLOBAL.steps.stSearchInDMS);
					});
				}//Archive the contract
				else DMSApp.pECMInbox.wait(function () {
					waitUntilExist(DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter), function () {
						st.endStep(GLOBAL.steps.stMoveCreditakte);
					});
				});
			});
		});
	}	,

	//recalcul total pages in DMS list
	UpdateTotalpages: function (ev, sc, st) {
		Logger("", "update totalpages ");
		if (DMSApp.pECMInbox.oPagination.exist() && DMSApp.pECMInbox.oPagination.get().indexOf("von") >= 0) {
			DmsAccessScript.totalpages = Math.ceil(parseInt(DMSApp.pECMInbox.oPagination.get().split("von")[1].trim()) / 20);
			//DmsAccessScript.currPageIndx = 0;
			ctx.log("Pagination exists ->update totalpages = " + DmsAccessScript.totalpages);
			Logger("", "Pagination exists ->update totalpages = " + DmsAccessScript.totalpages);
		}
		else {
			DmsAccessScript.totalpages = 1;
			//DmsAccessScript.currPageIndx = 0;
			ctx.log("Pagination does not exist -> totalpages = " + DmsAccessScript.totalpages);
			Logger("", "Pagination does not exist -> totalpages = " + DmsAccessScript.totalpages);
		}
		st.endStep(GLOBAL.steps.stToNextAntrag);
	},
	//Add entry to documentation file
	AddTraces: function (ev, sc, st) {
		var date = new Date();
		var fileName = "auditExcel" + date.getDate() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + ".csv";
		sc.data.progress = sc.data.progress + "<br/>Bearbeitung in Liste Dokumentieren";
		//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
		appendTraceInfo(sc.data.anfragNr, "Bearbeitung in Liste Dokumentieren");
		Logger(sc.data.anfragNr, "Bearbeitung in Liste Dokumentieren");

		var fileExist = ctx.fso.file.FileExists(DmsAccessScript.TraceDir + fileName);
		if (fileExist == false) {
			var header = "Datum der finanzierung;type;Anfragenr;Händlernr;Anfragedatum;Finanzierungbetrag";
			ctx.fso.file.append(DmsAccessScript.TraceDir + fileName, header);
		}
		var msg = new Date() + ";" + sc.data.curPostType + ";" + sc.data.anfragNr + ";" + sc.data.handlerNr + ";" + sc.data.anfragDat + ";" + sc.data.bertrag;
		ctx.fso.file.append(DmsAccessScript.TraceDir + fileName, msg);
		//wait load of pECMInbox with table
		DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
		DmsAccessScript.Stopper_Counter = DmsAccessScript.Stopper_Counter + 1;
		if (DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter).exist()) st.endStep(GLOBAL.steps.stUpdateTotalpages); //st.endStep(GLOBAL.steps.stToNextAntrag);//st.endStep(GLOBAL.steps.stSearchInDMS);
		else DMSApp.pECMInbox.wait(function () {
			waitUntilExist(DMSApp.pECMInbox.oBem.i(DmsAccessScript.Counter), function () {
				st.endStep(GLOBAL.steps.stUpdateTotalpages); //st.endStep(GLOBAL.steps.stToNextAntrag);//st.endStep(GLOBAL.steps.stSearchInDMS);
			});
		});

	},
	//Move the contract to Archive/Kreditakte
	MoveCreditakte : function (ev, sc, st) {
		var data = sc.data;
		var poscorb = data.poscorb;
		ctx.log("in MoveCreditakte");
		//DMSApp.pECMInbox.wait(function(){
		DMSApp.pECMInbox.btInfo.i(DmsAccessScript.Counter).setFocus();
		DMSApp.pECMInbox.btInfo.i(DmsAccessScript.Counter).click();

		DMSApp.pGeneralTab.wait(function () {
			Logger(sc.data.anfragNr, "MoveCreditakte --->oBtnArchiveLabel exits " + DMSApp.pGeneralTab.oBtnArchive.exist());
			ctx.log("MoveCreditakte --->oBtnArchiveLabel exits " + DMSApp.pGeneralTab.oBtnArchive.exist());
			DMSApp.pGeneralTab.oBtnArchive.setFocus();
			DMSApp.pGeneralTab.oBtnArchive.click();


			////ctx.log("in MoveCreditakte");
			sc.data.progress = sc.data.progress + "<br/>Antrag in Kreditakte verschieben";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(sc.data.anfragNr, "Antrag in Kreditakte verschieben");
			Logger(sc.data.anfragNr, "Antrag in Kreditakte verschieben");
			ctx.wait(function () {
				data.creditpostindex = DmsAccessScript.Counter;
				DmsAccessScript.Counter = DmsAccessScript.Counter - 1;
				st.endStep(GLOBAL.steps.stAddTraces);
			}, 1000);

		});
		//});
	}	,
// Start dMS for Ratanet Robot
StartDMS : function(ev, sc, st) {
	//DMSApp.pFirst.wait(function(){
	//	DMSApp.pFirst.btKreditPostkorb.click();
		DMSApp.pMain.wait(function(){
			sc.endStep();	
		});		
//	});	
}	,

//Open Postkorbe, add the filters and search
SearchNrDMS : function(ev, sc, st) {

	var data = sc.data;
	DmsAccessScript.CountEcomDocs ++;	
	DmsAccessScript.PageNr =0;
	//DMSApp.pMain[tab[DmsAccessScript.CountEcomDocs]].click();	
	function navigateTo(element,obj){
		console.log("navigateTo fct ("+element,obj);
		var	items = document.querySelectorAll("span.feact>span");
		for(var i=0;i<items.length;i++){
			if(items[i].textContent.trim() == obj ) {
				console.log(0,items[i].textContent);
				 items[i].click();
	 }	}	}
	DMSApp.pMain.injectFunction(navigateTo);
	DMSApp.pMain.btKreditPostkorb.execScript("navigateTo",DmsAccessScript.TabEcomFolders[DmsAccessScript.CountEcomDocs]);	
	RatLog(DmsAccessScript.TabEcomFolders[DmsAccessScript.CountEcomDocs], " Postkorb geöffnet");
	DMSApp.pECMInbox.wait(function(){
		DMSApp.pECMInbox.oDocType.set("QES Vertrag");
		DMSApp.pECMInbox.oBtnSearch.click();
		ctx.wait(function(){
			DMSApp.pECMInbox.oDate.click();
			ctx.wait(function(){
				sc.endStep();	
			},2000);	
		},2000);
	});
}	,


//Go through the list of AnfrageNummers
GetNrDMS : function(ev,sc,st) {

	if (DmsAccessScript.CountAnfr <DMSApp.pECMInbox.oDocLabel.count() ){
		// get one Anfr
		
		//if (DMSApp.pECMInbox.oBem.i(DmsAccessScript.CountAnfr).get() != "Bearb. Ratanet..." ) {
		if (DMSApp.pECMInbox.oBem.i(DmsAccessScript.CountAnfr).get() == "" ) {
			// bemerkung vide
			
			DmsAccessScript.objSearchNrDMS.AnfrNrTab[0]= DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.CountAnfr).get();
			DmsAccessScript.objSearchNrDMS.AnfrNrTab[1]= DmsAccessScript.CountAnfr; //current Anfr i
			sc.data=DmsAccessScript.objSearchNrDMS;
			DmsAccessScript.CountAnfr++;
			sc.endStep();
		}	
		else {
			//bem m3abbi		
			RatLog(DMSApp.pECMInbox.oAnfrNr.i(DmsAccessScript.CountAnfr).get()," bereits abgeschlossen");
			DmsAccessScript.CountAnfr++;
			sc.endStep(GLOBAL.steps.stGetNrDMS);
		}
	}
	else{
		if (DmsAccessScript.PageNr < DMSApp.pECMInbox.btPages.count()) {
			//new page
			
			DMSApp.pECMInbox.btPages.i(DmsAccessScript.PageNr).click();
			DmsAccessScript.CountAnfr=0;
			DmsAccessScript.PageNr++;
			ctx.wait(function(){
				sc.endStep(GLOBAL.steps.stGetNrDMS);
			},2000);
		}
		else{
			if (DmsAccessScript.CountEcomDocs==DmsAccessScript.TabEcomFolders.length-1  ) {
				//end 
				sc.data=DmsAccessScript.objSearchNrDMS;
				ctx.log("end scenario");
				RatLog("Ende der Bearbeitung ","");
				sc.endScenario();
			}
			else{
				//new folder
				
				DMSApp.pECMInbox.btKreditPostkorb.click();
				DmsAccessScript.CountAnfr=0;
				DMSApp.pMain.wait(function(){
					sc.endStep(GLOBAL.steps.stSearchNrDMS);	
				});	
			}	
		}	
	}
},
// hange the Bemerkung field of an AnfrageNummer
ChangeBemDMS: function (ev,sc,st){
	
	DMSApp.pECMInbox.btInfo.i(sc.data.AnfrNrTab[1]).click();
	DMSApp.pGeneralTab.wait(function(){
		
		DMSApp.pGeneralTab.oNotice.set(sc.data.AnfrNrTab[2]);
		if (sc.data.AnfrNrTab[2]=="Bearb. Ratanet abgeschlossen") {DMSApp.pGeneralTab.oQueueId.set('3312');DMSApp.pGeneralTab.oBtnMoveLabel.click();}
		else {DMSApp.pGeneralTab.oBtnSaveBack.click();}
		DMSApp.pECMInbox.wait(function(){
			//sc.data.AnfrNrTab[2] = "Antrag zu automatischen Weiterbearbeitung vorgemerkt";
			if (sc.data.AnfrNrTab[2]=="Bearb. Ratanet abgeschlossen") {
				RatSuccess(sc.data.AnfrNrTab[0],sc.data.AnfrNrTab[2],DmsAccessScript.TraceDir);
			}
			RatLog(sc.data.AnfrNrTab[0]," erforgleich abgeschlossen");
			sc.endStep(GLOBAL.steps.stToNext);
		});
	

	});
},

//To Loop or display the popup
ToNext : function (ev, sc, st) {
	var data = sc.data;
	if (sc.data.AnfrNrTab[2]=="Bearb. Ratanet abgeschlossen") {DmsAccessScript.CountPopups++;}
	st.disableTimeout();
	if (DmsAccessScript.CountPopups %  DmsAccessScript.DisplayedPopup ==0) {
		var popup = ctx.popup('pPopup' + data.anfragNr + DmsAccessScript.currPageIndx + DmsAccessScript.Counter).init( {
			title: 'Bestätigungsbox',
			template:e.popup.bootbox.YesNo,
			CX: 500,
			CY: 150,
			message: '<br/>' + data.AnfrNrTab[2] + '<br/>Anfrage Nummer: ' + data.AnfrNrTab[0]  + '<hr/>' +  DmsAccessScript.DisplayedPopup + ' Nummers werden behandelt.<br/>Möchten Sie fortfahren ?<br/>',
			icon: e.popup.icon32.info
		});
		popup.open() ;
	
		RatLog(data.AnfrNrTab[0], " Popup-"+data.AnfrNrTab[2]+" angezeigt");
		popup.waitResult(function (res) {
			if (res == e.popup.button.Yes) {
				st.endStep(GLOBAL.steps.stGetNrDMS);
			} else if (res == e.popup.button.No) {
				ctx.log("end scenario");
				RatLog("Ende der Bearbeitung ", "");
				sc.endScenario();
			}
		});
	}
	else st.endStep(GLOBAL.steps.stGetNrDMS);

}

}
