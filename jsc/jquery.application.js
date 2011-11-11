/*
* Version: 00.02
* Date: 10.11.2011
* By: usw-usf.de
*/

$(function () {

    // tell us the required event...
    var _clickEventType = ((document.ontouchstart !== null) ? 'click' : 'touchstart');

    // determine whether in web clip mode or not
    if (("standalone" in window.navigator) && !window.navigator.standalone) {
        if (navigator.userAgent.match(/iPhone/i))
            // make the font-size smaller cause of the limited window size
            $("html").css("font-size", "12.8px");
        
        $("#pleasenote").show().fadeOut(15000);
    }

    // bind to the color magic
    $("#hexpad li").bind(_clickEventType, function () {
        var $this = $(this),
            character = $this.html(),
            $hex = $("#value", "#output");

        //come on it's only HEX
        if ($hex.text().length >= 6)
            return;

        $hex.html($hex.html() + character);

        if ($hex.text().length >= 3) {
            var rgbVal = hexToRgb($hex.text());

            if (rgbVal != null) {
                $("#rgb-value", "#output").html(rgbVal.R + " " + rgbVal.G + " " + rgbVal.B);

                var hslVal = rgbToHsl(rgbVal.R, rgbVal.G, rgbVal.B);
                $("#hsl-value", "#output").html(hslVal.H + "<b>°</b> " + hslVal.S + "<b>%</b> " + hslVal.L + "<b>%</b>");

                var fontColor = setFontColor(rgbVal);
                $("#preview", "#output").css({ "background-color": "#" + $hex.text(), "color": "rgba(" + fontColor.R + "," + fontColor.G + "," + fontColor.B + "," + "1)" });
            }
        }
    });

    //online or offline detection
    function checkNetworkStatus() {
        if (navigator.onLine) {
            // set up a call to a static JSON object stored on the server.
            // the JSON object is not within our manifest. 
            // got it, we're online. otherwise we're offline.
            $.ajaxSetup({
                async: true,
                cache: false,
                context: $("#status"),
                dataType: "json",
                error: function () {
                    // to keep it simple: every error means offline for us
                    showNetworkStatus(false);
                },
                success: function () {
                    showNetworkStatus(true);
                },
                timeout: 5000,
                type: "GET",
                url: "jsc/network.js"
            });
            $.ajax();
        } else {
            showNetworkStatus(false);
        }
    }

    // set the CSS class according to the network status
    function showNetworkStatus(online) {
        var $e = $("#online");
        if (online) {
            $e.addClass("online").removeClass("offline");
        } else {
            $e.addClass("offline").removeClass("online");
        }
    }

    // a simple reset
    function clear() {
        $("#value, #rgb-value, #hsl-value", "#output").empty();
        $("#preview", "#output").css({ "background-color": "", "color": "#000" });
    }

    //mobile specific events
    window.ondevicemotion = function (event) {
        var ax = event.accelerationIncludingGravity.x;
        if (ax > 10.0) clear();
    };

    // bind the clear functionality to our button
    $("#preview").bind(_clickEventType, clear);

    // bind the network status check and call it
    $(document.body).bind("online offline", checkNetworkStatus);
    checkNetworkStatus();

});