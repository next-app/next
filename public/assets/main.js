function AppStorage() {
    var masterKey = "next::appStorage";
    var data = null;

    this.load = function() {
        if (window.localStorage) {
            var stored = JSON.parse(window.localStorage.getItem(masterKey));
            if (stored) {
                data = stored;
            }
        }

        if (data === null) {
            data = {};
        }
    }

    this.save = function() {
        if (window.localStorage) {
            window.localStorage.setItem(masterKey, JSON.stringify(data));
        }
    }

    this.get = function(key) {
        if (data === null) {
            this.load();
        }

        return data[key];
    }

    this.set = function(key, value) {
        if (data === null) {
            this.load();
        }

        data[key] = value;
        this.save();
    }
}

var appStorage = new AppStorage();

function transformResponse(jsonResponse) {
    var nationalLevel = [];
    var countyLevel = [];
    var stateLevel = [];

    var divisionIds = Object.keys(jsonResponse.divisions);
    for (var i = 0; i < divisionIds.length; i++) {
        var division = buildDivision(divisionIds[i], jsonResponse);
        if (division !== null) {
            switch (division.type) {
                case 'country':
                    nationalLevel.push(division);
                    break;
                case 'county':
                    countyLevel.push(division);
                    break;
                case 'state':
                    stateLevel.push(division);
                    break;
            }
        }
    }

    stateLevel.sort((a, b) => {
        return a.ocdid.length - b.ocdid.length;
    })

    var divisions = [].concat(stateLevel).concat(countyLevel).concat(nationalLevel);

    return divisions;
}

function buildDivision(divisionId, jsonResponse) {
    var division = jsonResponse.divisions[divisionId];

    var offices = [];

    if (division.officeIndices && division.officeIndices.length > 0) {
        for (var i = 0; i < division.officeIndices.length; i++) {
            var officeIndex = division.officeIndices[i];
            offices.push(buildOffice(officeIndex, jsonResponse));
        }
    } else {
        return null;
    }

    var divs = divisionId.replace("ocd-division/", "").split("/");
    var type = "division";
    if (divs.length > 0 && divs[0].startsWith("country:")) {
        type = "country";
    }
    if (divs.length > 1 && divs[1].startsWith("state:")) {
        type = "state";
    }
    if (divs.length > 2 && divs[2].startsWith("county:")) {
        type = "county";
    }

    return {
        name: division.name,
        ocdid: divisionId,
        offices: offices,
        type: type
    }
}

function buildOffice(officeIndex, jsonResponse) {
    var office = jsonResponse.offices[officeIndex];

    var officials = [];
    var isFederal = false;

    if (office.officialIndices) {
        for (var i = 0; i < office.officialIndices.length; i++) {
            var officialIndex = office.officialIndices[i];
            officials.push(buildOfficial(officialIndex, jsonResponse));
        }
    }

    if (office.levels && office.levels.indexOf("country") > -1) {
        isFederal = true;
    }

    return {
        name: office.name,
        officials: officials,
        isFederal: isFederal
    }
}

function buildOfficial(officialIndex, jsonResponse) {
    var official = jsonResponse.officials[officialIndex];

    return {
        name: official.name,
        party: official.party,
        address: official.address,
        phones: official.phones,
        emails: official.emails,
        links: buildLinks(official.urls, official.channels)
    }
}

function buildLinks(urls, channels) {
    var links = [];

    if (urls) {
        for (var i = 0; i < urls.length; i++) {
            links.push({
                type: "Website",
                url: urls[i]
            });
        }
    }

    if (channels) {
        for (var i = 0; i < channels.length; i++) {
            links.push(channelWithFullUrl(channels[i]));
        }
    }

    if (links.length === 0) {
        return null;
    }

    return links;
}

function channelWithFullUrl(channel) {
    var type = channel.type;
    var url;

    switch (type) {
        case "GooglePlus":
            url = "https://plus.google.com/" + channel.id;
            break;
        case "Facebook":
            url = "https://www.facebook.com/" + channel.id;
            break;
        case "Twitter":
            url = "https://twitter.com/" + channel.id;
            break;
        case "YouTube":
            url = "https://www.youtube.com/user/" + channel.id;
            break;
        default:
            url = channel.id;
            break;
    }

    return {
        type: type,
        id: channel.id,
        url: url
    }
}

function getOnlyFederal(divisions) {
    var newDivisions = [];
    for (var i = 0; i < divisions.length; i++) {
        var div = divisions[i];
        var shouldAddDiv = false;
        var federalOffices = [];
        for (var j = 0; j < div.offices.length; j++) {
            var office = div.offices[j];
            if (office.isFederal) {
                shouldAddDiv = true;
                federalOffices.push(office);
            }
        }
        if (shouldAddDiv) {
            newDivisions.push({
                name: div.name,
                ocdid: div.ocdid,
                offices: federalOffices,
                type: div.type
            })
        }
    }

    return newDivisions;
}

if (window.attachEvent) {
    window.attachEvent('onload', initialize);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            initialize(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = initialize;
    }
}

var nav;

function initialize() {
    nav = document.querySelector("nav.nav-bar");
    var ham = document.querySelector("#hamburger");
    ham.addEventListener("click", toggleNav);

    var repsView = document.getElementById("repsView");
    if (repsView) {
        var repsFilters = document.getElementById("reps-filters");
        if (repsFilters) {
            var radioBtns = repsFilters.querySelectorAll("input[type=radio]");
            console.log(radioBtns)
            for (var i = 0; i < radioBtns.length; i++) {
                radioBtns[i].addEventListener("change", function(evt) {
                    var newlyChecked = evt.target;
                    renderRepresentativesView(newlyChecked.value);
                })
            }
        }
        renderRepresentativesView("federal");
        return;
    }

    var addressForm = document.getElementById("address-form");
    if (addressForm) {
        console.log(addressForm)
        var saveBtn = document.getElementById("save-button");
        var clearBtn = document.getElementById("clear-button");

        console.log(saveBtn);
        clearBtn.addEventListener("click", clearAddressForm);
        saveBtn.addEventListener("click", saveAddressForm);

        var savedAddress = appStorage.get("address");
        document.getElementById("address-line1").value = savedAddress.line1 || null;
        document.getElementById("address-line2").value = savedAddress.line2 || null;
        document.getElementById("address-city").value = savedAddress.city || null;
        document.getElementById("address-state").value = savedAddress.state || null;
        document.getElementById("address-zip").value = savedAddress.zip || null;
        return;
    }
}

var allReps;
var onlyFederal;
function renderRepresentativesView(filter) {
    allReps = allReps || transformResponse(JSON.parse(response1));
    onlyFederal =  onlyFederal || getOnlyFederal(allReps);

    if (filter === "federal") {
        repsView.innerHTML = templates.repsView({
            divisions: onlyFederal
        });
    } else if (filter === "all") {
        repsView.innerHTML = templates.repsView({
            divisions: allReps
        });
    }

    // initialize expanders
    var exps = document.querySelectorAll('.expander');
    for (var i = 0; i < exps.length; i++) {
        var expHeader = exps[i].querySelector('.expander-header');
        expHeader.addEventListener("click", toggleExpanded)
    }
}

function clearAddressForm(evt) {
    var addressForm = document.getElementById("address-form");
    if (addressForm) {
        var inputs = addressForm.querySelectorAll("input");
        var select = addressForm.querySelector("select");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = null;
        }
        select.value = null;
    }
}

function saveAddressForm(evt) {
    var addressForm = document.getElementById("address-form");
    if (addressForm) {
        var line1 = document.getElementById("address-line1").value;
        var line2 = document.getElementById("address-line2").value;
        var city = document.getElementById("address-city").value;
        var state = document.getElementById("address-state").value;
        var zip = document.getElementById("address-zip").value;

        appStorage.set("address", {
            line1: line1,
            line2: line2,
            city: city,
            state: state,
            zip: zip
        });
    }
}

function toggleNav() {
    if (nav.classList.contains("nav-expanded")) {
        nav.classList.remove("nav-expanded");
        nav.classList.add("nav-collapsed");
    } else {
        nav.classList.remove("nav-collapsed");
        nav.classList.add("nav-expanded");
    }
}

function toggleExpanded() {
    var expander = this.parentNode;
    var icon = this.querySelector('.expander-icon');
    var content = expander.querySelector('.expander-content');
    if (content.classList.contains("collapsed")) {
        // Expanding
        content.classList.remove("collapsed");
        content.classList.add("expanded");
        icon.classList.remove("default");
        icon.classList.add("rotated");
    } else {
        // Collapsing
        content.classList.remove("expanded");
        content.classList.add("collapsed");
        icon.classList.remove("rotated");
        icon.classList.add("default");
    }
}
