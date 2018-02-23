
/** main process start handler */
GLOBAL.events.START.on(function (ev) {

	systray.addMenu('', 'MainMenu', GLOBAL.labels.menu.main);
	systray.addMenu('MainMenu', 'evMenu1', 'Siclid Bearbeitung', '', function(ev) {
		
		App.executeCounter = 1000000;
		App.start();
		
	});
	systray.addMenu('MainMenu', 'evMenu2', 'Ratanet Bearbeitung', '', function(ev) {

		App.start2();
		
	});
	// *** menus displayed in test mode only ***
	if (ctx.options.isDebug) {
		systray.addMenu('', 'TestMenu', GLOBAL.labels.menu.test);
		systray.addMenu('TestMenu', 'evTest1', 'Test 1', '', function(ev) {
			// add code here
		});
		systray.addMenu('TestMenu', 'evTest2', 'Test 2', '', function(ev) {
			// add code here
		});
	}
	App.init();
});

/** main process stop handler */
GLOBAL.events.QUIT.on(function(ev) {
	// add code here
});
