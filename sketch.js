

const CARHEIGHT = 10;
const CARWIDTH = 20;
const SPACING = 50;
const MASS = 10;
const VMAX = 2;
const VMAXXX = VMAX * 10;
const DENSITY = 1;
const DISTMIN = 30;
const NUMCARS = 5;

let boids = [];
let cars = [];


function setup() 
{
	createCanvas(700, 400);
	
	for (let i = NUMCARS-1; i >= 0; i--) 
	{
		cars[i] = new Car(i, i*(CARWIDTH + SPACING), CARWIDTH);
	}


}

function draw() 
{
	background(255);
	stroke(0);
	line(0, 200, 720, 200);
	
	for (let i = 0; i < cars.length; i++) 
	{
		cars[i].run(cars);
	}	
}

function mousePressed()
{
	for (let i = 0; i < cars.length; i++) 
	{
		cars[i].clicked();
	}	
}