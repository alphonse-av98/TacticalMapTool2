var cd = new CanvasDragger(canvas);
cd.setMoveHandler(function (dx, dy) {
    screen.redraw(dx, dy);
});

var objectCounter = 0;
var imageObjectSrc;

/**
 * 各種ボタン・入力フォームの制御
 */
$(function () {
    // オブジェクト選択ボタンが変更されたら
    $('input[name="objBtn"]:radio').change(function () {
        switch ($(this).val()) {
            case 'blank':
                cd.setMode(true);
                break;
            default:
                cd.setMode(false);
                break;
        }
        objectPreview();
    });

    $('input[name="objBtn"]:radio').click(function () {
        if ($(this).val() == "image") {
            imageObjectSrc = null;
            $('#objScale').val("100");
            $('#objAlpha').val("100");
            $('#objRotate').val("0");
            $('#imageObject').click();
        }
    });

    $('#imageObject').change(function (e) {
        let fileData = e.target.files[0];

        // imageObjectの値を初期化
        $('#imageObject').val('');

        // 画像ファイル以外は処理を止める
        if (!fileData.type.match('image.*')) {
            alert('画像を選択してください');
            return;
        }

        // FileReaderオブジェクトを使ってファイル読み込み
        let reader = new FileReader();

        // ファイル読み込みに成功したときの処理
        reader.onload = function () {
            imageObjectSrc = reader.result;
            objectPreview();
        }

        // ファイル読み込みを実行
        reader.readAsDataURL(fileData);
    });

    // オブジェクト選択ボタンが押されたら値を初期化
    $('input[name="objBtn"]').click(function () {
        $('#objName').val($(this).val()+objectCounter++);
        confRefresh();
        // オブジェクトリストの選択を外す
        $("#objectList").val([]);
        screen.redraw(0, 0);
    });

    // オブジェクトの回転角変更
    $('#objRotate').change(confChange);

    // オブジェクトの回転角を-15度するボタン
    $('#rotateDeg').click(function () {
        let deg = parseInt($('#objRotate').val()) - 15;
        if (deg < -180) deg = 360 + deg;
        $('#objRotate').val(deg);
        confChange();
    });

    // オブジェクトの回転角を+15度するボタン
    $('#rotateInc').click(function () {
        let deg = parseInt($('#objRotate').val()) + 15;
        if (deg > 180) deg = -360 + deg;
        $('#objRotate').val(deg);
        confChange();
    });

    // 文字オブジェクトのテクストメッセージ
    $('#msgMessage').change(confChange);

    // 文字の枠線のスイッチ
    $('#msgGrid').change(confChange);

    // 二重円のスイッチ
    $('#doubleFlag').change(confChange);

    // 矢じりのスイッチ
    $('input[name="arrowhead"]').change(confChange);

    // デフォルトカラーボタン
    $('.color-btn').click(function () {
        const hex = rgb2hex($(this).css('background-color'));
        $('#objColor').val(hex);
        confChange();
    });

    // 色変更
    $('#objColor').change(confChange);

    // サイズ変更
    $('#objSize').change(confChange);

    // サイズを減らすボタン
    $('#sizeDeg').click(function () {
        const size = parseInt($('#objSize').val()) - 5;
        $('#objSize').val(size < 1 ? 1 : size);
        confChange();
    });

    // オブジェクトの回転角を+15度するボタン
    $('#sizeInc').click(function () {
        $('#objSize').val(parseInt($('#objSize').val()) + 5);
        confChange();
    });


    // 透明度変更
    $('#objAlpha').change(confChange);

    $('#objAlphaInc').click(function () {
        let alpha = parseInt($('#objAlpha').val()) + 10;
        $('#objAlpha').val(alpha > 100 ? 100 : alpha);
        confChange();
    });

    $('#objAlphaDeg').click(function () {
        let alpha = parseInt($('#objAlpha').val()) - 10;
        $('#objAlpha').val(alpha < 0 ? 0 : alpha);
        confChange();
    });

    // オブジェクト名変更
    $('#objName').change(confChange);

    // x座標変更
    $('#objX').change(confChange);

    // x座標変更
    $('#objY').change(confChange);

    // areaの横幅
    $('#areaWidth').change(confChange);

    // areaの縦幅
    $('#areaHeight').change(confChange);

    // Line/Arrowの位置情報リスト
    $('#posList').change(function () {
        confChange();
        const pos = JSON.parse($('#posList > option:selected').text());
        $('#objListX').val(pos.x);
        $('#objListY').val(pos.y);
        editObjectMarker(pos.x, pos.y);
    });

    // posListから選択要素を削除
    $('#delPos').click(function () {
        // posListから削除
        $('#posList > option:selected').remove();
        if ($('#posList').children('option').length < 2) {
            // 対象のObject要素を画面から削除
            screen.removeObject($('#objectList').prop("selectedIndex"));
            $('#objectList > option:selected').remove();
        }
        confChange();
    });

    // posListの選択要素のxの値を更新
    $('#objListX').change(function () {
        if ($('#posList').prop('selectedIndex') >= 0) {
            const pos = JSON.parse($('#posList > option:selected').text());
            $('#posList > option:selected').text('{ "x": ' + $('#objListX').val() + ',"y": ' + pos.y + ' }');
            confChange();
            editObjectMarker(parseInt($('#objListX').val()), pos.y);
        }
    });

    $('#objListY').change(function () {
        if ($('#posList').prop('selectedIndex') >= 0) {
            const pos = JSON.parse($('#posList > option:selected').text());
            $('#posList > option:selected').text('{ "x": ' + pos.x + ',"y": ' + $('#objListY').val() + ' }');
            confChange();
            editObjectMarker(pos.x, parseInt($('#objListY').val()));
        }
    });

    $('#arcStartAngle').change(confChange);

    $('#arcEndAngle').change(confChange);

    // 最初に破線のスイッチ
    $('#startDash').change(confChange);

    // 最後に破線のスイッチ
    $('#endDash').change(confChange);

    // arcArrow系のパラメータの変更
    $('#division').change(confChange);
    $('#camber').change(confChange);

    $('#startPointX').change(function () {
        confChange();
        editObjectMarker(parseInt($('#startPointX').val()), parseInt($('#startPointY').val()));
    });

    $('#startPointY').change(function () {
        confChange();
        editObjectMarker(parseInt($('#startPointX').val()), parseInt($('#startPointY').val()));
    });

    $('#endPointX').change(function () {
        confChange();
        editObjectMarker(parseInt($('#endPointX').val()), parseInt($('#endPointY').val()));
    });

    $('#endPointY').change(function () {
        confChange();
        editObjectMarker(parseInt($('#endPointX').val()), parseInt($('#endPointY').val()));
    });

    $('#objRotate').change(confChange);

    $('#objRotateDeg').click(function () {
        let deg = parseInt($('#objRotate').val()) - 15;
        if (deg < -180) deg = 360 + deg;
        $('#objRotate').val(deg);
        confChange();
    });

    $('#objRotateInc').click(function () {
        let deg = parseInt($('#objRotate').val()) + 15;
        if (deg > 180) deg = -360 + deg;
        $('#objRotate').val(deg);
        confChange();
    });

    $('#objScale').change(confChange);

    $('#callletter').change(function () {
        $('#callno').val("1");
        confChange();
    });

    $('#callno').change(confChange);

    $('#hiveName').change(function () {
        $('#hiveName').val($('#hiveName').val().toUpperCase());
        confChange();
    });
    $('#hiveNo').change(confChange);

});

/* 位置情報系の入力フォームをクリア */
function confRefresh() {
    $('#objX').val('');
    $('#objY').val('');
    $('#objListX').val('');
    $('#objListY').val('');
    $('#posList').children().remove();
    $('#startPointX').val('');
    $('#startPointY').val('');
    $('#endPointX').val('');
    $('#endPointY').val('');
    $('#division').val('0.5');
}

/**
 * 入力値が変更された際に、プレビューの更新と
 * 編集モードの場合は、既存オブジェクトのアップデートを行う
 */
function confChange() {
    // プレビューの更新
    objectPreview();

    // オブジェクトリストが選択されていたら編集モードに切り替わる
    const index = $('#objectList').prop("selectedIndex");
    if (index >= 0) {
        $('#objectList > option:selected').text($('#objName').val());
        screen.updateObject(index, new MapObject(createJsonData()));
        screen.redraw(0, 0);
        editObjectMarker($('#objX').val(), $('#objY').val());
    }
}

function objectPreview() {
    const canvas = $('#previewCanvas');
    const ctx = canvas[0].getContext('2d');
    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const x = ctx.canvas.width / 2;
    const y = ctx.canvas.height / 2;

    switch ($('input[name="objBtn"]:checked').val()) {
        case 'point':
            pointObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val()) / 100, $("#objColor").val(),
                { "doubleFlag": $("#doubleFlag").prop('checked') });
            break;
        case 'message':
            // 文字が入力されていなかったらbreak
            if ($("#msgMessage").val() == null || $("#msgMessage").val() == '') break;
            messageObject(ctx, 20, 5, parseInt($("#objSize").val()), parseInt($("#objAlpha").val()) / 100, $("#objColor").val(), $("#msgMessage").val(),
                { "gridFlag": $("#msgGrid").prop('checked') });
            break;
        case 'unit':
            unitObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val())/100, $("#objColor").val(), parseInt($("#objRotate").val()));
            break;
        case 'animeUnit':
            animeUnitObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val()) / 100, $("#objColor").val(), parseInt($("#objRotate").val()),
                { "callsign": $('#callletter').val() + padZero(parseInt($('#callno').val())) });
            break;
        case 'animeBETA':
            animeBETAObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val()) / 100, $("#objColor").val(), parseInt($("#objRotate").val()));
            break;
        case 'animeHive':
            animeHiveObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val()) / 100, $("#objColor").val(), parseInt($("#objRotate").val()),
                { "name": $("#hiveName").val(), "number": padZero(parseInt($("#hiveNo").val())) });
            break;
        case 'ship':
            shipObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val())/100, $("#objColor").val(), parseInt($("#objRotate").val()));
            break;
        case 'fleet':
            fleetObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val())/100, $("#objColor").val(), parseInt($("#objRotate").val()));
            break;
        case 'plane':
            planeObject(ctx, x, y, parseInt($("#objSize").val()), parseInt($("#objAlpha").val())/100, $("#objColor").val(), parseInt($("#objRotate").val()));
            break;
        case 'line':
            lineObject(ctx,
                [{ "x": x - ctx.canvas.width / 4, "y": y }, { "x": x + ctx.canvas.width / 4, "y": y }],
                parseInt($("#objSize").val()), parseInt($("#objAlpha").val()) / 100, $("#objColor").val(),
                { "arrowhead": $('input[name="arrowhead"]:checked').val(), "startDash": $("#startDash").prop('checked'), "endDash":$("#endDash").prop('checked') });
            break;
        case 'area':
            areaObject(ctx, x, y,
                parseInt($("#areaWidth").val()), parseInt($("#areaHeight").val()), parseInt($("#objSize").val()),
                parseInt($("#objAlpha").val()) / 100, $("#objColor").val(), parseInt($("#objRotate").val()),
                { type: 'eclipse' });
            break;
        case 'arc':
            arcObject(ctx, x, y, parseInt($("#areaWidth").val()), parseInt($("#areaHeight").val()),
                parseInt($("#arcStartAngle").val()), parseInt($("#arcEndAngle").val()), parseInt($("#objSize").val()),
                parseInt($("#objAlpha").val()) / 100, $("#objColor").val(), parseInt($("#objRotate").val()));
            break;
        case 'arcarrow':
            arcArrowObject(ctx, [{ "x": x - ctx.canvas.width / 4, "y": y }, { "x": x + ctx.canvas.width / 4, "y": y }],
                parseInt($("#objSize").val()), parseInt($("#objAlpha").val()) / 100, $("#objColor").val(),
                { "arrowhead" : $('input[name="arrowhead"]:checked').val(), "camber" : parseInt($("#camber").val()), "division": parseFloat($("#division").val()) });
            break;
        case 'image':
            if (imageObjectSrc == null) break;
            let img = new Image();
            img.src = imageObjectSrc;
            img.onload = function () {
                const scale = parseInt($('#objScale').val()) / 100;
                imageObject(ctx, img, x, y, scale, parseInt($('#objAlpha').val()) / 100, parseInt($('#objRotate').val()));
            }
            break;
        default:
            break;
    }
}