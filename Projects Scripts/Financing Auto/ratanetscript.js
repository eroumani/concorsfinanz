var RataNetScript = {
	
	CountAnfrNum :0,
	
	init: function (){
		GLOBAL.step({ stSearchAnfrRatanet: RataNetScript.SearchAnfrRatanet});
		GLOBAL.step({ stClickETURatanet: RataNetScript.ClickETURatanet});
		GLOBAL.step({ stClickDIRRatanet: RataNetScript.ClickDIRRatanet});
		GLOBAL.step({ stCheckDetails: RataNetScript.CheckDetails});
	},
	
	SearchAnfrRatanet: function(ev, sc, st) {
		st.disableTimeout();
		var data =sc.data ;
		RataNetApp.pListe.wait(function(){
			RataNetApp.pListe.oAnfrNum.set(data.AnfrNrTab[0]);
			RataNetApp.pListe.oStatus.set("ALL");
			//RataNetApp.pListe.oSuchen.click();
			ctx.wait(function(){
			//RataNetApp.pListe.events.LOAD.on(function(){
				if (RataNetApp.pListe.oContract.exist()) {
					RatLog(data.AnfrNrTab[0]," in Ratanet gefunden");
					RataNetApp.pListe.oContract.click();
					RataNetApp.pDetails.wait(function(){
						sc.endStep(GLOBAL.steps.stCheckDetails);
					});
				}	
				else{
					sc.data.AnfrNrTab[2] = "Antrag nicht gefunden";
					RatLog(data.AnfrNrTab[0]," in Ratanet nicht gefunden");
					sc.endStep(GLOBAL.steps.stToNext);
				}
			},2000);
			//});	
		});	

	},
	
	CheckDetails: function (ev, sc, st) {
		var data =sc.data ;
		
		if(RataNetApp.pDetails.oFORM.get().indexOf("BETRUG")>-1){
			RatLog(data.AnfrNrTab[0]," Betrug case");
			RataNetApp.pToolbar.execScript("document.getElementsByTagName('a')[3].click();");
			RataNetApp.pDetails.wait(function(){
				sc.endStep(GLOBAL.steps.stGetNrDMS);
			});
		}
		else{
			if (RataNetApp.pDetails.oKode.get()=="REF" || RataNetApp.pDetails.oKode.get()=="SS"){
				sc.data.AnfrNrTab[2]="SS/REF";
				RataNetApp.pToolbar.execScript("document.getElementsByTagName('a')[3].click();");
				sc.endStep(GLOBAL.steps.stChangeBemDMS);
			}
			else{
				if (RataNetApp.pDetails.oETUDEEXPRESS.exist()){ 
					RataNetApp.pDetails.oNewNotice.set("automatische Buchung");
					RataNetApp.pDetails.btAddNewNotice.click();
					RataNetApp.pDetails2.wait(function(){
						RatLog(data.AnfrNrTab[0]," automatische Buchung hinzugefügt");
						sc.endStep(GLOBAL.steps.stClickETURatanet);
					});	
				}
				else {
					RatLog(data.AnfrNrTab[0]," hat keine Etude Express");
					RataNetApp.pDetails.btUNLK.click();
					RataNetApp.pListe2.wait(function(){
						//RataNetApp.pListe2.oSuchen.click(); 
						RataNetApp.pToolbar.execScript("document.getElementsByTagName('a')[3].click();");
						sc.data.AnfrNrTab[2] = "1er";
						RatLog(data.AnfrNrTab[0]," UNLCK geklickt");
						sc.endStep(GLOBAL.steps.stChangeBemDMS);
					});	
				}		
			}	
		}	
		
		
		
	},
	
	
	ClickETURatanet: function(ev, sc, st) {
		//To test if already clicked
		RatLog(sc.data.AnfrNrTab[0]," Step ETU entered");
		if (RataNetApp.pDetails2.btETU.html().indexOf("disabled")==-1){
			ctx.wait( function() {
				RatLog(sc.data.AnfrNrTab[0]," wait 500 enteredd");
				RatanetPopup.pAlert.events.LOAD.on(function(){
					RatLog(sc.data.AnfrNrTab[0]," pAlert loaded");
					RatanetPopup.pAlert.btOK.click();
					RataNetApp.pListe2.wait(function(){	
						RatLog(sc.data.AnfrNrTab[0]," ETU geklickt");
						RataNetApp.pListe2.oAnfrNum.set(sc.data.AnfrNrTab[0]);
						RataNetApp.pListe2.oStatus.set("ALL");
						//RataNetApp.pListe2.oSuchen.click();
						RataNetApp.pListe3.wait(function(){
							RatLog(sc.data.AnfrNrTab[0]," pListe3 loaded after second search");
							RataNetApp.pListe3.oContract.click();											
							RataNetApp.pDetails.wait(function(){	
								sc.endStep(GLOBAL.steps.stClickDIRRatanet);
							});		
						});	
					});	
				});	
			},500);	
			try {
				RataNetApp.pDetails2.btETU.click()
			} catch(ex) {}
		}
		else{
			RatLog(sc.data.AnfrNrTab[0]," ETU geklickt bevor");
			RataNetApp.pDetails2.btUNLK.click();
			RataNetApp.pListe2.wait(function(){	
				RatLog(sc.data.AnfrNrTab[0]," pliste2 loaded");
				RataNetApp.pListe2.oAnfrNum.set(sc.data.AnfrNrTab[0]);
				RataNetApp.pListe2.oStatus.set("ALL");
				//RataNetApp.pListe2.oSuchen.click();
				RataNetApp.pListe3.wait(function(){
					RatLog(sc.data.AnfrNrTab[0]," pliste3 loaded");
					RataNetApp.pListe3.oContract.click();											
					RataNetApp.pDetails.wait(function(){	
						sc.endStep(GLOBAL.steps.stClickDIRRatanet);
					});		
				});	
			});	

		} 
	},
	
	
	
	ClickDIRRatanet: function(ev, sc, st) {	
		RatLog(sc.data.AnfrNrTab[0]," Step DIR entered");
		if(RataNetApp.pDetails.btDIR.html().indexOf("disabled")==-1){
			ctx.wait( function() {
				RatLog(sc.data.AnfrNrTab[0]," wait 500 entered");
				RatanetPopup.pAlert2.events.LOAD.on(function(){
					RatLog(sc.data.AnfrNrTab[0]," popup2 loaded");
					RatanetPopup.pAlert2.btOK.click();
					RataNetApp.pListe2.wait(function(){
						RatLog(sc.data.AnfrNrTab[0]," DIR geklickt");
						//RataNetApp.pListe2.oSuchen.click();
						//RataNetApp.pToolbar.execScript("document.querySelector('body > table > tbody > tr:nth-child(8) > td > a').click();");
						RataNetApp.pToolbar.execScript("document.getElementsByTagName('a')[3].click();");
						sc.data.AnfrNrTab[2]="Bearb. Ratanet abgeschlossen";
						sc.endStep(GLOBAL.steps.stChangeBemDMS);
					});	
				});	
		  },500);
			try {
				RataNetApp.pDetails.btDIR.click();
			} 
			catch(ex) {}
		}
		else {
			RatLog(sc.data.AnfrNrTab[0]," DIR geklickt bevor");
			RataNetApp.pDetails.btUNLK.click();
			RataNetApp.pListe2.wait(function(){
				//RataNetApp.pListe2.oSuchen.click();
				RataNetApp.pToolbar.execScript("document.getElementsByTagName('a')[3].click();");
				sc.data.AnfrNrTab[2]="Bearb. Ratanet abgeschlossen";
				sc.endStep(GLOBAL.steps.stChangeBemDMS);
			});	
		}
	}						

}