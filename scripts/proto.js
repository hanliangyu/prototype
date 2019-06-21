document.getElementById("form1").onsubmit=function() {
result = parseInt(document.querySelector('input[name = "a1"]:checked').value);
if (result == 0) {
  result2 = "Please try again."};
if (result == 50) {
  result2 = "Correct."};
document.getElementById("grade").innerHTML = result2;
return false; // required to not refresh the page
}

function showQ1SolutionButton() {
  var x = document.getElementById('q1SolutionButton');
  if (x.style.display === 'none') {
    x.style.display = 'block';
  }
}
