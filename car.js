class Car 
{
	constructor(_i, x, _mass) 
	{
		this.acc = createVector(0, 0);
		this.vel = createVector(3, 0);
		this.pos = createVector(x, 200 - CARHEIGHT);
		this.color = color(0);
		this.mass = _mass;
		this.dist = 0;
		this.id = _i;
		this.isSelected = false;
		this.next = (this.id + 1 > cars.length ? 0 : this.id);
	}
	
	run(cars) 
	{
		this.drive(cars);
		this.control();
		this.update();
		this.edgeCheck(cars);
		this.render();
	}
	
	drive(cars) 
	{
		for(let i = 0; i < cars.length; i++)
		{
			if (cars[i] === this) // find yourself
			{
				if (i != cars.length-1) //every car exept last one
				{
					// let sign = (this.pos.x - cars[i+1].pos.x < 0 ? 1 : -1);

					this.dist = p5.Vector.dist(this.pos, cars[i+1].pos);

					let v = this.mass/(this.dist - DISTMIN);

					this.vel.set(1/v);
				}
				else if (i === cars.length-1) //last car in the array aka leader
				{
					this.color = color(255, 0, 0);
					this.vel.set(VMAX);
				}
			}
		}

		// let idx = (this.id + 1 > cars.length ? 0 : this.id); // loop indexes in array 
		// this.dist = p5.Vector.dist(this.pos, cars[idx].pos);

		// let v = this.mass/this.dist;
		// this.vel.set(v);

		// if (this.id === cars.length - 1){
		// 	this.color = color(255, 0, 0);
		// 	//this.vel.set(VMAX);
		// }

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
		if(this.pos.x > width) this.pos.x = 0;
	}
	
	render() 
	{
		stroke(0);
		noFill();
		text(round(this.dist), this.pos.x, this.pos.y - CARHEIGHT);
		text(this.id, this.pos.x, this.pos.y + CARHEIGHT*2);
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
	}
}