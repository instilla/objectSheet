//Fill this id with the id of your spreadsheet
var database = initializeSpreadsheetById('1YvnHXKFMLSYeMtu7XkJLxnm21jugcDiuF4f2rEbsJnU');
function test() {
    insertInvoice('c08cddb8-156f-4531-9583-a0f1fa6f1564', 'Website', 200, true);
    //updateInvoice('b9aa34f3-ad9c-4488-a94e-21ca8f646b0e','Sitarello');
    //deleteInvoice('b9aa34f3-ad9c-4488-a94e-21ca8f646b0e');
}

// functions
function getInvoiceByUuid(invoiceUuid) {
    return dbGetObjects(database, 'Invoices', "SELECT * WHERE uuid = '"+invoiceUuid+"'");
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
    
    dbInsertObject(database, 'Invoices', invoice); 
    return invoice.uuid;
}

function updateInvoice(uuid, activity) {
    var invoice = {
        'uuid': uuid,
        'activity': activity
    }
    
    dbUpdateObject(database, 'Invoices', 'uuid' ,invoice); 
    return invoice.uuid;
}

function deleteInvoice(uuid){
    var invoice = {
        'uuid': uuid
    }
    
    dbDeleteObject(database, 'Invoices' ,'uuid' ,invoice); 
    return invoice.uuid;
}
