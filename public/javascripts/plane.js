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
if (path.match('/planes/addplane')) {
    // validate add plane form
    $("#add-plane-form").validate({
        rules: {
            "aircraftNumber": {
                required: true,
            },
        },
        messages: {
            "aircraftNumber": {
                required: "Please enter a aircraft number",
            },
        },
        errorPlacement: errorPlacement,
        unhighlight: unhighlight,
        submitHandler: function(form, event) {
            event.preventDefault();
            submitForm();
        }
    });

    // handle submit add plane form
    function submitForm() {
        const aircraftNumber = document.getElementById("aircraftNumber").value;
        const airlineName = document.getElementById("airlineName").value;
        const data = {
            aircraftNumber: aircraftNumber,
            airlineName: airlineName
        }
        $.ajax({
            contentType: "application/json",
            url: '/planes/addplane/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            window.location.href = "/planes";
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}

if (path.match('/planes/updateplane/')) {
    $("#update-plane-form").validate({
        rules: {
            "aircraftNumber": {
                required: true,
            },
        },
        messages: {
            "aircraftNumber": {
                required: "Please enter a aircraft number",
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
        const aircraftNumber = document.getElementById("aircraftNumber").value;
        const airlineName = document.getElementById("airlineName").value;
        const data = {
            id: id,
            aircraftNumber: aircraftNumber,
            airlineName: airlineName
        }
        $.ajax({
            contentType: "application/json",
            url: '/planes/updateplane/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            $("#successfullyMessage").append(success);
            setTimeout(() => {
                window.location.href = '/planes';
            }, 2000);
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}