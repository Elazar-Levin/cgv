
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
		this.transform.position.set(0,0,0);
		this.animations = animations;
		this.add (transform);
		this.movingLeft = false;
		this.movingRight = false;
		this.movingForward = false;
		this.movingBackward = false;
		this.myFrame = 0;
	}

	moveLeft ()
	{
		this.movingLeft = true;
		this.movingRight = false;
		this.movingForward = false;
		this.movingBackward = false;
	}	

	moveRight ()
	{
		this.movingLeft = false;
		this.movingRight = true;
		this.movingForward = false;
		this.movingBackward = false;
	}
	
	moveForward ()
	{
		this.movingLeft = false;
		this.movingRight = false;
		this.movingForward = true;
		this.movingBackward = false;
	}
	
	moveBackward ()
	{
		this.movingLeft = false;
		this.movingRight = false;
		this.movingForward = false;
		this.movingBackward = true;
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
