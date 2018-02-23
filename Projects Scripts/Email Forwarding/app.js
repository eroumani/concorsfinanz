var App = {
	
	executeCounter: 0,
	
	init: function() {
		
		ctx.fso.file.append = App.append;
		ctx.fso.file.FileExists = Logger.FileExists;

		DmsAccessScript.init();
		MailScript.init();
		//Logger.init();
		
		GLOBAL.step({ stSaveAudit: App.saveAudit });
		
		
		GLOBAL.scenario({ scSendNextMail: function(ev, sc) {
			var data = sc.data;
			Logger.sc=sc;
			// Scenario is restarted until this flag is set somewhere in the steps.
			data.stopRequest = false;
			
		ctx.log(ctx.options.userName);
			sc.onTimeout(30000, function(sc, st) { 
				var msg = new Date() + ";#ERROR#;TIMEOUT;" + sc.data.fileName + ";" + sc.data.customerName;
				ctx.fso.file.append("C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\errors.csv", msg);
				Logger.error(msg);
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Timeout aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
				sc.data.stopRequest = true; 
				sc.endScenario();	
			}); // default timeout handler for each step

			sc.onError(function(sc, st, ex) { 
				var msg = new Date() + ";#ERROR#;" + ex +";" + sc.data.fileName + ";" + sc.data.customerName;
				ctx.fso.file.append("C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\errors.csv", msg);
				Logger.error(msg);
				showPopup("ACHTUNG", sc.data.progress + "<br/>Bei der Verarbeitung ist ein Feher aufgetreten. Bitte neu starten.", e.popup.icon32.error, e.popup.color.Red);
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
					GLOBAL.scenarios.scSendNextMail.start();
				}, 1000);
			});

			sc.step(GLOBAL.steps.stFindNextDocument);
			sc.step(GLOBAL.steps.stDownloadDocument);
			sc.step(GLOBAL.steps.stExtractDocument);
			sc.step(GLOBAL.steps.stGetAdditionalInfo);
			sc.step(GLOBAL.steps.stSendMail);
			sc.step(GLOBAL.steps.stArchiveDocument);
			//sc.step(GLOBAL.steps.stFailedDoc);
			sc.step(GLOBAL.steps.stDeleteDocumentInDms);
			sc.step(GLOBAL.steps.stSaveAudit);
			//sc.step(GLOBAL.steps.stFailedDoc);

		}});
		
	},
	
	//fso.file has no way to append to a file !? So we add our own here (code cloned courtesy of fso library).
	append : function(filename, txt, encoding)
		{
			ctx.log(filename);
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
	
	// Save a central log message
	saveAudit: function(ev, sc, st) {
		
		var msg = new Date() + ";" + ctx.fso.file.getFileName(sc.data.fileName) + ";" + sc.data.customerName + ";" + sc.data.docDate;
		ctx.fso.file.append("C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\audit.csv", msg);

		sc.data.progress = sc.data.progress + "<br/>Done";
		showPopup("Weiter", sc.data.progress , e.popup.icon32.info, e.popup.color.Green);

		sc.endStep();//stFindNextDocument);
	},
	
	start: function() {
		GLOBAL.scenarios.scSendNextMail.start();
	}
	
}

//Global show popup
function showPopup(headline, message, icon, color) {
	
	ctx.popup('pTooltip').init({
		template: e.popup.template.TooltipAlert,
		X: e.popup.position.Right,
		CX: 400,
		message: "<b>" + headline + "</b><br/>" +  message, 
		icon: icon,
		color: color,
		autoClose: 5000
	}).open()
}
