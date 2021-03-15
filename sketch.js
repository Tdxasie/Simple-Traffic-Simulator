

const CARHEIGHT = 10;
const CARWIDTH = 20;
const SPACING = 50;
let MASS = 1;
let VMAX = 3;
const VMAXXX = VMAX * 3;
const DISTMIN = 20;
const ROADLENGTH = 1000;
const ROADY = 400;

let cars = [];
let lastCar;

let vmaxSlider, massSlider;

function setup() 
{
	createCanvas(ROADLENGTH, ROADY);
	rectMode(CENTER);

	let vmaxText = createElement('div', 'VMAX');
	vmaxText.position(0, 0);

	vmaxSlider = createSlider(0, 10, VMAX, 0.1);
	vmaxSlider.position(50, 0);
	vmaxSlider.style('width', '80px')

	let massText = createElement('div', 'MASS');
	massText.position(0, 20);

	massSlider = createSlider(0, 100, MASS, 1);
	massSlider.position(50, 20);
	massSlider.style('width', '80px')


	let car = new Car(undefined, 0, CARWIDTH, cars);
	car.run();
	lastCar = car;

}

function draw() 
{
	updateParameters();

	background(255);
	stroke(0);
	line(0, ROADY - CARHEIGHT/2, ROADLENGTH, ROADY - CARHEIGHT/2);
	lastCar.run()

	if (lastCar.pos.x > DISTMIN + CARWIDTH)
	{
		lastCar = new Car(lastCar, 0, CARWIDTH, cars);
	}
	console.log(cars);
}

function mousePressed()
{
	lastCar.clicked();
}

function updateParameters()
{
	VMAX = vmaxSlider.value();
	MASS = massSlider.value();
}