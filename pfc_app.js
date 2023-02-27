function getJSON(JSONurl, callback) {
    var request = new XMLHttpRequest();

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data = JSON.parse(request.responseText);
            console.log(data);
        } else {
            // We reached our target server, but it returned an error
            if (request.status == 401) {
                //window.location.replace("/account/index");
            }
        }
        callback(data);
    };

    request.onerror = function () {
        // There was a connection error of some sort
    };

    request.open('GET', JSONurl, true);
    request.send();
}


function removeDropDownListOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function createDropDownListOption(ddVal, ddText) {
    var opt = document.createElement('option');
    opt.value = ddVal;
    opt.innerHTML = ddText;
    return opt;
}

/** Validate the search form inputs */
var validateSearchCriteria = function () {

    var errMsgs = [];

    var pid = document.getElementById("productid");
    if (pid) {
        if (pid.value == '0') { errMsgs[errMsgs.length] = "Product"; }
    }

    var cycles = document.getElementById('cycles');
    if (cycles) {
        if (cycles.value == '') { errMsgs[errMsgs.length] = "No of Cycles"; }
        else {
            if (isNaN(Number(cycles.value))) { errMsgs[errMsgs.length] = "No. of Cycles, wrong format"; return errMsgs; }

            if (cycles.value < 10000 || cycles.value > 10000000 ) { errMsgs[errMsgs.length] = "Cycles must be between 10000 - 10000000"; return errMsgs; }
        }
    }
    return errMsgs;
}

var populateStressTestedProducts = function (e) {

    var productDropdown = document.getElementById('productid');

    getJSON("https://api.belzona.com/Product/GetFatigueStressTestedProducts/", function (data) {
    //getJSON("http://192.168.4.29:5030/Product/GetFatigueStressTestedProducts/", function (data) {
    //getJSON("http://localhost:9476/Product/GetFatigueStressTestedProducts/" , function (data) {
    //getJSON("http://localhost:5015/Product/GetFatigueStressTestedProducts/" , function (data) {
        resultsJSON = data;
        var resultsHTML = '';
        if (resultsJSON && resultsJSON.constructor === Array) {
            removeDropDownListOptions(productDropdown);
            productDropdown.appendChild(createDropDownListOption('0','Select product...'));

            for (var i = 0; i < resultsJSON.length; i++) {
                if (resultsJSON[i]["State"] == '1') {
                    productDropdown.appendChild(createDropDownListOption(resultsJSON[i]["Id"], resultsJSON[i]["Description"]));
                }
            }
        }

        if (divResults) {
            divResults.innerHTML = resultsHTML;
        }

    });

}

var getFatigueStressVals = function (e) {

    e.preventDefault();

    resultsJSON = null;
    var divResults = document.getElementById("divResults");
    divResults.innerHTML = '';

    //Validate the form
    var formErrors = validateSearchCriteria();

    var pId = document.getElementById('productid').value;
    var cycles = document.getElementById('cycles').value;

    //Check if the validation returned any errors
    if (formErrors.length == 0) {

        var form = document.getElementById("frmSearch");
        if (form) {

            getJSON("https://api.belzona.com/Product/GetFatigueStressValues/" + pId + "/" + cycles + "/", function (data) {
            //getJSON("http://localhost:9476/Product/GetFatigueStressValues/" + pId + "/" + cycles + "/", function (data) {
            //getJSON("http://localhost:5015/Product/GetFatigueStressValues/" + pId + "/" + cycles + "/", function (data) {
                resultsJSON = data;
                var resultsHTML = '';
                if (resultsJSON && resultsJSON.constructor === Array) {
                    for (var i = 0; i < resultsJSON.length; i++) {
                        resultsHTML += "<div class=\"col-md-4 mb-4\">";
                        resultsHTML += "<strong>Product:&nbsp;</strong> " + resultsJSON[i]["ProductName"] + "<br/>";
                        resultsHTML += "<strong>No. of Cycles:&nbsp;</strong> " + resultsJSON[i]["NumberOfCycles"] + "<br/>";
                        resultsHTML += "<strong>Frequency:&nbsp;</strong><span class='text-danger font-weight-bold	'> " + resultsJSON[i]["TestFrequency"] + " </span><span class='small'>(Hz)</span><br/>";
                        resultsHTML += "<strong>Mean Stress:&nbsp;</strong> " + parseFloat(resultsJSON[i]["MeanStress"]).toFixed(3) + " <span class='small'>(MPa)</span><br/>";
                        resultsHTML += "<strong>Stress Amplitude:&nbsp;</strong> " + resultsJSON[i]["StressAmplitutde"] + " <span class='small'>(MPa)</span><br/>";
                        resultsHTML += "<strong>Lower Stress:&nbsp;</strong><span class='text-danger font-weight-bold'>" + (Math.round((resultsJSON[i]["LowerStress"] + Number.EPSILON) * 100) / 100) +  " </span><span class='small'>(MPa)</span><br/>";
                        resultsHTML += "<strong>Upper Stress:&nbsp;</strong><span class='text-danger font-weight-bold'> " + (Math.round((resultsJSON[i]["UpperStress"] + Number.EPSILON) * 100) / 100) + " </span><span class='small'>(MPa)</span><br/>";
                        resultsHTML += "</div>";
                    }
                }
                if (divResults) {
                    divResults.innerHTML = resultsHTML;
                }

            });
        }

    } else {
        var errMsgs = "";
        let errLen = formErrors.length;
        for (var i = 0; i < errLen; i++) {
            errMsgs += "* " + formErrors[i] + "<br />";
        }
        divResults.innerHTML = "<div class=\"errors\" id=\"divErrors\" style=\"color:#ff0000 !important;\">" + errMsgs + "</div>";
    }
}

var setupSearchListener = function () {
    var element = document.getElementById("btnSearch");
    //Add a event listener for the download buttton
    if (element) {
        element.addEventListener('click', getFatigueStressVals, false);
    }
}

setupSearchListener();
populateStressTestedProducts();
