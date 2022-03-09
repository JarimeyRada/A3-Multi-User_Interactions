'use strict'

let cellHorizontal = 9
let cellVertical = 7
let cellsArray = new Array(cellHorizontal)
let cellWidth = 10
//define cells
for (var i = 0; i < cellHorizontal; i++) {
	cellsArray[i] = new Array(cellVertical);
	for (var j = 0; j < cellVertical; j++) {
		cellsArray[i][j] = { min:{x:i*cellWidth-cellWidth/2-10, z:j*cellWidth-cellWidth/2-10}, max:{x:i*cellWidth+cellWidth/2-10.01, z:j*cellWidth+cellWidth/2-10.01} ,solid: false};
	}
}

//set walls
for (var i = 0; i < cellHorizontal; i++) {
	cellsArray[i][0].solid = true;
	cellsArray[i][cellVertical-1].solid = true;
}
for (var i = 0; i < cellVertical; i++) {
	cellsArray[0][i].solid = true;
	cellsArray[cellHorizontal-1][i].solid = true;
}
cellsArray[2][2].solid = true;
cellsArray[2][4].solid = true;
cellsArray[4][2].solid = true;
cellsArray[4][4].solid = true;
cellsArray[6][2].solid = true;
cellsArray[6][4].solid = true;

let timer = 0;
let playerPoints = 0;
let opponentPoints = 0;

function findCell(pointX,pointZ){
	var x = Math.floor(pointX/cellWidth+1.5);
	var z = Math.floor(pointZ/cellWidth+1.5);
	//console.log(x + '' + z);
	return x + '' + z;
}

function placeWall(cellX, cellZ, playerColor){
	var wall = document.querySelector('[cell="'+ cellX + '' + cellZ +'"]');

	console.log(wall.getAttribute('cell'));
	console.log(cellsArray[cellX][cellZ].solid);
	
	if (cellsArray[cellX][cellZ].solid == false){
		console.log(playerColor + '' + document.querySelector('#user').getAttribute('playerColor'));
		if (playerColor == document.querySelector('#user').getAttribute('playerColor')){
			playerPoints++;
		}else{
			opponentPoints++;
		}
		cellsArray[cellX][cellZ].solid = true;
		wall.setAttribute('material', playerColor);
		wall.setAttribute('cell', cellX+''+cellZ);
		wall.object3D.position.y = 1.8;
		wall.object3D.scale.y = 3.7;
		console.log('wall is created on ' + cellsArray[cellX][cellZ].solid + ' ' + playerColor  + ' ' + playerPoints + ' ' + opponentPoints);
	}else{
		console.log('color: '+ wall.getAttribute('material').color + '' + document.querySelector('#user').getAttribute('playerColor'));
		if ('color: ' + wall.getAttribute('material').color == document.querySelector('#user').getAttribute('playerColor')){
			playerPoints--;
		}else{
			opponentPoints--;
		}
		console.log('wall is removed' +  wall.getAttribute('cell') + ' ' + playerPoints + ' ' + opponentPoints);
		cellsArray[cellX][cellZ].solid = false;
		wall.setAttribute('material','color: rgb(150,150,150)');
		wall.object3D.position.y = 0.5;
		wall.object3D.scale.y = 1;
	}

}

AFRAME.registerComponent('coop',{
	schema: {
	},
	tick : function (){
		timer++;
		if(timer > 1000){
			if(playerPoints >= 27){
				console.log('win');
			}else{
				console.log('lose');
			}
		}
	}
});

AFRAME.registerComponent('vs',{
	schema: {
	},
	tick : function (){
		timer++;
		if(timer > 1000){
			if(playerPoints >= opponentPoints){
				console.log('win');
			}else{
				console.log('lose');
			}
		}
	}
});

AFRAME.registerComponent('createfloor',{
	schema: {
	},
	init : function(){
		//setup called at start
		const CONTEXT_AF = this;
		CONTEXT_AF.user = document.querySelector('#user');
		CONTEXT_AF.scene = document.querySelector('#scene');
		CONTEXT_AF.floor = document.querySelector('#floor');

		//define cells
		for (var i = 0; i < cellHorizontal; i++) {
			for (var j = 0; j < cellVertical; j++) {

				//create copy element
				var newCan = document.createElement('a-entity');

				//redefine attribute
				newCan.setAttribute('position', { x:i*cellWidth-10, y:0.5+2*cellsArray[i][j].solid, z:j*cellWidth-10});
				newCan.setAttribute('id', 'wall');
				newCan.setAttribute('cell', i+''+j);
				newCan.setAttribute('material', 'color: rgb(150,150,150)');
				if (cellsArray[i][j].solid == false){
					newCan.setAttribute('class', 'interactive');
				}
				newCan.setAttribute('place', "");
				newCan.setAttribute('geometry', {primitive:'box', width:cellWidth, height:0.6+3*cellsArray[i][j].solid, depth:cellWidth}, true);

				//append
				CONTEXT_AF.floor.appendChild(newCan);
			}
		}

		console.log(cellsArray)
	}
});

AFRAME.registerComponent('checkcollision',{
	schema: {
	},
	tick : function (){
		const CONTEXT_AF = this;
		CONTEXT_AF.user = document.querySelector('#user');
		CONTEXT_AF.scene = document.querySelector('#scene');
		CONTEXT_AF.floor = document.querySelector('#floor');
		var newCell = findCell(CONTEXT_AF.user.getAttribute('position').x, CONTEXT_AF.user.getAttribute('position').z);
		var currentCell = CONTEXT_AF.user.getAttribute('cell');

		if (newCell !== currentCell){

		 console.log(cellsArray[newCell[0]][newCell[1]].solid);

			if(cellsArray[newCell[0]][newCell[1]].solid === false){

				CONTEXT_AF.user.setAttribute('cell', newCell);
				console.log(newCell);
			}else{
				if(CONTEXT_AF.user.getAttribute('position').x > cellsArray[currentCell[0]][currentCell[1]].max.x){
					CONTEXT_AF.user.object3D.position.x = cellsArray[currentCell[0]][currentCell[1]].max.x;
				}
				if(CONTEXT_AF.user.getAttribute('position').x < cellsArray[currentCell[0]][currentCell[1]].min.x){
					CONTEXT_AF.user.object3D.position.x = cellsArray[currentCell[0]][currentCell[1]].min.x;
				}
				if(CONTEXT_AF.user.getAttribute('position').z > cellsArray[currentCell[0]][currentCell[1]].max.z){
					CONTEXT_AF.user.object3D.position.z = cellsArray[currentCell[0]][currentCell[1]].max.z;
				}
				if(CONTEXT_AF.user.getAttribute('position').z < cellsArray[currentCell[0]][currentCell[1]].min.z){
					CONTEXT_AF.user.object3D.position.z = cellsArray[currentCell[0]][currentCell[1]].min.z;
				}
			}
		}
		//console.log(currentCell);
		//console.log(CONTEXT_AF.user.getAttribute('cell'));
	}

});

AFRAME.registerComponent('place',{
	schema: {
	},
	init : function (){
		const CONTEXT_AF = this;
		CONTEXT_AF.user = document.querySelector('#user');
		CONTEXT_AF.scene = document.querySelector('#scene');
		CONTEXT_AF.floor = document.querySelector('#floor');

		CONTEXT_AF.el.addEventListener('click', function() {
			var userCell = CONTEXT_AF.user.getAttribute('cell');
			if(userCell == this.getAttribute('cell')){
				console.log(userCell);
				CONTEXT_AF.floor.setAttribute('wallMake', '00');
			}else if(userCell != this.getAttribute('cell')){
				console.log(userCell);
				console.log(this.getAttribute('cell'));
				//create wall
				//placeWall(this.getAttribute('cell')[0],this.getAttribute('cell')[1],CONTEXT_AF.user.getAttribute('playerColor'));
				CONTEXT_AF.floor.setAttribute('wallMake', this.getAttribute('cell'));
			}
		});
	}

});