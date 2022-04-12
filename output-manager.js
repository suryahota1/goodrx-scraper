const Excel = require('exceljs');
const path = require('path');
const nodemailer = require('nodemailer');
const PropertiesReader = require('properties-reader');
const ErrorHandler = require('./error-handler');
const { OutputError } = require('./ErrorTypes');
const Constants = require('./constants');

const OutputManager = (() => {
    // const propPath = process.argv[2];
    // const properties = PropertiesReader(propPath);

    let opFilePath;
    let opFileNameVal;
    let logFilePath;
    let logFileNameVal;

    let workBook;
    let workSheet;
    let logFileWorkBook;
    let logFileWorkSheet;
    let mailTransporter;

    const pharmaKeys = [];

    function createMailTransporter ( properties ) {
        mailTransporter = nodemailer.createTransport({
            host: properties.get("mail.server.host"),
            port: properties.get("mail.server.port"),
            secure: true,
            auth: {
                user: properties.get("mail.server.auth.username"),
                pass: properties.get("mail.server.auth.password"),
            }
        });
    }

    function sendEmail ( sCount, fCount, ipFileName, properties ) {
        return new Promise(( resolve, reject ) => {
            if ( !mailTransporter ) {
                createMailTransporter(properties);
            }
            const mailConfigurations = {
                from: properties.get("mail.from.address"),
                to: properties.get("mail.to.addresses"),
                subject: "Scraping completed for " + ipFileName,
                html: `
                    <h2>
                        Hi,
                    </h2> 
                    <h5> 
                        Total number of records scraped: <b>${sCount + fCount}</b>
                    </h5>
                    <h5> 
                        Success count: <b>${sCount}</b>
                    </h5>
                    <h5> 
                        Fail count: <b>${fCount}</b>
                    </h5>
                `
            };
            mailTransporter.sendMail(mailConfigurations, ( err, info ) => {
                //Logger.log("sendMail err", err);
                //Logger.log("sendMail info", info);
                if ( err ) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    function getKeyVal ( str ) {
        if ( str ) return str.trim().toLowerCase().replace(/\s/g, "_");
        return str;
    }

    function getIpRowsAsPharmaCols ( ipRows ) {
        const colData = {};
        let recordCount = 0;
        if ( ipRows.results && ipRows.results.length > 0 ) {
            for ( let i = 0; i < ipRows.results.length; i++ ) {
                const dp = ipRows.results[i]["pharmaName"];
                const key = getKeyVal(dp);
                const priceKey = key + "_price";
                const typeKey = key + "_type";
    
                if ( pharmaKeys.indexOf(priceKey) >= 0 ) {
                    recordCount++;
                }
    
                colData[priceKey] = ipRows.results[i]["price"];
                colData[typeKey] = ipRows.results[i]["type"];
    
            }
        }

        colData["independent_pharmacy_min"] = ipRows["idpMin"];
        colData["independent_pharmacy_max"] = ipRows["idpMax"];

        return { colData, recordCount };
    }

    async function appendData ( ipRows, ipData, actualFilters ) {
        const { colData, recordCount } = getIpRowsAsPharmaCols(ipRows);

        const dosageVal = ipData["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["dosage"] ? actualFilters["dosage"] : ipData["dosage"]) : (ipData["dosage"] ? ipData["dosage"] : actualFilters["dosage"]);
        const formVal = ipData["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["form"] ? actualFilters["form"] : ipData["form"]) : (ipData["form"] ? ipData["form"] : actualFilters["form"]);
        const quantityVal = ipData["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["quantity"] ? actualFilters["quantity"] : ipData["quantity"]) : (ipData["quantity"] ? ipData["quantity"] : actualFilters["quantity"]);
        const brandVal = ipData["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["label"] ? actualFilters["label"] : ipData["genericOrBrand"]) : (ipData["genericOrBrand"]  ? ipData["genericOrBrand"] : actualFilters["label"]);

        const rowRef = {
            "id": ipData["id"],
            "dosage": dosageVal,
            "form": formVal,
            "label": ipData["label"],
            "quantity": quantityVal,
            "genericOrBrand": brandVal,
            "zipCode": ipData["zipCode"] ? ipData["zipCode"] : "",
            ...colData
        };
        workSheet.addRow(rowRef);

        await workBook.xlsx.writeFile(opFilePath);
        return recordCount;
    }

    function createPharmaCols ( pharmacies ) {
        const cols = [];
        for ( let i = 0; i < pharmacies.length; i++ ) {
            const dp = pharmacies[i]["displayName"];
            const key = getKeyVal(dp);
            pharmaKeys.push(key + "_price");
            cols.push(
                { header: dp + "-Price", key: key + "_price", width: 40 },
                { header: dp + "-Price-Type", key: key + "_type", width: 40 }
            );
        }

        return cols;
    }

    async function saveData ( ipRows, ipData, actualFilters, status ) {
        try {
            const recordCount = await appendData(ipRows, ipData, actualFilters);
            Logger.log("saveData status", status);
            let errCode = "N/A";
            let errMsg = "N/A";
            if ( status === "na" ) {
                errCode = ErrorHandler.CODE.DRUG_DISCONTINUED;
                errMsg = ErrorHandler.MESSAGE.DRUG_DISCONTINUED;
            } else if ( status === "noData" ) {
                errCode = ErrorHandler.CODE.DRUG_PRICE_NOT_AVAILABLE;
                errMsg = ErrorHandler.MESSAGE.DRUG_PRICE_NOT_AVAILABLE;
            }
            await saveLogData(ipData, {
                "noOfResults": recordCount && recordCount >= 0 ? recordCount : ipRows.results ? ipRows.results.length : 0,
                "successOrFail": "Success",
                "errorCode": errCode,
                "errorMessage": errMsg
            }, actualFilters);
        } catch ( e ) {
            Logger.error("saveData e", e);
            throw new OutputError("Output file " + opFileNameVal + " is missing during execution, bot will exit.", ErrorHandler.CODE.MISSING_OUTPUT_FILE);
        }
    }

    async function saveLogData ( ipRecord, respData, actualFilters ) {
        const dosageVal = ipRecord["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["dosage"] ? actualFilters["dosage"] : ipRecord["dosage"]) : (ipRecord["dosage"] ? ipRecord["dosage"] : actualFilters["dosage"]);
        const formVal = ipRecord["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["form"] ? actualFilters["form"] : ipRecord["form"]) : (ipRecord["form"] ? ipRecord["form"] : actualFilters["form"]);
        const quantityVal = ipRecord["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["quantity"] ? actualFilters["quantity"] : ipRecord["quantity"]) : (ipRecord["quantity"] ? ipRecord["quantity"] : actualFilters["quantity"]);
        const brandVal = ipRecord["type"] === Constants.ALL_COMBINATIONS ? (actualFilters["label"] ? actualFilters["label"] : ipRecord["genericOrBrand"]) : (ipRecord["genericOrBrand"]  ? ipRecord["genericOrBrand"] : actualFilters["label"]);

        const rowRef = {
            "id": ipRecord["id"],
            "dosage": dosageVal,
            "form": formVal,
            "label": ipRecord["label"],
            "quantity": quantityVal,
            "genericOrBrand": brandVal,
            "zipCode": ipRecord["zipCode"] ? ipRecord["zipCode"] : "",
            "noOfResults": respData["noOfResults"],
            "successOrFail": respData["successOrFail"],
            "errorCode": respData["errorCode"],
            "errorMessage": respData["errorMessage"]
        };
        logFileWorkSheet.addRow(rowRef);

        await logFileWorkBook.xlsx.writeFile(logFilePath);
    }

    async function saveLog ( data, logRef, actualFilters ) {
        try {
            await saveLogData(data, logRef, actualFilters);
        } catch ( e ) {
            throw new OutputError("Log file " + logFileNameVal + " is missing during execution, bot will exit.", ErrorHandler.CODE.MISSING_OUTPUT_FILE);
        }
    }

    async function generateOutputFile ( pharmacies, opFileName, properties ) {
        return new Promise(( resolve, reject ) => {
            const opPath = properties.get("ouput.file.path");
            if ( opPath ) {
                opFilePath = path.join(opPath, opFileName);
            } else {
                opFilePath = path.resolve(__dirname, opFileName);
            }
            workBook = new Excel.Workbook();
            opFileNameVal = opFileName;
            workBook.xlsx.readFile(opFilePath).then(function() {
                // workSheet = workBook.worksheets[0];
                // resolve();
                reject(new OutputError("Output file " + opFileName + " already exists in the given destination folder. Please rename the file and restart the run.", ErrorHandler.CODE.OUTPUT_DIRECTORY_EXISTS));
            }).catch(async ( err ) => {
                workSheet = workBook.addWorksheet("Price");
                workSheet.columns = [
                    { header: "ID", key: "id", width: 10 },
                    { header: "drug_name", key: "label", width: 40 },
                    { header: "brand", key: "genericOrBrand", width: 20 },
                    { header: "drug_type", key: "form", width: 20 },
                    { header: "strength", key: "dosage", width: 20 },
                    { header: "quantity", key: "quantity", width: 20 },
                    { header: "zip_code", key: "zipCode", width: 10 },
                    ...createPharmaCols(pharmacies),
                    { header: "Independent Pharmacy - Min Value", key: "independent_pharmacy_min", width: 10 },
                    { header: "Independent Pharmacy - Max Value", key: "independent_pharmacy_max", width: 10}
                ];
                try {
                    await workBook.xlsx.writeFile(opFilePath);
                    resolve();
                } catch ( e ) {
                    reject(new OutputError("Output file directory path doesn't exist or invalid", ErrorHandler.CODE.INVALID_OUTPUT_DIRECTORY))
                }
            });
        });
    }

    function generateLogFile ( logFileName, properties ) {
        return new Promise(( resolve, reject ) => {
            const logPath = properties.get("output.log.file.path");
            logFileNameVal = logFileName;
            if ( logPath ) {
                logFilePath = path.join(logPath, logFileName);
            } else {
                logFilePath = path.resolve(__dirname, logFileName);
            }
            
            logFileWorkBook = new Excel.Workbook();
            logFileWorkBook.xlsx.readFile(logFilePath).then(async function() {
                reject(new OutputError("Log file " + logFileName + " already exists in the given destination folder. Please rename the file and restart the run.", ErrorHandler.CODE.OUTPUT_DIRECTORY_EXISTS));
            }).catch(async ( err ) => {
                logFileWorkSheet = logFileWorkBook.addWorksheet("Logs");
                logFileWorkSheet.columns = [
                    { header: "ID", key: "id", width: 10 },
                    { header: "drug_name", key: "label", width: 40 },
                    { header: "brand", key: "genericOrBrand", width: 20 },
                    { header: "drug_type", key: "form", width: 20 },
                    { header: "strength", key: "dosage", width: 20 },
                    { header: "quantity", key: "quantity", width: 20 },
                    { header: "zip_code", key: "zipCode", width: 10 },
                    { header: "num_results", key: "noOfResults", width: 20 },
                    { header: "Success/fail", key: "successOrFail", width: 20 },
                    { header: "Error Code", key: "errorCode", width: 20 },
                    { header: "Error Message", key: "errorMessage", width: 20 },
                ];
                try {
                    await logFileWorkBook.xlsx.writeFile(logFilePath);
                    resolve();
                } catch ( e ) {
                    reject(new OutputError("Log file directory path doesn't exist or invalid", ErrorHandler.CODE.INVALID_OUTPUT_DIRECTORY))
                }
            });
        });
    }

    return {
        saveData,
        saveLog,
        generateOutputFile,
        generateLogFile,
        sendEmail
    };
})();

module.exports = OutputManager;
