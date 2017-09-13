//Fill this id with the id of your spreadsheet
var database = initializeSpreadsheetById('1YvnHXKFMLSYeMtu7XkJLxnm21jugcDiuF4f2rEbsJnU');

function test() {
    var invoiceUuid = insertInvoice('c08cddb8-156f-4531-9583-a0f1fa6f1564', 'Website', 200, true);
    updateInvoiceActivity(invoiceUuid, 'Sitarello');
    var invoice = getInvoice(invoiceUuid);
    Logger.Log(invoice);
    deleteInvoice(invoiceUuid);
}

// demo functions
function getInvoice(invoiceUuid) {
    var query = "SELECT * WHERE uuid = '"+invoiceUuid+"'";
    return dbGetObjects(database, 'Invoices', query); // inputs: inizialized spreadsheet, sheet name, query
}

function insertInvoice(customerUuid, activity, price, paid) {
    var invoice = {
        'uuid': generateUuid(),
        'customerUuid': customerUuid,
        'activity': activity,
        'price': price,
        'paid': paid,
        'priceWithVat': '=D2*1.22'
    }
    
    dbInsertObject(database, 'Invoices', invoice); // inputs: inizialized spreadsheet, sheet name, object to insert
    return invoice.uuid;
}

function updateInvoiceActivity(uuid, activity) {
    var invoice = {
        'uuid': uuid,
        'activity': activity
    }
    
    dbUpdateObject(database, 'Invoices', 'uuid' ,invoice); // inputs: inizialized spreadsheet, sheet name, index column name, object to update
    return invoice.uuid;
}

function deleteInvoice(uuid){
    var invoice = {
        'uuid': uuid
    }
    
    dbDeleteObject(database, 'Invoices' ,'uuid' ,invoice); // inputs: inizialized spreadsheet, sheet name, index column name, object to update
    return invoice.uuid;
}
