//Global Initial Parameters:
const layout = {
    autosize: true,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5,5], zeroline: true, title: "x"},
    yaxis: {range: [-5,5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};

var defaultHref = window.location.href;
var initX = 0, initY = 0;
var resolution = 2000;
// set the step of the x axis from -2pi to 2pi
var z = numeric.linspace(-2*Math.PI,2*Math.PI,resolution);
// Define our interacting Jquery elements

var Nslider = $("#NController");
var Lslider = $("#LController");
var Aslider = $("#AController");

//----------------------------------------------------------------------------------------------------------------------
//VERY IMPORTANT!!!
// 0 is triangular, 1 is square, 2 is sawtooth, 3 is delta's, 4 is parabola, 5 is x, 6 is |x|,
var shape = 0;
//----------------------------------------------------------------------------------------------------------------------
// decay and decay2 is to optimize the visualization of the amplitude of the component plots.
var decay = 0.9;
var decay2 = 0.6;

/* set the default layout of the graph to adjust for different amplitudes and different number of terms involved
it changes the range of the y-axis according to the amplitude and number of terms
so the setLayout allows the layout to fit the graph, instead of fixing the layout to some values
*/
function setLayout(){

    const new_layout = {
    autosize: true,
    margin: {l:45, r:0, t:20, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [], zeroline: true, title: "$x$"},
    yaxis: {range: [], zeroline: true, title: "$f_{n}(x)$"},
    aspectratio: {x:1, y:1}
};
    return new_layout;
}

// initialize the Cartesian coordinates for the plots and the functions
function initFourier() {
    Plotly.purge("graph");
    Plotly.newPlot("graph", computeComponents(z), setLayout());

    return;

}


// sum up all the number in the array
function adding(array){
    var result = 0
    for(var i =0; i<array.length; ++i){
        result+=array[i];
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Start. Functions to plot all the Fourier Series' components.

// a_n
// a_n part is to multiply the function f(x) by sin, and sin is an odd function
// after the if statement, each function has been optimized for better visualization
// comment behind each if statement is the original a_n of each function without optimization
function odd_selection2(n,A,L,type){
    //Represents the bn part of the function summand
    if (type===0){
        amplitude = (A*(-1)**n)*(decay)**n; // (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))
    } else if (type===1){
        amplitude = (A*(1-(-1)**n))*(decay)**n; // A/(n*np.pi) *(1-(-1)**n)
    } else if (type===2){
        amplitude = (A*(-1)**(n+1))*(decay)**n;  //  2*A*(-1)**(n+1) /(n*np.pi)
    } else if (type===3){
        amplitude = 0;
    } else if (type===4){
        amplitude = 0 // (((4*L**2)/(n*Math.PI)**2)*(-1)**n)
    } else if (type===5){
        amplitude = 0.5*A*(2*(-1)**(n+1)*decay**n); //A*(2*L/(n*Math.PI)*(-1)**(n+1)
    } else if (type===6){
        amplitude = 0;
    }
    return amplitude;
}
//Note with both the an and bn part, the amplitude isn't necessarily mathematially correct, if that was done the components just
//get too small, so we use a decay power law, so that the components dont get too small too quickly
// b_n
// b_n part is to multiply the function f(x) by cos, and cos is and even function
function even_selection2(n,A,L,type){
    //Gives the an part of the function sum
    if (type === 6){
        if (n===0){
            amplitude2= A*L;
        } else {
            amplitude2 = 2*A*((-1)**(n)-1);
               }
               }
    else if (type ===3){
        if (n === 0 ){
            amplitude2 = 1/(2*L);
        }else{
             amplitude2 = 1/L;
             }
             }
    else if (type ===4){
        if (n === 0 ){
            amplitude2 = A*(L**2)/3;
        } else{
         amplitude2 =(4/Math.PI)*A*(L**2)*((-1)**n)*decay**n;
            }
            }
    else if (type === 0 || type === 1 || type === 2 || type === 5){
        amplitude2= 0;}
    return amplitude2;
}

// return the data that stores one component of the Fourier Series
function plotSines(n,x,shape){
    //Plots individual components that are being built up to the total function
    var L = Lslider.val();
    var A = Aslider.val();

    var x_n = [];
    var y_n = [];
    var spacing=3*A;
    var spacing2 = Math.sqrt((odd_selection2(n,A,L,shape))**2+(even_selection2(n,A,L,shape)))+1;


    for (var i = 0; i < x.length ; ++i){
        x_n.push(x[i]);
        y_n.push(((odd_selection2(n,A,L,shape))*Math.sin(n*Math.PI*x[i]/L)+(even_selection2(n,A,L,shape))*Math.cos(n*Math.PI*x[i]/L))+2*spacing*(n));
    }
    //y value gets shifted up so that the plots are distinctly different

    var data=
        {
            type:"scatter",
            mode:"lines",
            x: x_n,
            y: y_n,
            line:{color:"rgb(0,N*10,0)",width:3, dash:"dashed"},
        }
    ;
    return data;

}

// get each single component by recalling plotSines, and plot out all the components of the Fourier Series
function computeComponents(x){
    var N = parseFloat(Nslider.val());
    var data_value=[];
    for (var n=1; n<N+1; ++n){
        data_value.push(plotSines(n,z,shape));
    }

    return data_value;

}

// End. Functions for to plot all the Fourier Series' components.
//----------------------------------------------------------------------------------------------------------------------


/** updates the plot according to the slider controls. */
// Plotly.animate does not support bar charts, so need to reinitialize the Cartesian every time.
function updatePlot() {
    var data;
    // NB: updates according to the active tab
    var selectedValue = document.getElementById("Select").value; // finds out which function is active
    initFourier();
}

function main() {

    /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
    $("input[type=range]").each(function () {
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit"));
            //NB: Display values are restricted by their definition in the HTML to always display nice number.
            updatePlot(); //Updating the plot is linked with display (Just My preference)
        });

    });

    // as you select the functions you want from the scroll down
    // change the shape and the plots
    // change the titles and the math derivations
    $('#Select').change(function(){
        var selectedValue = document.getElementById("Select").value;
        if (selectedValue==="main"){
            shape = 0;
        } else if (selectedValue==="triangular"){
            shape = 0;
        } else if (selectedValue==="square"){
            shape = 1;
        } else if (selectedValue==="sawtooth"){
            shape = 2;
        } else if (selectedValue==="dirac"){
            shape = 3;
        } else if (selectedValue==="parabola"){
            shape = 4;
        } else if (selectedValue==="linear"){
            shape = 5;
        } else if (selectedValue==="mode"){
            shape = 6;
        }
        $(".title").hide();
        $("#"+selectedValue+"Title").show();
        initFourier();
    })
    //The First Initialisation - I use 's' rather than 'z' :p
    initFourier();
}
$(document).ready(main); //Load main when document is ready.