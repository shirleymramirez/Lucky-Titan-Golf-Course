$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAcxR76pg214qOPhV1zjs33_VfkUj-bB70",
        authDomain: "titan-golf-course.firebaseapp.com",
        databaseURL: "https://titan-golf-course.firebaseio.com",
        projectId: "titan-golf-course",
        storageBucket: "titan-golf-course.appspot.com",
        messagingSenderId: "1059074919743"
    };
    firebase.initializeApp(config);

    // current Time Update on HTML page
    setInterval(function() {
        $("#currentTime").text(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    // variable Declaration 
    var database = firebase.database();

    var firstName = "";
    var lastName = "";
    var numberOfPlayers;
    var numberOfCarts;
    var numberOfHours;
    var keyToUpdate;

    // capture submit button click 
    $("#inputForm").on("submit", function() {

        // storing and retrieving the most recent user.
        firstName = $("#firstNameInput").val().trim();
        lastName = $("#lastNameInput").val().trim();
        numberOfPlayers = $("#numberOfPlayers").val().trim();
        numberOfCarts = $("#numberOfCarts").val().trim();
        numberOfHours = $("#numberOfHours").val().trim();

        // store initial data to Firebase database.
        database.ref().push({
            firstName: firstName,
            lastName: lastName,
            numberOfPlayers: numberOfPlayers,
            numberOfCarts: numberOfCarts,
            numberOfHours: numberOfHours,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("input").val("");
        return false;
    });


    // firebase watcher on value event
    database.ref().on("child_added", function(childSnapshot) {

            //log everything that's coming out of snapshot
            var item = childSnapshot.val();

            // Change HTML Elements to reflect changes on Reservation Lists Table 
            $("#reservationLists").append('<tr class="' + childSnapshot.key + '">' +
                '<td id="playerName">' + item.firstName + " " + item.lastName + "</td>" +
                '<td id="numPlayers">' + item.numberOfPlayers + "</td>" +
                '<td id="numCarts">' + item.numberOfCarts + "</td>" +
                '<td id="numHours">' + item.numberOfHours + "</td>" +
                '<td id="actionGylp">' +
                '<button type="button" data-key="' + childSnapshot.key + '"class="edit-row"><span class="glyphicon glyphicon-pencil"></span></button>' +
                '<button type="button" data-key="' + childSnapshot.key + '"class="delete-row"><span class="glyphicon glyphicon-trash"></span></button>' +
                "</td>" + "</tr>");

            // Handle the errors
        },
        function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    );

    //  populate edit modal form
    $("body").on("click", ".edit-row", function(event) {
        console.log($(this).attr("data-key"));
        var key = $(this).attr("data-key");
        keyToUpdate = key;
        // obtain key value using once method - 
        // calls row values from database
        database.ref().child(key).once('value')
            .then(function(snapshot) {
                var value = snapshot.val();
                $("#editModal").modal();

                // populate modal with data from the database 
                $("#modalFirstName").val(value.firstName);
                $("#modalLastName").val(value.lastName);
                $("#modalNumberOfPlayers").val(value.numberOfPlayers);
                $("#modalNumberOfHours").val(value.numberOfHours);
                $("#modalNumberOfCarts").val(value.numberOfCarts);
                console.log(value);
            });
    });

    // handle changes on edit modal form
    $("#editForm").on("submit", function(event) {
        var databaseUpdate = database.ref().child(keyToUpdate);
        console.log(databaseUpdate);

        var firstName = $("#modalFirstName").val().trim();
        var lastName = $("#modalLastName").val().trim();
        var numOfPlayers = $("#modalNumberOfPlayers").val().trim();
        var numOfHours = $("#modalNumberOfHours").val().trim();
        var numOfCarts = $("#modalNumberOfCarts").val().trim();

        // store updated data to Firebase database.
        databaseUpdate.update({
            firstName: firstName,
            lastName: lastName,
            numberOfPlayers: numOfPlayers,
            numberOfCarts: numOfCarts,
            numberOfHours: numOfHours
        });

    });

    // delete button action
    $("body").on("click", ".delete-row", function(event) {
        console.log($(this).attr("data-key"));
        //obtain key value
        var key = $(this).attr("data-key");
        keyToUpdate = key;
        $("#deleteModal").modal();
    });

    // capturing ok/cancel button from the delete modal
    $(".deleteOkButton").on("click", function() {
        var databaseUpdate = database.ref().child(keyToUpdate);
        databaseUpdate.remove();

        $("#reservationLists tr." + keyToUpdate).remove();
    });

});