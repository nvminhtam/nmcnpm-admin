jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
    // $('.datepicker').datepicker({ "format": 'dd-mm-yyyy' }).datepicker("setDate", new Date()).datepicker({ "autoClose": true });
    $("#departureDatePicker").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
    $("#arrivalDatePicker").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});