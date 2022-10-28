var selectedIndex = 0;
var layerNumberIncrement = 0;

//From https://stackoverflow.com/a/5624139
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

//Input must be a 3 digit hex string, including the # at the start
function expandShortHex(shortHex) {
    let hexChars = shortHex.replace("#", "").split("");
    if (hexChars.length == 3)
        return (
            "#" + hexChars[0] + hexChars[0] + hexChars[1] + hexChars[1] + hexChars[2] + hexChars[2]
        );
    else return shortHex;
}

//From https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function drawLine(canvasId) {
    let c = document.getElementById(canvasId);
    let ctx = c.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke();
}

function drawRectangleClicked() {
    $("canvas").drawRect({
        layer: true,
        draggable: true,
        bringToFront: true,
        name: "Rectangle" + layerNumberIncrement++,
        fillStyle: "#585",
        x: 100,
        y: 100,
        width: 100,
        height: 50,
        click: function (layer) {
            displayProperties(layer, false);
        },
        mouseover: function (layer) {
            $(this).css("cursor", "pointer");
        },
        mouseout: function (layer) {
            $(this).css("cursor", "default");
        },
    });
}

function drawEllipseClicked() {
    $("canvas").drawEllipse({
        layer: true,
        draggable: true,
        bringToFront: true,
        name: "Ellipse" + layerNumberIncrement++,
        fillStyle: "#654",
        strokeStyle: "#000",
        strokeWidth: "3",
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        click: function (layer) {
            displayProperties(layer, false);
        },
        mouseover: function (layer) {
            $(this).css("cursor", "pointer");
        },
        mouseout: function (layer) {
            $(this).css("cursor", "default");
        },
    });
}

function drawTextClicked() {
    $("canvas").drawText({
        layer: true,
        draggable: true,
        bringToFront: true,
        name: "Text" + layerNumberIncrement++,
        fillStyle: "#000",
        x: 150,
        y: 100,
        strokeWidth: 0,
        fontSize: 24,
        fontFamily: "Arial, sans-serif",
        text: "Click to add text",
        click: function (layer) {
            displayProperties(layer, true);
        },
        mouseover: function (layer) {
            $(this).css("cursor", "pointer");
        },
        mouseout: function (layer) {
            $(this).css("cursor", "default");
        },
    });
}

//Ask user to confirm and then clear the canvas
function clearCanvas() {
    if (confirm("Are you sure you want to clear the canvas?"))
        $("canvas").removeLayers().drawLayers();
}

//Will let the user enter a name for the image and then save it as a .png file
function saveImageClick() {
    let fileName = prompt("Enter a name for the image", "New Image");
    if (fileName !== null && fileName !== "") {
        var link = document.getElementById("container");
        link.setAttribute("download", fileName + ".png");
        link.setAttribute(
            "href",
            canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        );
        link.click();
    }
}

function displayProperties(layer, isText) {
    selectedIndex = layer.index;
    $("#properties").css("display", "inline-block");

    if (isText) {
        $("#text").css("display", "block");
        $("#textID").val(layer.text);
        $("#fontFamilyID").val(layer.fontFamily);
        $("#fontSizeID").val(layer.fontSize);
    } else {
        $("#text").css("display", "none");
    }

    $("#xPosID").val(layer.x);
    $("#yPosID").val(layer.y);
    $("#widthID").val(layer.width);
    $("#heightID").val(layer.height);
    $("#rotateID").val(layer.rotate);
    $("#borderWidthID").val(layer.strokeWidth);
    $("#borderColorID").val(expandShortHex(layer.strokeStyle));
    $("#fillColorID").val(expandShortHex(layer.fillStyle));
}

function applyPropertiesClicked() {
    $("canvas")
        .setLayer(selectedIndex, {
            x: $("#xPosID").val(),
            y: $("#yPosID").val(),
            width: $("#widthID").val(),
            height: $("#heightID").val(),
            rotate: $("#rotateID").val(),
            strokeWidth: $("#borderWidthID").val(),
            strokeStyle: $("#borderColorID").val(),
            fillStyle: $("#fillColorID").val(),
            text: $("#textID").val(),
            fontFamily: $("#fontFamilyID").val(),
            fontSize: $("#fontSizeID").val(),
        })
        .drawLayers();
}

function deleteLayerClicked() {
    if (confirm("Are you sure you want to delete this layer?")) {
        $("canvas").removeLayer(selectedIndex).drawLayers();
        $("#properties").css("display", "none");
    }
}
