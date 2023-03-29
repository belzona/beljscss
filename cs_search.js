function getJSON(JSONurl, callback) {
    var response = null;
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

function postForm(form, callback) {

    var data = new FormData(form)
    var request = new XMLHttpRequest()

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data = JSON.parse(request.responseText);
            console.log(data);
        } else {
            //We reached our target server, but it returned an error
            if (request.status == 401) {
                window.location.replace("/account/index");
            }
        }
        callback(data);
    };

    request.onerror = function () {
        // There was a connection error of some sort
    };

    request.open(form.method, form.action, true);
    //request.send();
    request.send(data);
} 

// convert the form to JSON
// https://jordanfinners.dev/blogs/how-to-easily-convert-html-form-to-json
const getFormJSON = (form) => {
    const data = new FormData(form);
    return Array.from(data.keys()).reduce((result, key) => {
        if (result[key]) {
            result[key] = data.getAll(key)
            return result
        }
        result[key] = data.get(key);
        return result;
    }, {});
};

function sendFormJSONPostRequest(form, actionUrl, callback) {
    //var data = new FormData(form);
    var data = getFormJSON(form);
    var url = actionUrl; //"url";
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            // Success!
            data = JSON.parse(xhr.responseText);
            console.log(data);
        } else {
            //We reached our target server, but it returned an error
            if (xhr.status == 401) {
                //window.location.replace("/account/index");
            }
        }
        callback(data);
    };

    xhr.onerror = function () {
        // There was a connection error of some sort
    };

    xhr.open("POST", url, true);
    console.log('TO SEND: ', JSON.stringify(data));
    xhr.send(JSON.stringify(data));
    //xhr.send(data);
}









/**
 * Find and check/select a specified dropdown list item by value
 * @param {any} ddId id of the dropdown list
 * @param {any} valueToFind value to find
 */
function selectDropDownOption (ddId, valueToFind) {
    //select the dropdown
    var dropDown = document.getElementById(ddId);
    if (dropDown) {
        //reset the dropdown to the default value
        dropDown.selectedIndex = 0;
        var dropDownCount = dropDown.length;
        for (var i = 0; i < dropDownCount; i++) {
            if (dropDown.options[i].value == valueToFind) {
                dropDown.options[i].selected = true;
            }
        }
    }
}

function removeDropdownListOptions (ddElement) {
    var i, L = ddElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        ddElement.remove(i);
    }
}

function replaceHTMLWithLineBreaks (dataItem) {
    let replaceString = dataItem
    replaceString = replaceString.replace(/<p>/gi, '');
    replaceString = replaceString.replace(/<\/p>/gi, '\r\n');
    return replaceString.replace(/<br \/>/gi, '\r\n');
}
