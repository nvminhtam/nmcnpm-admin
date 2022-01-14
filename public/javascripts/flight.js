const error = msg => `<div class="alert alert-danger d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                            <div>
                                ${msg}
                            </div>
                        </div>`
const success = () => `<div class="alert alert-success d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Success:">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            <div>
                                Add flight successfully!
                            </div>
                        </div>`
$.validator.prototype.checkForm = function() {
    //overriden in a specific page
    this.prepareForm();
    for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
        if (this.findByName(elements[i].name).length !== undefined && this.findByName(elements[i].name).length > 1) {
            for (var cnt = 0; cnt < this.findByName(elements[i].name).length; cnt++) {
                this.check(this.findByName(elements[i].name)[cnt]);
            }
        } else {
            this.check(elements[i]);
        }
    }
    return this.valid();
};
$.validator.addMethod("valueNotEquals", function(value, element, arg) {
    return arg !== value;
}, "Value must not equal arg.");
const config = {
    enableTime: true,
    dateFormat: "Y-m-d H:i:S",
    minDate: "today",
    time_24hr: true,
    enableSeconds: true
}
var eFlightcount = 0;
var sClassCount = 0;

jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
    flatpickr("#departureTime", config);
    flatpickr("#arrivalTime", config);
});
const validateFlight = {
    rules: {
        "departureAirport": {
            valueNotEquals: "default"
        },
        "arrivalAirport": {
            valueNotEquals: "default"
        },
        "departureTime": {
            required: true,
        },
        "arrivalTime": {
            required: true,
        },
        "plane": {
            valueNotEquals: "default"
        },
    },
    messages: {
        "departureAirport": {
            valueNotEquals: "Please choose one airport",
        },
        "arrivalAirport": {
            valueNotEquals: "Please choose one airport",
        },
        "departureTime": {
            required: "Please enter a datetime",
        },
        "arrivalTime": {
            required: "Please enter a datetime"
        },
        "plane": {
            valueNotEquals: "Please choose one airport",
        },
    },
    errorPlacement: (error, element) => {
        isValid = false;
        element.css('background-color', '#ffdddd');
        error.css('color', 'red');
        error.css('margin-top', '10px');
        error.insertAfter(element);
    },
    success: function(label, element) {
        $(element).css('background-color', 'var(--mint)');
        label.parent().removeClass('error');
        label.remove();
    },
};
const validateSeatClass = {
    rules: {
        "totalCount": {
            min: 1,
        },
        "price": {
            min: 0,
        },
    },
    messages: {
        "totalCount": {
            min: "Number at least 1",
        },
        "price": {
            min: "Price at least 0d",
        },
    },
    errorPlacement: (error, element) => {
        isValid = false;
        element.css('background-color', '#ffdddd');
        error.css('color', 'red');
        error.css('margin-top', '10px');
        error.insertAfter(element);
    },
    success: function(label, element) {
        $(element).css('background-color', 'var(--mint)');
        label.parent().removeClass('error');
        label.remove();
    },
};
$("#add-extend-flight-btn").click(function() {
    $('#add-extend-flight').validate({
        ...validateFlight,
        submitHandler: function(form, event) {
            event.preventDefault();
            sendFlightSegment();
        }
    });
})
$("#add-seat-class-btn").click(function() {
    $('#add-seat-class').validate({
        ...validateSeatClass,
        submitHandler: function(form, event) {
            event.preventDefault();
            sendSeatClass();
        }
    });
})
$("#add-flight").click(function() {
    var checkAddFlightError = true;
    const extendFlightData = getFlightSegmentData();
    for (let i = 0; i < extendFlightData.extendFlight.length; i++) {
        if (extendFlightData.extendFlight[i].departureAirport == "default" || extendFlightData.extendFlight[i].arrivalAirport == "default" ||
            extendFlightData.extendFlight[i].departureTime == "" || extendFlightData.extendFlight[i].arrivalTime == "" || extendFlightData.extendFlight[i].plane == "") {
            const msg = "Please fill in all information of flight segment!";
            $("#errorMessage").append(error(msg));
            checkAddFlightError = false;
        }
    }
    const seatClassData = getSeatClassData();
    for (let i = 0; i < seatClassData.seatClass.length; i++) {
        if (seatClassData.seatClass[i].totalCount <= 0 || seatClassData.seatClass[i].price < 0) {
            const msg = "Total count must be > 0 and Price must be >=0!";
            $("#errorMessage").append(error(msg));
            checkAddFlightError = false;
        }
    }
    const data = {
        extendFlight: extendFlightData.extendFlight,
        seatClass: seatClassData.seatClass,
    }
    if (checkAddFlightError) {
        $("#errorMessage").empty();
        $.ajax({
            contentType: "application/json",
            url: '/flights/addflight',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data),
        }).done((res) => {
            $("#errorMessage").empty();
            $("#successfulMessage").append(success);
            setTimeout(() => {
                window.location.href = '/flights';
            }, 2000);
        });
    }
})
window.onclick = e => {
    if (e.target.id == "removeExtendFlight") {
        $(`#segment-${eFlightcount}`).remove();
        if (eFlightcount != 1) {
            $(`#parent-remove-ef-btn-${eFlightcount-1}`).append(`<div id="removeExtendFlight" value="removeExtendFlight" class="btn btn-outline-danger">Remove</div>`)
        }
        eFlightcount--;
        document.getElementById("extendFlightCount").value = eFlightcount;
    }
    if (e.target.id == "removeSeatClass") {
        $(`#seat-class-${sClassCount}`).remove();
        if (sClassCount != 1) {
            $(`#parent-remove-sc-btn-${sClassCount-1}`).append(`<div id="removeSeatClass" value="removeSeatClass" class="btn btn-outline-danger">Remove</div>`)
        }
        sClassCount--;
        document.getElementById("seatClassCount").value = sClassCount;
    }
};

function getFlightSegmentData() {
    const extendFlightCount = document.getElementById("extendFlightCount").value;
    const departureAirport = document.getElementById("departureAirport").value;
    const arrivalAirport = document.getElementById("arrivalAirport").value;
    const departureTime = document.getElementById("departureTime").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const plane = document.getElementById('plane').value;
    var extendFlight = new Array();
    extendFlight[0] = {
        departureAirport: parseInt(departureAirport),
        arrivalAirport: parseInt(arrivalAirport),
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        plane: parseInt(plane),
    }
    for (let i = 0; i < extendFlightCount; i++) {
        const index = i + 1;
        const departureAirport = document.getElementById('departureAirport' + index).value;
        const arrivalAirport = document.getElementById('arrivalAirport' + index).value;
        const departureTime = document.getElementById('departureTime' + index).value;
        const arrivalTime = document.getElementById('arrivalTime' + index).value;
        const plane = document.getElementById('plane' + index).value;
        extendFlight[index] = {
            departureAirport: parseInt(departureAirport),
            arrivalAirport: parseInt(arrivalAirport),
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            plane: parseInt(plane),
        }
    }
    const data = {
        extendFlightCount: parseInt(extendFlightCount, 10),
        extendFlight: extendFlight
    }
    console.log(data);
    return data;
}

function sendFlightSegment() {
    const data = getFlightSegmentData();
    $.ajax({
        contentType: "application/json",
        url: '/flights/addextendflight',
        dataType: "json",
        type: 'POST', // http method
        data: JSON.stringify(data),
        success: function(data) {
            $("#errorMessage").empty();
            addFlightSegment(data);
        }
    });
}

function getSeatClassData() {
    const seatClassCount = document.getElementById("seatClassCount").value;
    const seatClassId = document.getElementById("seatClassId").value;
    const totalCount = document.getElementById("totalCount").value;
    const price = document.getElementById("price").value;
    var seatClass = new Array();
    seatClass[0] = {
        seatClassId: parseInt(seatClassId),
        totalCount: parseInt(totalCount),
        price: parseInt(price),
    }
    for (let i = 0; i < seatClassCount; i++) {
        const index = i + 1;
        const seatClassId = document.getElementById("seatClassId" + index).value;
        const totalCount = document.getElementById("totalCount" + index).value;
        const price = document.getElementById("price" + index).value;
        seatClass[index] = {
            seatClassId: parseInt(seatClassId),
            totalCount: parseInt(totalCount),
            price: parseInt(price),
        }
    }
    const data = {
        seatClassCount: parseInt(seatClassCount),
        seatClass: seatClass
    }
    return data;
}

function sendSeatClass() {
    const data = getSeatClassData();
    $.ajax({
        contentType: "application/json",
        url: '/flights/addseatclass',
        dataType: "json",
        type: 'POST', // http method
        data: JSON.stringify(data),
        success: function(data) {
            if (data.seatClassList.length > 0) {
                $("#errorMessage").empty();
                addSeatClass(data);
            }
        }
    });
}

// function render(filename, data) {
//     var fr = new FileReader();
//     fr.onload = function() {
//         document.getElementById('output')
//             .textContent = fr.result;
//     }
//     var template = Handlebars.compile(readSingleFile());
//     var output = template(data);
//     return output;
// }

function addFlightSegment(data) {
    const { arrivalAirportList, currentDepartureAirport, planeList } = data;
    eFlightcount++;
    document.getElementById("extendFlightCount").value = eFlightcount;
    if (eFlightcount != 1) {
        $(`#removeExtendFlight`).remove();
    }
    const html = `
    <div id="segment-${eFlightcount}">
    <div class="card p-2">
        <h3 class="pb-2">Flight Segment Information:</h3>
        <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <label for="departureAirport${eFlightcount}">Departure Airport</label>
                    <input id="departureAirport${eFlightcount}" class="form-control" name="departureAirport" value="${currentDepartureAirport.id}" hidden>
                    <input class="form-control" name="departureAirport" value="${currentDepartureAirport.airport_name} (${currentDepartureAirport.symbol_code}) - ${currentDepartureAirport.city}" disable>
                    </input>
                </div>
            </div>
            <div class="col-6">
                <div class="form-group">
                    <label for="arrivalAirport${eFlightcount}">Arrival Airport</label>
                    <div class="col">
                        <select id="arrivalAirport${eFlightcount}" class="form-control form-select" name="arrivalAirport">
                            <option hidden value="default"></option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <label for="departureTime${eFlightcount}">Departure Time</label>
                    <div class="input-group date">
                        <span class="input-group-append">
                            <span class="input-group-text bg-light d-block">
                                <i class="fa fa-calendar"></i>
                            </span>
                        </span>
                        <input type="datetime-local" class="form-control" id="departureTime${eFlightcount}" name="departureTime" />
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="form-group">
                    <label for="arrivalTime${eFlightcount}">Arrival Time</label>
                    <div class="input-group date">
                        <span class="input-group-append">
                            <span class="input-group-text bg-light d-block">
                                <i class="fa fa-calendar"></i>
                            </span>
                        </span>
                        <input type="datetime-local" class="form-control" id="arrivalTime${eFlightcount}" name="arrivalTime" />
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <label for="plane${eFlightcount}">Plane</label>
                    <select class="form-control form-select" id="plane${eFlightcount}" name="plane">
                        <option hidden></option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex justify-content-end my-auto" id="parent-remove-ef-btn-${eFlightcount}">
                <div id="removeExtendFlight" value="removeExtendFlight" class="btn btn-outline-danger">Remove</div>
            </div>
        </div>
    </div>
</div>`
    $('#list-segment').append(html);

    for (let index = 0; index < arrivalAirportList.length; index++) {
        const element = arrivalAirportList[index];
        $(`#arrivalAirport${eFlightcount}`).append(`
        <option value=${element.id}>${element.airport_name} ( ${element.symbol_code}) - ${element.city}</option>`)
    }
    for (let index = 0; index < planeList.length; index++) {
        const element = planeList[index];
        $(`#plane${eFlightcount}`).append(`
    <option value=${element.id}>${element.aircraft_number}</option>`)
    }
    flatpickr(`#departureTime${eFlightcount}`, config);
    flatpickr(`#arrivalTime${eFlightcount}`, config);
};

function addSeatClass(data) {
    const { seatClassList } = data;
    sClassCount++;
    document.getElementById("seatClassCount").value = sClassCount;
    if (sClassCount != 1) {
        $(`#removeSeatClass`).remove();
    }
    const html = `
    <div id="seat-class-${sClassCount}">
    <div class="card p-2">
        <h3 class="pb-2 pt-2">Seat Class Information:</h3>
        <div class="row mx-auto">
            <div class="col-4">
                <div class="form-group">
                    <label for="seatClassId${sClassCount}">Seat Class</label>
                    <select class="form-control form-select" id="seatClassId${sClassCount}">  
                </select>
                </div>
            </div>
            <div class="col-4">
                <div class="form-group">
                    <label for="totalCount${sClassCount}">Total Count</label>
                    <input id="totalCount${sClassCount}" type="number" class="form-control" value="1" min="1" />
                </div>
            </div>
            <div class="col-4">
                <div class="form-group">
                    <label for="price${sClassCount}">Price</label>
                    <input id="price${sClassCount}" type="number" class="form-control" value="100000" min="100000" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex justify-content-end my-auto" id="parent-remove-sc-btn-${eFlightcount}">
                <div id="removeSeatClass" value="removeSeatClass" class="btn btn-outline-danger">Remove</div>
            </div>
        </div>
    </div>
</div>`
    $('#list-seat-class').append(html);
    for (let index = 0; index < seatClassList.length; index++) {
        const element = seatClassList[index];
        $(`#seatClassId${sClassCount}`).append(`<option value=${element.id}>${element.name}</option>`)
    }
};