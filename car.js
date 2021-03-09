class Car 
{
	constructor(_nextCar, x, _mass) 
	{
		this.acc = createVector(0, 0);
		this.vel = createVector(3, 0);
		this.pos = createVector(x, 200 - CARHEIGHT);
		this.color = color(0);
		this.mass = _mass;
		this.dist = 0;
		this.nextCar = _nextCar;
		this.isSelected = false;
		this.isFirst = false;

		if (!_nextCar) {
			this.isFirst = true
		}
	}
	
	run() 
	{
		this.drive();
		this.control();
		this.update();
		this.edgeCheck();
		this.render();
		if(!this.isFirst) this.nextCar.run()
	}
	
	drive() 
	{
		if (this.isFirst)
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
			if(keyIsDown(32))
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
		if(!this.isFirst && this.pos.x > this.nextCar.pos.x) this.pos.x = this.nextCar.pos.x - CARWIDTH;

		if(this.pos.x > ROADLENGTH) {
			delete(this.nextCar);
			this.isFirst = true;
		}
	}
	
	render() 
	{
		stroke(0);
		noFill();
		text(round(this.dist), this.pos.x, this.pos.y - CARHEIGHT);
		fill(this.color);
		rect(this.pos.x, this.pos.y, CARWIDTH, CARHEIGHT);
	}

	clicked()
	{
		this.color = color(0);
		this.isSelected = false;
		var d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
		if (d < 20)
		{
			this.color = color(0, 255, 0);
			this.isSelected = true;
		}

		this.nextCar.clicked();

	}
}