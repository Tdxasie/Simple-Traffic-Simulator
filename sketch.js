

const CARHEIGHT = 10;
const CARWIDTH = 20;
const SPACING = 50;
const MASS = 1;
const VMAX = 3;
const VMAXXX = VMAX * 3;
const DENSITY = 1;
const DISTMIN = 20;
const NUMCARS = 5;
const ROADLENGTH = 1000;

let cars = [];
let lastCar;

function setup() 
{
	createCanvas(ROADLENGTH, 400);

	let car = new Car(undefined, 0, CARWIDTH);
	car.run();
	lastCar = car;

}

function draw() 
{
	background(255);
	stroke(0);
	line(0, 200, ROADLENGTH, 200);
	lastCar.run()

	if (lastCar.pos.x > DISTMIN + CARWIDTH)
	{
		let car = new Car(lastCar, 0, CARWIDTH);
		lastCar = car;
	}
}

function mousePressed()
{
	lastCar.clicked();
}