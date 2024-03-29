var searchForm = new ChemicalSearchForm();
searchForm.FormElements.populateProductTypes();
searchForm.FormElements.populateChemicalImmersionTypes();

var resultsObj = new Results(null);
resultsObj.tableLayout = 0;
resultsObj.setResultsRowHeadTemplate();

var setResultsTemplate = function (e) {
    var chkElement = e.target;
    resultsObj.tableLayout = chkElement.checked ? 1 : 0;
}

var populateCASNameLabels = function (data) {

    var formObjs = new FormElements(null);

    //Get CAS numbers entered
    var casInputValue1 = formObjs.getCasNumber(1);
    var casInputValue2 = formObjs.getCasNumber(2);
    var casInputValue3 = formObjs.getCasNumber(3);

    //Clear the existing CAS number labels 
    formObjs.setCasNumberName(1, casInputValue1 == '' ? '' : 'Not tested/found');
    formObjs.setCasNumberName(2, casInputValue2 == '' ? '' : 'Not tested/found');
    formObjs.setCasNumberName(3, casInputValue3 == '' ? '' : 'Not tested/found');


    if (data) {
        //Re-populate the CAS number labels if the CAS has been found
        for (let item of data) {
            if (casInputValue1 == item['Name']) { formObjs.setCasNumberName(1, item['Description']); }
            if (casInputValue2 == item['Name']) { formObjs.setCasNumberName(2, item['Description']); }
            if (casInputValue3 == item['Name']) { formObjs.setCasNumberName(3, item['Description']); }
        }

    }// end for


}



var populateSearchResults = function (data) {

    var resultsBody = document.getElementById('resultsBody');
    if (resultsBody) {
        resultsBody.innerHTML = "";
    }

    var formObjs = new FormElements(null);
    var storageObj = new Storage(null);
    var resultsJSON = null;

    //Get CAS numbers and CAS labels
    var casInputValue1 = formObjs.getCasNumber(1);
    var casInputValue2 = formObjs.getCasNumber(2);
    var casInputValue3 = formObjs.getCasNumber(3);

    var numResults = 0;

    if (data) {

        resultsObj.setResultsRowHeadTemplate();

        if (resultsBody) {

            for (let item of data) {

                ////Set the CAS name labels
                //switch (item['cas_number']) {
                //    case casInputValue1:
                //        formObjs.setCasNumberName(1, item['cas_name']);
                //        break;
                //    case casInputValue2:
                //        formObjs.setCasNumberName(2, item['cas_name']);
                //        break;
                //    case casInputValue3:
                //        formObjs.setCasNumberName(3, item['cas_name']);
                //        break;
                //}

                numResults++;
                //Build the table row data
                resultsBody.innerHTML += resultsObj.resultsRowTemplate(item);

            }// end for

            if (storageObj.localStorageAvailable()) {
                storageObj.setLastUsedCasNumbers();
                document.getElementById('lnkRestoreCasNumbers').style.display = 'block';
            }
        }
    }

    document.getElementById('resultsFooter').style.display = numResults >= 1 ? 'block' : 'none';

    var spnResultsNumber = document.getElementById('numResults');
    if (spnResultsNumber) {
        spnResultsNumber.innerHTML = numResults;
    }
}

var getSearchResults = function (e) {

    e.preventDefault();
    resultsJSON = null;
    var divErrors = document.getElementById('divErrors');
    divErrors.innerHTML = '';

    //Validate the form
    var formErrors = searchForm.Validation.validateSearchCriteria();


    //Check if the validation returned any errors
    if (formErrors.length <= 0) {

        var form = document.getElementById("frmSearch");
        if (form) {

            sendFormJSONPostRequest(form, searchForm.serviceURL_ChemicalSearch + 'checkCasNumbers', function (data) {
                //resultsJSON = data;

                populateCASNameLabels(data);

            });


            sendFormJSONPostRequest(form, searchForm.serviceURL_ChemicalSearch + 'getSearch', function (data) {

                resultsJSON = data;

                searchForm.Results.destroyResultsTable();

                populateSearchResults(data ?? null);

                searchForm.Results.initialiseResultsTable();
            });

        }

    } else {

        let errLen = formErrors.length;

        for (let i = 0; i < errLen; i++) {
            divErrors.innerHTML += "<br />* " + formErrors[i];
        }

        populateSearchResults(null);

    }
}


var getDownloadFile = function (e) {

    e.preventDefault();
    console.log('JSON', resultsJSON);

    var json = resultsJSON;

    var csv = JSON2CSV(json);
    console.log('CSV', csv);

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

}

var setupSearchEventListener = function () {
    var element = document.getElementById("btnSearch");
    //Add a event listener to all of the save/update buttons
    if (element) {
        element.addEventListener('click', getSearchResults, false);
    }
}

var setupTemplateEventListener = function () {
    var element = document.getElementById("templateid");
    //Add a event listener to template selector
    if (element) {
        element.addEventListener('click', setResultsTemplate, false);
    }
}

var setupDownloadEventListener = function () {
    var element = document.getElementById("dloadXFile");
    //Add a event listener for the download buttton
    if (element) {
        element.addEventListener('click', getDownloadFile, false);
    }
}

console.log(searchForm.Events);
setupTemplateEventListener();
setupSearchEventListener();
setupDownloadEventListener();

if (searchForm.Storage.casNumberHaveBeenStored()) { document.getElementById('lnkRestoreCasNumbers').style.display = 'block'; }


function JSON2CSV(JsonArray) {

    var JsonFields = [
        "Product"
        , "Formulation #"
        , "Chemical"
        , "Temperature C / F"
        , "Concentration %"
        , "Rating"
        , "Definition"
    ];

    var csvStr = JsonFields.join(",") + "\n";

    JsonArray.forEach(element => {

        cas_formula = element.cas_formula;
        cas_name = element.cas_name;
        cas_number = element.cas_number;
        concentration = element.concentration;
        formulation_number = element.formulation_number;
        name = element.name;
        number = element.number;
        post_cure = element.post_cure;
        product_id = element.product_id;
        rating_code = element.rating_code;
        rating_description = element.rating_description.replace(/,/g, " ").replace(/\r\n/g, " ");
        rating_key = element.rating_key;
        temperature = element.temperature;
        temperature_f = element.temperature_f;

        csvStr += number
            + ', FN' + formulation_number
            + ',' + cas_name
            + ',' + temperature + ' C /' + Number(temperature_f) + ' F '
            + ',' + concentration
            + ',' + rating_code
            + ',' + (post_cure == '1' ? '** Post cured ** ' : '') + rating_description
            + "\n";

    })
    return csvStr;
}
