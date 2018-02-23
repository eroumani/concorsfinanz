
// *** Choose language (en|fr|de) ***
GLOBAL.labels.setLanguage('en');

// Global Systray object
var systray = ctx.systray();

/** String table (English/French/German) */
GLOBAL.labels.set({
	menu: {
		about: { en:"About...", fr:"A propos...", de:"Uber..." },
		restart: { en:"Restart", fr:"Redémarrage", de:"Wieder starten" },
		stop: { en:"Shutdown", fr:"Arrêt", de:"Schließen" },
		main: { en:"Main Menu", fr:"Menu principal", de:"Hauptmenü" },
		test: { en:"Test Menu", fr:"Menu test", de:"Testmenü" },
		reportIncident: { en:"Report an incident", fr:"Signaler un incident", de:"Report an incident" },
		recordTraces: { en:"Record traces", fr:"Enregistrer des traces", de:"Record traces" }
	},
	aboutPopup: {
		title: { en:"About...", fr:"A propos...", de:"Uber..." },
		projectLabel: { en:"Project", fr:"Projet", de:"Projekt" },
		projectVersion: { en:"Project version", fr:"Version projet", de:"Projektversion" },
		productVersion: { en:"Product version", fr:"Version produit", de:"Produktversion" },
		studioVersion: { en:"Studio version", fr:"Version Studio", de:"Studio version" },
		environment: { en:"Environment", fr:"Environnement", de:"Environment" },
		frameworkVersion: { en:"Framework version", fr:"Version langage", de:"Framework-Version" }
	},
	stopPopup: {
		title: { en:"Contextor shutdown", fr:"Arrêt Contextor", de:"Schließen" },
		label: { 
			en:"Are you sure you want to stop Contextor ?", 
			fr:"Etes-vous certain de quitter Contextor ?",
			de:"Are you sure you want to stop Contextor ?"}
	},
	updatePopup: {
		title: { en:"Contextor update", fr:"Mise à jour Contextor", de:"Contextor update" },
		label: { 
			en:"A new version is available, do you want to restart now ?", 
			fr:"Une nouvelle version est disponible, voulez-vous redémarrer maintenant ?",
			de:"A new version is available, do you want to restart now ?"}
	},
	env: {
		prod: { en:"Production", fr:"Production", de:"Production" },
		qual: { en:"Qualification", fr:"Qualification", de:"Qualification" },
		dev: { en:"Development", fr:"Développement", de:"Development"}
	}
});

/** Show diagnostic popup */
GLOBAL.addOn({ evShowDiagnostic: function(ev) {
	ctx.diagnostic.showSubmitPopup();
}});

/** Show diagnostic recorder popup */
GLOBAL.addOn({ evShowDiagRecorder: function(ev) {
	ctx.diagnostic.showRecordInitPopup();
}});

/** main process start handler */
GLOBAL.events.START.on(function (ev) {

	// *** Create Systray ***
	systray.loadImage('stop', 'FILE', ctx.options.resourceURL + '/bmp/stop.png');
	systray.loadImage('restart', 'FILE', ctx.options.resourceURL + '/bmp/repeat.png');
	systray.loadImage('about', 'FILE', ctx.options.resourceURL + '/bmp/help.png');
	systray.createSystrayMenu(ctx.options.projectName, 'ICON1');

	/** 'About...' menu handler */
	systray.addMenu('', 'evCtxtAbout', GLOBAL.labels.menu.about, 'about', function (ev) {
		var label = "<H4>" + ctx.options.projectLabel + "</H4>" 
			+ GLOBAL.labels.aboutPopup.projectVersion + ": <b>" + ctx.options.projectVersion + "</b>&nbsp; (<b>" + ctx.options.projectDate + "</b>)<br/>" 
			+ GLOBAL.labels.aboutPopup.productVersion + ": <b>" + ctx.options.productVersion + "</b><br/>" 
			+ GLOBAL.labels.aboutPopup.frameworkVersion + ": <b>" + ctx.options.frameworkVersion + "</b><br/>";
		if (ctx.options.productVersions && ctx.options.productVersions['UnifiedStudio'])
			label += GLOBAL.labels.aboutPopup.studioVersion + ": <b>" + ctx.options.productVersions['UnifiedStudio'] + "</b><br/>" 
		if (ctx.options.env != e.env.prod)
			label += GLOBAL.labels.aboutPopup.environment + ": <b>" + GLOBAL.labels.env[ctx.options.env] + "</b><br/>";
		
		ctx.popup('pAbout', e.popup.template.Ok).open({
			title:  GLOBAL.labels.aboutPopup.title,
			CX: 500,
			CY: 300,
			message: label, 
			icon: ctx.options.resourceURL + '/bmp64/hello128.png'
		});
	});
	
	/** Stop menu handler */
	systray.addMenu('', 'evCtxtStop', GLOBAL.labels.menu.stop, 'stop', function(ev) {
		ctx.popup('pClose', e.popup.template.YesNo).open({
			title: GLOBAL.labels.stopPopup.title,
			CX: 500,
			CY: 180,
			message: '<br/><br/><b>' + GLOBAL.labels.stopPopup.label + '</b><br/><br/>', 
			icon: ctx.options.resourceURL + '/bmp64/hello.png'
		}).waitResult(function(res) {
			if (res == e.popup.button.Yes) {
				GLOBAL.notify(GLOBAL.events.PRESTOPCTX);				
			}
		});
	});

	/*systray.addMenu('', 'evCtxtRestart', GLOBAL.labels.menu.restart, 'restart', function(ev) {
		CtxtRestart();
		GLOBAL.notify(GLOBAL.events.PRESTOPCTX);
	});*/

	// add a shortcut Ctrl+Shift+D to display diagnostic
	ctx.regHotKey(e.key.Ctrl + e.key.Shift + 'D', GLOBAL.events.evShowDiagnostic);	
	
	// add a shortcut to display recorder
	ctx.regHotKey(e.key.Ctrl + e.key.Shift + 'R', GLOBAL.events.evShowDiagRecorder);	

	systray.loadImage('ICON2', 'FILE', ctx.options.resourceURL + '/bmp/record.png');
	systray.addMenu('', 'evReportBug', GLOBAL.labels.menu.reportIncident + ' (Ctrl+Shift+D)', 'ICON2', function(ev) {
		GLOBAL.notify(GLOBAL.events.evShowDiagnostic);
	});

	systray.addMenu('', 'evRecordTraces', GLOBAL.labels.menu.recordTraces + ' (Ctrl+Shift+R)', 'ICON2', function(ev) {
		GLOBAL.notify(GLOBAL.events.evShowDiagRecorder);
	});

	systray.addMenu('', 'MainMenu', 'Mail Transfer');
	systray.addMenu('MainMenu', 'evMenu1', 'Alle Dokumente übertragen', '', function(ev) {
			App.executeCounter = 1000000;
			App.start();
	});
	systray.addMenu('MainMenu', 'evMenu2', 'Das erste Dokument übertragen', '', function(ev) {
			App.executeCounter = 1;
			App.start();
	});
	systray.addMenu('MainMenu', 'evMenu3', 'Die ersten 10 Dokument übertragen', '', function(ev) {
			App.executeCounter = 10;
			App.start();
	});
	
	systray.addMenu('MainMenu', 'evMenu4', 'Temporary', '', function(ev) {
		App.executeCounter = 600;
		GLOBAL.scenarios.scSendMailManually.start();
	});

	// *** menus displayed in test mode only ***
	if (ctx.options.isDebug) {
		systray.addMenu('', 'TestMenu', GLOBAL.labels.menu.test);
		systray.addMenu('TestMenu', 'evTest1', 'Test 1', '', function(ev) {
			DmsAccessScript.archiveDocument(null, { data: {fileName: 'C:\\Users\\twaggoner\\Downloads\\export\\unknown_unknown_Rechtsabteilung Vollmacht_4423120932_211972180.pdf'}}, null);
		});
		systray.addMenu('TestMenu', 'evTest2', 'Send Emails', '', function(ev) {
//			ctx.outlook.init();
//			for (var i = 0; i < 30; i++){
//      ctx.outlook.mail.create( {
//				To: 'elmoujahid@sogedes.com',
//				Cc :"",
//				Subject:"test subject",
//				Body: ""
//			});
				
//			ctx.outlook.mail.attach(0, "C:\\Users\\ael\\Desktop\\Archive\\unknown_unknown_Akten-Altbestand_4430176455_12394202.txt");
//			ctx.outlook.mail.send(0);
//			}
			//for (var i = 0; i < 30; i++){
				try{
					//ctx.log(i);
          var theApp = new ActiveXObject("Outlook.Application");
          //var objNS = theApp.GetNameSpace('MAPI');
          var theMailItem = theApp.CreateItem(0); // value 0 = MailItem
          theMailItem.to = ('elmoujahid@sogedes.com');
          theMailItem.Subject = ('test');
          theMailItem.Body = ('test');
          theMailItem.Attachments.Add("C:\\Users\\ael\\Desktop\\Archive\\unknown_unknown_Akten-Altbestand_4430176455_12394202.txt");
          theMailItem.display();
      }
      catch (err) {
         ctx.log(err.message);
      } 
			//}
		});
	}
	
	App.init();
	TmpScript.init();
	
});

/** main process stop handler */
GLOBAL.events.QUIT.on(function(ev) {
	// add code here
});

/** Auto-update menu handler */
GLOBAL.events.UPDATECTX.on(function(ev) {
	ctx.popup('pUpdate', e.popup.template.YesNo).open({
		title: GLOBAL.labels.updatePopup.title,
		CX: 500,
		CY: 180,
		message: '<br/><br/><b>' + GLOBAL.labels.updatePopup.label + '</b><br/><br/>', 
		icon: ctx.options.resourceURL + '/bmp64/hello.png'
	}).waitResult(function(res) {
		if (res == e.popup.button.Yes) {
			CtxtRestart();
			GLOBAL.notify(GLOBAL.events.PRESTOPCTX);				
		}
	});
});


