/* 文字コードの表現変換 */
function hex2rgb ( hex ) {
    let r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    let c = null;
    if (r) {
        c = r.slice(1, 4).map(function (x) { return parseInt(x, 16) });
    }

    r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (r) {
        c = r.slice(1, 4).map(function (x) { return 0x11 * parseInt(x, 16) });
    }

    if (!c) {
        return null;
    }
    return `rgba(${c[0]}, ${c[1]}, ${c[2]})`;
}

function rgb2hex(orig) {
    let rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}

//現在時刻取得（yyyymmddhhmmss）
function getCurrentTime() {
    let now = new Date();
    let res = "" + now.getFullYear() + padZero(now.getMonth() + 1) + padZero(now.getDate()) + padZero(now.getHours()) + 
        padZero(now.getMinutes()) + padZero(now.getSeconds());
    return res;
}

//先頭ゼロ付加
function padZero(num) {
    return (num < 10 ? "0" : "") + num;
}

function getFileName(filepath) {
   let filename = new String(filepath).substring(filepath.lastIndexOf('/') + 1); 
    if(filename.lastIndexOf(".") != -1)       
        filename = filename.substring(0, filename.lastIndexOf("."));
   return filename;
}

function gcdList(list) {
    let f = (a, b) => b ? f(b, a % b) : a
    let ans = list[0]
    for (let i = 1; i < list.length; i++) {
        ans = f(ans, list[i]); 
    }
    return ans 
}

function lcmList(list) {
    let ans = list[0];
    for (let i = 1; i < list.length; i++) {
        ans = lcm(ans, list[i]);
    }
    return ans;
}

function lcm(a, b) {
    return a * b / gcd(a, b);
}

function gcd(a, b) {
    let remaining = 1;
    let v1, v2;
    if (a > b) {
        v1 = a;
        v2 = b;
    } else {
        v2 = a;
        v1 = b;
    }
    while (remaining != 0) {
        remaining = v1 % v2;
        v1 = v2;
        v2 = remaining;
    }
    return v1;
}

function baseName(file)
{
    let filename = file;
    if(filename.lastIndexOf(".") != -1)
        filename = filename.substring(0, filename.lastIndexOf("."));
   return filename;
}

function isNumber(str){
  var match = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return match.test(str);
}