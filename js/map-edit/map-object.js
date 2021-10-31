/**
 * 部隊アイコンまたは矢印の先のオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの中心のcanvas上のx座標
 * @param {number} y オブジェクトの中心のcanvas上のy座標
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {number} rotate 回転の角度
 */
function unitObject(ctx, x, y, size, alpha, color, rotate) {
    let width = size;
    let t_height = size * 3 / 4;
    let s_height = size * 1 / 4 * 0.9;
    let c_x = x - size / 2;
    let c_y = y - size / 2;

    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // △部分の描画
    ctx.beginPath();
    ctx.moveTo(c_x + width / 2, c_y);
    ctx.lineTo(c_x, c_y + t_height);
    ctx.lineTo(c_x + width / 4, c_y + t_height);
    ctx.lineTo(c_x + width / 2, c_y + t_height - width / 2 * 3 / 4);
    ctx.lineTo(c_x + width * 3 / 4, c_y + t_height);
    ctx.lineTo(c_x + width, c_y + t_height);
    ctx.closePath();

    // 透明度
    ctx.globalAlpha = alpha;

    // 塗りつぶしの色
    ctx.fillStyle = color;
    ctx.fill();

    // 四角の描画
    ctx.fillRect(c_x, c_y + size - s_height, width, s_height);

    // 回転
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = 1;
}

/**
 * 船アイコンのオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの中心のcanvas上のx座標
 * @param {number} y オブジェクトの中心のcanvas上のy座標
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {number} rotate 回転の角度
 */
function shipObject(ctx, x, y, size, alpha, color, rotate) {
    let width = size / 3;

    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = alpha;

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x - width / 2, y + size / 3);
    ctx.quadraticCurveTo(x, y + size * 1, x + width / 2, y + size / 3);
    ctx.lineTo(x + width / 2, y);
    ctx.quadraticCurveTo(x, y - size * 1.2, x - width / 2, y);
    ctx.fill();

    // 回転
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = 1;
}

/**
 * 文字を表示
 * @param {*} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color
 * @param {string} message
 * @param {json} option
 */
function messageObject(ctx, x, y, size, alpha, color, message, option) {
    ctx.save();

    // 文字の設定
    ctx.font = size + 'px "ＭＳ ゴシック",serif';

    ctx.beginPath();
    // 影を付ける。一旦固定
    ctx.shadowColor = "#000";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 3;

    // 透明度
    ctx.globalAlpha = alpha;

    // カラー指定
    ctx.fillStyle = color;

    // 文字列に改行を含んでいるか確認
    let lines = message.split("\n");

    // 最大幅
    let objWidth = 0;
    for (let i = 0; i < lines.length; i++) {
        // テキストの描画
        ctx.fillText(lines[i], x, y + size * (i + 1));

        // 幅を取得
        let lineSize = ctx.measureText(lines[i]);

        // 最大幅の行の幅を保存
        if (objWidth < lineSize.width) objWidth = lineSize.width;
    }
    ctx.restore();

    if (option.gridFlag) {

        // 透明度
        ctx.globalAlpha = alpha;

        // 枠の幅
        ctx.lineWidth = 2;

        // 枠の色
        ctx.strokeStyle = color;

        // 枠の設定
        ctx.rect( x - size * 0.2, y - size * 0.1, objWidth + size * 0.4, size * lines.length * 1.2);

        // 枠の描画
        ctx.stroke();
    }

    // 透明度
    ctx.globalAlpha = 1;
}

/**
 * ポイントを表すオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの中心のcanvas上のx座標
 * @param {number} y オブジェクトの中心のcanvas上のy座標
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {json} option
 */
function pointObject(ctx, x, y, size, alpha, color, option) {

    let radius = option.doubleFlag ? size / 2 * 0.7 : size / 2;

    // 透明度
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    if (option.doubleFlag) {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI, false);
        ctx.lineWidth = size / 10;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    // 透明度
    ctx.globalAlpha = 1;
}

/**
 * 艦隊アイコンのオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの真ん中の船の中心のcanvas上のx座標
 * @param {number} y オブジェクトの真ん中の船の中心のcanvas上のy座標
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {number} rotate 回転の角度
 */
function fleetObject(ctx, x, y, size, alpha, color, rotate) {
    let width = size / 3;

    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = alpha;

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x - width / 2, y + size / 3);
    ctx.quadraticCurveTo(x, y + size * 1, x + width / 2, y + size / 3);
    ctx.lineTo(x + width / 2, y);
    ctx.quadraticCurveTo(x, y - size * 1.2, x - width / 2, y);
    ctx.fill();

    x2 = x + size/2;
    y2 = y + size/2;

    ctx.beginPath();
    ctx.moveTo(x2 - width / 2, y2);
    ctx.lineTo(x2 - width / 2, y2 + size / 3);
    ctx.quadraticCurveTo(x2, y2 + size * 1, x2 + width / 2, y2 + size / 3);
    ctx.lineTo(x2 + width / 2, y2);
    ctx.quadraticCurveTo(x2, y2 - size * 1.2, x2 - width / 2, y2);
    ctx.fill();

    x2 = x - size/2;

    ctx.beginPath();
    ctx.moveTo(x2 - width / 2, y2);
    ctx.lineTo(x2 - width / 2, y2 + size / 3);
    ctx.quadraticCurveTo(x2, y2 + size * 1, x2 + width / 2, y2 + size / 3);
    ctx.lineTo(x2 + width / 2, y2);
    ctx.quadraticCurveTo(x2, y2 - size * 1.2, x2 - width / 2, y2);
    ctx.fill();

    // 回転
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = 1;
}

/**
 * 三角形のオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの中心のcanvas上のx座標
 * @param {number} y オブジェクトの中心のcanvas上のy座標
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {number} rotate 回転の角度
 */
function triangleObject(ctx, x, y, size, alpha, color, rotate) {
    // 透明度
    ctx.globalAlpha = alpha;

    // 色
    ctx.fillStyle = color;

    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 辺の長さ
    let radius = size / Math.sin( Math.PI / 3);

    // 三角形の描画
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x - radius / 2, y + size / 2);
    ctx.lineTo(x + radius / 2, y + size / 2);
    ctx.closePath();

    ctx.fill();

    // 回転
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = 1;
}

/**
 * 線/矢印のオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {JSON} position オブジェクトのcanvas上の座標の一覧
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {JSON} option オプション
 */
function lineObject(ctx, position, size, alpha, color, option) {

    // 接点を丸くする
    ctx.lineJoin = "round";
    ctx.lineCap = "butt";

    // 透明度
    ctx.globalAlpha = alpha;

    ctx.strokeStyle = color;

    ctx.lineWidth = size / 4;

    let distance;
    let radian = calcRadian(position[0].x, position[0].y,
        position[1].x, position[1].y);

    ctx.beginPath();
    ctx.moveTo(position[0].x, position[0].y);
    if (typeof option.startDash !== undefined ? option.startDash : false) {
        distance = calcDistance(position[0].x, position[0].y,position[1].x, position[1].y);
        const x1 = position[0].x + (size / 4 * 9) * Math.cos(radian);
        const y1 = position[0].y + (size / 4 * 9) * Math.sin(radian);
        ctx.setLineDash([size / 4 * 2,size / 4]);
        ctx.lineDashOffset = size / 4;

        // 破線部分が線より長くなる場合は途中点の描画をスキップ
        if (distance > size / 4 * 9) {
            ctx.lineTo(x1, y1);
            ctx.stroke();

            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(x1, y1);
        } else {
            ctx.lineTo(position[1].x, position[1].y);
            ctx.stroke();

            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(position[1].x, position[1].y);
        }

    }

    for (let i = 1; i < position.length-1; i++){
        ctx.lineTo(position[i].x, position[i].y);
    }

    // 変数
    let endX = position[position.length - 1].x;
    let endY = position[position.length - 1].y;
    distance = calcDistance(position[position.length - 2].x, position[position.length - 2].y,
        position[position.length - 1].x, position[position.length - 1].y);

    radian = calcRadian(position[position.length - 2].x, position[position.length - 2].y,
        position[position.length - 1].x, position[position.length - 1].y);

    // 最後の線の描画
    if (typeof option.arrowhead !== undefined && option.arrowhead != '') {
        distance = distance - size / 2;

        // 線の終点
        endX = position[position.length - 2].x + distance * Math.cos(radian);
        endY = position[position.length - 2].y + distance * Math.sin(radian);

        // 終わりに破線の場合
        if (typeof option.endDash !== undefined ? option.endDash : false) {
            const x1 = position[position.length - 2].x + (distance - size / 4 * 9) * Math.cos(radian);
            const y1 = position[position.length - 2].y + (distance - size / 4 * 9) * Math.sin(radian);

            // 破線部分が線より長くなる場合は途中点の描画をスキップ
            if( distance >= size / 4 * 9 ) ctx.lineTo(x1 , y1);
            ctx.stroke();

            ctx.beginPath();
            ctx.setLineDash([size / 4 * 2,size / 4]);
            ctx.lineDashOffset = size / 4;
            ctx.moveTo(distance > size / 4 * 9? x1 : position[position.length - 2].x,distance > size / 4 * 9? y1 : position[position.length - 2].y);
        }

        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 矢じりの選択
        switch (option.arrowhead) {
            case 'unit':
                unitObject(ctx, position[position.length - 1].x, position[position.length - 1].y, size, alpha, color, radian * 180 / Math.PI + 90);
                break;
            case 'triangle':
                triangleObject(ctx, position[position.length - 1].x, position[position.length - 1].y, size, alpha, color, radian * 180 / Math.PI + 90);
            default:
                break;
        }
    } else {
        // 終わりに破線の場合
        if (typeof option.endDash !== undefined ? option.endDash : false) {
            const x1 = position[position.length - 2].x + (distance - size / 4 * 9) * Math.cos(radian);
            const y1 = position[position.length - 2].y + (distance - size / 4 * 9) * Math.sin(radian);

            // 破線部分が線より長くなる場合は途中点の描画をスキップ
            if( distance >= size / 4 * 9 ) ctx.lineTo(x1 , y1);
            ctx.stroke();

            ctx.beginPath();
            ctx.setLineDash([size / 4 * 2,size / 4]);
            ctx.lineDashOffset = size / 4;
            ctx.moveTo(distance > size / 4 * 9? x1 : position[position.length - 2].x,distance > size / 4 * 9? y1 : position[position.length - 2].y);
        }
        ctx.lineTo(position[position.length - 1].x, position[position.length - 1].y);
        ctx.stroke();
    }

    // 初期化
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
}

function calcDistance(x1,y1,x2,y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function calcRadian(x1,y1,x2,y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * エリアのオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの中心のcanvas上のx座標
 * @param {number} y オブジェクトの中心のcanvas上のy座標
 * @param {number} width オブジェクトの中心の横幅
 * @param {number} height オブジェクトの中心の縦幅
 * @param {number} size オブジェクトの線の太さ
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {string} rotate 回転
 * @param {json} option オブジェクトのオプション
 */
function areaObject(ctx, x, y, width, height, size, alpha, color, rotate, option) {
    // 透明度
    ctx.globalAlpha = alpha;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.lineWidth = size / 4;

    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    switch (option.type) {
        case 'eclipse':
            ctx.beginPath();
            ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
            ctx.fill();
            break;
        default:
            break;
    }
    // 透明度
    ctx.globalAlpha = 1;
    ctx.stroke();

    // 回転戻し
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);
}

/**
 * 弧オブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの中心のcanvas上のx座標
 * @param {number} y オブジェクトの中心のcanvas上のy座標
 * @param {number} width オブジェクトの中心の横幅
 * @param {number} height オブジェクトの中心の縦幅
 * @param {number} startAngle オブジェクトの描画開始角度
 * @param {number} endAngle オブジェクトの描画終了角度
 * @param {number} size オブジェクトの線の太さ
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {string} rotate 回転
 */
function arcObject(ctx, x, y, width, height, startAngle, endAngle, size, alpha, color, rotate) {
    // 透明度
    ctx.globalAlpha = alpha;

    ctx.strokeStyle = color;

    ctx.lineWidth = size / 4;

    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, (startAngle + 180) * Math.PI / 180, (endAngle + 180) * Math.PI / 180);
    ctx.stroke();

    // 回転戻し
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = 1;
}

/**
 * 線/矢印のオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {JSON} position オブジェクトのcanvas上の座標の一覧
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {JSON} option オプション
 */
function arcArrowObject(ctx, position, size, alpha, color, option) {
    // 接点を丸くする
    ctx.lineJoin = "round";
    ctx.lineCap = "butt";

    // 透明度
    ctx.globalAlpha = alpha;

    ctx.strokeStyle = color;

    ctx.lineWidth = size / 4;

    let distance = calcDistance(position[0].x, position[0].y, position[1].x, position[1].y);
    let radian = calcRadian(position[0].x, position[0].y, position[1].x, position[1].y);

    ctx.beginPath();
    ctx.moveTo(position[0].x, position[0].y);

    let radian_a;
    if ((position[1].x - position[0].x) >= 0 && (position[1].y - position[0].y) >= 0) {
        radian_a = Math.acos((position[1].x - position[0].x) / distance);
    } else if((position[1].x - position[0].x) > 0 && (position[1].y - position[0].y) < 0) {
        radian_a = Math.asin((position[1].y - position[0].y) / distance);
    } else if((position[1].x - position[0].x) < 0 && (position[1].y - position[0].y) > 0) {
        radian_a = Math.acos((position[1].x - position[0].x) / distance);
    } else if((position[1].x - position[0].x) < 0 && (position[1].y - position[0].y) < 0) {
        radian_a = -Math.acos((position[1].x - position[0].x) / distance);
    }

    let cpx = distance * option.division * Math.cos(radian_a) - option.camber * Math.sin(radian_a) + position[0].x;
    let cpy = distance * option.division * Math.sin(radian_a) + option.camber * Math.cos(radian_a) + position[0].y;

    ctx.quadraticCurveTo(cpx, cpy, position[1].x, position[1].y);
    ctx.stroke();

    radian = calcRadian(cpx, cpy, position[1].x, position[1].y);

    // distance = calcDistance(cpx, cpy, position[1].x, position[1].y);
    // 線の終点
    let endX = position[1].x + size / 2 * Math.cos(radian);
    let endY = position[1].y + size / 2 * Math.sin(radian);

    // 矢じりの選択
    switch (option.arrowhead) {
        case 'unit':
            unitObject(ctx, endX, endY, size, alpha, color, radian * 180 / Math.PI + 90);
            break;
        case 'triangle':
            triangleObject(ctx, endX, endY, size, alpha, color, radian * 180 / Math.PI + 90);
        default:
            break;
    }

    // 初期化
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
}

/**
 * 画像添付
 * @param {*} ctx 
 * @param {Image} src 
 * @param {number} x 
 * @param {number} y 
 * @param {number} size 
 * @param {number} alpha 
 * @param {number} rotate 
 */
function imageObject(ctx, src, x, y, size, alpha, rotate) {
    ctx.globalAlpha = alpha;
    
    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);
   
    ctx.drawImage(src, x - src.width * size / 2, y - src.height * size / 2, src.width * size , src.height * size);

    // 回転戻し
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 初期化
    ctx.globalAlpha = 1;
}

/**
 * 飛行機アイコンのオブジェクト
 * @param {*} ctx canvasのコンテキスト
 * @param {number} x オブジェクトの中心のcanvas上のx座標
 * @param {number} y オブジェクトの中心のcanvas上のy座標
 * @param {number} size オブジェクトのサイズ（正方形の１辺）
 * @param {number} alpha オブジェクトの透明度
 * @param {string} color RGB指定
 * @param {number} rotate 回転の角度
 */
function planeObject(ctx, x, y, size, alpha, color, rotate) {
    let width = size / 6;

    // 回転
    ctx.translate(x, y );
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = alpha;

    ctx.fillStyle = color;


    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.quadraticCurveTo(x - width / 3, y - size / 2, x - width / 3, y - width / 2);
    ctx.quadraticCurveTo(x - ( size / 2 - width / 3 ) * 2, y + width * 1.6, x - width / 3, y );
    ctx.lineTo(x - width / 3 * 0.6, y + size / 2 * 0.95);
    ctx.lineTo(x - width / 2, y + size / 2);
    ctx.lineTo(x + width / 2, y + size / 2);
    ctx.lineTo(x + width / 3 * 0.6, y + size / 2 * 0.95);
    ctx.lineTo(x + width / 3, y);
    ctx.quadraticCurveTo(x + ( size / 2 - width / 3 ) * 2, y + width * 1.6, x + width / 3, y - width / 2);
    ctx.quadraticCurveTo(x + width / 3, y - size / 2, x, y - size / 2);
    ctx.fill();

    // 回転
    ctx.translate(x , y );
    ctx.rotate(-rotate * Math.PI / 180);
    ctx.translate(-x, -y);

    // 透明度
    ctx.globalAlpha = 1;
}
