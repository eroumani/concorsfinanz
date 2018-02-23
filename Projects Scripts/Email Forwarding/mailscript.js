// Wrapper which does the sending of an email via outlook

var MailScript = {
	
	to: "",
	subject: "",
	body: "",
	
	init : function() {
		
		MailScript.to = "CFGIrrlaeufer@commerzbank.com";
		//MailScript.to = "elmoujahid@sogedes.com"; 
		MailScript.subject = "CoBa Documents from Consors Finance"; // Fill in template here
		
		GLOBAL.step({ stSendMail: MailScript.sendMail });
	},
	
	//Send the mail
	sendMail : function(ev, sc, st){
		st.disableTimeout();
		try {
			Logger.info("create mail");
			var theApp = new ActiveXObject("Outlook.Application");
			//var objNS = theApp.GetNameSpace('MAPI');
			var theMailItem = theApp.CreateItem(0); // value 0 = MailItem
			theMailItem.to = (MailScript.to);
			theMailItem.Subject = (MailScript.subject + "_" + sc.data.docDate + "_" + sc.data.customerName);
			theMailItem.Body = (MailScript.body);
			theMailItem.Attachments.Add(sc.data.fileName);
			theMailItem.display();
			OutlookApp.pNewMail.wait(function () {
				OutlookApp.pNewMail.btSenden.click(true);

				ctx.log("click the btn senden");
				OutlookApp.pNewMail.waitClose(function () {
					sc.data.progress = sc.data.progress + "<br/>Message sent to " + MailScript.to;
					showPopup("Weiter", sc.data.progress, e.popup.icon32.info, e.popup.color.Blue);
					sc.endStep();//stArchiveDocument);
				});

			});
			}
			catch (err) {
				ctx.log(err.message);
				Logger.error("Error creating mail: " + err);
			}
		////////////////////
		
		/*OutlookApp.pMain.btNewMail.click();
		Logger.info("click the btn btNewMail");
			ctx.log("Wait pNewMail to Load");
		OutlookApp.pNewMail.wait( function() {
				ctx.log("wait 1s");
			Logger.info("pNewMail Loaded , wait 1s");
			//Logger.debug("init");
	
			ctx.wait ( function () {
				Logger.info("edSubject exists "+OutlookApp.pNewMail.edSubject.exist() + " edTo exists "+OutlookApp.pNewMail.edTo.exist() + " edTo btAttachment "+OutlookApp.pNewMail.btAttachment.exist());
				OutlookApp.pNewMail.activate();
				OutlookApp.pNewMail.edSubject.setFocus();
				OutlookApp.pNewMail.edSubject.set(MailScript.subject+ "_" + sc.data.docDate + "_" + sc.data.customerName);
				//OutlookApp.pNewMail.edSubject.keyStroke(e.key.Tab);
				OutlookApp.pNewMail.edTo.setFocus();
				OutlookApp.pNewMail.edTo.set(MailScript.to);
				OutlookApp.pNewMail.btAttachment.click(true);
				
				ctx.wait(function() {
				
					OutlookApp.pNewMail.activate();
				}, 1000);
				Logger.debug("wait Load pInsertDocument");
				OutlookApp.pInsertDocument.wait( function () {
					ctx.log("add path in edfilename "+sc.data.fileName);
					var btn = OutlookApp.pInsertDocument.btInsert;
					OutlookApp.pInsertDocument.edFileName.set(sc.data.fileName);
					try {
						
						//btn.click(true);
							OutlookApp.pInsertDocument.btInsert.keyStroke(e.key.Enter);
							Logger.debug("Document is inserted");
						ctx.log("click the btn insert");
					} catch (ex) {
						ctx.log("Error sending mail: " + ex);
						Logger.debug("Error sending mail: " + ex);
						throw "Error sending mail: " + ex;
					}

					OutlookApp.pInsertDocument.waitClose( function() {
						ctx.wait(function() {
							OutlookApp.pNewMail.btSenden.click(true);
						
							ctx.log("click the btn senden");
							OutlookApp.pNewMail.waitClose( function () {
								sc.data.progress = sc.data.progress + "<br/>Message sent to " + MailScript.to;
								showPopup("Weiter",sc.data.progress , e.popup.icon32.info, e.popup.color.Blue);
								sc.endStep();//stArchiveDocument);
							});
						}, 1000);
					});
				});
			
			}, 1000);
			
		});*/
		
	}
	
}