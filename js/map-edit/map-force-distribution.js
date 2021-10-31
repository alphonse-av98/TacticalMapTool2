function forceDistributorLayer(ctx, diffX, diffY, color, grid, gridSize) {

    // 透明度
    ctx.globalAlpha = 0.1;

    // 文字の設定
    ctx.fillStyle = color;
    ctx.lineWidth = 0;

    ctx.shadowColor = color;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            for (let k = 0; k < grid[i][j]; k++){
                ctx.beginPath();
                ctx.arc(diffX + gridSize * i + gridSize / 2,
                    diffY + gridSize * j + gridSize / 2,
                    k / 2 < gridSize / 2 * 1.3 ? k / 2 : gridSize / 2
                    , 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // 透明度
    ctx.globalAlpha = 1;
}