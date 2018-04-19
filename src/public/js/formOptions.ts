$(document).ready(function() {
    $("#coa").change(function(event) {
      $.ajax("/proof/selections/" + (this as any).value, {
        complete: (data) => {
          // console.log(data);
          $("#proofAddress").remove("option");
          $("#proofIdentity").remove("option");
          $("#proofDOB").remove("option");
          $.each(data.responseJSON.address, function (i, item) {
            $("#proofAddress").append($("<option>", {
                value: i,
                text : item
              }));
            });
          $.each(data.responseJSON.identity, function (i, item) {
            $("#proofIdentity").append($("<option>", {
                value: i,
                text : item
              }));
            });
          $.each(data.responseJSON.dob, function (i, item) {
            $("#proofDOB").append($("<option>", {
              value: i,
              text : item
              }));
          });
        }
      });
    });
  });