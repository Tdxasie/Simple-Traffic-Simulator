// Pierre Garnier
// M2 CSM
// pierre.garnier1618@gmail.com
// 03/2021


// constantes utilisées pour les settings de la simulation
const CARHEIGHT = 10;
const CARWIDTH = 20;
const SPACING = 50;
let MASS = 1;
let VMAX = 3;
const VMAXXX = VMAX * 3;
const DISTMIN = 20;
const ROADLENGTH = 1000;
const ROADY = 400;

let cars = [];													// tableau qui contiendra l'ensemble des voitures présentes sur l'écran
let lastCar;
let vmaxSlider, massSlider;

function setup() 												// fonction exécutée une seule fois au début du programme 
{
	createCanvas(ROADLENGTH, ROADY); 							// création de la fenêtre 
	rectMode(CENTER);											// le point d'origine des rectangles est au centre

	let vmaxText = createElement('div', 'VMAX');				// création des sliders pour modifier des paramètres 
	vmaxText.position(0, 0);

	vmaxSlider = createSlider(0, 10, VMAX, 0.1);
	vmaxSlider.position(50, 0);
	vmaxSlider.style('width', '80px')

	let massText = createElement('div', 'MASS');
	massText.position(0, 20);

	massSlider = createSlider(0, 100, MASS, 1);
	massSlider.position(50, 20);
	massSlider.style('width', '80px')


	let car = new Car(undefined, 0, CARWIDTH, cars);			// création de la première voiture
	car.run();													// lancement de la première voiture
	lastCar = car;												// on garde seulement la dernière voiture en mémoire

}

function draw() 													// fonction exécutée de manière répétitive aussi rapidement que possible
{
	updateParameters();												// mise à jour des paramètres avec les données des sliders

	background(255);
	stroke(0);
	line(0, ROADY - CARHEIGHT/2, ROADLENGTH, ROADY - CARHEIGHT/2);	// dessin de la route

	lastCar.run();													// on update la dernière voiture créée 

	if (lastCar.pos.x > DISTMIN + CARWIDTH)							// si cette voiture dépasse la distance de sécurité 
	{
		lastCar = new Car(lastCar, 0, CARWIDTH, cars);				// on crée une nouvelle voiture en lui passant la dernière voiture et le tableau de voitures 
	}
}

function mousePressed()				// l'évenement de click est détecté dans ce scope et cette fonction est exécutée automatiquement
{
	lastCar.clicked();				// on dit à la dernière voiture créée qu'un click à été détecté
}

function updateParameters()			// mise à jour des paramètres en fonction des valeurs des sliders 
{
	VMAX = vmaxSlider.value();
	MASS = massSlider.value();
}