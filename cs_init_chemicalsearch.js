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

    var populateSearchResults = function (data) {

        var resultsBody = document.getElementById('resultsBody');
        if (resultsBody) {
        resultsBody.innerHTML = "";
        }

        var formObjs = new FormElements(null);
        var storageObj = new Storage(null);

        //Get CAS numbers and CAS labels
        var casInputValue1 = formObjs.getCasNumber(1);
        var casInputValue2 = formObjs.getCasNumber(2);
        var casInputValue3 = formObjs.getCasNumber(3);

        var numResults = 0;

        if (data) {

        resultsObj.setResultsRowHeadTemplate();

            if (resultsBody) {

                for (let item of data) {

                    //Set the CAS name labels
                    switch (item['cas_number']) {
                        case casInputValue1:
                            formObjs.setCasNumberName(1, item['cas_name']);
                            break;
                        case casInputValue2:
                            formObjs.setCasNumberName(2, item['cas_name']);
                            break;
                        case casInputValue3:
                            formObjs.setCasNumberName(3, item['cas_name']);
                            break;
                    }

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

        var spnResultsNumber = document.getElementById('numResults');
        if (spnResultsNumber) {
        spnResultsNumber.innerHTML = numResults;
        }
    }

    var getSearchResults = function (e) {

        e.preventDefault();

        var divErrors = document.getElementById('divErrors');
        divErrors.innerHTML = '';

        //Validate the form
        var formErrors = searchForm.Validation.validateSearchCriteria();

        //Check if the validation returned any errors
        if (formErrors.length == 0) {

            var form = document.getElementById("frmSearch");
            if (form) {

        sendFormJSONPostRequest(form, searchForm.serviceURL_ChemicalSearch + 'getSearch', function (data) {
            console.log(data);
            searchForm.Results.destroyResultsTable();

            populateSearchResults(data ?? null);

            searchForm.Results.initialiseResultsTable();
        });
            }

        } else {

        populateSearchResults(null);

            let errLen = formErrors.length;
            for (let i = 0; i < errLen; {
        divErrors.innerHTML += "<br />* " + formErrors[i];
            }
        }
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

    console.log(searchForm.Events);
    setupTemplateEventListener();
    setupSearchEventListener();

    if (searchForm.Storage.casNumberHaveBeenStored()) {document.getElementById('lnkRestoreCasNumbers').style.display = 'block'; }

