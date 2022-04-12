const Excel = require('exceljs');
const path = require('path');
const Constants = require('./constants');
const PropertiesReader = require('properties-reader');
const ErrorHandler = require('./error-handler');

const InputManager = (() => {
    let properties;
    let proxyHost;
    let proxyPort;
    let filePath;
    let zipCodeVal;
    let sheetName;
    let pharmaDictionaryFilePath;
    let ipFileName;
    let logFileName;
    let outputFileName;
    let startRowVal;
    let endRowVal;
    let filterMap = {};
    let baseDestUrl;

    function checkConfigFile () {
        let propPath;
        try {
            propPath = process.argv[2];
            // console.log("process.argv", process.argv);
            if ( !propPath ) {
                propPath = path.resolve("configs/bot.properties");
            }
            properties = PropertiesReader(propPath);
            return properties.get("log.file.path");
        } catch ( e ) {
            throw new Error("Missing " + propPath + " config file");
        }
    }

    function validateData () {
        proxyHost = properties.get("proxy.host");
        proxyPort = properties.get("proxy.port");
        if ( !proxyHost || !proxyPort ) {
            throw new Error("Proxy configurations missing");
        }

        filePath = properties.get("input.file.path");
        if ( !filePath ) {
            throw new Error("Input file path is missing");
        }
        const acPath = path.resolve(filePath);
        const nmPath = path.normalize(filePath);

        filePath = filePath.split("/");
        ipFileName = filePath[filePath.length - 1];

        const ipFormatMatch = ipFileName.match(new RegExp(properties.get("system.input.file.format.expression"), "g"), "g");
        if ( !ipFormatMatch || ipFormatMatch.length === 0 ) {
            throw new Error("Incorrect input file name format. It should match the format Input_TARGETPORTAL_ZIPCODE_MMDDYYYY.xlsx");
        }

        zipCodeVal = filePath[filePath.length - 1].split("_")[2];
        logFileName = filePath[filePath.length - 1].split("_");
        logFileName[0] = "Log";
        logFileName = logFileName.join("_");

        outputFileName = filePath[filePath.length - 1].split("_");
        outputFileName[0] = "Output";
        outputFileName = outputFileName.join("_");

        filePath = acPath

        pharmaDictionaryFilePath = properties.get("pharmacy.dictionary.file.path");
        if ( !pharmaDictionaryFilePath ) {
            throw new Error("Pharmacy dictionary file path is missing");
        }

        const phacPath = path.resolve(pharmaDictionaryFilePath);
        const phnmPath = path.normalize(pharmaDictionaryFilePath);

        pharmaDictionaryFilePath = pharmaDictionaryFilePath.split("/");
        pharmaDictionaryFilePath = phacPath;

        sheetName = properties.get("input.file.sheet.name");
        if ( !sheetName ) {
            throw new Error("Input file sheet name missing");
        }

        startRowVal = properties.get("start.row");
        endRowVal = properties.get("end.row");

        if ( ( startRowVal >= 0 && !endRowVal ) || ( endRowVal >= 0 && !startRowVal )) {
            throw new Error(`Start row or End row value is missing`);
        }else if ((startRowVal <= 1 || endRowVal <= 1) || (startRowVal > endRowVal)) {
            throw new Error(`Invalid Start row (${startRowVal}) or End row (${endRowVal}) value is invalid`);
        }  
        baseDestUrl = properties.get("system.dest.endpoint.url");
        return true;
    }

    function getFilterColIndexes ( sheetRef ) {
        return new Promise(( resolve, reject ) => {
            const filterTypeText = "filter_type";
            const displayNameText = "filter_display_value";
            const queryText = "filter_query_value";

            const colMap = {};

            sheetRef.getRow(1).eachCell(function(cell, colNumber) {
                if ( cell.value === filterTypeText ) {
                    colMap["filterType"] = colNumber;
                } else if ( cell.value === displayNameText ) {
                    colMap["displayName"] = colNumber;
                } else if ( cell.value === queryText ) {
                    colMap["queryName"] = colNumber;
                }
            });
            resolve(colMap);
        });
    }

    function getKeyVal ( str ) {
        if ( str ) return str.trim().toLowerCase().replace(/\s/g, "-");
    }

    function prepareFilterMap () {
        return new Promise(( resolve, reject ) => {
            const wb = new Excel.Workbook();
            const filterFilePath = properties.get("filter.map.dictionary.file");
            wb.xlsx.readFile(filterFilePath).then(async function () {
                try {
                    const sheetName = properties.get("filter.map.dictionary.file.sheet.name");
                    const sh = wb.getWorksheet(sheetName);
                    if ( !sh ) {
                        reject(new Error("Can't find sheet named " + sheetName + " in the given filter mapping file"));
                        return;
                    }
                    const colMap = await getFilterColIndexes(sh);
                    // console.log("getFilterColIndexes colMap", colMap);
                    if ( colMap["filterType"] && colMap["displayName"] && colMap["queryName"] ) {
                        const rowCount = sh.rowCount;
                        for ( let i = 2; i <= rowCount; i++ ) {
                            const filterVal = sh.getRow(i).getCell(colMap["filterType"]).value;
                            const dispVal = sh.getRow(i).getCell(colMap["displayName"]).value;
                            const queryVal = sh.getRow(i).getCell(colMap["queryName"]).value;
                            if ( !filterVal || !dispVal || !queryVal ) {
                                break;
                            } else {
                                const key = getKeyVal(filterVal + "" + dispVal);
                                filterMap[key] = queryVal;
                            }
                        }
                        resolve(true);
                    } else {
                        reject(new Error("Filter Data not available"));
                    }
                } catch ( e ) {
                    reject(e);
                }
            }).catch(( err ) => {
                reject(new Error("Missing Filter mapping file " + filterFilePath));
            });
        });
    }
    
    function getPharmacyDetails () {
        return new Promise(( resolve, reject ) => {
            const pharmacies = [];
            const wb = new Excel.Workbook();
            wb.xlsx.readFile(pharmaDictionaryFilePath).then( function () {
                try {
                    const sheetName = properties.get("pharmacy.dictionary.file.sheet.name");
                    const sh = wb.getWorksheet(sheetName);
                    if ( !sh ) {
                        reject(new Error("Can't find sheet named " + sheetName + " in the given pharmacy file"));
                        return;
                    }
                    const rowCount = sh.rowCount;
                    for ( let i = 2; i <= rowCount; i++ ) {
                        const val = sh.getRow(i).getCell(1).value;
                        if ( val ) {
                            pharmacies.push({
                                "displayName": val
                            });
                        }
                    }
                    if ( pharmacies.length === 0 ) {
                        reject(new Error("Pharmacy data not available"));
                        return;
                    }
                    resolve(pharmacies);
                } catch ( e ) {
                    reject(e);
                }
            }).catch(( err ) => {
                reject(new Error("Missing Phamacy Dictionary file " + pharmaDictionaryFilePath));
            });
        });
    }

    function getCellPositions ( sheetRef ) {
        const labelText = "drug_name";
        const dosageText = "strength";
        const formText = "drug_type";
        const quantityText = "quantity";
        const genericOrBrandText = "brand";
        const zipCode = "zip_code";
        const idText = "ID";

        const colMap = {};

        return new Promise(( resolve, reject ) => {
            sheetRef.getRow(1).eachCell(function(cell, colNumber) {
                if ( cell.value === labelText ) {
                    colMap["label"] = colNumber;
                } else if ( cell.value === dosageText ) {
                    colMap["dosage"] = colNumber;
                } else if ( cell.value === formText ) {
                    colMap["form"] = colNumber;
                } else if ( cell.value === quantityText ) {
                    colMap["quantity"] = colNumber;
                } else if ( cell.value === genericOrBrandText ) {
                    colMap["type"] = colNumber;
                } else if ( cell.value === zipCode ) {
                    colMap["zipCode"] = colNumber;
                } else if ( cell.value === idText ) {
                    colMap["id"] = colNumber;
                }
            });
            resolve(colMap);
        });
    }

    function checkIfWildcard ( val ) {
        if ( val ) return val.match(new RegExp(properties.get("system.wildcard.match.text"), "g"), "g")
    }

    function prepareData () {
        return new Promise(( resolve, reject ) => {
            var wb = new Excel.Workbook();
            wb.xlsx.readFile(filePath).then( function () {
                var sh = wb.getWorksheet(sheetName);
                if ( !sh ) {
                    reject(new Error("Can't find sheet named " + sheetName + " in the given input file"));
                    return;
                }
                getCellPositions(sh).then(( resp ) => {
                    const startRow = properties.get("start.row") ? properties.get("start.row") : 2;
                    const endRow = properties.get("end.row") ? properties.get("end.row") : sh.rowCount;
                    const ipData = [];
                    if ( !resp["label"] || !resp["id"] ) {
                        reject(new Error(ErrorHandler.MESSAGE.COLUMN_MISMATCH));
                    }
                    for ( i = startRow; i <= endRow; i++ ) {
                        let isDosageWildcard = false;
                        let isFormWildcard = false;
                        let isBrandWildcard = false;
                        let isQuantityWildcard = false;

                        const label = resp["label"] && sh.getRow(i).getCell(resp["label"]).value ? sh.getRow(i).getCell(resp["label"]).value : "";
                        const idVal = ( resp["id"] && sh.getRow(i).getCell(resp["id"]).value ) ?  sh.getRow(i).getCell(resp["id"]).value.result ? sh.getRow(i).getCell(resp["id"]).value.result : sh.getRow(i).getCell(resp["id"]).value : "";
                        let genericOrBrand = ( resp["type"] && sh.getRow(i).getCell(resp["type"]).value ) ?  sh.getRow(i).getCell(resp["type"]).value.result ? sh.getRow(i).getCell(resp["type"]).value.result : sh.getRow(i).getCell(resp["type"]).value : "";

                        if ( !label || !idVal ) {
                            break;
                        }

                        const dosage = ( resp["dosage"] && sh.getRow(i).getCell(resp["dosage"]).value ) ? sh.getRow(i).getCell(resp["dosage"]).value.result ? sh.getRow(i).getCell(resp["dosage"]).value.result : sh.getRow(i).getCell(resp["dosage"]).value  : "";
                        const form = ( resp["form"] && sh.getRow(i).getCell(resp["form"]).value ) ?  sh.getRow(i).getCell(resp["form"]).value.result ? sh.getRow(i).getCell(resp["form"]).value.result : sh.getRow(i).getCell(resp["form"]).value : "";
                        const quantity = ( resp["quantity"] && sh.getRow(i).getCell(resp["quantity"]).value ) ?  sh.getRow(i).getCell(resp["quantity"]).value.result ? sh.getRow(i).getCell(resp["quantity"]).value.result : sh.getRow(i).getCell(resp["quantity"]).value : "";
                        const zipCode = ( resp["zipCode"] && sh.getRow(i).getCell(resp["zipCode"]).value ) ?  sh.getRow(i).getCell(resp["zipCode"]).value.result ? sh.getRow(i).getCell(resp["zipCode"]).value.result : sh.getRow(i).getCell(resp["zipCode"]).value : "";
                        let stringVal;

                        const list = [];
                        if ( dosage.length > 0 ) {
                            if ( checkIfWildcard(dosage) ) {
                                isDosageWildcard = true;
                            } else {
                                const key = getKeyVal("strength" + dosage);
                                const actualVal = filterMap[key] ? filterMap[key] : dosage;
                                list.push("dosage=" + actualVal);
                            }
                        }
                        if ( form.length > 0 ) {
                            if ( checkIfWildcard(form) ) {
                                isFormWildcard = true;
                            } else {
                                const key = getKeyVal("drug_type" + form);
                                const actualVal = filterMap[key] ? filterMap[key] : form;
                                list.push("form=" + actualVal);
                            }
                        }
                        if ( genericOrBrand && genericOrBrand.length > 0 ) {
                            if ( checkIfWildcard(genericOrBrand) ) {
                                isBrandWildcard = true;
                            } else {
                                stringVal = genericOrBrand.match(new RegExp(properties.get("system.filter.expression"), "g"), "g");
                                if ( !stringVal || stringVal.length === 0 ) {
                                    stringVal = genericOrBrand;
                                    genericOrBrand = label + " (" + genericOrBrand + ")";
                                    const key = getKeyVal("brand" + label);
                                    const actualVal = filterMap[key] ? filterMap[key] : label;
                                    list.push("label_override=" + actualVal);
                                } else {
                                    const queryStringVal = genericOrBrand.replace(stringVal[stringVal.length-1], "").trim();
                                    stringVal = stringVal[stringVal.length-1].replace("(","").replace(")","");
                                    const key = getKeyVal("brand" + queryStringVal);
                                    const actualVal = filterMap[key] ? filterMap[key] : queryStringVal;
                                    list.push("label_override=" + actualVal);
                                }
                            }
                        }
                        if ( quantity.length > 0 ) {
                            if ( checkIfWildcard(quantity) ) {
                                isQuantityWildcard = true;
                            } else {
                                const key = getKeyVal("quantity" + quantity);
                                const actualVal = filterMap[key] ? filterMap[key] : quantity;
                                list.push("quantity=" + actualVal);
                            }
                        }
                        list.push("sort_type=popularity");

                        const queryParams = list.join("&");

                        const dataRef = {};
                        dataRef["id"] = idVal;
                        dataRef["stringVal"] = stringVal;
                        dataRef["dosage"] = dosage;
                        dataRef["form"] = form;
                        dataRef["label"] = label;
                        dataRef["quantity"] = quantity;
                        dataRef["quantity"] = quantity;
                        dataRef["genericOrBrand"] = genericOrBrand;
                        dataRef["zipCode"] = zipCode ? "" + zipCode : "" + zipCodeVal;
                        dataRef["url"] = encodeURI(baseDestUrl + "/" + label.toLowerCase().replace(/\s/g, "-") + "?" + queryParams);
                        dataRef["type"] = (isDosageWildcard || isFormWildcard || isBrandWildcard || isQuantityWildcard) ? Constants.ALL_COMBINATIONS : Constants.SPECIFIC_URL;
                        dataRef["wildcardStatus"] = {
                            isDosageWildcard,
                            isFormWildcard,
                            isBrandWildcard,
                            isQuantityWildcard
                        };
                        ipData.push(dataRef);
                    }
                    getPharmacyDetails().then(( pharmacies ) => {
                        resolve({
                            ipData,
                            pharmacies,
                            logFileName,
                            outputFileName,
                            proxyHost,
                            proxyPort,
                            ipFileName,
                            properties
                        });
                    }).catch(( err ) => {
                        reject(err);
                    });
                }).catch(( err ) => {
                    reject(err);
                });
            }).catch(() => {
                reject(new Error("Missing input file " + filePath));
            });
        });
    }

    return {
        validateData,
        prepareData,
        prepareFilterMap,
        checkConfigFile
    };
})();

module.exports = InputManager;
