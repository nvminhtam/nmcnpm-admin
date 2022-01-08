jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
    // const picker = datepicker('#datePicker', {

    //     // Customizations.
    //     formatter: (input, date, instance) => {
    //         // This will display the date as `1/1/2019`.
    //         input.value = date.toDateString()
    //     },

    //     // Settings.
    //     alwaysShow: true, // Never hide the calendar.
    //     dateSelected: new Date(), // Today is selected.
    //     maxDate: new Date(2099, 0, 1), // Jan 1st, 2099.
    //     minDate: new Date(2016, 5, 1), // June 1st, 2016.
    //     startDate: new Date(), // This month.
    //     showAllDates: true, // Numbers for leading & trailing days outside the current month will show.
    // })
});