const config = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
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