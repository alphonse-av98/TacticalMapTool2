$('#importImage').click(function (e) {
    $('#imagefile').click();
});

$('#importConf').click(function (e) {
    $('#mapImport').click();
});

$('#imagefile').change(function (e) {
    // ファイル情報を取得
    let fileData = e.target.files[0];

    // imagefileの値を初期化
    $('#imagefile').val('');

    // キャンセルされた場合
    if (typeof fileData === undefined) return;

    // 画像ファイル以外は処理を止める
    if (!fileData.type.match('image.*')) {
        alert('画像を選択してください');
        return;
    }

    // オブジェクトの全削除
    screen.allRemoveObject();
    $('#objectList').children().remove();
    screen.reposition();
    
    // ファイル名をMAP名にする
    $("#mapName").val(getFileName(fileData.name));

    // FileReaderオブジェクトを使ってファイル読み込み
    let reader = new FileReader();
    // ファイル読み込みに成功したときの処理
    reader.onload = function () {
        // Canvas上に表示する
        let uploadImgSrc = reader.result;
        canvasDraw(uploadImgSrc);
    }
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
});

// Canvas上に画像を表示する
function canvasDraw(imgSrc) {

    // Canvas上に画像を表示
    let img = new Image();
    img.src = imgSrc;
    img.onload = function () {
        screen.redraw(0,0);
        $('#canvasWidth').val(img.width);
        $('#canvasHeight').val(img.height);
    }
    screen.image = img;
}

// ポジションリセットボタン
$('#repositionBtn').click(function () {
    screen.reposition();
});

$('#mapExport').click(function () {
    const exportData = {
        "name": $('#mapName').val(),
        "image": screen.image.currentSrc,
        "objects": screen.objects,
        "mapGrid": $('#mapGrid').prop('checked'),
        "mapGridSize": $('#mapGridSize').val()
    }
    const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = $("#mapName").val()+'.json';
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

// MAP情報を読込
$('#mapImport').change(function (e) {
    // ファイル情報を取得
    let fileData = e.target.files[0];

    // mapImportの値を初期化
    $('#mapImport').val('');

    // キャンセルされた場合
    if (typeof fileData === undefined) return;

    // 画像ファイル以外は処理を止める
    if (!fileData.type.match('application/json')) {
        alert('JSONファイルを選択してください');
        return;
    }

    // オブジェクトの全削除
    screen.allRemoveObject();
    $('#objectList').children().remove();
    screen.reposition();

    // FileReaderオブジェクトを使ってファイル読み込み
    const reader = new FileReader();

    // ファイル読み込みに成功したときの処理
    reader.onload = function () {
        let src = reader.result;

        let jsonData = JSON.parse(src);

        $("#mapName").val(jsonData.name);
        for (let i = jsonData.objects.length - 1; i >= 0; i--){
            screen.addObject(new MapObject(jsonData.objects[i]));
            $("#objectList").prepend(`<option>` + jsonData.objects[i].name + `</option>`);
        }

        $("#mapGrid").prop('checked', jsonData.mapGrid);
        $("#mapGridSize").val(typeof jsonData.mapGridSize !== 'undefined' ? jsonData.mapGridSize : 100)

        // Canvas上に画像を表示
        let img = new Image();
        img.src = jsonData.image;
        img.onload = function () {
            screen.redraw(0, 0);
            $('#canvasWidth').val(img.width);
            $('#canvasHeight').val(img.height);
        }
        screen.image = img;
    }

    // ファイル読み込みを実行
    reader.readAsText(fileData);
});

$('#mapCanvasSave').click(function () {
    screen.reposition();
    screen.canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.download = $("#mapName").val()+'.png';
        a.href = url;
        a.click();
        a.remove();
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1E4);
    }, 'image/png');
});

$('#mapGrid').change(GridChange);

$('#mapGridColor').change(GridChange);

$('#mapGridSize').change(GridChange);

$('#mapLineSize').change(GridChange);

$('#mapLineAlpha').change(GridChange);

function GridChange() {
    if ($('#mapGrid').prop('checked')) {
        screen.setGrid(parseInt($('#mapGridSize').val()), $('#mapGridColor').val(), $('#mapLineSize').val(), $('#mapLineAlpha').val() / 100);
    } else {
        screen.setGrid(0, $('#mapGridColor').val(), $('#mapLineSize').val(), $('#mapLineAlpha').val() / 100);
    }
    screen.redraw(0,0);
}

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
