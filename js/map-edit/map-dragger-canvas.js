function Screen(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // キャンパスコンテキストの初期値保存
    this.ctx.globalAlpha = 1;
    this.ctx.setLineDash([]);
    this.ctx.shadowColor = "rgba(0, 0, 0, 0)";
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;
    this.ctx.save();

    // パラメータ
    this.objects = [];
    this.diffX = 0;
    this.diffY = 0;
    this.image = new Image();
    this.gridSize = 0;
    this.gridColor = "rgb(0, 255, 255)";
    this.gridLineWidth = 1;
    this.gridAlpha = 0.3;
    this.background = "rgba(0, 0, 0, 0)";
    this.backgroundAlpha = 1;
    this.fdGridSize = 20;
    this.fdColor = 'rgb(255,30,100)';
    this.resetFdGrid();
}

Screen.prototype.resetFdGrid = function () {
    const posXsize = Math.ceil(this.canvas.width / this.fdGridSize);
    const posYsize = Math.ceil(this.canvas.height / this.fdGridSize);

    this.fdGrid = new Array(posXsize);
    for (let i = 0; i < posXsize; i++) {
        this.fdGrid[i] = new Array(posYsize);
        for (let j = 0; j < posYsize; j++) {
            this.fdGrid[i][j] = 0;
        }
    }
};

Screen.prototype.setForceDistribution = function (color, size) {
    this.fdColor = color;
    if (this.fdGridSize != size) {
        this.fdGridSize = size;
        this.resetFdGrid();
    }
    this.redraw(0,0);
}

Screen.prototype.addObject = function (object) {
    this.objects.unshift(object);
};

Screen.prototype.removeObject = function (index) {
    this.objects.splice(index, 1);
}

Screen.prototype.allRemoveObject = function () {
    this.objects = [];
}

Screen.prototype.getObject = function (index) {
    return this.objects[index];
}

Screen.prototype.updateObject = function (index,object) {
    this.objects[index] = object;
}


Screen.prototype.upObject = function (index) {
    const s_object = this.objects[index];
    this.objects[index] = this.objects[index - 1];
    this.objects[index - 1] = s_object;
}

Screen.prototype.downObject = function (index) {
    const s_object = this.objects[index];
    this.objects[index] = this.objects[index + 1];
    this.objects[index + 1] = s_object;
}

Screen.prototype.redraw = function (dx, dy) {
    this.clearScreen();
    this.diffX += dx;
    this.diffY += dy;

    // CanvasSize変更
    this.canvas.width = this.image.width != 0 ? this.image.width : this.canvas.width;
    this.canvas.height = this.image.height != 0 ? this.image.height : this.canvas.height;

    this.ctx.beginPath();
    this.ctx.globalAlpha = this.backgroundAlpha;
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(this.diffX, this.diffY, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;

    // 画像描画
    this.ctx.drawImage(this.image, this.diffX, this.diffY);

    // 戦力分布レイヤー
    forceDistributorLayer(this.ctx,this.diffX,this.diffY,this.fdColor,this.fdGrid,this.fdGridSize);

    // Grid線描画
    if (this.gridSize != 0) {
        DrawGrid(this.ctx, this.gridSize, this.gridColor, this.gridLineWidth, this.gridAlpha,
            this.image.width != 0 ? this.image.width : this.canvas.width,
            this.image.height != 0 ? this.image.height : this.canvas.height,
            this.diffX, this.diffY)
    }
    for (let i = this.objects.length - 1; i >= 0; i--) {
        this.objects[i].draw(this.ctx, this.diffX, this.diffY);
    }
};

function DrawGrid(ctx, size, color, lineWidth, alpha, imageWidth, imageHeight, diffX, diffY) {
    const currentColor = ctx.strokeStyle;
    const currentAlpha = ctx.globalAlpha;
    const currentLineWidth = ctx.lineWidth;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;

    // 横線
    for (let i = 1; i <= Math.floor(imageHeight / size); i++) {
        ctx.beginPath();
        ctx.moveTo(diffX, i * size + diffY);
        ctx.lineTo(imageWidth + diffX, i * size + diffY);
        ctx.stroke();
    }

    // 縦線
    for (let i = 1; i <= Math.floor(imageWidth / size); i++) {
        ctx.beginPath();
        ctx.moveTo(i * size + diffX, diffY);
        ctx.lineTo(i * size + diffX, imageHeight + diffY);
        ctx.stroke();
    }

    ctx.strokeStyle = currentColor;
    ctx.globalAlpha = currentAlpha;
    ctx.currentLineWidth = currentLineWidth;
}

Screen.prototype.clearScreen = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Screen.prototype.reposition = function () {
    this.redraw(-this.diffX, -this.diffY);
}

Screen.prototype.setGrid = function (size,color,lineSize,lineAlpha) {
    this.gridSize = size;
    this.gridColor = color;
    this.gridLineWidth = lineSize;
    this.gridAlpha = lineAlpha;
}

Screen.prototype.setCanvasSize = function (width, height) {
    this.clearScreen();
    this.canvas.width = width;
    this.canvas.height = height;
    this.redraw(0,0);
}

Screen.prototype.setBgColor = function (rgb,alpha) {
    this.background = rgb;
    this.backgroundAlpha = alpha;
    this.redraw(0,0);
}

function CanvasDragger(elem) {
    elem.addEventListener('mousedown', this._handleMouseDown.bind(this), false);
    elem.addEventListener('mouseup', this._handleMouseUp.bind(this), false);
    elem.addEventListener('mousemove', this._handleMouseMove.bind(this), false);
    this.elem = elem;
    this.isDragging = false;
    this.isMode = true;
}

CanvasDragger.prototype.setMode = function (flag) {
    this.isMode = flag;
}

CanvasDragger.prototype.setMoveHandler = function (callback) {
    this.moveHandler = callback;
};

CanvasDragger.prototype._handleMouseDown = function (e) {
    this.prevX = e.offsetX;
    this.prevY = e.offsetY;
    if(this.isMode) this.isDragging = true;
};

CanvasDragger.prototype._handleMouseUp = function (e) {
    this.isDragging = false;
};

CanvasDragger.prototype._handleMouseMove = function (e) {
    if (!this.isDragging) {
        return;
    }
    let diffX = e.offsetX - this.prevX;
    let diffY = e.offsetY - this.prevY;
    this.prevX = e.offsetX;
    this.prevY = e.offsetY;
    if (this.moveHandler) {
        this.moveHandler(diffX, diffY);
    }
};

function MapObject(jsonData) {
    this.type = jsonData.type;
    this.name = jsonData.name;
    this.color = jsonData.color;
    this.size = jsonData.size;
    this.alpha = jsonData.alpha;
    this.rotate = jsonData.rotate;
    this.x = jsonData.x;
    this.y = jsonData.y;
    this.position = jsonData.position;
    this.message = jsonData.message;
    this.option = jsonData.option;
    this.imageSrc = jsonData.imageSrc;
    this.scale = jsonData.scale;
}

MapObject.prototype.draw = function (ctx, dx, dy) {
    let x = this.x + dx;
    let y = this.y + dy;
    switch (this.type) {
        case 'point':
            pointObject(ctx, x, y, this.size, this.alpha, this.color, this.option);
            break;
        case 'message':
            messageObject(ctx, x, y, this.size, this.alpha, this.color, this.message, this.option);
            break;
        case 'unit':
            unitObject(ctx, x, y, this.size, this.alpha, this.color, this.rotate);
            break;
        case 'animeUnit':
            animeUnitObject(ctx, x, y, this.size, this.alpha, this.color, this.rotate, this.option);
            break;
        case 'animeBETA':
            animeBETAObject(ctx, x, y, this.size, this.alpha, this.color, this.rotate);
            break;
        case 'animeHive':
            animeHiveObject(ctx, x, y, this.size, this.alpha, this.color, this.rotate, this.option);
            break;
        case 'ship':
            shipObject(ctx, x, y, this.size, this.alpha, this.color, this.rotate);
            break;
        case 'fleet':
            fleetObject(ctx, x, y, this.size, this.alpha, this.color, this.rotate);
            break;
        case 'plane':
            planeObject(ctx, x, y, this.size, this.alpha, this.color, this.rotate);
            break;
        case 'line':
            let line_pos = [];
            for (let i = 0; i < this.position.length; i++) {
                line_pos.push({
                    "x": this.position[i].x + dx,
                    "y": this.position[i].y + dy
                });
            }
            lineObject(ctx, line_pos, this.size, this.alpha, this.color, this.option);
            break;
        case 'area':
            areaObject(ctx, x, y, this.option.width, this.option.height, this.size, this.alpha, this.color, this.rotate, this.option);
            break;
        case 'arc':
            arcObject(ctx, x, y, this.option.width, this.option.height, this.option.startAngle, this.option.endAngle, this.size, this.alpha, this.color, this.rotate, this.option);
            break;
        case 'arcarrow':
            let arcarrow_pos = [{
                    "x": this.position[0].x + dx,
                    "y": this.position[0].y + dy
                },{
                    "x": this.position[1].x + dx,
                    "y": this.position[1].y + dy
                }];
            arcArrowObject(ctx, arcarrow_pos, this.size, this.alpha, this.color, this.option);
            break;
        case 'image':
            imageObject(ctx, this.imageSrc, x, y, this.scale, this.alpha, this.rotate);
            break;
        default:
            break;
    }
}
