var navBar = document.getElementById('myNavBar');

window.onload = function(){
    if(this.inIframe()){
        this.navBar.style.display = "none";
    }
}



function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}