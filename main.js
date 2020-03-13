document.addEventListener("DOMContentLoaded", function() {
	
	var canvas = document.getElementById('canvas');
	var width = canvas.width;
	var height = canvas.height; 

	if (canvas.getContext)
	{
		var context = canvas.getContext('2d');
		
		balls = [];
		colors = ['white','grey','orange','green','blue','yellow','black','red','purple','magenta','brown','black']

		//Player Ball
		ball = {'x': 200,
				'y': 300,
				'vx': Math.random()*50 + 5,
				'vy': (Math.random()*10)-5,
				'friction': 0.02,
				'size': 25,
				'color': colors[0]};

		balls.push(ball);

		//Others Balls
		let c = 1;
		for (let i = 0; i < 4; i++)
		{
			for (let j = 0; j <= i; j++)
			{			
				ball = {'x': 400+i*70,
						'y': 300+(-i/2)*70+(j*70),
						'vx': 0,
						'vy': 0,
						'friction': 0.02,
						'size': 25,
						'color': colors[c]};
				c = c + 1;
				balls.push(ball);
			}
		}

		//Draw
		setInterval(function(){

			//Background
			context.clearRect(0,0,width,height);
			context.fillStyle = '#E6E6EA';
			context.fillRect(0,0,width,height);

			//Ball Display
			for (let ball of balls)
			{
				update(ball,width,height,balls);

				var cercle = new Path2D();
		    	cercle.arc(ball['x'], ball['y'], ball['size'], 0, 2 * Math.PI);
		    	context.fillStyle = ball['color'];
		    	context.fill(cercle);

		    	//Vector
		    	context.strokeStyle = 'red';
		    	context.lineWidth = 5;
		    	context.beginPath();
				context.moveTo(ball['x'], ball['y']);
				context.lineTo(ball['x'] + ball['vx'] * 6, ball['y'] + ball['vy'] * 6);
				context.stroke();
			}
		}, 10);

	}
	else
	{
		alert("Canvas non supporté sur ce navigateur");
		return;
	}
});


function update(ball, width, height, balls) {

	//Coord
	ball['x'] = ball['x'] + ball['vx'];
	ball['y'] = ball['y'] + ball['vy'];

	//Frict
	ball['vx'] = ball['vx']*(1-ball['friction']);
	ball['vy'] = ball['vy']*(1-ball['friction']);

	//Collision Walls
	if (ball['x']+ball['size']>= width || ball['x']-ball['size'] <= 0)
	{
		ball['vx']=-ball['vx'];
	}

	if (ball['y']+ball['size'] >= height || ball['y']-ball['size'] <= 0)
	{
		ball['vy']=-ball['vy'];
	}

	//Collision Balls
	for (let bal of balls)
	{
		if (bal != ball)
		{
			//Distances
			var dx = ball['x'] - bal['x'];
			var dy = ball['y'] - bal['y'];

			var distance = Math.sqrt(dx * dx + dy * dy);
			var r = ball['size'] + bal['size'];
			
			//If collision
			if (distance <= r)
			{
				let dvx = bal['vx']-ball['vx'];
				let dvy = bal['vy']-ball['vy'];

				let dot = dx * dvx + dy * dvy;

				if (dot >= 0)
				{
					let factor = dot/Math.pow(distance,2);
					ball['vx'] += factor * dx;
					ball['vy'] += factor * dy;
					bal['vx'] -= factor * dx;
					bal['vy'] -= factor * dy;
				}				
			}
		}
	}
}