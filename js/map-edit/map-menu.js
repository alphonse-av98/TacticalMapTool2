$(function () {
    screen.setCanvasSize($('#canvasWidth').val(), $('#canvasHeight').val());
});

$('#canvasWidth').change(function () {
    screen.setCanvasSize($('#canvasWidth').val(), $('#canvasHeight').val());
    $('#canvasWidth').val(screen.canvas.width);
    $('#canvasHeight').val(screen.canvas.height);
});

$('#canvasHeight').change(function () {
    screen.setCanvasSize($('#canvasWidth').val(), $('#canvasHeight').val());
    $('#canvasWidth').val(screen.canvas.width);
    $('#canvasHeight').val(screen.canvas.height);
});

$('#mapBackgroundColor').change(function () {
    if ($('#mapBackground').prop('checked')) {
        screen.setBgColor($('#mapBackgroundColor').val(),$('#mapBackgroundAlpha').val()/100);
    }
});

$('#mapBackgroundAlpha').change(function () {
    if ($('#mapBackground').prop('checked')) {
        screen.setBgColor($('#mapBackgroundColor').val(),$('#mapBackgroundAlpha').val()/100);
    }
});

$('#mapBackground').change(function () {
    if ($('#mapBackground').prop('checked')) {
        screen.setBgColor($('#mapBackgroundColor').val(),$('#mapBackgroundAlpha').val()/100);
    } else {
        screen.setBgColor('rgba(0,0,0,0)',$('#mapBackgroundAlpha').val()/100);
    }
});

$('#mapFdColor').change(function () {
    screen.setForceDistribution($('#mapFdColor').val(), parseInt($('#mapFdGridSize').val()));
});

$('#mapFdGridSize').change(function () {
    screen.setForceDistribution($('#mapFdColor').val(), parseInt($('#mapFdGridSize').val()));
});