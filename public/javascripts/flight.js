jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
    $("#departureDatePicker").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
    $("#arrivalDatePicker").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});