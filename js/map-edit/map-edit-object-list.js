/* Object List Up Btn */
$("#objUpBtn").click(function () {
    const index = $('#objectList').prop("selectedIndex");

    // 一番先頭のオブ江ジェクトだったら何もしない
    if (index == 0) return;

    screen.upObject(index);
    screen.redraw(0, 0);
    const $selected = $("#objectList > option:selected");
    if (!$selected.length) return;
    $selected.insertBefore($selected.prev());
});

/* Object List Down Btn */
$("#objDownBtn").click(function () {
    const index = $('#objectList').prop("selectedIndex");

    // 一番下のオブジェクトだったら何もしない
    if (index == $('#objectList').children('option').length - 1) return;

    screen.downObject(index);
    screen.redraw(0, 0);
    const $selected = $("#objectList > option:selected");
    if (!$selected.length) return;
    $selected.insertAfter($selected.next());
});

/* 削除 */
$('#objDelBtn').click(function () {
    // オブジェクトが選択されていない場合
    if (document.getElementById('objectList').value == '') {
        return;
    }

    // POPUPで削除してよいか確認する
    if (!window.confirm("オブジェクトを削除しても宜しいですか？")) {
        // キャンセルの場合
        return;
    }

    // position系のconfをクリア
    confRefresh();

    // 対象のObject要素を画面から削除
    screen.removeObject($('#objectList').prop("selectedIndex"));

    // ObjectListから削除
    $('#objectList > option:selected').remove();

    // 再描画
    screen.redraw(0, 0);
});

/* オブジェクト全削除 */
$('#allObjDelBtn').click(function () {
    // POPUPで削除してよいか確認する
    if (!window.confirm("オブジェクトを全て削除しても宜しいですか？")) {
        // キャンセルの場合
        return;
    }

    // position系のconfをクリア
    confRefresh();

    // オブジェクトの全削除
    screen.allRemoveObject();

    // オブジェクトリストの全削除
    $('#objectList').children().remove();

    // 再描画
    screen.redraw(0, 0);
});

/* オブジェクトリスト選択 */
$('#objectList').change(function () {
    // 名前はjsonDataからではなく、リストの項目名から取得
    $('#objName').val($('#objectList > option:selected').text());

    // オブジェクトのデータを呼び出し
    const jsonData = screen.getObject($('#objectList').prop("selectedIndex"));

    // 対象オブジェクトタイプにボタンを切り替え
    $('input:radio[name="objBtn"]').val([jsonData.type]);
 
    // 共通パラメータ
    $('#objSize').val(jsonData.size);
    $('#objColor').val(jsonData.color);
    $('#objAlpha').val(jsonData.alpha*100);

    // 個別パラメータ
    $('#objRotate').val(typeof jsonData.rotate !== 'undefined' ? jsonData.rotate : 0);
    $('#objX').val(typeof jsonData.x !== undefined ? jsonData.x : '');
    $('#objY').val(typeof jsonData.y !== undefined ? jsonData.y : '');

    // 位置座標のパラメータ
    switch (jsonData.type) {
        case 'line':
            $("#posList").children().remove();
            for (let i = 0; i < jsonData.position.length; i++) {
                const pos_s = JSON.stringify(jsonData.position[i]);
                $("#posList").append(`<option>`+pos_s+`</option>`);
            }
            $('input[name="arrowhead"]').val([jsonData.option.arrowhead]);
            $('#startDash').prop('checked', jsonData.option.startDash);
            $('#endDash').prop('checked', jsonData.option.endDash);
            break;
        case 'point':
            $('#doubleFlag').prop('checked', jsonData.option.doubleFlag);
            break;
        case 'message':
            $('#msgMessage').val(jsonData.message);
            $('#msgGrid').prop('checked', jsonData.option.gridLine);
            break;
        case 'arc':
            $('#arcStartAngle').val(jsonData.option.startAngle);
            $('#arcEndAngle').val(jsonData.option.endAngle);
        case 'area':
            $('#areaWidth').val(jsonData.option.width);
            $('#areaHeight').val(jsonData.option.height);
            break;
        case 'arcarrow':
            $('#startPointX').val(jsonData.position[0].x);
            $('#startPointY').val(jsonData.position[0].y);
            $('#endPointX').val(jsonData.position[1].x);
            $('#endPointY').val(jsonData.position[1].y);
            $('#division').val(jsonData.option.division);
            $('#camber').val(jsonData.option.camber);
            $('input[name="arrowhead"]').val([jsonData.option.arrowhead]);
            break;
        case 'image':
            imageObjectSrc = jsonData.imageSrc.src;
            $('#objAlpha').val(jsonData.alpha * 100);
            $('#objScale').val(jsonData.scale * 100);
            $('#objRotate').val(jsonData.rotate);
            break;
        case 'animeUnit':
            let callsign = jsonData.option.callsign;
            $('#callletter').val(callsign.substr(0, 1));
            $('#callno').val(callsign.substr(1));
            break;
        case 'animeHive':
            $('#hiveName').val(jsonData.option.name);
            $('#hiveNo').val(jsonData.option.number);
        default:
            break;
    }
    // プレビュー画面更新
    objectPreview();

    // 再描画
    screen.redraw(0, 0);

    // 対象オブジェクトを白い点で示す
    editObjectMarker(jsonData.x, jsonData.y);

    $('#objectList').blur();
    $('#mapGrid').focus();
});

/* 対象オブジェクトを白い点で示す */
function editObjectMarker(x, y) {
    if (typeof x === undefined || typeof y === undefined) return;
    new MapObject({
        "name": 'point',
        "type": 'point',
        "x": x,
        "y": y,
        "size": 10,
        "alpha": 1,
        "color": '#FFFFFF',
        "option": {
            "doubleFlag": false
        }
    }).draw(screen.ctx, screen.diffX, screen.diffY);
}