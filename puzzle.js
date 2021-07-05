

		var canvas;
		var stage;
		var bitmap;
		var container;
		var piece;
		var col;
		var row;
		var shapes;
		var clone_shapes = [];
		var pieceSize;
		var pieceMargin;
		var puzzle_column = 4;
		var puzzle_rows = 4 ; 
		var idealRowCol;
		var initY,initX;
		var fpsLabel;
		var timeLabel;
		var timeInterval;
		var seconds;
		var minutes;
		var debug_mode = true;
		var showOverlay = true;


							    
		var palettecolors = ["#FF0000"/*Red solid*/
							,"#FF7F00"/*Flush Orange*/
							,"#FFFF00"/*Yellow solid*/
							,"#DFFF00"/*Chartreuse Yellow*/
							,"#00FF00"/*Green solid*/
							,"#00FF7F"/*Spring Green solid*/
							,"#00FFFF"/*Cyan / Aqua solid*/
							,"#007FFF"/*Azure Radiance solid*/
							,"#0000FF"/*Bluesolid*/
							,"#8F00FF"/*Electric Violet*/
							,"#FF00FF"/*Magenta / Fuchsia solid*/
							,"#146eb4"/*Denim*/
							,"#88aca1"/*Cascade*/
							,"#788cb6"/*Wild Blue Yonder*/
							,"#cf0072"/*Lipstick*/
							,"#ed6856"/*Burnt Sienna*/
							];


		const  INIT_GAME_MESSAGE = "Please match the paired colors by dragging the puzzle pieces";
		const  INIT_GAME_SUB_MESSAGE = "Click anywhere to begin";
		const  END_GAME_MESSAGE  = "Well done!";
		const TITLE_FONTSIZE = "2em";
		const LINE_HEIGHT = 36;
		const SECONDARY_FONTSIZE = "1.5em";


		palettecolors = shuffleArray(palettecolors);
		console.log(palettecolors);
		//palettecolors.sort(function() { return 0.5 - Math.random()}); // shuffle arrays colors
 		var selected_colors = palettecolors.slice(0,(puzzle_rows * puzzle_column )/2); 
 		//Para tener un par de piezas del mismo color : el numero total de piezas debe ser un numero par. 
 		//Debemos obtener un array con la longuitud de piezas, para obtener el par de color se divide por dos el array, asi nos aseguramos que tenemos un array siempre con par de colores
 		var shuffle_colors  = selected_colors.concat(selected_colors);//añadimos los valores en un solo array. El resultado seria una array de colores pares.
 		shuffle_colors = shuffleArray(shuffle_colors);
 		//shuffle_colors.sort(function() { return 0.5 - Math.random()});//devuelve un orden aleatorio del array, con esto evitamos que los colores pares salgan secuenciales.
 		
 	




function init () {

	canvas = document.getElementById('canvas');

	//Set canvas meassures 
	canvas.width = document.body.clientWidth || 550;
	canvas.height = document.body.clientHeight || 500;
	console.log('%c##### canvas width : ' + canvas.width , "color:red;");


	stage = new createjs.Stage(canvas);
	stage.name = "stage";
	createjs.Ticker.setInterval(25);
	createjs.Ticker.setFPS(60);

	
	//Enable mouse over and touch event at the stage,  by default is disabled.
	stage.enableMouseOver(60);
	createjs.Touch.enable(stage);
	//createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	
	//init drawing - stagepdate
	draw();

	//Build the pieces
	buildPieces();
	//displayEndGameMsg();
	displayStartMsg();
	
	if(debug_mode){setFpsLabel();}//inicio salida fps 

}	



function shuffleArray(array) {
  var currentIndex = array.length , temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;	
}



function buildPieces () {


	//
	col = 0;
	row = 0;

	//La longitud de la pieza es el 90% del ancho del canvas / 16
	//The lenght of the pieces is 90 % of the canvas width divide by 16
	pieceSize = Math.sqrt(Math.pow(stage.canvas.height, 2) + Math.pow(stage.canvas.width, 2))/shuffle_colors.length;

	//Margen entre cada pieza//Margin between pieces 1% del ancho del canvas
	pieceMargin = (canvas.width * 0.010 ) || 5 ; 


	//Estblece el primer punto de x a partir de cual se empezarán a desplazar las piezas..
	// La x empieza despues del primer cuarto del ancho del canvas..
	// Centramos el contenido : la mitad del canvas le restamos al ancho total de piezas en el eje x e y  (columnas + margen) / 2 
	
	initX = Math.floor((stage.canvas.width/2)  - ( (pieceSize+pieceMargin) * puzzle_column)/2 + (pieceSize/2)) + pieceMargin/2;
	initY = Math.floor((stage.canvas.height/2) - ( (pieceSize+pieceMargin) * puzzle_rows)/2 + (pieceSize/2)) + pieceMargin/2;

	//idealRowCol = 

	//test = ( (canvas.width * 0.010 ) || 5  ) + pieceSize;

	///pieceSize= pieceSize + pieceMargin;

	console.log('%c##### Building Pieces ', "color:chocolate;");


			for (var i = 0; i < puzzle_column * puzzle_rows; i++) {
				
				shapes = new createjs.Shape();
				
				console.log("%c## "+i+"-col : " + "%c" + col ,"color:blue;","color:green");

				shapes.graphics.beginFill(shuffle_colors[i]).drawRect(0,0,pieceSize,pieceSize);
				
				//Set shape position 
				  
				shapes.homeX = initX + ( col * ( pieceSize + pieceMargin) ) ; //desde la posicion inicial ideal, vamos moviendo el eje x en cada iteracion, 
				shapes.homeY = initY + ( row * (pieceSize + pieceMargin) ) ;
				
				shapes.x = shapes.homeX;
				shapes.y = shapes.homeY ; 
				shapes.regX = pieceSize/2 ;
				shapes.regY = pieceSize/2 ;
				shapes.colour = shuffle_colors[i];
				shapes.index = i ;
				//shapes.compositeOperation = "destination-over";
				// turn snapToPixel on for all shapes - it's set to false by default on Shape.
				// it won't do anything until stage.snapToPixelEnabled is set to true.
				shapes.snapToPixel = true;
				shapes.cache(0,0,pieceSize,pieceSize);

				console.log("%c#~# shape X : " + shapes.homeX ,"color:olive");

				//Shape pressmove listener
				shapes.addEventListener("pressmove",handlePressMove,false);
				//shapes.on("pressmove",function(event) {

					// Set z-index to the top of stage stack display list object.
					//if(!showOverlay){
					/*stage.setChildIndex(this, stage.getNumChildren() - 1); // lo usamos para poner siempre la posicion z del shape al seleccionarlo y siempre esté por encima del resto.
					 event.currentTarget.x = event.stageX;
					 event.currentTarget.y= event.stageY;*/

					//}
					//createjs.Tween.removeAllTweens();
				//});

				//Shape presup listener
				shapes.addEventListener("pressup",function(event) {
						//if(!showOverlay)
						console.log('pressup');
						console.log(event.target.name+" : "+event.eventPhase+" : "+event.currentTarget.name);
						//Lógica : El método getObjectsUnderPoint nos facilita saber que objetos están debajo de las coordenas por las que vamos pasando al arrastar/soltar.
						//Al arrastar una pieza del puzzle , sucede lo siguiente : 
						// 1 - La primera pieza que moveremos , será el primer objeto que detecte el método getObjectsUnderPoint , dado que las coordenas del raton asi lo detectan .
						// 2 - Durante el dragging de la pieza , si la situamos encima de otra , el método getObjectsUnderPoint devuelve dos objetos, pudiendo asi saber qué objeto está debajo de la pieza que estoy moviendo.
						// Mediante el color de las piezas determino si coinciden o no.
						// El control d la longuitud es para aseguirar que hay dos objetos y luego comprobar si son del mismo color.

						var objectUnder = stage.getObjectUnderPoint(event.stageX, event.stageY);
						var objectsUnder = stage.getObjectsUnderPoint(event.stageX, event.stageY);

						console.log(objectsUnder.length)
						

							if ( objectsUnder.length == 2 ) {

								if( objectsUnder[0].colour === objectsUnder[1].colour ){

									console.log('MATCH COLORS');

									targetGoal( objectsUnder );
									
								}
								else{

									console.log("WRONG COLOR");
									//console.log(objectsUnder[0]);
									
									console.log(objectsUnder[0]);
									objectsUnder[0].mouseEnabled = false; // Evitar hacer pressmove durante el tween de regreso al home position.
									createjs.Tween.get(objectsUnder[0], {loop: false , override :false}).to({alpha: 0.5 ,x : objectsUnder[0].homeX , y : objectsUnder[0].homeY }, 1750, createjs.Ease.bounceOut).to({alpha: 1 }).call(function(){objectsUnder[0].mouseEnabled = true;});
									createjs.Tween.get(objectsUnder[1], {loop: false , override :false})
									.to({alpha: 0.5 , rotation : 5 }, 1750/12, createjs.Ease.sineIn)
									.to({alpha: 0.6 , rotation : -5 }, 1750/12, createjs.Ease.sineIn)
									.to({alpha: 0.7 , rotation : 0 }, 1750/12, createjs.Ease.sineIn)
									.to({alpha: 0.8 , rotation : 5 }, 1750/12, createjs.Ease.sineIn)
									.to({alpha: 0.9 , rotation : -5 }, 1750/12, createjs.Ease.sineIn)
									.to({alpha: 1 , rotation : 0 }, 1750/12, createjs.Ease.sineIn)


								};


							}else{


								console.log('NO COLORS LENGHT ADMITED');
								console.log(objectsUnder[0]);
								objectsUnder[0].mouseEnabled = false;
								createjs.Tween.get(objectsUnder[0], {loop: false ,override :false}).to({alpha: 0.5 ,x : objectsUnder[0].homeX , y : objectsUnder[0].homeY }, 1750, createjs.Ease.bounceOut).to({alpha: 1 }).call(function(){objectsUnder[0].mouseEnabled = true;});;
								
							}

						},false);

				//clone shape reference
				clone_shapes.push(shapes);
				//add shape to stage.
				stage.addChild(shapes);
				
				col ++;

				// num columns per row drawn are equal to column size ? 
				if (col  == puzzle_column ){
				console.log("%c## MAYOR --------------------------------------------------------------- ","color:Crimson" );
				//reset value.
				col = 0;
				//incrementamos la fila.
				row ++;  
				} 

			};
	
}






function handlePressMove(event){

//console.log(ess)
stage.setChildIndex(event.target, stage.getNumChildren() - 1); // lo usamos para poner siempre la posicion z del shape al seleccionarlo y siempre esté por encima del resto.
/*event.currentTarget.x = event.stageX;
event.currentTarget.y= event.stageY;*/
event.target.x = event.stageX;
event.target.y = event.stageY;
}


function setTimeClock () {

	console.log("setTimeClock : ");
	timeLabel = new createjs.Text("TIME", "1.5em PT Sans, Arial", "white");
	stage.addChild(timeLabel);
	timeLabel.textAlign = "center";
	timeLabel.x = stage.canvas.width - (timeLabel.getMeasuredWidth() * 3 ) ;
	timeLabel.y = 20 ; 
	timeLabel.name ="timelabel";
	
	//creamos el reloj secundero y mostramos el resultado 
	seconds=0;
	minutes=0;
	timeInterval = setInterval(function(){
		seconds++;
		if (seconds>=60 ){ 
			seconds = 0; 
			minutes++;
		}
		if (seconds<10){
			timeLabel.text = "TIME \n\n" + minutes +":0" + seconds;
		}else{
			timeLabel.text = "TIME \n\n" + minutes +":" + seconds;
		}

	},1000);

}



function setFpsLabel () {

	// add a text object to output the current FPS:
	
	fpsLabel = new createjs.Text("-- fps", "bold 1em Arial", "#FFF");
	stage.addChild(fpsLabel);
	fpsLabel.x = 10;
	fpsLabel.y = 20;
	fpsLabel.name = "fpslabel";

}



function targetGoal ( objects ) {

	var matrix = new createjs.ColorMatrix().adjustColor(15, 10, 100, 180);  
	//remove all tweens from circles
	//createjs.Tween.removeAllTweens();	
	//
	//for (var i = 0; i < objects.length; i++) {
	
	objects.map(function(e,i){
		objects[i].filters = [ new createjs.ColorMatrixFilter(matrix) ];
		objects[i].cache(0,0,pieceSize,pieceSize);
	});

	createjs.Tween.get(objects[0]).to({alpha: 0.1}, 1000, createjs.Ease.bounceOut).call(  function(){  checkScore(objects[0])   }  );
	createjs.Tween.get(objects[1]).to({alpha: 0.1}, 1000, createjs.Ease.bounceOut).call(  function(){  checkScore(objects[1])   }  );

	var checkScore = function ( pieceObj ) {
		//createjs.Tween.removeAllTweens();	
		//console.log("INDEX "  + pieceObj.index);

		//borramos pieza en el objeto clon por la propiedad cache id, ya que el por indice daba error;
		clone_shapes.splice(clone_shapes.indexOf(pieceObj.cacheID),1);
		stage.removeChild(pieceObj);
		//console.log("CLONE SHAPES" + clone_shapes.length);
		//Se comprueba si se ha completado el puzzle.
		if (clone_shapes.length == 0 ) {
				for (var i = stage.getNumChildren() - 1; i >= 0; i--) {
					if (stage.getChildAt(i) != stage.getChildByName("fpslabel")) {
						stage.removeChildAt(i);
					}
				};

				//reset clock
				clearInterval(timeInterval);
				displayEndGameMsg();
				//rebuild again
				//TODO : Show overlay.
				//buildPieces();
				///
		}

	}

}




function displayStartMsg () {

	
//An a container is created that contains 3 childs objects ( shape, 2 texts )

	var container = new createjs.Container();
	container.name = "displayStartMsgContainer";

	///draw a black square with opacity 
	var fadingRect = new createjs.Shape();
	fadingRect.graphics.beginFill("black").drawRect(0, 0, canvas.width, canvas.height);
	fadingRect.alpha = 0.9;

	//Text 1
	var startTaskText = new createjs.Text(INIT_GAME_MESSAGE, TITLE_FONTSIZE + " Arial", "white");
	startTaskText.lineWidth = document.body.clientWidth*(9/10);
	///set position text1
	startTaskText.lineHeight = LINE_HEIGHT;
	startTaskText.textAlign = "center";
	startTaskText.x = canvas.width/2;
	startTaskText.y = canvas.height/2 - startTaskText.getMeasuredHeight();
	//Text 2
	var nextText = new createjs.Text(INIT_GAME_SUB_MESSAGE, SECONDARY_FONTSIZE + " Arial", "white");
	nextText.lineWidth = document.body.clientWidth*(9/10);
	nextText.lineHeight = LINE_HEIGHT;
	nextText.textAlign = "center";
	nextText.x = canvas.width/2;
	nextText.y = canvas.height/2 + startTaskText.getMeasuredHeight()/2 + LINE_HEIGHT;
	

	
	container.addChild(fadingRect,startTaskText,nextText);
	stage.addChild(container);


	fadingRect.addEventListener('click', function(evt) { 
		console.log(evt.target.name+" : "+evt.eventPhase+" : "+evt.currentTarget.name)
		stage.removeChild(container); 
		setTimeClock();//inicio salida del reloj
	 }, null, false, null, false);

	
}	



function displayEndGameMsg () {

	var container = new createjs.Container();
	//container.mouseChildren = false;
	container.name = "displayEndGameMsgContainer";
	
	var fadingRect = new createjs.Shape();
	fadingRect.name ="faddingrect";
	fadingRect.graphics.beginFill("black").drawRect(0, 0, canvas.width, canvas.height);
	fadingRect.alpha = 0.9;

	var completedText = new createjs.Text(END_GAME_MESSAGE, TITLE_FONTSIZE + " Arial", "white");
	completedText.name ="completedText";
	completedText.lineWidth = document.body.clientWidth*(9/10);
	completedText.textAlign = "center";
	completedText.lineHeight = LINE_HEIGHT;
	completedText.x = canvas.width/2;
	completedText.y = canvas.height/2 -completedText.getMeasuredHeight();
	/*completedText.regX =  completedText.getMeasuredWidth()/2;
	completedText.regY =  completedText.getMeasuredHeight()/2;*/
	
	
	var advanceText = new createjs.Text("RETRY", SECONDARY_FONTSIZE + " Arial", "white");
	advanceText.name ="advanceText";
	advanceText.lineWidth = document.body.clientWidth*(9/10);
	advanceText.textAlign = "center";
	advanceText.lineHeight = advanceText.getMeasuredHeight()*2;
	advanceText.x = canvas.width/2 ;
	advanceText.y = canvas.height/2 - advanceText.getMeasuredHeight()/2 + LINE_HEIGHT  ;
	/*advanceText.regX =  advanceText.getMeasuredWidth()/2;
	advanceText.regY =  advanceText.getMeasuredHeight()/2;*/
	
	console.log("Width" + advanceText.getMeasuredHeight())

	var nextRect = new createjs.Shape();
	nextRect.name ="nextRect";

	nextRect.graphics.beginStroke("white").beginFill("black").drawRect(advanceText.x - advanceText.getMeasuredWidth() * 2     , advanceText.y - advanceText.regY , advanceText.getMeasuredWidth() *4  , advanceText.getMeasuredHeight());
	nextRect.alpha = 0.9;

	//retry button click
	container.addEventListener('click' , function(evt){ 
		console.log('click container')
		//console.log(evt.target.name+" : "+evt.eventPhase+" : "+evt.currentTarget.name);
	},false);

	nextRect.addEventListener('click', function(evt) { 
		evt.stopPropagation();
		//console.log(evt.target.name+" : "+evt.eventPhase+" : "+evt.currentTarget.name);

		console.log("click");

		//stage.setChildIndex(this, stage.getNumChildren() - 1);
		stage.removeChild(container); 
		shuffle_colors.sort(function() { return 0.5 - Math.random()});
		buildPieces();
		setTimeClock();//inicio salida del reloj*/
		
	 },false);
	
	container.addChild(fadingRect,completedText,nextRect,advanceText);
	stage.addChild(container);
	
}




function draw () {

		console.log('#Trigger draw') 
        
        createjs.Ticker.addEventListener("tick",stage);

        createjs.Ticker.addEventListener("tick", function(){

        		 if (debug_mode){

        		 	fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
        		 }
        		
        		
        });
       
}


window.onresize = function(){

	//reset canvas , radius circles meassures 
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;

	console.log('resize');
	//Removing puzzle by child of the stage, except fpslabel.
	
	for (var i = stage.getNumChildren() - 1; i >= 0; i--) {
		if (stage.getChildAt(i) != stage.getChildByName("fpslabel")) {
			stage.removeChildAt(i);
		}
	};

	
	clearInterval(timeInterval);
	buildPieces();
	displayStartMsg();
}

