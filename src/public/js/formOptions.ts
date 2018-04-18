$(document).ready(function() {
    (document.getElementById("coa") as HTMLSelectElement).addEventListener("change", function(event) {
      console.log(this.value);
  });
  });