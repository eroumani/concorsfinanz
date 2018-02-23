var TmpScript = {
	init: function() {

		GLOBAL.step({ stGetNextDoc: TmpScript.getNextDoc });
		
		GLOBAL.scenario({ scSendMailManually: function(ev, sc) {
			var data = sc.data;
			Logger.sc=sc;
			// Scenario is restarted until this flag is set somewhere in the steps.
			data.stopRequest = false;
			
			sc.onTimeout(30000, function(sc, st) { 
				var msg = new Date() + ";#ERROR#;TIMEOUT;" + sc.data.fileName + ";" + sc.data.customerName;
				ctx.fso.file.append("C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\errors.csv", msg);
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Timeout aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
				Logger.error(msg,sc.data.fileName,sc.data.customerName);
				sc.data.stopRequest = true; 
				sc.endScenario();	
			}); // default timeout handler for each step

			sc.onError(function(sc, st, ex) { 
				var msg = new Date() + ";#ERROR#;" + ex +";" + sc.data.fileName + ";" + sc.data.customerName;
				ctx.fso.file.append("C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\errors.csv", msg);
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Feher aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
				Logger.error(msg,sc.data.fileName,sc.data.customerName);
				sc.data.stopRequest = true; 
				sc.endScenario();
			}); // default error handler

			sc.setMode(e.scenario.mode.clearIfRunning);

			sc.onEnd(function(sc) {
				App.executeCounter = App.executeCounter -1;

				if(sc.data.stopRequest || App.executeCounter<=0 ) {
					return;
				}
				
				// Restart with next document
				ctx.wait( function() {
					GLOBAL.scenarios.scSendMailManually.start();
				}, 1000);
			});

			sc.step(GLOBAL.steps.stGetNextDoc);
			sc.step(GLOBAL.steps.stSendMail);
			sc.step(GLOBAL.steps.stSaveAudit);

		}});
		
		
	},
	
	getNextDoc : function(ev, sc, st) {
		
		sc.data.docDate = "2017-10-11";
		sc.data.customerName = "UNKNOWN";
		sc.data.fileName = "";
		sc.data.customerName = "";
		var enumerator =  ctx.fso.folder.getFileCollection("C:\\Users\\"+ ctx.options.userName+"\\Downloads\\extracted\\");
		var fileName = "";
		try{
		
			enumerator.moveFirst();
			fileName = enumerator.item().Path;
		} catch (ex) {
				showPopup("Fertig", "Alle Dokumente wurden verarbeitet.", e.popup.icon32.ok, e.popup.color.Green);
				Logger.info( "Alle Dokumente wurden verarbeitet.","","");
				sc.data.stopRequest = true;
				sc.endScenario();
				return;
		}
		var destination = "C:\\Users\\"+ ctx.options.userName+"\\Downloads\\sent\\" + ctx.fso.file.getFileName(fileName);
		ctx.fso.file.move(fileName, destination);
		sc.data.fileName = destination;

		sc.data.progress = sc.data.progress + "<br/>" + sc.data.fileName;
		showPopup("Weiter", sc.data.progress , e.popup.icon32.info, e.popup.color.Blue);
		Logger.info( "get Next Doc."+sc.data.fileName,sc.data.fileName,"");
		st.endStep();		
		
	}
	
	
}