/**
 * Basic Canvas Paint
 * Copyright (c) 2018 Alex Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.7.3
 */

function changeColorURI(data, oldColor, newColor)
{
    var img, cnv, cnt, imgData;

    img = document.createElement('img');
    img.src = data;

    cnv = document.createElement('canvas');
    cnv.width = img.width;
    cnv.height = img.height;

    ctx = cnv.getContext('2d');
    ctx.drawImage(img, 0, 0);

    imgData = ctx.getImageData(0, 0, cnv.width, cnv.height)
    data = imgData.data;

    for(var x = 0, len = data.length; x < len; x += 4)
    {
        if((data[x] == oldColor[0]) && (data[x + 1] == oldColor[1]) && (data[x + 2] == oldColor[2]))
        {
            data[x] = newColor[0];
            data[x + 1] = newColor[1];
            data[x + 2] = newColor[2];
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return cnv.toDataURL();
}

$(document).ready(function(){
	$('body').on('click', '.bcPaint-palette-color', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint.setColor($(this).css('background-color'));
	});

	$('body').on('click', '#bcPaint-reset', function(){
		$.fn.bcPaint.clearCanvas();
	});

	$('body').on('click', '#bcPaint-export', function(){
		$.fn.bcPaint.export();
	});
});


// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
	return window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimaitonFrame ||
				function (callback) {
				 	window.setTimeout(callback, 1000/60);
				};
})();

window.mousePos = { x:0, y:0 };
window.lastPos = window.mousePos;



(function( $ ) {
	/**
	* Private variables
	**/
	var isDragged		= false,
		startPoint		= { x:0, y:0 },
		templates 		= {
							container 		: $('<div id="bcPaint-container"></div>'),
							header 			: $('<div id="bcPaint-header"></div>'),
							palette 		: $('<div id="bcPaint-palette"></div>'),
							color 			: $('<div class="bcPaint-palette-color"></div>'),
							canvasContainer : $('<div id="bcPaint-canvas-container"></div>'),
							canvasPane 		: $('<canvas id="bcPaintCanvas"></canvas>'),
							bottom 			: $('<div id="bcPaint-bottom"></div>'),
							buttonReset 	: $('<button id="bcPaint-reset">Je recommence</button>'),
							buttonSave		: $('<button id="bcPaint-export">Export</button>')
						},
		paintCanvas,
		paintContext;

	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint = function (options) {

		return this.each(function () {
			var rootElement 	= $(this),
				colorSet		= $.extend({}, $.fn.bcPaint.defaults, options),
				defaultColor	= (rootElement.val().length > 0) ? rootElement.val() : colorSet.defaultColor,
				container 		= templates.container.clone(),
				header 			= templates.header.clone(),
				palette 		= templates.palette.clone(),
				canvasContainer = templates.canvasContainer.clone(),
				canvasPane 		= templates.canvasPane.clone(),
				bottom 			= templates.bottom.clone(),
				buttonReset 	= templates.buttonReset.clone(),
				buttonSave 		= templates.buttonSave.clone(),
				color;

			// assembly pane
			rootElement.append(container);
			container.append(header);
			container.append(canvasContainer);
			container.append(bottom);
			header.append(palette);
			canvasContainer.append(canvasPane);
			bottom.append(buttonReset);
			bottom.append(buttonSave);

			// assembly color palette
			$.each(colorSet.colors, function (i) {
        		color = templates.color.clone();
				color.css('background-color', $.fn.bcPaint.toHex(colorSet.colors[i]));
				palette.append(color);
    		});

			// set canvas pane width and height
			var bcCanvas = rootElement.find('canvas');
			var bcCanvasContainer = rootElement.find('#bcPaint-canvas-container');
			bcCanvas.attr('width', bcCanvasContainer.width());
			bcCanvas.attr('height', bcCanvasContainer.height());

			// get canvas pane context
			paintCanvas = document.getElementById('bcPaintCanvas');
			paintContext = paintCanvas.getContext('2d');

			// set color
			$.fn.bcPaint.setColor(defaultColor);

			// bind mouse actions
			paintCanvas.onmousedown = $.fn.bcPaint.onMouseDown;
			paintCanvas.onmouseup = $.fn.bcPaint.onMouseUp;
			paintCanvas.onmousemove = $.fn.bcPaint.onMouseMove;

			// bind touch actions
			paintCanvas.addEventListener('touchstart', function(e){
				window.mousePos = $.fn.bcPaint.getTouchPos(paintCanvas, e);
				$.fn.bcPaint.dispatchMouseEvent(e, 'mousedown');
			});
			paintCanvas.addEventListener('touchend', function(e){
  				$.fn.bcPaint.dispatchMouseEvent(e, 'mouseup');
			});
			paintCanvas.addEventListener('touchmove', function(e){
				$.fn.bcPaint.dispatchMouseEvent(e, 'mousemove');
			});

			// Prevent scrolling on touch event
			document.body.addEventListener("touchstart", function (e) {
			  if (e.target == 'paintCanvas') {
			    e.preventDefault();
			  }
			}, false);
			document.body.addEventListener("touchend", function (e) {
			  if (e.target == 'paintCanvas') {
			    e.preventDefault();
			  }
			}, false);
			document.body.addEventListener("touchmove", function (e) {
			  if (e.target == 'paintCanvas') {
			    e.preventDefault();
			  }
			}, false);
			
			$.fn.bcPaint.drawLoop();
		});
	}

	/**
	* Extend plugin
	**/
	$.extend(true, $.fn.bcPaint, {

		/**
		* Dispatch mouse event
		*/
		dispatchMouseEvent : function(e, mouseAction){
			var touch = e.touches[0];
			if(touch == undefined){
				touch = { clientX : 0, clientY : 0 };
			}
			var mouseEvent = new MouseEvent(mouseAction, {
				clientX: touch.clientX,
				clientY: touch.clientY
			});
			paintCanvas.dispatchEvent(mouseEvent);
		},

		/**
		* Remove pane
		*/
		clearCanvas : function(){
			paintCanvas.width = paintCanvas.width;
		},

		/**
		* On mouse down
		**/
		onMouseDown : function(e){
			window.lastPos = $.fn.bcPaint.getMousePos(paintCanvas, e);
			isDragged = true;
			
			/*// get mouse x and y coordinates
			startPoint.x = e.offsetX;
			startPoint.y = e.offsetY;
			// begin context path
			window.line = paintContext.beginPath();
            paintContext.lineWidth = 6;
            paintContext.lineCap = "round";
            paintContext.moveTo(startPoint.x, startPoint.y);*/
		},

		/**
		* On mouse up
		**/
		onMouseUp : function() {
		    isDragged = false;
		},

		/**
		* On mouse move
		**/
		onMouseMove : function(e){
			window.mousePos = $.fn.bcPaint.getMousePos(paintCanvas, e);
			/*if(isDragged){
				paintContext.lineTo(e.offsetX, e.offsetY);
                paintContext.lineWidth = 6;
				paintContext.stroke();
			}*/
		},

		
		renderCanvas: function() {
			if(isDragged){
				
				// begin context path
				window.line = paintContext.beginPath();
	            paintContext.lineWidth = 6;
	            paintContext.lineCap = "round";
				
				paintContext.moveTo(window.lastPos.x, window.lastPos.y);
				paintContext.lineTo(window.mousePos.x, window.mousePos.y);
				paintContext.stroke();
				window.lastPos = window.mousePos;
			}
		},
		

		getMousePos: function(canvasDom, mouseEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: mouseEvent.clientX - rect.left,
				y: mouseEvent.clientY - rect.top
			};
		},
		
		getTouchPos: function(canvasDom, touchEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: touchEvent.touches[0].clientX - rect.left,
				y: touchEvent.touches[0].clientY - rect.top
			};
		},
		
		
		drawLoop: function() {
			requestAnimFrame($.fn.bcPaint.drawLoop);
			$.fn.bcPaint.renderCanvas();
		},
		
		
		/**
		* Set selected color
		**/
		setColor : function(color){

            // changeColorURI(paintCanvas.toDataURL('image/png'), paintContext.strokeStyle, $.fn.bcPaint.toHex(color));

			paintContext.strokeStyle = $.fn.bcPaint.toHex(color);

		},

		/**
		*
		*/
		export : function(){
			var imgData = paintCanvas.toDataURL('image/png');
			var windowOpen = window.open('about:blank', 'Image');
			windowOpen.document.write('<img src="' + imgData + '" alt="Exported Image"/>');
		},

		/**
		* Convert color to HEX value
		**/
		toHex : function(color) {
		    // check if color is standard hex value
		    if (color.match(/[0-9A-F]{6}|[0-9A-F]{3}$/i)) {
		        return (color.charAt(0) === "#") ? color : ("#" + color);
		    // check if color is RGB value -> convert to hex
		    } else if (color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/)) {
		        var c = ([parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)]),
		            pad = function (str) {
		                if (str.length < 2) {
		                    for (var i = 0, len = 2 - str.length; i < len; i++) {
		                        str = '0' + str;
		                    }
		                }
		                return str;
		            };
		        if (c.length === 3) {
		            var r = pad(c[0].toString(16)),
		                g = pad(c[1].toString(16)),
		                b = pad(c[2].toString(16));
		            return '#' + r + g + b;
		        }
		    // else do nothing
		    } else {
		        return false;
		    }
		}

	});

	/**
	* Default color set
	**/
	$.fn.bcPaint.defaults = {
        // default color
        defaultColor : '000000',

        // default color set
        colors : [
					'000000', '444444', '999999', 'DDDDDD', '6B0100', 'AD0200',
					'6B5E00', 'FFE000', '007A22', '00E53F', '000884', '000FFF'
        ],

        // extend default set
        addColors : [],
    };

})(jQuery);
