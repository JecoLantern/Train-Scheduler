// Initialize Firebase
var config = {
    apiKey: "AIzaSyBUj7SCo8yVi-6FZJlIRGo6hdQtvbTVnzQ",
    authDomain: "train-scheduler-86bd7.firebaseapp.com",
    databaseURL: "https://train-scheduler-86bd7.firebaseio.com",
    projectId: "train-scheduler-86bd7",
    storageBucket: "",
    messagingSenderId: "638170716783"
};
firebase.initializeApp(config);

var Train = {};

Train = ({
    startTimer: function () {
        setInterval('window.location.reload()', 60000);
    },
});

jQuery(document).ready(function(){
    Train.startTimer();
});

var database = firebase.database();

$(function() {
    $("#first_train_input").timepicker({ 'timeFormat': 'H:i' });
});

$("#add_new_train").on("click", function (){
    var trainName = $("#train_name_input").val().trim();
    var destinationTrain = $("#destination_input").val().trim();
    var firstTrain = $("#first_train_input").val().trim();
    var frequencyTrain = $("#frequency_input").val().trim();

    if(trainName === "" | destinationTrain === "" | firstTrain === "" | frequencyTrain === "")
    return;

    

    var addNewTrain = {
        name: trainName,
        destination: destinationTrain,
        first: firstTrain,
        frequency: frequencyTrain
    }

    database.ref().push(addNewTrain);

    console.log(addNewTrain.name);
    console.log(addNewTrain.destination);
    console.log(addNewTrain.first);
    console.log(addNewTrain.frequency);

    $("#train_new_input").val("");
    $("#destination_input").val("");
    $("#first_train_input").val("");
    $("#frequency_input").val("");

    return false;
});

database.ref().on("child_removed", function(childSnapshot) {
    console.log(childSnapshot.val());
});

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var destinationTrain = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().first;
    var frequencyTrain = childSnapshot.val().frequency;
    var trainData = [
        trainName,
        destinationTrain,
        firstTrain,
        frequencyTrain
    ];

    console.log(trainName);
    console.log(destinationTrain);
    console.log(firstTrain);
    console.log(frequencyTrain);
    
    var firstTimeConverted = moment(firstTrain, "hh:mm A").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("HH:mm"));

    var differenceTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in Time: " + differenceTime);

    var timeRemaining = differenceTime % frequencyTrain;
    console.log(timeRemaining);

    var timeMinutesUntilTrain = frequencyTrain - timeRemaining;
    console.log("Minutes Until Train: " + timeMinutesUntilTrain);

    var nextTrain = moment().add(timeMinutesUntilTrain, "minutes").format("hh:mm A");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm A"));

    $("#train_table > tbody").append("<tr><td class='animated flipInX slower delay-5s'><a href='#' id='remove_train' data-train='" + trainData + "'><img src='assets/images/trashcan-delete.png' alt='trashCanDeleteIcon' class='mx-auto d-block'></a></td><td class='animated flipInX slower delay-5s'>" + trainName + "</td><td class='animated flipInX slower delay-5s'>" + destinationTrain + "</td><td class='animated flipInX slower delay-5s'>" + frequencyTrain + "</td><td class='animated flipInX slower delay-5s'>" + nextTrain + "</td><td class='animated flipInX slower delay-5s'>" + timeMinutesUntilTrain + "</td></tr>");

    $("a").bind("click", function() {
        var train = $(this).attr("data-train").split(",");

        var deleteQueryRef = database.ref().orderByChild("name").equalTo(train[0]);
        deleteQueryRef.on("child_added", function(snapshot) {
            snapshot.ref.remove();
            location.reload();
        });
        return true;
    });
});