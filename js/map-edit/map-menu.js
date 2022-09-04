$(function () {
    screen.setCanvasSize($('#canvasWidth').val(), $('#canvasHeight').val());
});

// Backgroundメニュー
$('#mapBackground').change(BackgroundChange);

$('#mapBackgroundColor').change(BackgroundChange);

$('#mapBackgroundAlpha').change(BackgroundChange);

function BackgroundChange(){
    if ($('#mapBackground').prop('checked')) {
        screen.setBgColor($('#mapBackgroundColor').val(),$('#mapBackgroundAlpha').val()/100);
    } else {
        screen.setBgColor('rgba(0,0,0,0)',$('#mapBackgroundAlpha').val()/100);
    }
}

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

// Gridメニュー
$('#mapGrid').change(GridChange);

$('#mapGridColor').change(GridChange);

$('#mapGridSize').change(GridChange);

$('#mapGridLineSize').change(GridChange);

$('#mapGridAlpha').change(GridChange);

function GridChange() {
    screen.setGrid($('#mapGrid').prop('checked'),parseInt($('#mapGridSize').val()), $('#mapGridColor').val(), $('#mapGridLineSize').val(), $('#mapGridAlpha').val() / 100);
}

// ForceDistibutionメニュー
$('#mapFdColor').change(FdChange);

$('#mapFdGridSize').change(FdChange);
    
function FdChange() {
    screen.setForceDistribution($('#mapFdColor').val(), parseInt($('#mapFdGridSize').val()));
}

// ポジションリセットボタン
$('#repositionBtn').click(function () {
    screen.reposition();
});

// MovieMapList追加ボタン
$('#mapAddMapList').click(function () {
    // 手のひらツールボタンに切り替え
    $('#blankBtn').trigger("click");

    let mapList = $('#mapList').children('option');
    let mapname = $("#mapName").val();
    let number = 0;
    let flag = false;

    for (let i = 0; i < mapList.length; i++){
        let name = mapList.eq(i).text();
        if (name.lastIndexOf(mapname + "_") != -1) {
            let tempNum = name.substring(name.lastIndexOf("_") + 1);
            if (isNumber(tempNum)) {
                tempNum = parseInt(tempNum)
                if (number < tempNum) {
                    number = tempNum;
                }
            }
        }
        if (mapname == name) {
            flag = true;
        }
    }

    // 同名のMAPがなければ
    if (flag) {
        number = number + 1;
        mapname = mapname + "_" + number;
    }

    $('#mapList').append($("<option>").val(screen.canvas.toDataURL()).text(mapname));
    alert(mapname+"をMAP LISTに追加しました。\n\""+ mapname + "\" has been added to the Map List.")
});
