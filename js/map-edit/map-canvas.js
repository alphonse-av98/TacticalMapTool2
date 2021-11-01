var screen = new Screen(document.getElementById("canvas"));

/**
 * キャンパス上のクリックの制御
 */
$('#canvas').click(function (e) {
    const x = e.clientX - screen.canvas.offsetLeft - screen.diffX;
    const y = e.clientY - screen.canvas.offsetTop - screen.diffY;

    // オブジェクトリストが選択されているか
    const index = $('#objectList').prop("selectedIndex");
    if (index >= 0) {
        // オブジェクトリストが選択されている場合は既存オブジェクトの編集
        switch ($('input[name="objBtn"]:checked').val()) {
            case 'line':
                // ポジションリストが選択されている場合
                if ($('#posList').prop("selectedIndex") >= 0) {
                    $('#posList > option:selected').text('{ "x": ' + x + ',"y": ' + y + ' }');
                    $('#posList').val([]);
                } else {
                    // ポジションリストに追加
                    $("#posList").append(`<option>` + '{ "x": ' + x + ',"y": ' + y + ' }' + `</option>`);
                }
                screen.updateObject(index, new MapObject(createJsonData()));
                break;
            case 'arcarrow':
                if ($('#startPointX').val() == null || $('#startPointX').val() == '') {
                    $('#startPointX').val(x);
                    $('#startPointY').val(y);
                    screen.updateObject(index, new MapObject(createJsonData()));
                    $('#endPointX').val('');
                    $('#endPointY').val('');
                } else {
                    $('#endPointX').val(x);
                    $('#endPointY').val(y);
                    screen.updateObject(index, new MapObject(createJsonData()));
                }
                break;
            default:
                $('#objX').val(x);
                $('#objY').val(y);
                screen.updateObject(index, new MapObject(createJsonData()));
                break;
        }
    } else {
        // 新規オブジェクトの作成
        switch ($('input[name="objBtn"]:checked').val()) {
            case 'blank':
                break;
            case 'forceDistribution':
                let positionX = Math.ceil(x / screen.fdGridSize) - 1;
                let positionY = Math.ceil(y / screen.fdGridSize) - 1;

                if (positionX != 0) {
                    screen.fdGrid[positionX-1][positionY]++;        
                }

                if (positionX != Math.ceil(screen.canvas.width / screen.fdGridSize) - 1) {
                    screen.fdGrid[positionX+1][positionY]++;
                }

                if (positionY != 0) {
                    screen.fdGrid[positionX][positionY-1]++;        
                }

                if (positionY != Math.ceil(screen.canvas.height / screen.fdGridSize) - 1) {
                    screen.fdGrid[positionX][positionY+1]++;
                }

                screen.fdGrid[positionX][positionY] = screen.fdGrid[positionX][positionY] + 2;
                break;
            case 'line':
                // ポジションリストに追加
                $("#posList").append(`<option>` + '{ "x": ' + x + ',"y": ' + y + ' }' + `</option>`);

                // ポジションリストが2個だったらオブジェクトリストに追加して選択
                if ($("#posList").children('option').length == 2) {
                    screen.addObject(new MapObject(createJsonData()));
                    $("#objectList").prepend(`<option>` + $("#objName").val() + `</option>`);
                    $("#objectList").prop('selectedIndex', 0);
                    $('#objName').val($('input[name="objBtn"]:checked').val()+objectCounter++);
                }
                break;
            case 'arcarrow':
                if ($('#startPointX').val() == null || $('#startPointX').val() == '') {
                    $('#startPointX').val(x);
                    $('#startPointY').val(y);
                } else {
                    $('#endPointX').val(x);
                    $('#endPointY').val(y);
                    screen.addObject(new MapObject(createJsonData()));
                    $('#objectList').prepend(`<option>` + $("#objName").val() + `</option>`);
                    confRefresh();
                    $('#objName').val($('input[name="objBtn"]:checked').val()+objectCounter++);
                }
                break;
            case 'message':
                if ($("#msgMessage").val() == null || $("#msgMessage").val() == '') return;
                $('#objX').val(x);
                $('#objY').val(y);
                screen.addObject(new MapObject(createJsonData()));
                $("#objectList").prepend(`<option>` + $("#objName").val() + `</option>`);
                $('#objName').val($('input[name="objBtn"]:checked').val()+objectCounter++);
                break;
            case 'animeUnit':
                $('#objX').val(x);
                $('#objY').val(y);
                screen.addObject(new MapObject(createJsonData()));
                $("#objectList").prepend(`<option>` + $("#objName").val() + `</option>`);
                $('#objName').val($('input[name="objBtn"]:checked').val() + objectCounter++);
                $('#callno').val(parseInt($('#callno').val())+1);
                break;
            default:
                $('#objX').val(x);
                $('#objY').val(y);
                screen.addObject(new MapObject(createJsonData()));
                $("#objectList").prepend(`<option>` + $("#objName").val() + `</option>`);
                $('#objName').val($('input[name="objBtn"]:checked').val()+objectCounter++);
                break;
        }
    }
    screen.redraw(0, 0);
});

/**
 * キャンパス上で右クリックされた場合の制御
 * 右クリックは各種オブジェクトの編集および線/矢印オブジェクトの接点追加を終了させる
 */
$('#canvas').on('contextmenu', function (e) {
    const x = e.clientX - screen.canvas.offsetLeft - screen.diffX;
    const y = e.clientY - screen.canvas.offsetTop - screen.diffY;

    switch ($('input[name="objBtn"]:checked').val()) {
        case 'blank':
            break;
        case 'forceDistribution':
            // 右クリックメニューのを出力抑止
            e.preventDefault();

            let positionX = Math.ceil(x / screen.fdGridSize) - 1;
            let positionY = Math.ceil(y / screen.fdGridSize) - 1;

            if (positionX != 0) {
                if (screen.fdGrid[positionX - 1][positionY] > 0) {
                    screen.fdGrid[positionX - 1][positionY]--;
                }
            }

            if (positionX != Math.ceil(screen.canvas.width / screen.fdGridSize) - 1) {
                if (screen.fdGrid[positionX + 1][positionY] > 0) {
                    screen.fdGrid[positionX + 1][positionY]--;
                }
            }

            if (positionY != 0) {
                if (screen.fdGrid[positionX][positionY - 1] > 0) {
                    screen.fdGrid[positionX][positionY - 1]--;
                }
            }

            if (positionY != Math.ceil(screen.canvas.height / screen.fdGridSize) - 1) {
                if (screen.fdGrid[positionX][positionY + 1] > 0) {
                    screen.fdGrid[positionX][positionY + 1]--;
                }
            }

            screen.fdGrid[positionX][positionY] = screen.fdGrid[positionX][positionY] - 2;
            if (screen.fdGrid[positionX][positionY] < 0) {
                screen.fdGrid[positionX][positionY] = 0;
            }
            // 再描画
            screen.redraw(0, 0);
            break;
        case 'line':
            // posListが選択されておらず、ポジションが2個以上あり、オブジェクトが登録されていなければオブジェクト追加
            if ($('#posList').prop("selectedIndex") < 0 && $("#posList").children().length >= 2 && $('#objectList').prop("selectedIndex") < 0) {
                screen.addObject(new MapObject(createJsonData()));
                $("#objectList").prepend(`<option>` + $("#objName").val() + `</option>`);
            }
        default:
            // 右クリックメニューのを出力抑止
            e.preventDefault();

            // 位置情報系の入力をクリア
            confRefresh();

            // オブジェクトリストの選択をクリア
            $('#objectList').val([]);

            // 再描画
            screen.redraw(0, 0);
            break;
    }
});

/**
 * キャンパス上でマウスを動かした際の挙動
 */
$('#canvas').on('mousemove', function (e) {
    const x = e.clientX - screen.canvas.offsetLeft - screen.diffX;
    const y = e.clientY - screen.canvas.offsetTop - screen.diffY;
    let jsonData;
    switch ($('input[name="objBtn"]:checked').val()) {
        case 'blank':
        case 'forceDistribution':
            break;
        case 'line':
            if ($('#posList').children('option').length == 0) break;
            screen.redraw(0, 0);

            let posJsonStr = ""
            // ポジションリストが選択されていた場合
            if ($('#posList').prop("selectedIndex") >= 0) {
                let pos = JSON.parse($('#posList option:selected').text());
                editObjectMarker(pos.x, pos.y);
                $('#posList option').each(function (i) {
                    if (i == $('#posList').prop("selectedIndex")) {
                        posJsonStr += ',' + '{"x":' + x + ', "y":' + y + '}';
                    } else {
                        posJsonStr += ',' + $(this).text();
                    }
                });
            } else {
                $('#posList option').each(function () {
                    posJsonStr += ',' + $(this).text();
                });
                posJsonStr += ',' + '{"x":' + x + ', "y":' + y + '}';
            }
            posJsonStr = posJsonStr.slice(1);
            jsonData = {
                "name": $("#objName").val(),
                "type": $('input[name="objBtn"]:checked').val(),
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val()) / 100,
                "color": $("#objColor").val(),
                "position": JSON.parse('[' + posJsonStr + ']'),
                "option": {
                    "arrowhead": $('input[name="arrowhead"]:checked').val(),
                    "startDash": $("#startDash").prop('checked'),
                    "endDash": $("#endDash").prop('checked')
                }
            }
            new MapObject(jsonData).draw(screen.ctx, screen.diffX, screen.diffY);
            break;
        case 'arcarrow':
            if ($('#startPointX').val() == null || $('#startPointX').val() == '') break;
            screen.redraw(0, 0);
            editObjectMarker(parseInt($('#endPointX').val()), parseInt($('#endPointY').val()));
            jsonData = {
                "name": $("#objName").val(),
                "type": $('input[name="objBtn"]:checked').val(),
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "position": [{ "x": parseInt($('#startPointX').val()), "y": parseInt($('#startPointY').val()) },
                    { "x": x, "y": y }],
                "option": {
                    "arrowhead": $('input[name="arrowhead"]:checked').val(),
                    "division": parseFloat($('#division').val()),
                    "camber": parseInt($('#camber').val())
                }
            }
            new MapObject(jsonData).draw(screen.ctx, screen.diffX, screen.diffY);
            break;
        case 'image':
            // キャンセルされた場合
            if (imageObjectSrc == null) {
                $('input[name="objBtn"]').val(['blank']);
                $('input[name="objBtn"]:checked').trigger("change");
                break;
            }
        default:
            screen.redraw(0, 0);
            if ($('#objectList').prop("selectedIndex") >= 0) {
                editObjectMarker(parseInt($("#objX").val()), parseInt($("#objY").val()));
            }
            new MapObject(createJsonDataXY(x,y)).draw(screen.ctx, screen.diffX, screen.diffY);
            break;
    }
});

function createJsonData() {
    let objectType = $('input[name="objBtn"]:checked').val();
    let jsonData;

    switch (objectType) {
        case 'line':
            let posJsonStr = "";
            $('#posList option').each(function () {
                posJsonStr += ',' + $(this).text();
            });
            posJsonStr = posJsonStr.slice(1);
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "position": JSON.parse('[' + posJsonStr + ']'),
                "option": {
                    "arrowhead": $('input[name="arrowhead"]:checked').val(),
                    "startDash": $("#startDash").prop('checked'),
                    "endDash": $("#endDash").prop('checked')
                }
            }
            break;
        case 'arcarrow':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "position": [{ "x": parseInt($('#startPointX').val()), "y": parseInt($('#startPointY').val()) },
                    { "x": parseInt($('#endPointX').val()), "y": parseInt($('#endPointY').val()) }],
                "option": {
                    "arrowhead": $('input[name="arrowhead"]:checked').val(),
                    "division": parseFloat($('#division').val()),
                    "camber": parseInt($('#camber').val())
                }
            }
            break;
        default:
            jsonData = createJsonDataXY(parseInt($('#objX').val()), parseInt($('#objY').val()));
            break;
    }
    return jsonData;
}

function createJsonDataXY(x,y) {
    let objectType = $('input[name="objBtn"]:checked').val();
    let jsonData;

    switch (objectType) {
        case 'point':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "option": {
                    "doubleFlag": $("#doubleFlag").prop('checked')
                }
            };
            break;
        case 'animeUnit':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "rotate": parseInt($("#objRotate").val()),
                "option": { "callsign": $('#callletter').val() + padZero(parseInt($('#callno').val())) }
            };
            break;
        case 'animeHive':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "rotate": parseInt($("#objRotate").val()),
                "option": { "name": $('#hiveName').val().toUpperCase(), "number": padZero(parseInt($('#hiveNo').val())) }
            };
            break;
        case 'unit':
        case 'animeBETA':
        case 'ship':
        case 'fleet':
        case 'plane':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "rotate": parseInt($("#objRotate").val())
            };
            break;
        case 'message':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "message": $("#msgMessage").val(),
                "option": {
                    "gridFlag": $("#msgGrid").prop('checked')
                }
            };
            break;
        case 'line':
            let posJsonStr = "";
            $('#posList option').each(function () {
                posJsonStr += ',' + $(this).text();
            });
            posJsonStr = posJsonStr.slice(1);
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "position": JSON.parse('[' + posJsonStr + ']'),
                "option": {
                    "arrowhead": $('input[name="arrowhead"]:checked').val(),
                    "startDash": $("#startDash").prop('checked'),
                    "endDash": $("#endDash").prop('checked')
                }
            }
            break;
        case 'area':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "rotate": parseInt($("#objRotate").val()),
                "option": {
                    "type": 'eclipse',
                    "width": parseInt($("#areaWidth").val()),
                    "height": parseInt($("#areaHeight").val())
                }
            }
            break;
        case 'arc':
            jsonData = {
                "name": $("#objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "size": parseInt($("#objSize").val()),
                "alpha": parseInt($("#objAlpha").val())/100,
                "color": $("#objColor").val(),
                "rotate": parseInt($("#objRotate").val()),
                "option": {
                    "width": parseInt($("#areaWidth").val()),
                    "height": parseInt($("#areaHeight").val()),
                    "startAngle": parseInt($("#arcStartAngle").val()),
                    "endAngle": parseInt($("#arcEndAngle").val())
                }
            }
            break;
        case 'image':
            let img = new Image();
            img.src = imageObjectSrc;
            jsonData = {
                "name": $("objName").val(),
                "type": objectType,
                "x": x,
                "y": y,
                "imageSrc": img,
                "scale": parseInt($("#objScale").val()) / 100,
                "alpha": parseInt($('#objAlpha').val()) / 100,
                "rotate": parseInt($("#objRotate").val())
            }
            break;
        default:
            return null;
    }
    return jsonData;
}

$('html').keydown(function (e) {
    const index = $('#objectList').prop("selectedIndex");
    if (index >= 0) {
        switch ($('input[name="objBtn"]:checked').val()) {
            case 'line':
            case 'arrow':
                break;
            default:
                switch (e.which) {
                    case 39: // Key[→]
                        $('#objX').val(parseInt($('#objX').val()) + 1);
                        break;
                    case 37: // Key[←]
                        $('#objX').val(parseInt($('#objX').val()) - 1);
                        break;
                    case 38: // Key[↑]
                        $('#objY').val(parseInt($('#objY').val()) - 1);
                        break;
                    case 40: // Key[↓]
                        $('#objY').val(parseInt($('#objY').val()) + 1);
                        break;
                }
                screen.updateObject(index, new MapObject(createJsonData()));
                screen.redraw(0, 0);
                editObjectMarker(parseInt($('#objX').val()), parseInt($('#objY').val()));
                break;
        }
    }
});
