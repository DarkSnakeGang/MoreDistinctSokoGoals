
window.rgb_to_hsv = function(col) {
  let R = col.r / 255, G = col.g / 255, B = col.b / 255;
  let xmax = Math.max(R, G, B);
  let xmin = Math.min(R, G, B);
  let C = xmax - xmin;
  let h, s, v;
  v = xmax;
  h = (
    C === 0
      ? 0 
    : v === R
      ? 60 * (G - B) / C 
    : v === G
      ? 60 * (2 + (B - R) / C)
    : v === B
      ? 60 * (4 + (R - G) / C) 
    : 0
  );
  s = v == 0 ? 0 : C / v;
  return { h: h < 0 ? h + 360 : h, s: s, v: v, };
};

window.hsv_to_rgb = function(col) {
  let C = col.v * col.s;
  let H = col.h / 60;
  let X = C * (1 - Math.abs((H % 2) - 1));
  
  let [ R, G, B, ] = (
    0 <= H && H <= 1 
      ? [ C, X, 0, ]
    : H <= 2 
      ? [ X, C, 0, ] 
    : H <= 3 
      ? [ 0, C, X, ] 
    : H <= 4 
      ? [ 0, X, C, ] 
    : H <= 5
      ? [ X, 0, C, ]
    : H <= 6
      ? [ C, 0, X, ] 
    : [ 0, 0, 0, ]
  );

  let m = col.v - C;
  let r = R + m, 
      g = G + m, 
      b = B + m;

  return { r: r * 255, g: g * 255, b: b * 255, };
};

window.hex_to_rgb = function(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
};

window.rgb_to_hex = function(col) {
  return `#${col.r.toString(16).padStart(2, '0')}${col.g.toString(16).padStart(2, '0')}${col.b.toString(16).padStart(2, '0')}`
};

window.close = function(c0, c1, rr = 1, rg = rr, rb = rr) {
  return Math.abs(c0.r - c1.r) < rr &&
        Math.abs(c0.g - c1.g) < rg &&
        Math.abs(c0.b - c1.b) < rb;
};

window.snake._e = function() {

  window.boximage = new Image();
  window.boximage.src = 'https://i.postimg.cc/C1w3nYcZ/box.png';
  

  
  
  const scripts = document.getElementsByTagName('script');
  for (let script of scripts) {
    if(script.src === '' || script.src.includes('apis.google.com'))continue;
    const req = new XMLHttpRequest();
    req.open('GET', script.src);
    req.onload = function () {
      const code = this.responseText;
      if(code.indexOf('trophy') === -1)
        return;

      const bees = code.match(
        /[a-zA-Z0-9_$]{1,8}=function\(a\){if\(0!==a\.settings[^]*?oa\)}/
      )[0];
      const bDaoa = bees.match(
        /b\.[a-zA-Z0-9_$]{1,8}\.[a-zA-Z0-9_$]{1,8},[a-zA-Z0-9_$]{1,8}\[0\]\[0\],c,5/
      )[0].match(/b\.[a-zA-Z0-9_$]{1,8}\.[a-zA-Z0-9_$]{1,8}/)[0];
      const snatch = function(s) {
        return bees.match(
          /[a-zA-Z0-9_$]{1,8}\(a\.settings,a\.settings\.[a-zA-Z0-9_$]{1,8},4\)/
        )[0].replace('4', s);
      };
      

      eval(
        bees.replace(
          '{',
          `{
            let f = ${snatch(0)};
            f = f.replace('#', '');
            var { h, s, v, } = window.rgb_to_hsv({
              r: parseInt(f.substring(0, 2), 16),
              g: parseInt(f.substring(2, 4), 16),
              b: parseInt(f.substring(4, 6), 16),
            });
            s += 0.03;
            v += 0.07;
            s = s > 1 ? 1 : s;
            v = v > 1 ? 1 : v;

            var { r, g, b } = window.hsv_to_rgb({ h: h, s: s, v: v });
            const light_goal = window.rgb_to_hex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });

            f = ${snatch(1)};
            f = f.replace('#', '');
            var { h, s, v, } = window.rgb_to_hsv({
              r: parseInt(f.substring(0, 2), 16), 
              g: parseInt(f.substring(2, 4), 16),
              b: parseInt(f.substring(4, 6), 16),
            });
            s += 0.03;
            v -= 0.08;
            s = s > 1 ? 1 : s;
            v = v > 1 ? 1 : v < 0 ? 0 : v;

            var { r, g, b } = window.hsv_to_rgb({ h: h, s: s, v: v });
            const dark_goal = window.rgb_to_hex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });

            f = dark_goal;
            f = f.replace('#', '');
            var { h, s, v, } = rgb_to_hsv({
              r: parseInt(f.substring(0, 2), 16), 
              g: parseInt(f.substring(2, 4), 16),
              b: parseInt(f.substring(4, 6), 16),
            });
            v -= .11;
            v = v < 0 ? 0 : v;
            var { r, g, b } = hsv_to_rgb({ h: h, s: s, v: v });
            const darker_goal = rgb_to_hex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
          `
        ).replace(
          '}else',
          `
            var boxCanvas = document.createElement('canvas');
            boxCanvas.width = 1024;boxCanvas.height = 128;
            var bctx = boxCanvas.getContext('2d');

            bctx.drawImage(window.boximage, 0, 0);
      
            bctx.fillStyle = light_goal;
            bctx.fillRect(256, 0, 128, 128);

            bctx.fillStyle = darker_goal;
            bctx.fillRect(277, 21, 85, 85);

            bctx.fillStyle = light_goal;
            bctx.fillRect(298, 42, 42, 42);

            bctx.fillStyle = darker_goal;
            bctx.fillRect(384, 0, 128, 128);

            bctx.fillStyle = light_goal;
            bctx.fillRect(405, 21, 85, 85);

            bctx.fillStyle = darker_goal;
            bctx.fillRect(426, 42, 42, 42);

            bctx.fillStyle = light_goal;
            bctx.fillRect(512, 0, 128, 128);

            bctx.fillStyle = dark_goal;
            bctx.fillRect(533, 21, 85, 85);

            bctx.fillStyle = light_goal;
            bctx.fillRect(554, 42, 42, 42);

            bctx.fillStyle = dark_goal;
            bctx.fillRect(640, 0, 128, 128);

            bctx.fillStyle = light_goal;
            bctx.fillRect(661, 21, 85, 85);

            bctx.fillStyle = dark_goal;
            bctx.fillRect(682, 42, 42, 42);

            ${bDaoa}.ka.drawImage(boxCanvas, 0, 0);
            document.body.appendChild(boxCanvas);

          }else`
        )
      );

      

      
    };
    req.send();
  }
};

