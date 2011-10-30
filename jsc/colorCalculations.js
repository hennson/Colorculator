/*
* Version: 00.01
* Date: 29.10.2011
* By: usw-usf.de
*/

/* hex --> rgb
* works with color shorthands and the full representation
* (#fff or #ffffff)
*/
function hexToRgb(hex) {

// nothing to do
if (hex.length < 3) return null;
    
    var temp,hxv;
    hxv = temp = hex;
    
    if (hxv.length == 3) {

        hxv = "";
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i .exec(temp).slice(1);

        for (var i = 0; i < 3; i++) {
            var col = temp[i];
            // mak a 2-tuple out of it
            hxv += col + col;
        }
    }

    if (hxv.length == 6) {
        var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i .exec(hxv).slice(1);

        // prepare for calculation
        hxv = "0x" + triplets.join("");
        return {
            R: (hxv & 0xff0000) >> 16,
            G: (hxv & 0x00ff00) >> 8,
            B: (hxv & 0x0000ff)
        };
    }
    
    return null;
}

/* rgb --> hsl
* according to algorithm from http://en.wikipedia.org/wiki/HSL_color_space.
* result converted to degree, percent, percent 
*/
function rgbToHsl(r, g, b){
   
    r /= 255,
    g /= 255, 
    b /= 255;
    
    var max = Math.max(r, g, b), 
        min = Math.min(r, g, b);
    var h = 0,
        s = 0,
        l = (max + min) / 2;

	if(max == min){
		// gray
        h = s = 0; 
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {    
    	H: Math.floor(h * 360),
    	S: Math.floor(s * 100),
    	L: Math.ceil(l * 100)
    };
}

/* set font color for dark or light background
 * based on a C# algorithm from Gacek
 * http://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
 */
function setFontColor(color)
{
            var d = 0;
            var a = 1 - ( 0.299 * color.R + 0.587 * color.G + 0.114 * color.B)/255;

            if (a < 0.5) {
            	// bright bg --> black font
            	d = 60; 
            } else {
            	// dark bg --> white font
            	d = 255;	
            }
                 
           	return {    
		    	R: Math.floor(d),
		    	G: Math.floor(d),
		    	B: Math.floor(d)
		    };
}