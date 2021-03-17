// Pierre Garnier
// M2 CSM
// pierre.garnier1618@gmail.com
// 03/2021

class Car 
{
	constructor(_nextCar, x, _mass, _cars) 					// chaque voiture connait la voiture suivante et le tableau de voitures
	{
		this.acc = createVector(0, 0);
		this.vel = createVector(VMAX, 0);
		this.pos = createVector(x, ROADY - CARHEIGHT);

		this.color = color(0);

		this.mass = _mass;
		this.dist = 0;

		this.nextCar = _nextCar;
		this.carsArray = _cars;
		this.prevCar = undefined;

		this.isSelected = false;

		this.carsArray.unshift(this); 						// ajoute cette voiture à la première place du tableau

		if (!_nextCar) {									// si il n'y a pas de voiture suivante
			this.isLeader = true;							// cette voiture devient le leader
		}
		else
		{
			this.isLeader = false;
			this.tellNextCar(); 							// on s'identifie auprès de la voiture suivante
		}

	}
	
	run() 													// exécute toutes les tâches nécessaires à la conduite
	{
		this.drive();
		this.control();
		this.update();
		this.edgeCheck();
		this.render();
		if(!this.isLeader) this.nextCar.run()				// si on est pas leader, on lance cette fonction pour la voiture suivante
	}
	
	drive() 															// fonction de conduite de la voiture
	{
		if (this.isLeader)
		{
			this.targetVel = VMAX;										// le leader conduit toujours à VMAX
		}
		else 
		{
			this.dist = p5.Vector.dist(this.pos, this.nextCar.pos);		// calcul de la distance à la prochaine voiture

			let p = this.mass/(this.dist - DISTMIN);					// calcul du paramètre de vitesse en comptant la distance de sécurité (DISTMIN)

			this.targetVel = 1/p;										// la fonction de vitesse est une fonction inverse 
		}

		if (this.vel.x > this.targetVel)								// si la vitesse est supérieure à la vitesse target
		{
			this.acc.set(-0.1);											// accélération
		}
		else if (this.vel.x < this.targetVel)							// si la vitesse est inférieure à vitesse target
		{
			this.acc.set(0.1);											// décélération
		}
		else
		{
			this.acc.set(0);											// vitesse constante
		}
	}
	
	control()								// gestion du contrôle manuel de la voiture via les touches
	{
		if (this.isSelected)
		{
			if(keyIsDown(LEFT_ARROW))
			{
				this.acc.set(-0.1);			// décélération
			}
			if(keyIsDown(RIGHT_ARROW))
			{
				this.acc.set(0.1);			// accelération
			}
			if(keyIsDown(32)) 				// SPACEBAR
			{
				this.spacePressed = true;   // frein à main
			}
			else
			{
				this.spacePressed = false;
			}
		}
	}
	
	update()								// mise à jour des vitesses et accélération
	{
		if (!this.spacePressed)
		{
			this.vel.add(this.acc);				// vt+1 = vt + acc 
			this.vel.limit(this.targetVel);		// on limite la vitesse à la vitesse target
			this.pos.add(this.vel);				// xt+1 = xt + vt+1
		}
		else
		{
			this.vel.mult(0);
		}
		

		this.acc.mult(0); 					// remise à zéro de l'accélération pour chaque cycle
	}
	
	edgeCheck()																// gestion des bords 
	{
		if(!this.isLeader && this.pos.x + CARWIDTH > this.nextCar.pos.x) 	// on empeche une voiture d'en dépasser une autre 
		{
			this.pos.x = this.nextCar.pos.x - CARWIDTH;						// hard set back de la position de la voiture
		}

		if(this.pos.x > ROADLENGTH && !this.isLeader) { 					// si la prochaine voiture est en dehors de la fenêtre, on la suprimme 
			delete(this.nextCar);
			this.isLeader = true; 											// on commence donc à se comporter comme le leader
			this.carsArray.pop(); 											// on suprimme la dernière voiture du tableau
		}
	}
	
	render() 												// fonction de rendu qui dessine la voiture
	{
		stroke(0);
		noFill();
		// text(round(this.dist), this.pos.x - CARWIDTH/2, this.pos.y - CARHEIGHT);  // possible affichage de la distance 
		fill(this.color);
		rect(this.pos.x, this.pos.y, CARWIDTH, CARHEIGHT);

		// recherches sur un affichage sous forme de graph :

		// let height = map(this.dist, 0, ROADLENGTH, 100, 0, true);
		// noStroke();
		// fill(color('red'));
		// ellipse(this.pos.x, this.pos.y - height, 10, 10);
	}

	clicked() 													// gestion des clicks 
	{
		this.color = color(0);
		this.isSelected = false;
		var d = dist(mouseX, mouseY, this.pos.x, this.pos.y);	// calcul de la distance à la souris
		let offset = 10;										// facilite le clic sur une voiture, possiblité de plusieurs voitures sélectionnés si > 0
		if (d < CARWIDTH/2 + offset)							// si la souris est dans la zone de la voiture
		{
			this.color = color(0, 255, 0);						// on change la couleur 
			this.isSelected = true;								// on se comporte comme voiture sélectionnée 
		}

		this.nextCar.clicked();									// on exécute cette fonction sur la prochaine voiture

	}

	tellNextCar()							// permet de donner une référence à la voiture suivante
	{
		this.nextCar.setPrevCar(this);		// on passe cet objet à la voiture suivante
	}

	setPrevCar(car)							// permet de récupérer la voiture suivante et l'enregistrer dans les propriétés 
	{
		this.prevCar = car;
	}
}