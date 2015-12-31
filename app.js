/**
 * Created by Vignesh on 12/31/15.
 */

var AdmZip = require('adm-zip'),
    fs = require('fs'),
    baby = require("babyparse"),
    fstream = require('fstream');

var zipFile = './files/sample.zip',
    csvFile = './output/sample.CSV',
    unzippedFilePath = './output';

/**
 *
 * CSV TO JSON Object helps to unzip file and convert those files format
 *
 * **/
var csvToJson = {

    zipFile : "",
    csvFile : "",
    unzippedFilePath : "",
    processStartTime : "",
    processStatus : true,

    startProcess : function (zipFile, csvFile, unzippedFilePath) {
        csvToJson.zipFile = zipFile; // Zip file belong file path
        csvToJson.csvFile = csvFile; // CSV File belong file path
        csvToJson.unzippedFilePath = unzippedFilePath; // Unizipped file path
        csvToJson.processStartTime = new Date().getTime(); // Process Start Time
        csvToJson.processStatus = true; // Process status
        csvToJson.unzipProcess();
    },

    // Set the Process Start Time
    setProcessStartTime : function () {
        this.processStartTime = new Date().getTime();
    },

    // Track console log here with parameter of process message.
    trackLog : function (message) {
        console.log(message);
    },

    // Format log message here with help of parameters type and message.
    formatLog : function ( type, message ) {
        switch(type) {
            case "info" :
                csvToJson.trackLog(type + " : " + message);
                break;
            case "warn" :
                csvToJson.trackLog(type + " : " + message);
                break;
            case "error" :
                csvToJson.trackLog(type + " : " + message);
                break;
        }
    },

    // Calculate milleseconds differnece between start time and current time.
    calculateTimeDifference : function (startTime) {
        return  new Date().getTime() - startTime;
    },

    // Unzip Process helps to unzip the given file.
    unzipProcess : function() {
        csvToJson.formatLog( "info", "Trying to unzip." );
        try {
            csvToJson.setProcessStartTime();
            stats = fs.lstatSync(csvToJson.zipFile);
            // Check weather file given file is directory or not!!
            if (!stats.isDirectory()) {
                zip = new AdmZip(csvToJson.zipFile);
                zipEntries = zip.getEntries();
                zip.extractAllTo(/*target path*/ csvToJson.unzippedFilePath, /*overwrite*/true);
                var diff = csvToJson.calculateTimeDifference(csvToJson.processStartTime);
                csvToJson.formatLog( "info", "For file unzip time taken is " +diff+" milliseconds." );
                csvToJson.parseCSVtoJSON(csvToJson.csvFile);

            }
        } catch( except ) {
            console.log( 'Error occered whil unzip file ', except );
        }
    },

    // Parse CSV file to JSON using Baby Parse and customize column headers.
    parseCSVtoJSON : function( csvFile ) {
        csvstats = fs.lstatSync(csvFile);
        // Is it a directory?
        if (!csvstats.isDirectory()) {
            csvToJson.formatLog( "info", "Parsing the CSV..." );
            csvToJson.setProcessStartTime();
            try {
                var file = fs.readFileSync(csvFile, {encoding: "UTF-8"});
                var count = 0;

                // command to parse CSV file
                baby.parse(file, {
                    delimiter: "",	// auto-detect
                    newline: "",	// auto-detect
                    header: true,
                    dynamicTyping: false,
                    skipEmptyLines: true,
                    fastMode: true,
                    step: function(row) {  	// called after each row, used for large data
                       // console.log(JSON.stringify(row.data));
                        count++;
                    },
                    complete: function() {
                        csvToJson.formatLog( "info", "Parsing complete.");
                        //csvToJson.formatLog( "info", "File name:"+csvFile );
                        //csvToJson.formatLog( "info", "Row Count: "+count );
                        var diff = csvToJson.calculateTimeDifference(csvToJson.processStartTime);
                        csvToJson.formatLog( "info", "For Parsing CSV to JSOn time taken is "+diff+" milliseconds." );
                    }
                });
            } catch ( err ) {
                console.log( 'Error occered whil unzip file ', err );
            }
        }
    }
};


csvToJson.startProcess(zipFile, csvFile, unzippedFilePath);
