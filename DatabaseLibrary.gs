// initialize spreadsheet
function initializeSpreadsheetById(spreadSheetId) {
	var spreadSheet = SpreadsheetApp.openById(spreadSheetId);
	if (spreadSheet.getSheetByName('DBQueries') === undefined) {
		spreadSheet.insertSheet('DBQueries');
		var DBQueries = spreadSheet.getSheetByName('DBQueries');
		DBQueries.hideSheet();
	}
    return spreadSheet;
}

// spreadSheet library functions
function dbInsertObject(spreadSheet, sheetName, object) {
    var dataSheet = spreadSheet.getSheetByName(sheetName);
    var dataRange = dataSheet.getDataRange();
    var firstEmptyRow = dataRange.getNumRows()+1;
    var headings = dataRange.getValues()[0];
    var rowToInsert = [];
    for (var iii=0; iii<headings.length; iii++) {
        var value = object[headings[iii]];
        if (typeof(value) == "boolean") {
            value = booleanToString(value);
        }
        if (value) {            
            rowToInsert.push(value);
        } else {
            Logger.log(headings[iii]+" not found while inserting object in "+sheetName);
            rowToInsert.push("");
        }
    }
    dataSheet.getRange(firstEmptyRow,1,1,headings.length).setValues([rowToInsert]);
    return true;
}

function dbUpdateObject(spreadSheet, sheetName, indexName, object) {
    var dataSheet = spreadSheet.getSheetByName(sheetName);
    var dataRange = dataSheet.getDataRange();
    var headings = dataRange.getValues()[0];
    var objectRow = getFirstRowByIndex(dataRange, indexName, object[indexName]);
    if (!objectRow) {
        return false;
    }
    var oldRow = dataSheet.getRange(objectRow+':'+objectRow).getValues()
    var newRow = [];
    for (var iii=0; iii<headings.length; iii++) {
        var value = object[headings[iii]];
        if (typeof(value) == "boolean") {
            value = booleanToString(value);
        }
        if (value) {            
            newRow.push(value);
        } else {
            newRow.push(oldRow[0][iii]);
        }
     }    
    dataSheet.getRange(objectRow,1,1,headings.length).setValues([newRow]);
    return true;
}

function dbGetObjects(spreadSheet, sheetName, queryString) {
    var dataSheet = spreadSheet.getSheetByName(sheetName);
    var dataRange = dataSheet.getDataRange().getA1Notation();
    var cellRange = dataSheet.getDataRange().getA1Notation();
    queryString = convertQueryStringToNameReferences(spreadSheet, sheetName, cellRange, queryString);
    var rows = dbQuery(spreadSheet, sheetName, cellRange, queryString, true);
    var objects = [];
    if (rows.length>1) {
        for (var iii=1; iii<rows.length; iii++){
            var object = {};
            for (var jjj=0; jjj<rows[0].length; jjj++){
                 var value = rows[iii][jjj];
                 if (typeof(value) == "boolean") {
                     value = stringToBoolean(value);
                 }
                 object[rows[0][jjj]] = value;
            }
            objects.push(object);
        }
    }
    return objects;
}

function dbTruncateSheet(spreadSheet, sheetName) {  
    var spreadSheet = quoteDB.getSheetByName(sheetName);
    if (spreadSheet.getDataRange().getNumRows() > 2) {  
        spreadSheet.deleteRows(2,sheetToClear.getLastRow()-2);
    }
    spreadSheet.getRange('2:2').clearContent();
}

function dbDeleteObject(spreadSheet, sheetName, indexName, object) {
    var dataSheet = spreadSheet.getSheetByName(sheetName);
    var dataRange = dataSheet.getDataRange();
    var objectRow = getFirstRowByIndex(dataRange, indexName, object[indexName]);
    dataSheet.deleteRow(objectRow);
}

// sheet helpers
function dbQuery(spreadSheet, sheetName, cellRange, queryString, explicitHeadings) {
    if (explicitHeadings === undefined | explicitHeadings == true) {
        var explicitHeadingsString = "-1";
    } else {
        var explicitHeadingsString = "0";
    }

    var DBQueriesSheet = spreadSheet.getSheetByName('DBQueries');
    DBQueriesSheet.getRange(1, 1)
        .setFormula("=QUERY("+sheetName+"!"+cellRange+"; \""+queryString+"\"; "+explicitHeadingsString+")");
    return DBQueriesSheet.getDataRange().getValues();
}

function convertQueryStringToNameReferences(spreadSheet, sheetName, cellRange, queryString) {
    var data = spreadSheet.getSheetByName(sheetName).getRange(cellRange);
    var headings = data.getValues()[0];

    for (var iii=0; iii<headings.length; iii++) {
        if (headings[iii].length < 1) {
            continue;
        }
        var regexColumnName = new RegExp("\\b"+headings[iii]+"\\b","gm");
        var columnLetter=data.getCell(1,iii+1).getA1Notation().split(/[0-9]/)[0];
        queryString = queryString.replace(regexColumnName,columnLetter);
    }
    return queryString;
}

function getFirstRowByIndex(dataRange, indexName, indexValue){
  var dataValues = dataRange.getValues();
  var headings = dataValues[0]
      
  for (var iii=0; iii<headings.length; iii++) {
        if (headings[iii] == indexName) {
            var columnIndex = iii;
            break;
        }
    }
    for (var iii=0; iii<dataValues.length; iii++) {  
        if (dataValues[iii][columnIndex] == indexValue) {
            return iii+1;
        }
    }
}

// sheet helpers
function columnToLetter(column) {
    var temp, letter = '';
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

function letterToColumn(letter) {
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}

// uuid helpers
function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function booleanToString(boolean) {
    if(boolean){
        return "TRUE";
    } else return "FALSE";
}

function stringToBoolean(string) {
    return (string.toLowerCase() === 'true');
}