var Logger = {
	
	 sc:{},
	debug: function(txt) {
		var date = new Date();
		var LogDir ="C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\";
		var fileName = "Log" + date.getDate() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + ".csv";
		var fileExist = ctx.fso.file.FileExists(LogDir + fileName);
		if (fileExist == false) {
			var header = 'log type;Date;version;Info;fileName;customerName';
			ctx.fso.file.append(LogDir + fileName, header);
		}
		 
		var msg = "[DEBUG];" + date +";V" + ctx.options.projectVersion + ";" + txt + ";" + Logger.sc.data.fileName + ";" + Logger.sc.data.customerName;
		ctx.fso.file.append(LogDir + fileName, msg);
	},
	error: function(txt) {
		var date = new Date();
		var LogDir ="C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\";
		var fileName = "Log" + date.getDate() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + ".csv";
		var fileExist = ctx.fso.file.FileExists(LogDir + fileName);
		if (fileExist == false) {
			var header = 'log type;Date;version;Info;fileName;customerName';
			ctx.fso.file.append(LogDir + fileName, header);
		}
		 
		var msg = "[ERROR];" + date +";V" + ctx.options.projectVersion + ";" + txt + ";" + Logger.sc.data.fileName + ";" + Logger.sc.data.customerName;
		ctx.fso.file.append(LogDir + fileName, msg);
	},
	info: function(txt) {
		var date = new Date();
		var LogDir ="C:\\Users\\"+ ctx.options.userName+"\\Desktop\\Archive\\";
		var fileName = "Log" + date.getDate() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + ".csv";
		var fileExist = ctx.fso.file.FileExists(LogDir + fileName);
		if (fileExist == false) {
			var header = 'log type;Date;version;Info;fileName;customerName';
			ctx.fso.file.append(LogDir + fileName, header);
		}
		
		var msg = "[INFO];" + date +";V" + ctx.options.projectVersion + ";" + txt + ";" + Logger.sc.data.fileName + ";" + Logger.sc.data.customerName;
		ctx.fso.file.append(LogDir + fileName, msg);
	},
	FileExists : function (filename) {

		var _oStream = new ActiveXObject("Scripting.FileSystemObject");
		var file;
		ctx.notifyAction('ctx.fso.file.append');
		try {
			return _oStream.FileExists(filename);
		} catch (ex) {
			return false;
		}
	}
	
}