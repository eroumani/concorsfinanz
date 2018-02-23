
// *** Choose language (en|fr|de) ***
GLOBAL.labels.setLanguage(e.language.English);

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
			+  "<b>Version:  "+ ctx.options.projectVersion+"</b><br/>" 
			
			//+ GLOBAL.labels.aboutPopup.projectVersion + ": <b>" + ctx.options.projectVersion + "</b>&nbsp; (<b>" + ctx.options.projectDate + "</b>)<br/>" 
			+ "Release" + ":  " + ctx.options.projectDate+ "<br/>" 
			+  "Siclid Robot Version:  "+ ctx.options.projectVersion+"<br/>" 
			+ "Contextor Robot 2017<br/>Consors Finanz,BNP Parisbas" + "<br/>" 
		/*
			+ GLOBAL.labels.aboutPopup.productVersion + ": <b>" + ctx.options.productVersion + "</b><br/>" 
			+ GLOBAL.labels.aboutPopup.frameworkVersion + ": <b>" + ctx.options.frameworkVersion + "</b><br/>";
		if (ctx.options.productVersions && ctx.options.productVersions['UnifiedStudio'])
			label += GLOBAL.labels.aboutPopup.studioVersion + ": <b>" + ctx.options.productVersions['UnifiedStudio'] + "</b><br/>" 
		if (ctx.options.env != e.env.prod)
			label += GLOBAL.labels.aboutPopup.environment + ": <b>" + GLOBAL.labels.env[ctx.options.env] + "</b><br/>";
		*/
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

	systray.loadImage('ICON2', 'FILE', ctx.options.resourceURL + '/bmp/record.png');
	/** Diagnostic */
	ctx.regHotKey(e.key.Ctrl + e.key.Shift + 'D', GLOBAL.events.evShowDiagnostic);	// shortcut Ctrl+Shift+D to display diagnostic
	systray.addMenu('', 'evReportBug', GLOBAL.labels.menu.reportIncident + ' (Ctrl+Shift+D)', 'ICON2', function(ev) {
		GLOBAL.notify(GLOBAL.events.evShowDiagnostic);
	});

	/** Trace recorder */
	ctx.regHotKey(e.key.Ctrl + e.key.Shift + 'R', GLOBAL.events.evShowDiagRecorder);  // shortcut Ctrl+Shift+R to display recorder
	systray.addMenu('', 'evRecordTraces', GLOBAL.labels.menu.recordTraces + ' (Ctrl+Shift+R)', 'ICON2', function(ev) {
		GLOBAL.notify(GLOBAL.events.evShowDiagRecorder);
	});
});

/** Auto-update menu handler */
GLOBAL.events.UPDATECTX.on(function(ev) {
	if (ctx.options.updateConfirmation) {
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
	} else {
		CtxtRestart();
		GLOBAL.notify(GLOBAL.events.PRESTOPCTX);				
	}
});


