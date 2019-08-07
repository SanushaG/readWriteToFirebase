import Framework7 from 'framework7/framework7.esm.bundle';
import $$ from 'dom7';
import firebase from 'firebase/app';
import app from "./F7App.js";
import 'firebase/database';
import 'firebase/auth';



$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("books/" + sUser).on("value", (snapshot) => {
        
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);

        $$("#bookList").html("");
        for (let n = 0; n < aKeys.length; n++) {
            
            let sBook = `${oItems[aKeys[n]].title} <br> Author: ${oItems[aKeys[n]].author} <br> Genre: ${oItems[aKeys[n]].genre}  <br> Published: ${oItems[aKeys[n]].published}`;
            
            if(oItems[aKeys[n]].datePurchased){
                sBook = "<span class=\"completed\">" + sBook+ "</span>";
            }

            let sCard = `
            <div class="card">
            <div class="card-content card-content-padding"> ${sBook}</div>
            <div class="row"><div class="col"><button id="d${sUser+ "/" + aKeys[n]}" class="delete button">I Don't Need This</button></div><div class="col"><button id="f${sUser+ "/" + aKeys[n]}" class="finish button">I Bought This</button></div></div>
            </div>
            `
            
            $$("#bookList").append(sCard);

            
        }

        createDeleteHandlers();
        createFinishHandlers();
    });

});

function createDeleteHandlers() {
    var aClassname = document.getElementsByClassName("delete");
    for (var n = 0; n < aClassname.length; n++) {
        aClassname[n].addEventListener("click", (evt) => {
            const sId = evt.target.id.substr(1);
            firebase.database().ref("books/" + sId).remove();
        })
    }
}

function createFinishHandlers() {
    var aClassname = document.getElementsByClassName("finish");
    for (var n = 0; n < aClassname.length; n++) {
        aClassname[n].addEventListener("click", (evt) => {
            const sId = evt.target.id.substr(1);
            const sPurchased = new Date().toISOString().replace(".", "_");
            firebase.database().ref("books/" + sId + "/datePurchased").set(sPurchased);
        })
    }
}

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("books/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});