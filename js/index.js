var options = ["2 large crust pizzas delivered on site", 
               "A tin of tuna", 
               "A dozen donuts delivered on site", 
                "$50 Coles/Myer voucher", 
                "Lunch with Ricky @ Jamie's Italian", 
                "Bottle of wine or six pack of beer", 
                "$30 Haighs voucher",
                "$30 iTunes voucher"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

// document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  switch(item) {
    case 0:
        return RGB2Color(46, 125, 225);
        break;
    case 1:
        return RGB2Color(162, 184, 66);
        break;
    case 2:
        return RGB2Color( 226, 204, 0 );
        break;
    case 3:
        return RGB2Color( 255, 131, 0  );
        break;
    case 4:
        return RGB2Color( 176, 149, 218);
        break;
    case 5:
        return RGB2Color(  63, 189, 169 );
        break;
    case 6:
        return RGB2Color(46, 125, 225);
        break;
    case 7:
        return RGB2Color( 226, 204, 0 );
        break;

    default:
        return RGB2Color(46, 125, 225);
  }
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 350;
    var textRadius = 260;
    var insideRadius = 100;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,1000,1000);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 12px Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(350, 350, outsideRadius, angle, angle + arc, false);
      ctx.arc(350, 350, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(350 + Math.cos(angle + arc / 2) * textRadius, 
                    350 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(350 - 4, 350 - (outsideRadius + 5));
    ctx.lineTo(350 + 4, 350 - (outsideRadius + 5));
    ctx.lineTo(350 + 4, 350 - (outsideRadius - 5));
    ctx.lineTo(350 + 9, 350 - (outsideRadius - 5));
    ctx.lineTo(350 + 0, 350 - (outsideRadius - 13));
    ctx.lineTo(350 - 9, 350 - (outsideRadius - 5));
    ctx.lineTo(350 - 4, 350 - (outsideRadius - 5));
    ctx.lineTo(350 - 4, 350 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  ctx.fillText(text, 350 - ctx.measureText(text).width / 2, 350 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}
var controller = Leap.loop({enableGestures: true}, function(frame){
  if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
        switch (gesture.type){
          case "circle":
              console.log("Circle Gesture");
              break;
          case "keyTap":
              console.log("Key Tap Gesture");
              break;
          case "screenTap":
              console.log("Screen Tap Gesture");
              break;
          case "swipe":
              console.log("Swipe Gesture");
              // var audioElement = document.createElement('audio');
              // audioElement.setAttribute('src', 'bomb.mp3');
              // audioElement.load();
              // audioElement.play();
              spin();
              break;
        }
    });
  }
});


controller.use('riggedHand').connect();
window.controller = controller;
drawRouletteWheel();