function Vec2(x, y) {
    this.x = x;
    this.y = y;
}

function drawLines(ctx, vtx) {
    if (!vtx) {
        return;
    }
    if (!vtx[0]) {
        return;
    }
    ctx.beginPath();
    ctx.moveTo(vtx[0].x, vtx[0].y);

    var i = 1;
    while (true) {
        if (!vtx[i]) {
            break;
        }
        ctx.lineTo(vtx[i].x, vtx[i].y);
        i++;
    }
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.stroke();
}

function CellTri(vtx, l, f) {
    this.vtx = vtx;
    this.l = l;
    this.f = 0.7;
    this.level = 0;
    if (this.vtx[0] != null) {
        var x = this.vtx[0].x;
        var y = this.vtx[0].y;
        this.vtx[4] = new Vec2(x - l / 2, y + 0.5 * 1.732 * l);
        this.vtx[8] = new Vec2(x + l / 2, y + 0.5 * 1.732 * l);
    } else if (this.vtx[4] != null) {
        var x = this.vtx[4].x;
        var y = this.vtx[4].y;
        this.vtx[0] = new Vec2(x + l / 2, y - 0.5 * 1.732 * l);
        this.vtx[8] = new Vec2(x + l, y);
    } else if (this.vtx[8] != null) {
        var x = this.vtx[8].x;
        var y = this.vtx[8].y;
        this.vtx[0] = new Vec2(x - l / 2, y - 0.5 * 1.732 * l);
        this.vtx[4] = new Vec2(x - l, y);
    }
    this.init();
}

CellTri.prototype.init = function() {
    var x = this.vtx[4].x;
    var y = this.vtx[4].y;
    var l = this.l;
    var f = this.f;

    this.vtx[5] = new Vec2(x + 2 * f * l - l, y);
    this.vtx[7] = new Vec2(x + l - 2 * f * l + l, y);
    this.vtx[3] = new Vec2(x + f * l - 0.5 * l, y - 1.732 * (f - 0.5) * l);
    this.vtx[6] = new Vec2(x + l - f * l + 0.5 * l, y - 1.732 * (f - 0.5) * l);
    this.vtx[1] = new Vec2(x + 0.5 * l - f * l + 0.5 * l, y - 0.5 * 1.732 * (l - 2 * f * l + l));
    this.vtx[2] = new Vec2(x + 0.5 * l + f * l - 0.5 * l, y - 0.5 * 1.732 * (l - 2 * f * l + l));
}

MasterTri.prototype.drawLevel = function(ctx) {
    var cells = [];
    var pts = [];

    cell = this.cell[0].vtx;
    pt = [cell[0], cell[1], cell[2]];
    cells.push(cell);
    pts.push(pt);

    cell = this.cell[1].vtx;
    pt = [cell[6], cell[7], cell[8]];
    cells.push(cell);
    pts.push(pt);

    cell = this.cell[2].vtx;
    pt = [cell[3], cell[4], cell[5]];
    cells.push(cell);
    pts.push(pt);

    for (i = 0; i < this.level; ++i) {
        this.drawLevelCell(ctx, cells[i], pts[i]);
    }
}

MasterTri.prototype.drawLevelCell = async function(ctx, cell, pt) {
    ctx.beginPath();
    ctx.moveTo(cell[1].x, cell[1].y);
    ctx.lineTo(cell[3].x, cell[3].y);
    ctx.lineTo(cell[5].x, cell[5].y);
    ctx.lineTo(cell[7].x, cell[7].y);
    ctx.lineTo(cell[6].x, cell[6].y);
    ctx.lineTo(cell[2].x, cell[2].y);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(pt[0].x, pt[0].y);
    ctx.lineTo(pt[1].x, pt[1].y);
    ctx.lineTo(pt[2].x, pt[2].y);
    ctx.closePath();
    ctx.fillStyle = "#7f1713";
    ctx.fill();
}

CellTri.prototype.draw = function(ctx) {
    var vtx = this.vtx;

    drawLines(ctx, [vtx[0], vtx[4], vtx[8]]);

    drawLines(ctx, [vtx[1], vtx[2]]);

    drawLines(ctx, [vtx[3], vtx[5]]);

    drawLines(ctx, [vtx[6], vtx[7]]);
}

MasterTri.prototype.setLevel = function(level) {
    this.level = level;
}


function MasterTri(posx, posy, len, factor) {
    var vtx1 = [null, null, null, null, null, null, null, null, null];
    var vtx2 = [null, null, null, null, null, null, null, null, null];
    var vtx3 = [null, null, null, null, null, null, null, null, null];

    vtx1[0] = new Vec2(posx + 0.5 * len, posy);
    vtx2[8] = new Vec2(posx + len, posy + len * 0.5 * 1.732);
    vtx3[4] = new Vec2(posx, posy + len * 0.5 * 1.732);

    this.cell = [new CellTri(vtx1, len * factor, factor),
        new CellTri(vtx2, len * factor, factor),
        new CellTri(vtx3, len * factor, factor)];
}

MasterTri.prototype.draw = function(ctx) {
    this.cell[0].draw(ctx);
    this.cell[1].draw(ctx);
    this.cell[2].draw(ctx);

    if (this.level > 0) {
        this.drawLevel(ctx);
    }
}


function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        var img = new Image();
        img.src = "img/char_103_angel_2_optimized.png";

        var elite = new Image();
        elite.src = "img/e2.png";

        img.onload = function() {
            elite.onload = doIt(ctx, img, elite);
        }
    }
}

async function doIt(ctx, a, b) {
    await img1Draw(ctx, a);
    await img2Draw(ctx, b);
}

async function img1Draw(ctx, img) {
    ctx.drawImage(img, 5, 0);
    ctx.fillStyle = "rgb(51, 51, 51)";
    ctx.fillRect (0, 190, 120, 70);

    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.lineTo(0, 190);
    ctx.lineTo(120, 190);
    ctx.closePath();
    ctx.fillStyle = "#333333";
    ctx.fill();

    ctx.font="20px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText("能天使", 50, 210);

    ctx.font="7px Verdana";
    ctx.fillText("LV", 23, 163);


    ctx.font="30px Verdana";
    ctx.fillText("90", 8, 188);

    ctx.beginPath();
    ctx.moveTo(41, 225);
    ctx.lineTo(41, 245);
    ctx.closePath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(81, 225);
    ctx.lineTo(81, 245);
    ctx.closePath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    drawMaster(ctx, 5, 220, 32, 1)
    drawMaster(ctx, 45, 220, 32, 2)
    await drawMaster(ctx, 84, 220, 32, 3)
}

async function drawMaster(ctx, posx, posy, len, level) {
    var tri = new MasterTri(posx, posy, len, 0.618);
    tri.setLevel(level);
    tri.draw(ctx);
}

async function img2Draw(ctx, img) {
    ctx.drawImage(img, 60, 145, 50, 42);
}

async function drawTri(ctx, posx, posy, len) {
    drawLines(ctx, [
        new Vec2(posx + len / 2, posy),
        new Vec2(posx, posy + 0.5 * 1.732 * len),
        new Vec2(posx + len, posy + 0.5 * 1.732 * len)
    ]);

    var factor = 0.618;

    drawLines(ctx, [
        new Vec2(posx + 0.5 * (1 - factor) * len, posy + 0.5 * 1.732 * factor * len),
        new Vec2(posx + 0.5 * (1 + factor) * len, posy + 0.5 * 1.732 * factor * len)
    ]);

    drawLines(ctx, [
        new Vec2(posx + 0.5 * factor * len, posy + 0.5 * 1.732 * (1 - factor) * len),
        new Vec2(posx + factor * len, posy + 0.5 * 1.732 * len)
    ]);
}
