class Car 
{
	constructor(_nextCar, x, _mass, _cars) 
	{
		this.acc = createVector(0, 0);
		this.vel = createVector(3, 0);
		this.pos = createVector(x, ROADY - CARHEIGHT);
		this.color = color(0);
		this.mass = _mass;
		this.dist = 0;
		this.nextCar = _nextCar;
		this.prevCar = undefined;
		this.isSelected = false;
		this.carsArray = _cars;

		this.carsArray.unshift(this); //add this car to the first place

		if (!_nextCar) {
			this.isLeader = true;
		}
		else
		{
			this.isLeader = false;
			this.tellNextCar(); // on creating register yourself to the next car so data can be used
		}

	}
	
	run() 
	{
		this.drive();
		this.control();
		this.update();
		this.edgeCheck();
		this.render();
		if(!this.isLeader) this.nextCar.run()
	}
	
	drive() 
	{
		if (this.isLeader)
		{
			this.vel.set(VMAX);
		}
		else 
		{
			this.dist = p5.Vector.dist(this.pos, this.nextCar.pos);

			let v = this.mass/(this.dist - DISTMIN);

			this.vel.set(1/v);
		}
	}
	
	control()
	{
		if (this.isSelected)
		{
			if(keyIsDown(LEFT_ARROW))
			{
				this.acc.set(-VMAX);
			}
			if(keyIsDown(RIGHT_ARROW))
			{
				this.acc.set(10);
			}
			if(keyIsDown(32)) // SPACEBAR
			{
				this.vel.set(0);
			}
		}
	}
	
	update()
	{
		this.vel.add(this.acc);
		this.vel.limit(VMAXXX);
		this.pos.add(this.vel);

		this.acc.mult(0); //reset acc each cycle 
	}
	
	edgeCheck()
	{
		if(!this.isLeader && this.pos.x + CARWIDTH > this.nextCar.pos.x) // prevent car from passing next car
		{
			this.pos.x = this.nextCar.pos.x - CARWIDTH;
		}

		if(this.pos.x > ROADLENGTH && !this.isLeader) { // if next car is out of render view, delete it 
			delete(this.nextCar);
			this.isLeader = true; // start behaving like the leader 
			this.carsArray.pop(); //remove the car from the array 
		}
	}
	
	render() // function used for rendering the car on screen
	{
		stroke(0);
		noFill();
		// text(round(this.dist), this.pos.x - CARWIDTH/2, this.pos.y - CARHEIGHT);
		fill(this.color);
		rect(this.pos.x, this.pos.y, CARWIDTH, CARHEIGHT);
		// let height = map(this.dist, 0, ROADLENGTH, 100, 0, true);
		// noStroke();
		// fill(color('red'));
		// ellipse(this.pos.x, this.pos.y - height, 10, 10);
	}

	clicked() // detects if the car was clicked and passes on the check to the next car
	{
		this.color = color(0);
		this.isSelected = false;
		var d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
		if (d < CARWIDTH/2)
		{
			this.color = color(0, 255, 0);
			this.isSelected = true;
		}

		this.nextCar.clicked();

	}

	tellNextCar()
	{
		this.nextCar.setPrevCar(this);
	}

	setPrevCar(car)
	{
		this.prevCar = car;
	}
}