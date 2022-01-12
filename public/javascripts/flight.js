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
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
    flatpickr("#departureTime", config);
    flatpickr("#arrivalTime", config);
});
const validate1 = {
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
    },
    errorPlacement: (error, element) => {
        isValid = false;
        element.css('background-color', '#ffdddd');
        error.css('color', 'red');
        error.css('margin-top', '10px');
        error.insertAfter(element);
        if (element.attr('name') == "departureTime" || element.attr('name') == "arrivalTime") {
            error.css('width', '90%');
        }
    },
    success: function(label, element) {
        $(element).css('background-color', 'var(--mint)');
        label.parent().removeClass('error');
        label.remove();
    },
};
const validate2 = {
    rules: {
        "plane": {
            valueNotEquals: "default"
        },
    },
    messages: {
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
$("#find-plane").click(function() {
    $('#add-flight-1').validate({
        ...validate1,
        submitHandler: function(form, event) {
            event.preventDefault();
            findPlane();
        }
    });
})

$("#add-extend-flight").click(function() {
    const extendFlightCount = document.getElementById("extendFlightCount").value;
    const newDepartureAirport = document.getElementById("departureAirport").value;
    const newArrivalAirport = document.getElementById("arrivalAirport").value;
    const newDepartureTime = document.getElementById("departureTime").value;
    const newArrivalTime = document.getElementById("arrivalTime").value;
    var extendFlight = new Array();
    for (let i = 0; i < extendFlightCount; i++) {
        const index = i + 1;
        const departureAirport = document.getElementById('departureAirport' + index).value;
        const arrivalAirport = document.getElementById('arrivalAirport' + index).value;
        const departureTime = document.getElementById('departureTime' + index).value;
        const arrivalTime = document.getElementById('arrivalTime' + index).value;
        extendFlight[i] = {
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
        }
    }
    const data = {
        extendFlightCount: parseInt(extendFlightCount, 10),
        newDepartureAirport: newDepartureAirport,
        newArrivalAirport: newArrivalAirport,
        newDepartureTime: newDepartureTime,
        newArrivalTime: newArrivalTime,
        extendFlight: extendFlight
    }
    console.log(data);


    $.ajax({
        contentType: "application/json",
        url: '/flights/addflight/',
        dataType: "json",
        type: 'POST', // http method
        data: JSON.stringify(data),
        success: function(data) {
            console.log('success');
            console.log(data);
            //location.reload();
            getBalance();
        }
    });
    // .done((res) => {
    //     console.log('success');
    //     location.reload();
    // });
    // .done((res) => {
    //     $("#errorMessage").empty();
    //     console.log("SUCCESS respones", res);
    //     window.location.href = "/planes";
    // }).fail((res) => {
    //     $("#errorMessage").empty();
    //     const msg = res.responseJSON.message;
    //     $("#errorMessage").append(error(msg));
    // });
})

function findPlane() {
    document.getElementById('plane').disabled = false;
}
var path = window.location.pathname;
if (path.match('/flights/addflight')) {
    // readSingleFile()

    // function readSingleFile(evt) {
    //     //Retrieve the first (and only!) File from the FileList object
    //     var f = evt.target.files[0];

    //     if (f) {
    //         var r = new FileReader();
    //         r.onload = function(e) {
    //             var contents = e.target.result;
    //             document.getElementById("ReadResult").innerHTML = contents;
    //         }
    //         r.readAsText(f);
    //     } else {
    //         alert("Failed to load file");
    //     }
    // }

    // document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
}