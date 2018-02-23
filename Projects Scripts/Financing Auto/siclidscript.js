var SiclidScript = {


	init : function () {

		// Register steps
		GLOBAL.step( {
			stAntageOffnen:  SiclidScript.AntageOffnen
		});
		GLOBAL.step( {
			stAntageOffnenBis:  SiclidScript.AntageOffnenBis
		});
		GLOBAL.step( {
			stCheckZustand:  SiclidScript.CheckZustand
		});
		GLOBAL.step( {
			stCheckAdditionalDok:  SiclidScript.CheckAdditionalDok
		});
		GLOBAL.step( {
			stAutomatischBoch: SiclidScript.AutomatischBoch
		});
		GLOBAL.step( {
			stSaveEtud: SiclidScript.SaveEtud
		});
		GLOBAL.step( {
			stTrevMask: SiclidScript.TrevMask
		});
		GLOBAL.step( {
			stConnectSession: SiclidScript.ConnectSession
		});
		GLOBAL.step( {
			stDisconnectSession: SiclidScript.DisconnectSession
		});
		GLOBAL.step( {
			stConnectSessionBis: SiclidScript.ConnectSessionBis
		});
	},
	//Connect to Siclid Session
	ConnectSession : function (ev, sc, st) {
		Logger("", "In connect to siclid session");
		SiclidApp.connect('A', function (res) {
			if (res) {
				if (ctx.popup('pTooltip').exist()) ctx.popup('pTooltip').close();
				sc.endStep(GLOBAL.steps.stNavigateInDMS);
			}
			else {
				ctx.log("Error");
				Logger("", "ERROR CONNECT TO SICLID retry after 1 sec (ConnectSession)");
				ctx.wait(function () {
					st.endStep(GLOBAL.steps.stConnectSession);
				}, 1000);
			}
		});
	},
	//reconnect to Siclid Session and go to a specific step
	ConnectSessionBis : function (ev, sc, st) {
		Logger("", "In connect to siclid session BIS");
		SiclidApp.connect('A', function (res) {
			if (res) {
				ctx.log("to nextstep " + sc.data.nextstep);
				sc.endStep(GLOBAL.steps[sc.data.nextstep]);
			}
			else {
				ctx.log("Error");
				Logger("", "ERROR CONNECT TO SICLID retry after 1 sec (ConnectSessionBis)");
				ctx.wait(function () {
					st.endStep(GLOBAL.steps.stConnectSessionBis);
				}, 1000);
			}
		});
	},
	//disconnect from Siclid Session
	DisconnectSession : function (ev, sc, st) {
		SiclidApp.disconnect(function (res) {
			Logger("", "In disconnect from siclid session");
			st.disableTimeout();
			if (DmsAccessScript.SC_POSTKOBE_INX >= DmsAccessScript.DMS_POSTKOBES.length - 1) {

				showPopup("Weiter", "Alle Postkörbe bearbeitet!", e.popup.icon32.ok, e.popup.color.Green);
				appendTraceInfo("", "Alle Postkörbe bearbeitet!");
				Logger("", "Alle Postkörbe bearbeitet!");
				var popup = ctx.popup('pPopup_EndBearbeitung').init( {
					title: 'Bestätigungsbox',
					template:e.popup.bootbox.Ok,
					CX: 500,
					CY: 150,
					message: "Alle Postkörbe bearbeitet!",
					icon: e.popup.icon32.info,
					autoClose: 0
				});
				popup.open();
				popup.waitResult(function (res) {
					if (res == e.popup.button.Ok) {
						sc.endScenario();
					}
				});
			} else sc.endScenario();
		});
	},
	//Open Antrag in Siclid
	AntageOffnen : function (ev, sc, st) {
		// Navigate to the queue
		var data = sc.data;
		sc.data.progress = sc.data.progress + "<br/>In SICLID Antrag öffnen";
		//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
		appendTraceInfo(data.anfragNr, "In SICLID Antrag öffnen");
		Logger(data.anfragNr, "In SICLID Antrag öffnen");
		var antrNr = data.anfragNr;
		SiclidApp.pTalf.activate();
		SiclidApp.pTalf.wait(function () {
			sc.endStep(GLOBAL.steps.stAntageOffnenBis);
		});
	},
	AntageOffnenBis : function (ev, sc, st) {
		var data = sc.data;
		var antrNr = data.anfragNr;
		ctx.log("exist " + SiclidApp.pTalf.oAntrNr.exist());
		try {
			SiclidApp.pTalf.oAntrNr.set(antrNr);
		}
		catch (ex) {
			ctx.log("Error setting anfragNr " + ex);
			Logger(data.anfragNr, "Error setting anfragNr " + ex);
			sc.data.nextstep = "stAntageOffnen";
			sc.endStep(GLOBAL.steps.stConnectSessionBis);
		}
		SiclidApp.pTalf.keyStroke(e.key.Enter);
		//SiclidApp.pTalfBis.activate();
		SiclidApp.pTalfBis.wait(function () {
			SiclidApp.pTalfBis.oAct.set("save");
			this.keyStroke(e.key.Enter);
			sc.endStep(GLOBAL.steps.stCheckZustand);
		});
		ctx.wait(function () {
			try {
				SiclidApp.pTalf.oAntrNr.set(antrNr);
			}
			catch (ex) {
				ctx.log("Error setting anfragNr " + ex);
				Logger(data.anfragNr, "Error setting anfragNr " + ex);
				sc.data.nextstep = "stAntageOffnen";
				sc.endStep(GLOBAL.steps.stConnectSessionBis);
			}
			SiclidApp.pTalf.keyStroke(e.key.Enter);
		}, 2000);
		SiclidApp.pTalf.events.UPDATE.on(function () {

			ctx.log("event received" + data.anfragNr + SiclidApp.pTalf.oNotFound.get());
			if (SiclidApp.pTalf.exist() && SiclidApp.pTalf.oNotFound.get() == "K E I N   T R E F F E R") {
				ctx.log("event received" + data.anfragNr);
				sc.data.progress = sc.data.progress + "<br/>Anfrage Nummer nicht gefunden";
				appendTraceInfo(data.anfragNr, "Anfrage Nummer nicht gefunden");
				Logger(data.anfragNr, "Anfrage Nummer nicht gefunden");
				SiclidApp.pTalf.activate();
				ctx.log("2event received" + data.anfragNr);
				SiclidApp.pTalf.oTransCode.set("talf");
				ctx.log("3event received" + data.anfragNr);
				SiclidApp.pTalf.keyStroke(e.key.Enter);
				ctx.log("4event received" + data.anfragNr);
				DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
				st.endStep(GLOBAL.steps.stSearchInDMS);//st.endStep(GLOBAL.steps.stToNextAntrag);
				//////////test///////
				//DmsAccessScript.Stopper_Counter = DmsAccessScript.Stopper_Counter + 1;
				//st.endStep(GLOBAL.steps.stToNextAntrag);
				//////////////////////

			}

		});
	},
	//Maske Save öffnen und Zustand prüfen
	CheckZustand : function (ev, sc, st) {

		// Navigate to the queue
		var data = sc.data;
		sc.data.progress = sc.data.progress + "<br/>Maske Save öffnen und Zustand prüfen";
		appendTraceInfo(data.anfragNr, "Maske Save öffnen und Zustand prüfen");
		Logger(data.anfragNr, "Maske Save öffnen und Zustand prüfen");
		SiclidApp.pSave.wait(function () {
			///////
			try {
				data.bertrag = SiclidApp.pSave.oBetrag.get().trim();
			}
			catch (ex) {
				Logger(data.anfragNr, "Error getting oBetrag " + ex);
				sc.data.nextstep = "stCheckZustand";
				sc.endStep(GLOBAL.steps.stConnectSessionBis);
			}
			///////
			//data.bertrag = SiclidApp.pSave.oBetrag.get().trim();
			if (SiclidApp.pSave.oZustand.get().indexOf("INS") > - 1) {
				sc.data.progress = sc.data.progress + "<br/>Zustand ist INS";
				appendTraceInfo(data.anfragNr, "Zustand ist INS");
				Logger(data.anfragNr, "Zustand ist INS");
				sc.endStep(GLOBAL.steps.stCheckAdditionalDok);


			} else if (SiclidApp.pSave.oZustand.get().indexOf("ENC") > - 1 || SiclidApp.pSave.oZustand.get().indexOf("FIN") > - 1) {
				sc.data.progress = sc.data.progress + "<br/>Zustand ist " + SiclidApp.pSave.oZustand.get();
				appendTraceInfo(data.anfragNr, "Zustand ist " + SiclidApp.pSave.oZustand.get());
				Logger(data.anfragNr, "Zustand ist " + SiclidApp.pSave.oZustand.get());
				SiclidApp.pSave.oTransCode.set("talf");
				SiclidApp.pSave.keyStroke(e.key.Enter);
				sc.endStep(GLOBAL.steps.stArchiveInDMS);


			}
			else {
				sc.data.progress = sc.data.progress + "<br/>Zustand ist nicht INS<br/>Bearbeitung beendet";
				appendTraceInfo(data.anfragNr, "Zustand ist nicht INS-->Bearbeitung beendet");
				Logger(data.anfragNr, "Zustand ist nicht INS ( " + SiclidApp.pSave.oZustand.get() + " )-->Bearbeitung beendet");
				SiclidApp.pSave.oTransCode.set("talf");
				SiclidApp.pSave.keyStroke(e.key.Enter);
				DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
				st.endStep(GLOBAL.steps.stSearchInDMS);//st.endStep(GLOBAL.steps.stToNextAntrag);
			}
			// do the test here

		});
	},
	//Notwendigkeit zusätzlicher Dokumente (Auflage) prüfen
	CheckAdditionalDok : function (ev, sc, st) {
		var data = sc.data;

		var antrNr = data.anfragNr;
		sc.data.progress = sc.data.progress + "<br/>Notwendigkeit zusätzlicher Dokumente (Auflage) prüfen";
		appendTraceInfo(data.anfragNr, "Notwendigkeit zusätzlicher Dokumente (Auflage) prüfen");
		Logger(data.anfragNr, "Notwendigkeit zusätzlicher Dokumente (Auflage) prüfen");
		SiclidApp.pSave.wait(function () {
			this.oTransCode.set("etud");
			this.keyStroke(e.key.Enter);
		});
		SiclidApp.pPosEtud.wait(function () {
			SiclidApp.pPosEtud.oTransCode.set("talf");
			SiclidApp.pPosEtud.keyStroke(e.key.Enter);
			sc.data.progress = sc.data.progress + "<br/>Auflage erforderlich";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(data.anfragNr, "Auflage erforderlich");
			Logger(data.anfragNr, "Auflage erforderlich");
			data.endEteration = true;
			data.Note = "Antrag mit Auflage";
			st.endStep(GLOBAL.steps.stAddRemarkInDms);
		});
		SiclidApp.pBearbeitungExpress.wait(function () {
			var isEtuExpress;
			try {
				isEtuExpress = this.oEtud.text();
			}
			catch (ex) {
				Logger(data.anfragNr, "Error getting oEtud " + ex);
				sc.data.nextstep = "stCheckAdditionalDok";
				sc.endStep(GLOBAL.steps.stConnectSessionBis);
			}
			if (isEtuExpress == "BEARBEITUNG EXPRESS") {
				this.oTransCode.set("note");
				this.keyStroke(e.key.Enter);
				sc.data.progress = sc.data.progress + "<br/>Keine Auflage notwendig";
				//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
				appendTraceInfo(data.anfragNr, "Keine Auflage notwendig");
				Logger(data.anfragNr, "Keine Auflage notwendig");
				sc.endStep(GLOBAL.steps.stAutomatischBoch);
			}
			else {
				SiclidApp.pBearbeitungExpress.oTransCode.set("talf");
				SiclidApp.pBearbeitungExpress.keyStroke(e.key.Enter);

				sc.data.progress = sc.data.progress + "<br/>Auflage erforderlich";
				//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
				appendTraceInfo(data.anfragNr, "Auflage erforderlich");
				Logger(data.anfragNr, "Auflage erforderlich");
				data.Note = "Antrag mit Auflage";
				data.endEteration = true;
				st.endStep(GLOBAL.steps.stAddRemarkInDms);
			}
		});
	},
	//In Make Note "Automatische Buchung" eintragen
	AutomatischBoch : function (ev, sc, st) {
		var data = sc.data;
		sc.data.progress = sc.data.progress + "<br/>In Make Note \"Automatische Buchung\" eintragen";
		//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
		appendTraceInfo(data.anfragNr, "In Make Note \"Automatische Buchung\" eintragen");
		Logger(data.anfragNr, "In Make Note \"Automatische Buchung\" eintragen");
		var antrNr = data.anfragNr;
		SiclidApp.pNote.wait(function () {
			this.oMessage.setFocus();
			this.oMessage.text("Automatische Buchung");
			this.keyStroke(e.key.Enter);
			SiclidApp.pNote.wait(function () {
				this.oTransCode.setFocus();
				this.oTransCode.text("etud");
				this.keyStroke(e.key.Enter);
				sc.endStep(GLOBAL.steps.stSaveEtud);
			}, 600);
			//						
		});
	},
	//In der Maske ETUDE "OK" und  "V" eintragen
	SaveEtud : function (ev, sc, st) {
		var data = sc.data;
		sc.data.progress = sc.data.progress + "<br/>" + data.typeVertrag;
		//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
		appendTraceInfo(data.anfragNr, "type Vertrag: " + data.typeVertrag);
		Logger(data.anfragNr, "type Vertrag: " + data.typeVertrag);
		var antrNr = data.anfragNr;
		SiclidApp.pBearbeitungExpress.wait(function () {
			try {
				this.oEntschei.set("OK ");
			}
			catch (ex) {
				Logger(data.anfragNr, "Error setting oEntschei " + ex);
				sc.data.nextstep = "stSaveEtud";
				sc.endStep(GLOBAL.steps.stConnectSessionBis);
			}

			if (data.typeVertrag == "Kredit Vertrag") {
				this.oFinanzierung.text("V");
				this.keyStroke(e.key.Enter);
				SiclidApp.pBearbeitungExpress.events.UPDATE.on(function () {
					if (SiclidApp.pBearbeitungExpress.exist() && SiclidApp.pBearbeitungExpress.oSaved.get() == "nderung erledigt und Finanzierung gespeichert" && SiclidApp.pBearbeitungExpress.oEtud28.get() == "ETUD28") {
						sc.data.progress = sc.data.progress + "<br/>In der Maske ETUDE \"OK\" und  \"V\" eintragen<br/>Antrag finanziert";
						//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
						appendTraceInfo(data.anfragNr, "In der Maske ETUDE \"OK\" und  \"V\" eintragen --> Antrag finanziert");
						Logger(data.anfragNr, "In der Maske ETUDE \"OK\" und  \"V\" eintragen -> Antrag finanziert");
						SiclidApp.pBearbeitungExpress.oTransCode.set("talf");
						SiclidApp.pBearbeitungExpress.keyStroke(e.key.Enter);

						/*data.Note = "Antrag ohne Auflage";
						data.endEteration = false;
						st.endStep(GLOBAL.steps.stAddRemarkInDms);*/
						st.endStep(GLOBAL.steps.stMoveCreditakte);
					} else if (SiclidApp.pBearbeitungExpress.oFinanzierung.get().indexOf("V") > - 1) {
						sc.data.progress = sc.data.progress + "<br/>In der Maske ETUDE  -> ¢nderung nicht erledigt und Finanzierung nicht gespeichert";
						//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
						appendTraceInfo(data.anfragNr, "In der Maske ETUDE  -> ¢nderung nicht erledigt und Finanzierung nicht gespeichert");
						appendSkippedCase(data.anfragNr, "" + DmsAccessScript.SC_POSTKOBE);
						Logger(data.anfragNr, "In der Maske ETUDE  -> ¢nderung nicht erledigt und Finanzierung nicht gespeichert, we could not add OK and V,add remark (Antrag mit Auflage)");
						SiclidApp.pBearbeitungExpress.keyStroke(e.key.F5);
						SiclidApp.pBearbeitungExpress.keyStroke(e.key.F5);
						SiclidApp.pTrevBis.wait(function () {
							Logger(data.anfragNr, "In pTrevBis");
							SiclidApp.pTrevBis.oTransCode.set("talf");
							SiclidApp.pTrevBis.keyStroke(e.key.Enter);
							DmsAccessScript.Counter = DmsAccessScript.Counter + 1;
							st.endStep(GLOBAL.steps.stSearchInDMS);//st.endStep(GLOBAL.steps.stToNextAntrag);
							/*data.endEteration = true;
							data.Note = "Antrag mit Auflage";
							st.endStep(GLOBAL.steps.stAddRemarkInDms);*/
						});

					}
				});

			}
			else {
				this.keyStroke(e.key.Enter);
				ctx.wait(function () {
					SiclidApp.pBearbeitungExpress.oTransCode.set("trev");
					SiclidApp.pBearbeitungExpress.keyStroke(e.key.Enter);
					sc.data.progress = sc.data.progress + "<br/>In der Maske ETUDE \"OK\" eintragen";
					//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
					appendTraceInfo(data.anfragNr, "In der Maske ETUDE \"OK\" eintragen");
					Logger(data.anfragNr, "In der Maske ETUDE \"OK\" eintragen");
					st.endStep(GLOBAL.steps.stTrevMask);
				}, 500);

			}

		});
	},
	//In der Maske TREV "Enter" klicken
	TrevMask : function (ev, sc, st) {
		var data = sc.data;

		var antrNr = data.anfragNr;
		SiclidApp.pTrev.wait(function () {
			sc.data.progress = sc.data.progress + "<br/>In der Maske TREV \"Enter\" klicken<br/>Antrag finanziert";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(data.anfragNr, "In der Maske TREV \"Enter\" klicken -> Antrag finanziert");
			Logger(data.anfragNr, "In der Maske TREV \"Enter\" klicken -> Antrag finanziert");
			this.keyStroke(e.key.Enter);
			ctx.wait(function () {
				SiclidApp.pTrev.oTransCode.set("talf");
				SiclidApp.pTrev.keyStroke(e.key.Enter);

				/*data.endEteration = false;
				data.Note = "Antrag ohne Auflage";
				st.endStep(GLOBAL.steps.stAddRemarkInDms);*/
				st.endStep(GLOBAL.steps.stMoveCreditakte);
			}, 500);


		});
		SiclidApp.pTrev40.wait(function () {
			sc.data.progress = sc.data.progress + "<br/>In der Maske TREV ERROR trev40";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(data.anfragNr, "In der Maske TREV ERROR trev40");
			Logger(data.anfragNr, "In der Maske TREV ERROR trev40");
			SiclidApp.pTrev40.keyStroke(e.key.Clear);
			ctx.wait(function () {
				SiclidApp.currentPage.keyStroke("talf");
				SiclidApp.currentPage.keyStroke(e.key.Enter);

				/*data.endEteration = false;
				data.Note = "Antrag ohne Auflage";
				st.endStep(GLOBAL.steps.stAddRemarkInDms);*/
				st.endStep(GLOBAL.steps.stMoveCreditakte);

			}, 1000);
		});
		ctx.wait(function () {
			sc.data.progress = sc.data.progress + "<br/>In der Maske TREV ERROR trev46";
			//showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Green);
			appendTraceInfo(data.anfragNr, "In der Maske TREV ERROR trev46");
			Logger(data.anfragNr, "In der Maske TREV ERROR trev46");
			SiclidApp.currentPage.keyStroke(e.key.Clear);
			ctx.wait(function () {
				SiclidApp.currentPage.keyStroke("talf");
				SiclidApp.currentPage.keyStroke(e.key.Enter);

				/*data.endEteration = false;
				data.Note = "Antrag ohne Auflage";
				st.endStep(GLOBAL.steps.stAddRemarkInDms);*/
				st.endStep(GLOBAL.steps.stMoveCreditakte);

			}, 1000);
		}, 3000);

	}


}
