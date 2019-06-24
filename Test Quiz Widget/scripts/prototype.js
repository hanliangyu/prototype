/* JS code for the prototype*/

/* Function for the quiz */
function answer_question1(){
  result = $('input[name=a1]:checked').val();
  console.log(result);
  if (result == 0) {
    result2 = "Please try again. Try the next page for some hints."};
  if (result == 50) {
    result2 = "Correct."};
  $("#grade").html(result2);
  console.log(result2); // required to not refresh the page
  return false;
};

function answer_question2(){
  result = $('input[name=a2]:checked').val();
  console.log(result);
  if (result == 0) {
    result2 = "Please try again. Try the next page for some hints."};
  if (result == 50) {
    result2 = "Correct."};
  $("#grade").html(result2);
  console.log(result2); // required to not refresh the page
  return false;
};

function showQ1SolutionButton() {
  var x = document.getElementById('q1SolutionButton');
  if (x.style.display === 'none') {
    x.style.display = 'block';
  }
}

function showQ1Solution() {
  var x = document.getElementById('q1Solution');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}


/* Main Function */
function main() {

    /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
    $("input[type=range]").each(function () {
        /*Allows for live update for display values*/
        $(this).on('input', function () {
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
            //NB: Display values are restricted by their definition in the HTML to always display nice number.
            updatePlot(); //Updating the plot is linked with display (Just My preference)
        });

    });

    /*Tabs*/
    $(function () {
        $('ul.tab-nav li a.button').click(function () {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initFourier(href); //re-initialise when tab is changed
            return false;
        });
    });

    // as you select the functions you want from the scroll down
    // change the shape and the plots
    // change the titles and the math derivations


    $('#Select').change(function () {
        var selectedValue = document.getElementById("Select").value;
        if (selectedValue === "main") {
            shape = 0;
        } else if (selectedValue === "q1") {
            shape = 0;
        } else if (selectedValue === "q2") {
            shape = 1;
        } else if (selectedValue === "q3") {
            shape = 2;
        } /*else if (selectedValue === "dirac") {
            shape = 3;
        } else if (selectedValue === "parabola") {
            shape = 4;
        } else if (selectedValue === "mode") {
            shape = 6;
        } */

        $(".derivation").hide();
        $("#" + selectedValue).show();
        $(".title").hide();
        $("#" + selectedValue + "Title").show();

        if (selectedValue != "q1") {
            $('.tab-pane.active').removeClass('active');
            $('#maths').addClass('active');
        }

    })
    $("#sub0").click(answer_question1)
    $("#sub1").click(answer_question2)

}

$(document).ready(main); //Load main when document is ready.
