//ON-LOAD
window.onload = function () {
    //call init function to setup images for preload
    init();
};

// INIT
function init() {
    drop_down_Menu();
}

//drop-down menu for mobile version (below 680px)
function drop_down_Menu() {
    var x = document.getElementById("drop_down_Click");
    /*change top_nav to top_nav.responsive*/
    if (x.className === "top_nav") {
        x.className += " responsive";
        console.log("changed");

    } else {
        x.className = "top_nav";
    }
}

function selectFilter(selected) {
    // console.log("selection changed to " + selected);
    let filterBTN = document.getElementById("filter_BTN");

    let value = selected.toString();

    if (value === "name") {
        // console.log("Name selected");
        filterBTN.href = "/restaurants/name";
        // console.log(filterBTN.href.toString());
    }
    if (value === "neighborhood") {
        // console.log("Neighborhood selected");
        filterBTN.href = "/restaurants/neighborhood";
        // console.log(filterBTN.href.toString());
    }
    if (value === "cuisine") {
        // console.log("Cuisine selected");
        filterBTN.href = "/restaurants/cuisine";
        // console.log(filterBTN.href.toString());
    }

}


var i = 0;
function incrementValue() {
    if(document.getElementById('rating').value<5){
        i++;
        document.getElementById('rating').value = i;
    }
}
function decrementValue() {
    if(document.getElementById('rating').value > 0){
        i--;
        document.getElementById('rating').value = i;
    }
}