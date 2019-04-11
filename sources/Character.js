
class Character extends THREE.Object3D
{
	//var speed;
	
	/*var x,y,z;
	var transform;
	var animations;*/
	constructor (speed, x, y, z, transform, animations)
	{
		super();
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.z = z;
		this.transform = transform;
		this.animations = animations;
		this.add (transform);
		var movingLeft = false;
		var movingRight = false;
		var movingForward = false;
		var movingBackward = false;
		var myFrame = 0;
	}

	moveLeft ()
	{
		movingLeft = true;
		movingRight = false;
		movingForward = false;
		movingBackward = false;
	}	

	moveRight ()
	{
		movingLeft = false;
		movingRight = true;
		movingForward = false;
		movingBackward = false;
	}
	
	moveForward ()
	{
		movingLeft = false;
		movingRight = false;
		movingForward = true;
		movingBackward = false;
	}
	
	moveBackward ()
	{
		movingLeft = false;
		movingRight = false;
		movingForward = false;
		movingBackward = true;
	}
	
	animate (frameNumber)
	{
		myFrame = frameNumber;
		for (var i = 0; i < transform.children.length; i++)
		{
			transform.children [i].geometry = animations [myFrame];
		}//For loop
	}
}
