function myPluginLoadEvent(func) {
    // assign any pre-defined functions on 'window.onload' to a variable
    var oldOnLoad = window.onload;
    // if there is not any function hooked to it
    if (typeof window.onload != 'function') {
        // you can hook your function with it
        window.onload = func
    } else { // someone already hooked a function
        window.onload = function () {
            // call the function hooked already
            oldOnLoad();
            // call your awesome function
            func();
        }
    }
}
 
// pass the function you want to call at 'window.onload', in the function defined above
myPluginLoadEvent(function(){
    // your awesome code to run on window.onload
    alert('window loaded');
});