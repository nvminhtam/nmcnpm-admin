const error = msg => `<div class="alert alert-danger d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                            <div>
                                ${msg}
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
var count = 0;
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
    flatpickr("#departureTime", config);
    flatpickr("#arrivalTime", config);
});
const validateInfo = {
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

$("#add-extend-flight").click(function() {
    event.preventDefault();
    sendFlightSegment();
    console.log("add flight click");
    // $('#add-flight').validate({
    //     ...validateInfo,
    //     submitHandler: function(form, event) {
    //         event.preventDefault();
    //         sendFlightSegment();
    //     }
    // });
})
window.onclick = e => {
    //console.log(e.target.id);
    if (e.target.id == "remove") {
        $(`#segment-${count}`).remove();
        if (count != 1) {
            $(`#parent-remove-btn-${count-1}`).append(`<div id="remove" value="remove" class="btn btn-outline-danger">Remove</div>`)
        }
        count--;
        document.getElementById("extendFlightCount").value = count;
    }
};

function sendFlightSegment() {
    const extendFlightCount = document.getElementById("extendFlightCount").value;
    const departureAirport = document.getElementById("departureAirport").value;
    const arrivalAirport = document.getElementById("arrivalAirport").value;
    const departureTime = document.getElementById("departureTime").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const plane = document.getElementById('plane').value;
    console.log("COUNT", extendFlightCount);
    var extendFlight = new Array();
    extendFlight[0] = {
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        plane: plane,
    }
    for (let i = 0; i < extendFlightCount; i++) {
        const index = i + 1;
        const departureAirport = document.getElementById('departureAirport' + index).value;
        const arrivalAirport = document.getElementById('arrivalAirport' + index).value;
        const departureTime = document.getElementById('departureTime' + index).value;
        const arrivalTime = document.getElementById('arrivalTime' + index).value;
        const plane = document.getElementById('plane' + index).value;
        extendFlight[index] = {
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            plane: plane,
        }
    }
    const data = {
        extendFlightCount: parseInt(extendFlightCount, 10),
        extendFlight: extendFlight
    }
    console.log("DATA", data);
    $.ajax({
        contentType: "application/json",
        url: '/flights/addextendflight',
        dataType: "json",
        type: 'POST', // http method
        data: JSON.stringify(data),
        success: function(data) {
            console.log('success');
            console.log(data);
            addFlightSegment(data);
        }
    });
}

function render(filename, data) {
    var fr = new FileReader();
    fr.onload = function() {
        document.getElementById('output')
            .textContent = fr.result;
    }
    var template = Handlebars.compile(readSingleFile());
    var output = template(data);
    return output;
}




function addFlightSegment(data) {
    const { departureAirportList, arrivalAirportList, currentDepartureAirport, planeList, extendFlightCount } = data;
    console.log("Hello", data);
    count++;
    document.getElementById("extendFlightCount").value = count;
    const hihi = document.getElementById("extendFlightCount").value;
    console.log("hihi", hihi);
    // for (let i = 1; i < count; i++) {
    //     if (i != count) {

    //     }
    // }
    if (count != 1) {
        $(`#remove`).remove();
    }
    const html =
        `<form id="add-flight">
        <input name="extendFlightCount" id="extendFlightCount" type="hidden"
                            value="{{extendFlightCount}}" class="form-control" />
    <div id="segment-${count}">
        <div class="card p-2">
        <h3 class="pb-2">Flight Segment Information:</h3>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="departureAirport">Departure Airport</label>
                        <input id="departureAirport${count}" class="form-control" name="departureAirport" value="${currentDepartureAirport.airport_name} (${currentDepartureAirport.symbol_code}) - ${currentDepartureAirport.city}" disable>
                        </input>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label for="arrivalAirport">Arrival Airport</label>
                        <div class="col">
                            <select id="arrivalAirport${count}" class="form-control form-select" name="arrivalAirport">
                            <option hidden value="default"></option>
                        </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="departureTime">Departure Time</label>
                        <div class="input-group date">
                            <span class="input-group-append">
                            <span class="input-group-text bg-light d-block">
                                <i class="fa fa-calendar"></i>
                            </span>
                            </span>
                            <input type="datetime-local" class="form-control" id="departureTime${count}" name="departureTime" />
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label for="arrivalTime">Arrival Time</label>
                        <div class="input-group date">
                            <span class="input-group-append">
                            <span class="input-group-text bg-light d-block">
                                <i class="fa fa-calendar"></i>
                            </span>
                            </span>
                            <input type="datetime-local" class="form-control" id="arrivalTime${count}" name="arrivalTime" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="plane">Plane</label>
                        <select class="form-control form-select" id="plane${count}" name="plane">
                        <option hidden></option>
                    </select>
                    </div>
                </div>
            </div>
        <div class="row">
            <div class="col d-flex justify-content-end my-auto" id="parent-remove-btn-${count}">
                <div id="remove" value="remove" class="btn btn-outline-danger">Remove</div>
            </div>
        </div>
    </div>
</form>`
    $('#list-segment').append(html);

    for (let index = 0; index < arrivalAirportList.length; index++) {
        const element = arrivalAirportList[index];
        $(`#arrivalAirport${count}`).append(`
    <option value=${element.id}>${element.airport_name} ( ${element.symbol_code}) - ${element.city}</option>
    `)
    }
    for (let index = 0; index < planeList.length; index++) {
        const element = planeList[index];
        $(`#plane${count}`).append(`
    <option value=${element.id}>${element.aircraft_number}</option>
    `)
    }
    flatpickr(`#departureTime${count}`, config);
    flatpickr(`#arrivalTime${count}`, config);
};












var seatClassCount = 0;
$("#add-seat-class-btn").on("click", function() {
    seatClassCount++;
    const html = ` <div id="seat-class-${seatClassCount}" class="card p-2">
    <h3 class="pb-2 pt-2">Seat Class Information:</h3>
    <div class="row mx-auto">
        <div class="col-4">
            <div class="form-group">
                <label for="seatClass">Seat Class</label>
                <select class="form-control form-select" id="seatClass-${count}">
                    {{#each seatClassList}}
                    <option value={{id}}>{{name}}</option>
                    {{/each}}
                </select>
            </div>
        </div>
        <div class="col-4">
            <div class="form-group">
                <label for="totalCount">Total Count</label>
                <input id="totalCount-${count}" type="number" class="form-control" value="1" min="1" />
            </div>
        </div>
        <div class="col-4">
            <div class="form-group">
                <label for="price">Price</label>
                <input id="price-${count}" type="number" class="form-control" value="100000" min="100000" />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex justify-content-end my-auto">
            <div class="btn btn-outline-danger">Remove</div>
        </div>
    </div>
</div>`
    $('#list-seat-class').append(html);
    for (let i = 0; i <= seatClassCount; i++) {
        $(`#remove-seat-${i}`).on("click", function() {
            $(`seat-class-${i}`).remove();

        })
    }

});