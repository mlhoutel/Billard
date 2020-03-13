var system

var cwidth = window.screen.width - 100
var cheight = window.screen.height - 200

var reset;
var pause;
var paused = false;

function setup() {
	createCanvas(cwidth, cheight)

	textSize(15);

	reset = createButton('&#8634;');
	reset.position(cwidth - 35, 10);
	reset.style("height","40px")
	reset.style("width","40px")
	reset.style("font-size: 2em")
	reset.mousePressed(Reset);

	pause = createButton('&#10074;&#10074;');
	pause.position(cwidth - 80, 10);
	pause.style("height","40px")
	pause.style("width","40px")
	pause.style("font-size: 1.5em")
	pause.mousePressed(Pause);

	Reset()
}

function Pause() {
	if (paused) {
		paused = false
		pause.elt.innerHTML = '&#10074;&#10074;'
	} else {
		paused = true
		pause.elt.innerHTML = '&#9658;'
	}
}

function Reset() {
	system = new System()

	var colors = ['white','grey','orange','green','blue','yellow','black','red','purple','magenta','brown','black']
	
	system.add(new Body(200, 300, 10, 0, colors[0]))

	let c = 1;
	for (let i = 0; i < 4; i++)
	{
		for (let j = 0; j <= i; j++)
		{
			system.add(new Body(400+i*70, 300+(-i/2)*70+(j*70), 0, 0, colors[c]))
			c = c + 1;
		}
	}

	system.setTupples()
}

function RandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
function randomColor() {
	return [RandomInt(255),RandomInt(255),RandomInt(255)]
}

function draw() {
	background(0);

	system.Step()
	system.Draw()
}

function System() {
	this.bodies = []
	this.tupples = []

	this.setTupples = function() {
		for (var i = 0; i < this.bodies.length; i++) {
			for (var j = 0; j < this.bodies.length; j++) {
				if (i != j && !this.tuppleExist(this.bodies[i], this.bodies[j]))
				{
					this.tupples.push([this.bodies[i], this.bodies[j]])
				}
			}
		}
	}

	this.tuppleExist = function(bodyA, bodyB) {
		let exist = false
		for (var i = 0; i < this.tupples.length; i++) {
			if ((this.tupples[i][0] == bodyA && this.tupples[i][1] == bodyB) || (this.tupples[i][1] == bodyA && this.tupples[i][0] == bodyB)) {
				exist = true
			}
		}
		return exist
	}

	this.Step = function() {

		if (!paused)
		{
			for (var i = 0; i < this.bodies.length; i++) {
				this.bodies[i].Step()
			}
			for (var i = 0; i < this.tupples.length; i++) {
				this.tupples[i][0].BCollision(this.tupples[i][1])
			}
		}
	}

	this.Draw = function() {

		strokeWeight(3)

		for (var i = 0; i < this.bodies.length; i++) {
			this.bodies[i].Draw()
		}
	}

	this.add = function(body) {
		this.bodies.push(body)
	}
}


function Body(x, y, x_speed, y_speed, color) {
	this.x = x
	this.y = y

	this.x_speed = x_speed
	this.y_speed = y_speed

	this.size = 25
	this.mass = 10
	this.friction = 0.02

	this.color = color

	this.Step = function() {

		this.x += this.x_speed
		this.y += this.y_speed

		this.x_speed = this.x_speed * (1 - this.friction)
		this.y_speed = this.y_speed * (1 - this.friction)

		if (abs(this.x_speed) < 0.1) { this.x_speed = 0 }
		if (abs(this.y_speed) < 0.1) { this.y_speed = 0 }

		this.Collision()
	}

	this.Draw = function() {
		
		fill(this.color)
		stroke(this.color)
		ellipse(this.x, this.y, this.size * 2, this.size * 2);
	}

	this.Collision = function() {
		if ( this.x - this.size <= 0 ) { this.x_speed = abs(this.x_speed) }
		if ( this.y - this.size <= 0 ) { this.y_speed = abs(this.y_speed) }

		if ( this.x + this.size >= cwidth ) { this.x_speed = -abs(this.x_speed) }
		if ( this.y + this.size >= cheight ) { this.y_speed = -abs(this.x_speed) }
	}

	this.BCollision = function(body) {
		var x_distance = this.x - body.x
		var y_distance = this.y - body.y

		var distance = sqrt(x_distance^2 + y_distance^2)
		var r_size = this.size + body.size

		if (distance <= r_size) {
			var dx_speed = this.x_speed - body.x_speed
			var dy_speed = this.y_speed - body.y_speed

			var dot = x_distance * dx_speed + y_distance * dy_speed

			if (dot >= 0) {
				var factor = dot / (distance^2)

				this.x_speed += factor*x_distance
				this.y_speed += factor*y_distance

				body.x_speed -= factor*x_distance
				body.y_speed -= factor*y_distance
			}
		}
	}
}