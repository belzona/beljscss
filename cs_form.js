function ChemicalSearchForm() {

    //this.serviceURL_ChemicalSearch = "http://localhost:9476/ChemicalSearch/";
    //this.serviceURL_ChemicalSearch = "http://dev.api.belzona.com/ChemicalSearch/";
    this.serviceURL_ChemicalSearch = "https://api.belzona.com/ChemicalSearch/";
    this.Validation = new Validation(this);
    this.FormElements = new FormElements(this);
    this.Storage = new Storage();
    this.Results = new Results(this);
}




/** VALIDATION VALIDATION VALIDATION VALIDATION **/


function Validation(parentObj) {
    this.parent = parentObj;
}

/** Validate the search form inputs */
Validation.prototype.validateSearchCriteria = function () {

    var errMsgs = [];

    var pType = document.getElementById("ProductType");
    if (pType) {
        if (pType.value == '0') { errMsgs[errMsgs.length] = "Product Type"; }
    }

    var cImmersion = document.getElementById("ChemicalImmersion");
    if (cImmersion) {
        if (cImmersion.value == '0') { errMsgs[errMsgs.length] = "Chemical Immersion"; }
    }

    var temperature = document.getElementById('Temperature');
    if (temperature) {
        if (temperature.value == '') { errMsgs[errMsgs.length] = "Temperature"; }
        else {

            if (isNaN(Number(temperature.value))) { errMsgs[errMsgs.length] = "Temperature, wrong format"; }
        }
    }

    if (this.parent.FormElements.getCasNumber(1) == '') { errMsgs[errMsgs.length] = "CAS Number 1"; }
    else {
        if (!this.validateCasNumber(1, false)) { errMsgs[errMsgs.length] = "CAS 1, Invalid format"; }
    }

    if (!this.validateCasNumber(2, true)) { errMsgs[errMsgs.length] = "CAS 2, Invalid format"; }
    if (!this.validateCasNumber(3, true)) { errMsgs[errMsgs.length] = "CAS 3, Invalid format"; }

    return errMsgs;
}


/**
 * Check wehter a cas number is made up of the correct signature
 * @param {any} orderNumber
 * @param {any} allowEmpty allow the value to be an empty value/''
 */
Validation.prototype.validateCasNumber = function (orderNumber, allowEmpty) {

    if (allowEmpty && this.parent.FormElements.getCasNumber(orderNumber) == '') { return true; }

    if (!allowEmpty && this.parent.FormElements.getCasNumber(orderNumber) == '') { return false; }

    var casParts = this.parent.FormElements.getCasNumberInputs(orderNumber);

    if (isNaN(Number(casParts.cas_input_1.value)) || isNaN(Number(casParts.cas_input_2.value)) || isNaN(Number(casParts.cas_input_3.value))) { return false; }

    if (Number(casParts.cas_input_1.value) < 0 || Number(casParts.cas_input_1.value) > 9999999) { return false; }
    if (Number(casParts.cas_input_2.value) < 0 || Number(casParts.cas_input_2.value) > 99) { return false; }
    if (Number(casParts.cas_input_3.value) < 0 || Number(casParts.cas_input_3.value) > 9) { return false; }

    return true;
}

/** END VALIDATION END VALIDATION END VALIDATION END VALIDATION **/



/** FORM ELEMENTS/OBJECTS FORM ELEMENTS/OBJECTS **/

function FormElements(parentObj) {
    this.parent = parentObj;
}


FormElements.prototype.populateProductTypes = function () {

    getJSON(this.parent.serviceURL_ChemicalSearch + 'GetProductTypes', function (data) {
        //return data;

        if (data) {

            var select = document.getElementById('ProductType');
            for (let item of data) {
                var opt = document.createElement('option');
                opt.value = item['Id'];
                opt.innerHTML = item['Name'];
                select.appendChild(opt);
            }
        }


    });

    //return null;
}

FormElements.prototype.populateChemicalImmersionTypes = function () {

    getJSON(this.parent.serviceURL_ChemicalSearch + 'GetChemicalImmersionTypes', function (data) {

        if (data) {

            var select = document.getElementById('ChemicalImmersion');
            for (let item of data) {
                var opt = document.createElement('option');
                opt.value = item['Id'];
                opt.innerHTML = item['Name'];
                select.appendChild(opt);
            }
        }

        //return data;
    });

    //return null;
}

/**
 * CAS name part, element input (the element input of the cas name part)
 **/
FormElements.prototype.casNamePartElementInput = function (casOrder, casPart) {
    return document.getElementById(this.casNamePartElementKey(casOrder, casPart));
}

/**
 * CAS element key
 * @param {any} casOrder
 * @param {any} casPart
 */
FormElements.prototype.casNamePartElementKey = function (casOrder, casPart) {
    return "CAS_" + casOrder + "_" + casPart;
}
/**
 * CAS label element key
 * @param {any} casOrder
 */
FormElements.prototype.casLabelElementKey = function (casOrder) {
    return 'lbl_cas_name_' + casOrder;
}


/**
 * Get the input values of a cas number (three input values)
 * @param {any} orderNumber
 */
FormElements.prototype.getCasNumberInputs = function (orderNumber) {

    var casPt1 = this.casNamePartElementInput(orderNumber, 1);
    var casPt2 = this.casNamePartElementInput(orderNumber, 2);
    var casPt3 = this.casNamePartElementInput(orderNumber, 3);

    return { cas_input_1: casPt1, cas_input_2: casPt2, cas_input_3: casPt3 };
}

/**
 * Get a cas number from the input boxes
 * @param {any} casNumberOrder
 */
FormElements.prototype.getCasNumber = function (casNumberOrder) {

    var casParts = this.getCasNumberInputs(casNumberOrder);
    if (casParts.cas_input_1.value == '' && casParts.cas_input_2.value == '' && casParts.cas_input_3.value == '') { return ''; }

    return casParts.cas_input_1.value + '-' + casParts.cas_input_2.value + '-' + casParts.cas_input_3.value;
}

/**
 * Get the CAS name of the inputs
 * @param {any} casNumberOrder
 */
FormElements.prototype.getCasNumberName = function (casNumberOrder) {
    var lblCasName = document.getElementById(this.casLabelElementKey(casNumberOrder));
    return lblCasName.innerHTML;
}

/**
 * Set the CAS name label of the inputs
 * @param {any} casNumberOrder
 * @param {any} casName
 */
FormElements.prototype.setCasNumberName = function (casNumberOrder, casName) {
    document.getElementById(this.casLabelElementKey(casNumberOrder)).innerHTML = casName;
}

/**
 * Clear the cas number inputs within a row
 * @param {any} casNumberOrder
 */
FormElements.prototype.clearCasNumber = function (casNumberOrder) {

    var casParts = this.getCasNumberInputs(casNumberOrder);
    casParts.cas_input_1.value = '';
    casParts.cas_input_2.value = '';
    casParts.cas_input_3.value = '';
    this.setCasNumberName(casNumberOrder, '');

    return false;
}

/** Clear the search form (clear all inputs and all results) */
FormElements.prototype.clearForm = function () {

    document.getElementById("ProductType").selectedIndex = 0;
    document.getElementById("ChemicalImmersion").selectedIndex = 0;
    document.getElementById("TemperatureMetric").selectedIndex = 0;
    document.getElementById("Temperature").value = '';

    this.clearCasNumber(1);
    this.clearCasNumber(2);
    this.clearCasNumber(3);

    var resultsBody = document.getElementById('resultsBody');
    if (resultsBody) {
        resultsBody.innerHTML = "";
    }

    var divErrors = document.getElementById('divErrors');
    divErrors.innerHTML = '';

    return false;
}


/** END FORM ELEMENTS END FORM ELEMENTS END FORM ELEMENTS **/


/** LOCAL STORAGE  **/

function Storage() {
    this.FormElements = new FormElements();
}


/**
* Test if local storage is available
* returns true if localStorage is available and false if it's not
**/
Storage.prototype.localStorageAvailable = function () {
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**Set/Store the currently being used cas numbers */
Storage.prototype.setLastUsedCasNumbers = function () {

    for (var i = 1; i <= 3; i++) {
        var casParts = this.FormElements.getCasNumberInputs(i);
        window.localStorage.setItem(this.FormElements.casLabelElementKey(i), this.FormElements.getCasNumberName(i));
        var elementKey = this.FormElements.casNamePartElementKey(i, 1);
        window.localStorage.setItem(elementKey, casParts.cas_input_1.value);
        elementKey = this.FormElements.casNamePartElementKey(i, 2);
        window.localStorage.setItem(elementKey, casParts.cas_input_2.value);
        elementKey = this.FormElements.casNamePartElementKey(i, 3);
        window.localStorage.setItem(elementKey, casParts.cas_input_3.value);
    }
}

/** Restore the previously used cs numbers */
Storage.prototype.restoreLastUsedCasNumbers = function () {
    for (var i = 1; i <= 3; i++) {
        this.FormElements.setCasNumberName(i, window.localStorage.getItem(this.FormElements.casLabelElementKey(i)));
        var elementKey = this.FormElements.casNamePartElementKey(i, 1);
        document.getElementById(elementKey).value = window.localStorage.getItem(elementKey);
        elementKey = this.FormElements.casNamePartElementKey(i, 2);
        document.getElementById(elementKey).value = window.localStorage.getItem(elementKey);
        elementKey = this.FormElements.casNamePartElementKey(i, 3);
        document.getElementById(elementKey).value = window.localStorage.getItem(elementKey);
    }
}

/**Check if cas number have been previously stored */
Storage.prototype.casNumberHaveBeenStored = function () {
    for (var i = 1; i <= 3; i++) {
        var elementKey = this.FormElements.casNamePartElementKey(i, 1);
        if (null != window.localStorage.getItem(elementKey)) { return true; }
        elementKey = this.FormElements.casNamePartElementKey(i, 2);
        if (null != window.localStorage.getItem(elementKey)) { return true; }
        elementKey = this.FormElements.casNamePartElementKey(i, 3);
        if (null != window.localStorage.getItem(elementKey)) { return true; }
    }

    return false;
}
/** END LOCAL STORAGE **/


/**** RESULTS TABLE RESULTS TABLE RESULTS TABLE RESULTS TABLE *****/

function Results(parentObj) {
    this.parent = parentObj;
    this.tableLayout = 0;
    this.resultsTableID = '#tableResults';
}

/**
 * Initialise the results table
 **/
Results.prototype.initialiseResultsTable = function () {

    table = $(this.resultsTableID).DataTable({
        retrieve: true,
        paging: true,
        searching: true,
        scrollX: true
    });

}

/**
 * Destroy the results table
 **/
Results.prototype.destroyResultsTable = function () {

    /** https://datatables.net/manual/index **/
    if ($.fn.dataTable.isDataTable(this.resultsTableID)) {
        table = $(this.resultsTableID).DataTable();
        table.destroy();
    }

}



/**
 * Search results row template
 * @param {any} rowDataItem
 */
Results.prototype.setResultsRowHeadTemplate = function () {

    //this.destroyResultsTable();

    var rowTemplate = '';
    var resultsHead = document.getElementById('tbleHeadTemplate');
        resultsHead.innerHTML = rowTemplate;

    switch (this.tableLayout) {
        case 1:
            rowTemplate = "<tr>"
                + "    <th scope=\"col\">Product</th>"
                + "    <th scope=\"col\">Test Data</th>"
                + "    <th scope=\"col\" width=\"60%\">Definition</th>"
                + "</tr>";
            break;
        default:
            rowTemplate = "<tr>"
                + "    <th scope=\"col\">Product</th>"
                + "    <th scope=\"col\">Chemical</th>"
                + "    <th scope=\"col\">Temp. &#8451; / &#8457;</th>"
                + "    <th scope=\"col\">Conc. &#37;</th>"
                + "    <th scope=\"col\">Rating</th>"
                + "    <th scope=\"col\" width=\"45%\">Definition</th>"
                + "</tr>";
            break;
    }

    resultsHead.innerHTML = rowTemplate;

    //this.initialiseResultsTable();

    //return rowTemplate;

}



/**
 * Search results row template
 * @param {any} rowDataItem
 */
Results.prototype.resultsRowTemplate = function (rowDataItem) {

    var rowTemplate = '';
    //alert(this.tableLayout);
    switch (this.tableLayout) {
        case 1:
            rowTemplate = "<tr class=\"row_" + rowDataItem['rating_code'] + "\">"
//                + "<td scope=\"row\"  class=\"text-center\"  style=\"vertical-align: text-top;\">" + rowDataItem['number'] + "<br />(FN" + rowDataItem['formulation_number'] + ")</td>"
                + "<td scope=\"row\"  class=\"text-center\"  style=\"vertical-align: text-top;\">"
                + rowDataItem['number']
                + "<br />FN"
                + rowDataItem['formulation_number']
                + " &nbsp(<a target='_blank' href='https://prodapp.belzona.com/download/?docid=" + rowDataItem['CRC_Document_Id'] +"' title='chemical resistance chart'>CRC</a>)"
                + "</td>"                
                + "<td  style=\"vertical-align: text-top;\">" + rowDataItem['cas_name']
                + "<br/><strong>Temp.</strong> " + rowDataItem['temperature'] + '&#8451; / ' + Number(rowDataItem['temperature_f']) + "&#8457;"
                + "<br/><strong>Conc.</strong> " + rowDataItem['concentration'] + "&#37;"
                + "<br/><strong>Rating.</strong> " + rowDataItem['rating_code']
                + "</td>"
                + "<td>" + (rowDataItem['post_cure'] == '1' ? '<strong>** Post cured **</strong> ' : '') + rowDataItem['rating_description'] + "</td>"
                + "</tr>";
            break;
        default:
            rowTemplate = "<tr class=\"row_" + rowDataItem['rating_code'] + "\">"
                + "<td scope=\"row\"  class=\"text-center\"  style=\"vertical-align: text-top;\">"
                + rowDataItem['number']
                + "<br />FN"
                + rowDataItem['formulation_number']
                + " &nbsp(<a target='_blank' href='https://prodapp.belzona.com/download/?docid=" + rowDataItem['CRC_Document_Id'] +"' title='chemical resistance chart'>CRC</a>)"
                + "</td>"                + "<td>" + rowDataItem['cas_name'] + "</td>"
                + "<td class=\"text-center\">" + rowDataItem['temperature'] + '&#8451; / ' + Number(rowDataItem['temperature_f']) + "&#8457;</td>"
                + "<td class=\"text-center\">" + rowDataItem['concentration'] + "</td>"
                + "<td class=\"text-center\">" + rowDataItem['rating_code'] + "</td>"
                + "<td>" + (rowDataItem['post_cure'] == '1' ? '<strong>** Post cured **</strong> ' : '') + rowDataItem['rating_description'] + "</td>"
                + "</tr>";
            break;
    }

    return rowTemplate;

}
/**** END RESULTS TABLE END RESULTS TABLE END RESULTS TABLE *****/

