

function Puzzle (){
	
	this.title = "START GAME";
	this.canvas;
	this.stage;
	this.pieces = [];
	this.colour = "#008744";
	this.image;
	this.bitmap;
	this.container;
	this.sideMargin = 40;
	this.idealWidth;
	this.idealHeight;

	this.init();


}



Puzzle.prototype.init = function () {

	console.log('#init');
	this.canvas = document.getElementById('canvas');
	this.canvas.width = document.body.clientWidth ;
	this.canvas.height = document.body.clientHeight  ;
	this.stage = new createjs.Stage(this.canvas);
	self = this ; 
	this.stage.enableMouseOver();
	createjs.Touch.enable(this.stage);

	this.ticker();
	
	image = new Image();
	image.src = "333388.jpg";
	image.onload  = this.handleImage;

}


Puzzle.prototype.scale = function (bitmap, idealWidth, idealHeight) {
	bitmap.scaleX = idealWidth/bitmap.image.width;
	bitmap.scaleY = idealHeight/bitmap.image.height;
	console.log("SCALE X = " +bitmap.scaleX  );
}

Puzzle.prototype.handleImage = function(event){


	self.container = new createjs.Container();
	//damos medidas al container : alto y ancho al 50% relativo a las medidas del canvas
	self.container.setBounds(self.stage.canvas.width/2,self.stage.canvas.height/2,self.stage.canvas.width * 0.50 , self.stage.canvas.height * 0.50);

	//obtenemos las medidas y posición del container 
	var Containerbounds = self.container.getBounds();

	///centramos el eje de x y de y al centro del container 
	self.container.regX = Containerbounds.width/2;
	self.container.regY = Containerbounds.height/2;

	//creamos un borde para enmarcar al container.
	var borderContainer = new createjs.Shape();
		borderContainer.graphics.setStrokeStyle(4);
		borderContainer.graphics.beginStroke("red");
		borderContainer.graphics.drawRect(Containerbounds.x , Containerbounds.y ,Containerbounds.width,Containerbounds.height);


	//dibujamos cuadricula
	//
	//
	var col  = Containerbounds.x;
	var row  = 	Containerbounds.y ;

	for (var i = 0; i < 16; i++) {
		console.log('create shapes')
		//creamos un borde para enmarcar al container.
	var boxes = new createjs.Shape();
		self.container.addChild(boxes);
		boxes.graphics.setStrokeStyle(4);
		boxes.graphics.beginStroke("red");
		boxes.graphics.beginFill("blue");
		//divido el container en 4 * 4 piezas , 
		boxes.graphics.drawRect( col , row  ,Containerbounds.width/4,Containerbounds.height/4);
		//obtenemos las medidas y posición del container 
		/*var boxesbounds = boxes.getBounds();*/
		boxes.regX = Containerbounds.width/4 - (Containerbounds.width/4)/2 ;
		boxes.regY = Containerbounds.height/4 - (Containerbounds.height/4)/2 ;
		col+= Containerbounds.width/4;
		console.log("##col " + col + " row " + row + " container W "  + Containerbounds.width + "  container H " + Containerbounds.height + " container X " + Containerbounds.x + " container W/4 = " + Containerbounds.width/4);
		console.log(Containerbounds.width + Containerbounds.x)
		if ( col >= (Containerbounds.width + Containerbounds.x) ) {

			console.log('mayor');
			col = Containerbounds.x;
			row += Containerbounds.height/4;

		}
		

	boxes.on("pressmove",function(evt) {
				// currentTarget will be the container that the event listener was added to:
				evt.currentTarget.x = evt.stageX;
				evt.currentTarget.y = evt.stageY ;
				// make sure to redraw the stage to show the change:
				   
			});
	};

		
	self.container.addChild(borderContainer);



	self.stage.addChild(self.container);

   

}




Puzzle.prototype.ticker = function () {

		console.log('#Trigger Ticker') 
        //createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);

}