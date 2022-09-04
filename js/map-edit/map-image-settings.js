// Import(Background Image)ボタン
$('#importImage').click(function (e) {
    $('#imagefile').click();
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

// Import(Conf)ボタン
$('#importConf').click(function (e) {
    $('#mapImport').click();
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

        // Canvas設定
        $('#canvasWidth').val(jsonData.canvas.canvasWidth);
        $('#canvasHeight').val(jsonData.canvas.canvasHeight);
        screen.setCanvasSize(jsonData.canvas.canvasWidth,jsonData.canvas.canvasHeight);

        // 背景色設定
        $('#mapBackground').prop("checked",[null, undefined, "rgba(0, 0, 0, 0)"].includes(jsonData.canvas.background) ? false: true);
        $('#mapBackgroundColor').val(jsonData.canvas.background);
        $('#mapBackgroundAlpha').val(jsonData.canvas.backgroundAlpha*100);
        screen.setBgColor(jsonData.canvas.background,jsonData.canvas.backgroundAlpha);
        
        // Grid設定
        $('#mapGrid').prop("checked",[null, undefined].includes(jsonData.canvas.grid) ? false: jsonData.canvas.grid);
        $('#mapGridSize').val(jsonData.canvas.gridSize);
        $('#mapGridColor').val(jsonData.canvas.gridColor);
        $('#mapGridLineSize').val(jsonData.canvas.gridLineWidth);
        $('#mapGridAlpha').val(jsonData.canvas.gridAlpha*100);
        screen.setGrid(jsonData.canvas.grid,jsonData.canvas.gridSize,jsonData.canvas.gridColor,jsonData.canvas.gridLineWidth,jsonData.canvas.gridAlpha);

        // Canvas上に画像を表示
        let img = new Image();
        img.src = jsonData.canvas.image;
        img.onload = function () {
            screen.redraw(0, 0);
            $('#canvasWidth').val(img.width);
            $('#canvasHeight').val(img.height);
        }
        screen.image = img;

        // Object読み込み
        for (let i = jsonData.canvas.objects.length - 1; i >= 0; i--){
            screen.addObject(new MapObject(jsonData.canvas.objects[i]));
            $("#objectList").prepend(`<option>` + jsonData.canvas.objects[i].name + `</option>`);
        }
        screen.redraw(0,0);
    }

    // ファイル読み込みを実行
    reader.readAsText(fileData);
});

// Export(PNG Image)ボタン
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

// Export(Conf)ボタン
$('#mapExport').click(function () {
    const exportData = {
        "name": $('#mapName').val(),
        "canvas": screen.toJson()
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