debug.time("Start Up");
var s5e = window.s5e || {};

(function ($, _, Modernizr, less, debug) {
  "use strict";

    _.extend(s5e, {
        hexregexp: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        rgbregexp: /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/,
        rgbaregexp: /^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), (\d?\.\d+)\)$/,
        functions: {
            saturate: { id: "saturate", display: "Saturate",  func: less.tree.functions.saturate, params: "(color, amount)", min: 0, max: 100 },
            desaturate: { id: "desaturate", display: "Deaturate",  func: less.tree.functions.desaturate, params: "(color, amount)", min: 0, max: 100 },
            lighten: { id: "lighten", display: "Lighten",  func: less.tree.functions.lighten, params: "(color, amount)", min: 0, max: 100 },
            darken: { id: "darken", display: "Darken",  func: less.tree.functions.darken, params: "(color, amount)", min: 0, max: 100 },
            fadein: { id: "fadein", display: "Fade-in",  func: less.tree.functions.fadein, params: "(color, amount)", min: 0, max: 100 },
            fadeout: { id: "fadeout", display: "Fade-out",  func: less.tree.functions.fadeout, params: "(color, amount)", min: 0, max: 100 },
            fade: { id: "fade", display: "Fade",  func: less.tree.functions.fade, params: "(color, amount)", min: 0, max: 100 },
            spin: { id: "spin", display: "Spin",  func: less.tree.functions.spin, params: "(color, amount)", min: 0, max: 360 },
            mix: { id: "mix", display: "Mix", func: less.tree.functions.mix, params: "(color1, color2, weight)", min: 0, max: 100 },
            contrast: { id: "contrast", display: "Contrast", func: less.tree.functions.contrast, params: "(color, dark, light, threshold)", min: 0, max: 100 },
            greyscale: { id: "greyscale", display: "Greyscale", func: less.tree.functions.greyscale, params: "(color)" },
            multiply: { id: "multiply", display: "Multiply", func: less.tree.functions.multiply, params: "(color1, color2)" },
            screen: { id: "screen", display: "Screen", func: less.tree.functions.screen, params: "(color1, color2)" },
            overlay: { id: "overlay", display: "Overlay", func: less.tree.functions.overlay, params: "(color1, color2)" },
            softlight: { id: "softlight", display: "Soft Light", func: less.tree.functions.softlight, params: "(color1, color2)" },
            hardlight: { id: "hardlight", display: "Hard Light", func: less.tree.functions.hardlight, params: "(color1, color2)" },
            difference: { id: "difference", display: "Difference", func: less.tree.functions.difference, params: "(color1, color2)" },
            exclusion: { id: "exclusion", display: "Exclusion", func: less.tree.functions.exclusion, params: "(color1, color2)" },
            average: { id: "average", display: "Average", func: less.tree.functions.average, params: "(color1, color2)" },
            negation: { id: "negation", display: "Negation", func: less.tree.functions.negation, params: "(color1, color2)" },
            hue: { id: "hue", display: "Hue", func: less.tree.functions.hue, params: "(color)" },
            saturation: { id: "saturation", display: "Saturation", func: less.tree.functions.saturation, params: "(color)" },
            lightness: { id: "lightness", display: "Lightness", func: less.tree.functions.lightness, params: "(color)" },
            hsvhue: { id: "hsvhue", display: "HSV Hue", func: less.tree.functions.hsvhue, params: "(color)" },
            hsvsaturation: { id: "hsvsaturation", display: "HSV Saturation", func: less.tree.functions.hsvsaturation, params: "(color)" },
            hsvvalue: { id: "hsvvalue", display: "HSV Value", func: less.tree.functions.hsvvalue, params: "(color)" },
            red: { id: "red", display: "Red", func: less.tree.functions.red, params: "(color)" },
            green: { id: "green", display: "Green", func: less.tree.functions.green, params: "(color)" },
            blue: { id: "blue", display: "Blue", func: less.tree.functions.blue, params: "(color)" },
            alpha: { id: "alpha", display: "Alpha", func: less.tree.functions.alpha, params: "(color)" },
            luma: { id: "luma", display: "Luma", func: less.tree.functions.luma, params: "(color)" },
            luminance: { id: "luminance", display: "Luminance", func: less.tree.functions.luminance, params: "(color)" }
        }
    });

    $(function () {

        /*---------- Tell Underscore templates to use curly brace notation ----------*/
        _.templateSettings = {
            evaluate: /\{\{([\s\S]+?)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g
        };

        /*---------- Shim to treat CSS panel as Less ----------*/
        $('head style[type="text/css"]').attr('type', 'text/less');
        less.refreshStyles();

        _.extend(s5e, {
            $func: $("#func"),
            $fieldsets: $("fieldset"),
            $coloramountfieldset: $("#color-amount-inputs"),
            $colorcolorweightfieldset: $("#color-color-weight-inputs"),
            $colordarklightthresholdfieldset: $("#color-dark-light-threshold-inputs"),
            $colorfieldset: $("#color-inputs"),
            $colorcolorfieldset: $("#color-color-inputs"),
            $colors: $(".color-input"),
            $numbers: $(".number-input"),
            $sections: $("section"),
            $coloroutputsection: $("#color-output"),
            $valueoutputsection: $("#value-output"),
            $rgbout: $("#rgb-output"),
            $rgbswatch: $("#rgb-swatch"),
            $rgbout2: $("#rgb-output2"),
            $rgbswatch2: $("#rgb-swatch2"),
            $extraout: $("#extra-output"),
            $valout: $("#val-output"),
            $inputs: $("input[type='text']"),
            $helplink: $("#help-link"),
            $helpcloselink: $("#help-close-link"),
            $help: $("#help"),
            $ranges: $(".range")
        });

        _.each(s5e.functions, function(func) {
            var $el = $('<option></option>');
            $el.attr("value", func.id);
            $el.html(func.display + " " + func.params);
            s5e.$func.append($el);
        });

        s5e.$colors.each(function() {
            var $color = $(this);
            $color.change(function() {
                updateSwatch($color, $color.siblings(".swatch"));
            }).change();
        });

        s5e.$numbers.each(function() {
            var $number = $(this);
            $number.change(validateNumberInput);
        }).change();

        s5e.$inputs.change(changeFunction);
        s5e.$func.change(changeFunction).change();

        s5e.$helplink.click(showHelp);
        s5e.$helpcloselink.click(hideHelp);

        ZeroClipboard.config( {
            swfPath: 'http://dl.dropboxusercontent.com/u/8596275/cdn/zeroclipboard/ZeroClipboard.swf',
            moviePath: "http://dl.dropboxusercontent.com/u/8596275/cdn/zeroclipboard/ZeroClipboard.swf"
        } );
        s5e.client = new ZeroClipboard($(".copy-btn"));

        debug.timeEnd('Start Up');
    });

    function updateSwatch($input, $output) {
        var orig_color = $input.val().trim();
        if (isColor(orig_color)) {
            $output.css("background-color", orig_color);
            $output.closest(".form-group").removeClass("has-error");
        } else {
            $output.css("background-color", "transparent");
            $output.closest(".form-group").addClass("has-error");
        }
    }

    function validateNumberInput() {
        var $number = $(this);
        var number = parseInt($number.val().trim(), 10);
        var func = getFunction();
        if(isNaN(number) || number > func.max || number < func.min) {
            $number.closest(".form-group").addClass("has-error");
        } else {
            $number.closest(".form-group").removeClass("has-error");
        }
    }

    function changeFunction() {
        s5e.$fieldsets.hide();
        var func = getFunction();

        setRanges(func.min, func.max);

        if(func.params === "(color, amount)") {
            s5e.$coloramountfieldset.show();
            executeColorAmountFunction(func);
        } else if(func.params === "(color1, color2, weight)") {
            s5e.$colorcolorweightfieldset.show();
            executeColorColorWeightFunction(func);
        } else if(func.params === "(color, dark, light, threshold)") {
            s5e.$colordarklightthresholdfieldset.show();
            executeColorDarkLightThresholdFunction(func);
        } else if(func.params === "(color)") {
            s5e.$colorfieldset.show();
            executeColorFunction(func);
        } else if(func.params === "(color1, color2)") {
            s5e.$colorcolorfieldset.show();
            executeColorColorFunction(func);
        }
    }

    function setRanges(min, max) {
        s5e.$ranges.html("(" + min + "-" + max + ")");
    }

    function executeColorAmountFunction(func) {
        var iserror = s5e.$coloramountfieldset.find(".has-error").length > 0;
        if(iserror) {
            s5e.$coloroutputsection.hide();
            s5e.$valueoutputsection.hide();
            return;
        }
        var $color = $("#color1");
        var $amount = $("#amount");
        var color = getColor($color);
        var amount = { value: parseInt($amount.val(), 10) };
        var result = null;
        debug.log("Executing function " + func.id + "('" + color.toCSS() + "', " + amount.value + ")...");
        result = func.func(color, amount);
        debug.log("Function " + func.id + " returned " + result.toCSS() + ".");
        showColorOutput(result);
    }

    function executeColorColorWeightFunction(func) {
        var iserror = s5e.$colorcolorweightfieldset.find(".has-error").length > 0;
        if(iserror) {
            s5e.$coloroutputsection.hide();
            s5e.$valueoutputsection.hide();
            return;
        }
        var $color1 = $("#color2");
        var $color2 = $("#color3");
        var $weight = $("#weight");
        var color1 = getColor($color1);
        var color2 = getColor($color2);
        var weight = { value: parseInt($weight.val(), 10) };
        var result = null;
        debug.log("Executing function " + func.id + "('" + color1.toCSS() + "', '" + color2.toCSS() + "', " + weight.value + ")...");
        result = func.func(color1, color2, weight);
        debug.log("Function " + func.id + " returned " + result.toCSS() + ".");
        showColorOutput(result);
    }

    function executeColorDarkLightThresholdFunction(func) {
        var iserror = s5e.$colordarklightthresholdfieldset.find(".has-error").length > 0;
        if(iserror) {
            s5e.$coloroutputsection.hide();
            s5e.$valueoutputsection.hide();
            return;
        }
        var $color = $("#color4");
        var $dark = $("#color5");
        var $light = $("#color6");
        var $threshold = $("#threshold");
        var color = getColor($color);
        var dark = getColor($dark);
        var light = getColor($light);
        var threshold = parseInt($threshold.val(), 10) / 100;
        var result = null;
        debug.log("Executing function " + func.id + "('" + color.toCSS() + "', '" + dark.toCSS() + "', '" + light.toCSS() + "', " + threshold.value + ")...");
        result = func.func(color, dark, light, threshold);
        debug.log("Function " + func.id + " returned " + result.toCSS() + ".");
        showColorOutput(result);
    }

    function executeColorFunction(func) {
        var iserror = s5e.$colorfieldset.find(".has-error").length > 0;
        if(iserror) {
            s5e.$coloroutputsection.hide();
            s5e.$valueoutputsection.hide();
            return;
        }
        var $color = $("#color7");
        var color = getColor($color);
        var result = null;
        var boundfunc = _.bind(func.func, less.tree.functions);
        debug.log("Executing function " + func.id + "('" + color.toCSS() + "')...");
        result = boundfunc(color);
        if(result instanceof less.tree.Color) {
            debug.log("Function " + func.id + " returned " + result.toCSS() + ".");
            showColorOutput(result);
        } else {
            debug.log("Function " + func.id + " returned " + result + ".");
            showValueOutput(result);
        }
    }

    function executeColorColorFunction(func) {
        var iserror = s5e.$colorcolorfieldset.find(".has-error").length > 0;
        if(iserror) {
            s5e.$coloroutputsection.hide();
            s5e.$valueoutputsection.hide();
            return;
        }
        var $color1 = $("#color8");
        var $color2 = $("#color9");
        var color1 = getColor($color1);
        var color2 = getColor($color2);
        var result = null;
        debug.log("Executing function " + func.id + "('" + color1.toCSS() + "', '" + color2.toCSS() + "')...");
        result = func.func(color1, color2);
        debug.log("Function " + func.id + " returned " + result.toCSS() + ".");
        showColorOutput(result);
    }

    function getColor($input) {
        var ret = null;
        var orig_color = $input.val();
        var color, match;
        if (isHex(orig_color)) {
            color = orig_color.replace("#", "");
            ret = new less.tree.Color(color);
        } else if(isRGB(orig_color)) {
            match = s5e.rgbregexp.exec(orig_color);
            ret = less.tree.functions.rgb(parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10));
        } else if(isRGBA(orig_color)) {
            match = s5e.rgbaregexp.exec(orig_color);
            ret = less.tree.functions.rgba(parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseFloat(match[4]));
        }
        return ret;
    }

    function isColor(color) {
        return isHex(color) || isRGB(color) || isRGBA(color);
    }

    function isHex(color) {
        return s5e.hexregexp.test(color);
    }

    function isRGB(color) {
        return s5e.rgbregexp.test(color);
    }

    function isRGBA(color) {
        return s5e.rgbaregexp.test(color);
    }

    function getFunction() {
        var func_name = s5e.$func.val();
        var func = s5e.functions[func_name];
        return func;
    }

    function showColorOutput(color) {
        s5e.$sections.hide();
        var colorCSS = color.toCSS({ compress: true });
        s5e.$rgbout.html(colorCSS);
        s5e.$rgbswatch.css("background-color", colorCSS);
        if(color.alpha === 1) {
            colorCSS = "rgb(" + color.rgb.map(function(c) {
                return Math.min(Math.max(Math.round(c), 0), 255);
            }).join(', ') + ")";
            s5e.$rgbout2.html(colorCSS);
            s5e.$rgbswatch2.css("background-color", colorCSS);
            s5e.$extraout.show();
        } else{
            s5e.$extraout.hide();
        }
        s5e.$coloroutputsection.show();
    }

    function showValueOutput(value) {
        s5e.$sections.hide();
        s5e.$valout.html(value.toCSS());
        s5e.$valueoutputsection.show();
    }

    function showHelp(e) {
        s5e.$helplink.hide();
        s5e.$helpcloselink.show();
        s5e.$help.show();
        e.preventDefault();
    }

    function hideHelp(e) {
        s5e.$helplink.show();
        s5e.$helpcloselink.hide();
        s5e.$help.hide();
        e.preventDefault();
    }

})(jQuery, _, Modernizr, less, debug);
