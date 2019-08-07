import Framework7 from 'framework7/framework7.esm.bundle';
import Dom7 from 'dom7';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from "./firebase.js";
import app from "./F7App.js";
//import "./book.js";
require("date-utils");

firebase.initializeApp(config);


const $$ = Dom7;

var userError = document.getElementById("userError").value;
var firstName = document.getElementById("firstName").value;
var lastName = document.getElementById("lastName").value;
var email = document.getElementById("email").value;
var userError=document.getElementById("userError");
var outFirstName = document.getElementById("outFirstName");
var outLastName = document.getElementById("outLastName");
var outEmail = document.getElementById("outEmail");
var accessEndDate = document.getElementById("grant-free");

document.getElementById("search").addEventListener("click", evt=>{
    evt.preventDefault();
    firebase.database().ref("user/").orderByChild("email").equalTo(email).on("child_added", function (snapshot) {
        userError.innerHTML="I tried";
        outFirstName.innerHTML = snapshot.val().firstName;
        outLastName.innerHTML = snapshot.val().lastName;
        outEmail.innerHTML = snapshot.val().email;
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        
        console.log(errorCode);
    });
})




// var ipAddress = "";
// var ipKey = "";
// var counter = 0;

// document.getElementById("try-free").addEventListener("click", evt => {
//     evt.preventDefault();
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             fetch('https://api.ipify.org?format=json').then(function (response) {
//                 return response.json();
//             }).then(function (myJson) {
//                 ipAddress = myJson.ip;
//                 ipKey = ipAddress.replace(/\./g, "_");
//                 //console.log(ipKey);
//                 //const ipSearch = firebase.database().ref("user").child("FreeUser").orderByKey();
//                 findIPAddress(ipKey);
//                     })
//                 }
//         else {
//             firebase.auth().signInAnonymously();
//         }
//     }); });


// function findIPAddress(ipAddress){
//    //var ipSearch = firebase.database().ref("user/").orderByChild("ipAddress").equalTo(ipAddress);
//     var ipSearch = firebase.database().ref("user/FreeUser/")
//    ipSearch.once("value", function (snapshot) {
//         console.log(snapshot.val())
//         const oItems=snapshot.val();
//         const aKeys=Object.keys(oItems);
//         for (let n=0; n<aKeys.length; n++){
//             if (aKeys[n]==ipAddress){
//                 counter = oItems[aKeys[n]].timesAccessed;
//                 if ((counter)&&counter < 2) {
//                     firebase.database().ref("user/FreeUser/" + ipAddress).update({
//                         timesAccessed: 2
//                     })
//                 }
//                 else {
//                     window.location.replace("../pages/payment.html");
//                 }
//             }
//             else{
//                 const dateCreated = Date.today().toFormat("YYYY-MM-DD");
//                 firebase.database().ref("user/FreeUser/"+ipAddress).set({
//                     timesAccessed: 1,
//                     dateCreated: dateCreated
//                 })
//             }
//         }
        
        
//         if (!snapshot.val()) {
//             const sUser = firebase.auth().currentUser.uid;
//             const dateCreated = Date.today().toFormat("YYYY-MM-DD");
//             firebase.database().ref("user/" + sUser).set({
//                 userType: "free",
//                 ipAddress: ipAddress,
//                 timesAccessed: 1,
//                 dateCreated: dateCreated
//             })
//         } else {
//             ipSearch.on("value", function (snapshot) {
//                 const userData = snapshot.val();
//                 const oldUser = userData.key;
//                 const counter = userData.timesAccessed;
//                 if (counter < 2) {
//                     firebase.database.ref("user/" + oldUser).update({
//                         timesAccessed: 2
//                     })
//                 }
//                 else {
//                     window.location.replace("../pages/payment.html");
//                 }
//             })
//         })
//     }



    // function saveURL() {
    //     alert("clicked save URL")
    //     var clientURL = document.getElementById("clientURL").value;
    //     const sUser = firebase.auth().currentUser.uid;
    //     console.log(clientURL + sUser);
    //     const dateSearched = Date.today().toFormat("YYYY-MM-DD-hh-mm-ss");
    //     firebase.database().ref("user/" + sUser + "/report/" + dateSearched).set({
    //         url: clientURL
    //     })
    //     return true;
    // }



    //Regex for Email - Validate email is well formed
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validateTextOnly(name) {
        var re = /^[a-zA-Z]+$/;
        return re.test(name);
    }

    //Password must be at least 6 letters long
    function validatePassword(password) {
        var re = /^(?=.{6,})/;
        return re.test(password);
    }

    //If payment is successful
    document.getElementById("payPal").addEventListener("click", evt => {
        const dateReceived = Date.today().toFormat("YYYY-MM-DD");
        const sUser = firebase.auth().currentUser.uid;
        firebase.database().ref("user/" + sUser + "/payment/" + dateReceived).set({
            paymentMethod: "PayPal",
            verificationCode: "code"
        }).then(() =>
            //window.location.replace("../pages/paidUserDash.html");
            console.log("redirect to dashboard")
        ).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("signUpError").innerHTML = "Something went wrong: " + errorCode + errorMessage;
            console.log("Error:" + errorCode + ". " + errorMessage);
        });
    })

    //Login
    // document.getElementById("loginSubmit").addEventListener("click", evt => {
    //     evt.preventDefault();
    //     const userEmail = document.getElementById("emailUser").value;
    //     const password = document.getElementById("passwordUser").value;
    //     if (validateEmail(userEmail) || userEmail != "") {
    //         if (validatePassword(password) || password != "") {
    //             firebase.auth().signInWithEmailAndPassword(userEmail, password).then(
    //                 () => {
    //                     const sUser = firebase.auth().currentUser.uid;
    //                     //var  ref = firebase.database().ref("users/");
    //                     console.log(sUser);
    //                     // ref.on("value", redirect, errorData);
    //                     //window.location.replace("../pages/paidUserDash.html");
    //                 }).catch(function (error) {
    //                     // Handle Errors here.
    //                     var errorCode = error.code;
    //                     var errorMessage = error.message;
    //                     document.getElementById("loginError").innerHTML = "Something went wrong: " + errorCode + ". " + errorMessage;
    //                     console.log("Error:" + errorCode + "." + errorMessage);
    //                 });
    //         }
    //         else {
    //             document.getElementById("loginError").innerHTML = "That password seems too short. Try again";
    //         }
    //     }
    //     else {
    //         document.getElementById("loginError").innerHTML = "That doesn't look like an email address. Try again!";
    //     }

    // });

    // function redirect(data){
    //     const user =data.val();
    //     const userId = Object.keys(user);
    //     var userType =userId.userType;
    //     if (userType == "pending"){
    //         window.location.replace("../pages/payment.html");
    //     }
    //     else if (userType == "paidUser"){
    //         window.location.replace("../pages/paidUserDash.html");
    //     }
    //     else if (userType == "admin"){
    //         window.location.replace("../pages/adminDash.html");
    //     }
    //     else{
    //         document.getElementById("loginError").innerHTML = "Something went wrong. We weren't able to verify your user type. Please contact the admin.";
    //     }
    // }
    // function errorData(errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // };

    //Logout
    document.getElementById("logout").addEventListener("click", () => {
        firebase.auth().signOut().then(() => {
            //Send the user back to the home page
            //window.location.replace("../index.html");
            document.getElementById("userMessage").innerHTML = "You have been logged out";
        }).catch(() => {
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("logoutError").innerHTML = "Something went wrong: " + errorCode + ". " + errorMessage;
            console.log("Error:" + errorCode + "." + errorMessage);
        });
    });

//Try for free (on click of try for free)
// document.getElementById("tryForFree").addEventListener("click", evt => {
//     evt.preventDefault();
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             //check user type 
//             const sUser = firebase.auth().currentUser.uid;
//             const userType = firebase.database().ref("user/" + sUser + "/userType").on("value", (snapshot) => {
//                 if (!snapshot.val())  {
//                     const dateCreated = Date.today().toFormat("YYYY-MM-DD");
//                     firebase.database().ref("user/" + sUser).set({
//                         userType: "freeUser",
//                         ipAddress: "insertIPHere",
//                         dateCreated: dateCreated
//                     })
//                 }else{
//                     //Want to check the userType then find other users with the same userType to see if they have the same Ip address
//                     userType=snapshot.val();
//                     console.log(userType);
//                 }
//                 // console.log(snapshot.val());
//                 //console.log(userType);
//             });
//         }
//         else {
//             firebase.auth().signInAnonymously();
//             //window.location.href="../pages/freeTry";
//             // console.log("logged in");
//         }
//     });

// });

//Password reset - Pasted in
// document.getElementById("submitPasswordReset").addEventListener("click", evt => {
//     evt.preventDefault();
//     var userEmail = document.getElementById("emailForResend").value;
//     firebase.auth().sendPasswordResetEmail(userEmail).then(() => {
//         document.getElementById("userMessage").innerHTML = "Password reset link sent!";
//     }).catch(() => {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         document.getElementById("userMessage").innerHTML = "Something went wrong: " + errorCode + ". " + errorMessage;
//         console.log("Error:" + errorCode + "." + errorMessage);
//     });
// });









// //////////////////////////////////////////////////////////////////////////////////////////
// //Rich's Code //////////////////////////////
// // document.getElementById("loginWithGoogle").addEventListener("click", (evt) => {
// //     const oProvider = new firebase.auth.GoogleAuthProvider;
// //     firebase.auth().signInWithRedirect(oProvider);
// // })

// // firebase.auth().onAuthStateChanged((user) => {
// //     if (user) {
// //         app.tab.show("#tab2", true);
// //         console.log(user);
// //     } else {
// //         app.tab.show("#tab1", true);
// //         console.log("logged out");
// //     }
// // });

// $$("#loginForm").on("submit", (evt) => {
//     evt.preventDefault();
//     var formData = app.form.convertToData('#loginForm');
//     firebase.auth().signInWithEmailAndPassword(formData.username, formData.password).then(
//         () => {
//             // could save extra info in a profile here I think.
//             app.loginScreen.close(".loginYes", true);
//         }
//     ).catch(function (error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         $$("#signInError").html(errorCode + " error " + errorMessage)
//         console.log(errorCode + " error " + errorMessage);
//         // ...
//     });

// });

// $$("#signUpForm").on("submit", (evt) => {
//     evt.preventDefault();
//     var formData = app.form.convertToData('#signUpForm');
//     //alert("clicked Sign Up: " + JSON.stringify(formData));
//     firebase.auth().createUserWithEmailAndPassword(formData.username, formData.password).then(
//         () => {
//             // could save extra info in a profile here I think.
//             app.loginScreen.close(".signupYes", true);
//         }
//     ).catch((error) => {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         $$("#signUpError").html(errorCode + " error " + errorMessage)
//         console.log(errorCode + " error " + errorMessage);
//     });

// });