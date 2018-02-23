var App = {
	
	executeCounter: 0,
	
	init: function() {
		
		ctx.fso.file.append = App.append;
		ctx.fso.file.FileExists = App.FileExists;

		DmsAccessScript.init();
		SiclidScript.init();
		RataNetScript.init();
		
		GLOBAL.step({ stSaveAudit: App.saveAudit });
		
		
		GLOBAL.scenario({ scSearchInDMS: function(ev, sc) {
			var data = sc.data;
			// Scenario is restarted until this flag is set somewhere in the steps.
			data.stopRequest = false;
				Logger( sc.data.anfragNr, "Start  the scenario");
			sc.onTimeout(30000, function(sc, st) { 
				DmsAccessScript.is_good=false;
				var msg = new Date() + ";#ERROR#;TIMEOUT;" + sc.data.anfragNr + ";" + DmsAccessScript.SC_POSTKOBE;
				ctx.fso.file.append("C:\\Users\\ael\\Desktop\\Archive\\errors.csv", msg);
				Logger( sc.data.anfragNr, ";#ERROR#;TIMEOUT;" + sc.data.anfragNr + ";" + DmsAccessScript.SC_POSTKOBE, undefined,"[ERROR]");
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Timeout aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
				sc.data.stopRequest = true; 
				sc.endScenario();	
			}); // default timeout handler for each step

			sc.onError(function(sc, st, ex) { 
				DmsAccessScript.is_good=false;
				var msg = new Date() + ";#ERROR#;" + ex +";" + sc.data.anfragNr + ";" + DmsAccessScript.SC_POSTKOBE;
				ctx.fso.file.append(DmsAccessScript.ErrorDir + "errors.csv", msg);
				Logger( sc.data.anfragNr, ";#ERROR#;" + ex +";" + sc.data.anfragNr + ";" + DmsAccessScript.SC_POSTKOBE, undefined,"[ERROR]");
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Feher aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
				sc.data.stopRequest = true; 
				sc.endScenario();	
			}); // default error handler

			sc.setMode(e.scenario.mode.clearIfRunning);

			sc.onEnd(function(sc) {
				
				App.executeCounter = App.executeCounter -1;
				////ctx.log"end scenario"+App.executeCounter+" curr postkobe "+	DmsAccessScript.SC_POSTKOBE+" "+sc.data.stopRequest+" currentpage "+	DmsAccessScript.currPageIndx+" counter "+	DmsAccessScript.Counter);
				if(sc.data.stopRequest || App.executeCounter<=0 ) {
					Logger( sc.data.anfragNr, "End of scenario with true return, mailbox= "+DmsAccessScript.SC_POSTKOBE);
					return;
				}
				if(DmsAccessScript.is_good==true){
					DmsAccessScript.SC_POSTKOBE_INX+=1;
					DmsAccessScript.currPageIndx=0;
						Logger( sc.data.anfragNr, "before restart the scenario, go to next mailbox");
				}
				
					if(DmsAccessScript.SC_POSTKOBE_INX<DmsAccessScript.DMS_POSTKOBES.length ){
							Logger( sc.data.anfragNr, "restart the scenario with mailbox "+DmsAccessScript.SC_POSTKOBE);
						DmsAccessScript.SC_POSTKOBE = DmsAccessScript.DMS_POSTKOBES[DmsAccessScript.SC_POSTKOBE_INX];
						DmsAccessScript.Counter=0;
						//ctx.log"start scenario "+	DmsAccessScript.SC_POSTKOBE);
						GLOBAL.scenarios.scSearchInDMS.start();
					}
					
		 
			});
			/*sc.step(	GLOBAL.steps.stAddRemarkInDms);
			sc.step(	GLOBAL.steps.stAddTraces);
			sc.step(	GLOBAL.steps.stMoveCreditakte);
			sc.step(GLOBAL.steps.stToNextAntrag);*/
			sc.step(GLOBAL.steps.stNavigateInDMS);
			sc.step(GLOBAL.steps.stSortInDMS);
			sc.step(GLOBAL.steps.stGoToPageTable);
			sc.step(GLOBAL.steps.stSearchInDMS);
			sc.step(GLOBAL.steps.stCheckBemerkung);
			sc.step(GLOBAL.steps.stCheckKundenNr);
			sc.step(GLOBAL.steps.stCheckDokumenttyp);
			sc.step(GLOBAL.steps.stAntageOffnen);
			// Unused steps:
			sc.step(GLOBAL.steps.stCheckZustand);
			sc.step(	GLOBAL.steps.stCheckAdditionalDok);
			sc.step(	GLOBAL.steps.stAddRemarkInDms);
			sc.step(	GLOBAL.steps.stAutomatischBoch);			
			sc.step(	GLOBAL.steps.stSaveEtud);
			sc.step(	GLOBAL.steps.stTrevMask);	
			sc.step(	GLOBAL.steps.stAddTraces);
			sc.step(	GLOBAL.steps.stMoveCreditakte);
			sc.step(GLOBAL.steps.stToNextAntrag);
			
		}});
		
		GLOBAL.scenario({ scRatanetB: function(ev, sc) {
			var data = sc.data;
			// Scenario is restarted until this flag is set somewhere in the steps.
			data.stopRequest = false;
			
			sc.onTimeout(40000, function(sc, st) { 
				RatLog( sc.data.AnfrNrTab[0], "#ERROR#;TIMEOUT;" + sc.data.AnfrNrTab[0] + ";" , "[ERROR]");
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Timeout aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
				sc.data.stopRequest = true; 
				sc.endScenario();	
			}); // default timeout handler for each step

			sc.onError(function(sc, st, ex) { 
				RatLog( sc.data.AnfrNrTab[0], "#ERROR#;" + ex +";" + sc.data.AnfrNrTab[0] + ";","[ERROR]");
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Feher aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
				sc.data.stopRequest = true; 
				sc.endScenario();	
			});

			sc.setMode(e.scenario.mode.clearIfRunning);

			sc.onEnd(function(sc) {
				App.executeCounter = App.executeCounter -1;

				if(sc.data.stopRequest || App.executeCounter<=0 ) {
					return;
				}
				
				// Restart with next document
				/*ctx.wait( function() {
					GLOBAL.scenarios.scSearchInDMS.start();
				}, 1000);*/
			});

			sc.step(GLOBAL.steps.stStartDMS);
			sc.step(GLOBAL.steps.stSearchNrDMS);
			sc.step(GLOBAL.steps.stGetNrDMS);
			sc.step(GLOBAL.steps.stSearchAnfrRatanet);
			sc.step(GLOBAL.steps.stClickETURatanet);
			sc.step(GLOBAL.steps.stClickDIRRatanet);
			sc.step(GLOBAL.steps.stToNext);
			sc.step(GLOBAL.steps.stChangeBemDMS);
			sc.step(GLOBAL.steps.stCheckDetails);

			
		}});
		
	},
	
	


	
	//fso.file has no way to append to a file !? So we add our own here (code cloned courtesy of fso library).
	append : function(filename, txt, encoding) {
		
		var _oStream = new ActiveXObject("Scripting.FileSystemObject");
		var file;
		ctx.notifyAction('ctx.fso.file.append');
		try {
			file = _oStream.OpenTextFile(filename, 8, true);
			file.WriteLine(txt);
			file.Close();
		} catch (ex) {
			if (file) {
				file.Close();
			}
			throw new Error(e.error.KO, '[fso.file.append] : '+ ex.description);
		}
	},
		
	//fso.file has no way to append to a file !? So we add our own here (code cloned courtesy of fso library).
	FileExists : function(filename) {
		
		var _oStream = new ActiveXObject("Scripting.FileSystemObject");
		var file;
		ctx.notifyAction('ctx.fso.file.append');
		try {
			return _oStream.FileExists(filename);
		} catch (ex) {
			return false;
		}
	},

	// Save a central log message
	saveAudit: function(ev, sc, st) {
		
		var msg = new Date() + ";" + ctx.fso.file.getFileName(sc.data.fileName) + ";" + sc.data.customerName + ";" + sc.data.docDate;
		ctx.fso.file.append("C:\\Users\\ael\\Desktop\\Archive\\audit.csv", msg);

		sc.data.progress = sc.data.progress + "<br/>Done";
		showPopup("Weiter", sc.data.progress , e.popup.icon32.info, e.popup.color.Green);
		
		sc.endStep();
	},
	
	start: function() {
		GLOBAL.scenarios.scSearchInDMS.start();
	},
	
	start2: function() {
		GLOBAL.scenarios.scRatanetB.start();
	}
}

//Global show popup
function showPopup(headline, message, icon, color) {
	
	ctx.popup('pTooltip').open({
		template: e.popup.template.TooltipAlert,
		X: e.popup.position.Right,
		CX: 400,
		maxCX: 400,
		message: "<b>" + headline + "</b><br/>" +  message, 
		icon: icon,
		color: color,
		autoClose: 0
	})
}
  function appendTraceInfo( anfragNr,txt, encoding) {
			var date= new Date();
			var fileName = "TraceProcesses" + date.getDate() + "" + (date.getMonth()+1) + "" + date.getFullYear() + ".csv";
			var fileExist = ctx.fso.file.FileExists(DmsAccessScript.TraceDir + fileName);
			if(fileExist == false){
				var header =  'Datum;Anfragnr;Info' ;
				ctx.fso.file.append(DmsAccessScript.TraceDir + fileName, header);
			}
			var msg =  new Date() + ";" + anfragNr + ";"  + txt;
			ctx.fso.file.append(DmsAccessScript.TraceDir + fileName, msg);
	
	}
	
function Logger( anfragNr,txt, encoding,type) {
			var date= new Date();
	var logtype;
			if(type== undefined) logtype = "[DEBUG]" ;else logtype = type;
			var fileName = "Log" + date.getDate() + "" + (date.getMonth()+1) + "" + date.getFullYear() + ".log";
			var msg = logtype +" " + (new Date() )+ " Anfragnr " + anfragNr + " " +  txt;
			ctx.fso.file.append(DmsAccessScript.LogDir + fileName, msg);
	}
function isInArray(item,arr) {
	
for(var i=0;i<arr.length;i++){
	if(arr[i] == item ) {
		////ctx.log"*** in array equality "+item +" "+arr[i]);
		return true;
	}
}
return false;
}

function RatLog(anfragNr,txt,type) {
	var date= new Date();
	var logtype;
	if(type== undefined) logtype = "[DEBUG]" ;
	else logtype = type;
	var fileName = "RatanetLog" + date.getDate() + "" + (date.getMonth()+1) + "" + date.getFullYear() + ".log";
	var msg = logtype +" " +"Version:"+ctx.options.projectVersion+" " + (new Date() )+ " Anfragnr " + anfragNr + " " +  txt;
	ctx.fso.file.append(DmsAccessScript.LogDir + fileName, msg);
}	

function RatSuccess(anfragNr,txt,dir) {
	var date = new Date();
	var fileName = "RataneTraces" + date.getDate() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + ".csv";
	var msg = anfragNr + ";" + txt ;
	ctx.fso.file.append(dir+ fileName, msg);
}	
