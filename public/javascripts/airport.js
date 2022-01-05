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
                                Update account successfully!
                            </div>
                        </div>`
const errorPlacement = (error, element) => {
    isValid = false;
    element.css('background-color', '#ffdddd');
    error.css('color', 'red');
    error.css('margin-top', '10px');
    error.insertAfter(element);
}
const unhighlight = (element) => {
    isValid = true;
    $(element).css('background-color', 'var(--mint)');
}

var path = window.location.pathname;
if (path.match('/airports/addairport')) {
    // validate add airport form
    $("#add-airport-form").validate({
        rules: {
            "airportName": {
                required: true,
            },
            "symbolCode": {
                required: true,
                maxlength: 5,
            },
            "province": {
                required: true,
            },
            "city": {
                required: true,
            },
        },
        messages: {
            "airportName": {
                required: "Please enter an airport name",
            },
            "symbolCode": {
                required: "Please enter a symbol code",
                maxlength: "Symbol code must be at most 5 characters long"
            },
            "province": {
                required: "Please enter province",
            },
            "city": {
                required: "Please enter city",
            },
        },
        errorPlacement: errorPlacement,
        unhighlight: unhighlight,
        submitHandler: function(form, event) {
            event.preventDefault();
            submitForm();
        }
    });

    // handle submit add airport form
    function submitForm() {
        const airportName = document.getElementById("airportName").value;
        const symbolCode = document.getElementById("symbolCode").value;
        const province = document.getElementById("province").value;
        const city = document.getElementById("city").value;
        const data = {
            airportName: airportName,
            symbolCode: symbolCode,
            province: province,
            city: city,
        }
        $.ajax({
            contentType: "application/json",
            url: '/airports/addairport/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            window.location.href = "/airports";
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}

if (path.match('/airports/updateairport/')) {
    $("#update-airport-form").validate({
        rules: {
            "airportName": {
                required: true,
            },
            "symbolCode": {
                required: true,
                maxlength: 5,
            },
            "province": {
                required: true,
            },
            "city": {
                required: true,
            },
        },
        messages: {
            "airportName": {
                required: "Please enter an airport name",
            },
            "symbolCode": {
                required: "Please enter a symbol code",
                maxlength: "Symbol code must be at most 5 characters long"
            },
            "province": {
                required: "Please enter province",
            },
            "city": {
                required: "Please enter city",
            },
        },
        errorPlacement: errorPlacement,
        unhighlight: unhighlight,
        submitHandler: function(form, event) {
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm() {
        const id = document.getElementById("id").value;
        const airportName = document.getElementById("airportName").value;
        const symbolCode = document.getElementById("symbolCode").value;
        const province = document.getElementById("province").value;
        const city = document.getElementById("city").value;
        const data = {
            id: id,
            airportName: airportName,
            symbolCode: symbolCode,
            province: province,
            city: city,
        }
        $.ajax({
            contentType: "application/json",
            url: '/airports/updateairport/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            $("#successfullyMessage").append(success);
            setTimeout(() => {
                window.location.href = '/airports';
            }, 2000);
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}