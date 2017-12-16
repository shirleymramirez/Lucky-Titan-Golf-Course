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

    //------------------ Current Time Update on HTML page --------------------
    setInterval(function() {
        $("#currentTime").text(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    //------------------ Variable Declaration ----------------------------------
    var database = firebase.database();

    var firstName = "";
    var lastName = "";
    var numberOfPlayers = "";
    var numberOfCarts = "";
    var numberOfHours;

    //------------------ capture submit button click ------------------------------
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


    //----------------- firebase watcher on value event-----------------------------------------
    database.ref().on("child_added", function(childSnapshot) {

            //log everything that's coming out of snapshot
            var item = childSnapshot.val();

            // Change HTML Elements to reflect changes on Reservation Lists Table 

            $("#reservationLists").append('<tr class="' + childSnapshot.key + '"><td>' + item.firstName + "</td>" +
                "<td>" + item.lastName + "</td>" +
                '<td id="numPlayers">' + item.numberOfPlayers + "</td>" +
                '<td id="numCarts">' + item.numberOfCarts + "</td>" +
                '<td id="numHours">' + item.numberOfHours + "</td>" +
                "<td>" +
                '<button type="button" class="edit-row"><span class="glyphicon glyphicon-pencil"></span></button>' +
                '<button type="button" class="delete-row"><span class="glyphicon glyphicon-trash"></span></button>' +
                "</td>" + "</tr>");


            // Handle the errors
        },
        function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    );

    // ---------------------------------------------------------------------------------------------------
});