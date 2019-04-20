
class Character extends THREE.Object3D
{
	
	constructor (speed, x, y, z, transform, animations, obstructions, food = null, powerPellets = null)
	{
		super();
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.z = z;
		this.transform = transform;
		this.position.set(x,y,z);
		this.transform.position.set(0,0,0);
		this.animations = animations;
		this.obstructions = obstructions;
		this.add (transform);
		this.movingLeft = false;
		this.movingRight = false;
		this.movingForward = false;
		this.movingBackward = false;
		//this.movingDown=false;
		this.vAngle = 0;
		this.myFrame = 0;
		this.rotationY=0;
		this.food = food;
		this.futureDir = "null";
		this.jumping = false;
		this.jumpingSpeed = 0.75;
		this.ySpeed = 0.5;
		this.yAccelerataion = 0;
		this.canJump = false;
		this.powerPellets = powerPellets;
		this.score = 0;
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

	setX (x)
	{
		this.position.x = x;
		this.x = x;
	}
	setY (y)
	{
		this.position.y = y;
		this.y = y;
	}
	setZ (z)
	{
		this.position.z = z;
		this.z = z;
	}
	getPos()
	{
		return new THREE.Vector3 (this.x, this.y, this.z);
	}

	setPos (x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.position.set (x, y, z);
	}

	animate (frameNumber)
	{
		this.myFrame = frameNumber;
		for (var i = 0; i < this.transform.children.length; i++)
		{
			this.transform.children [i].geometry = this.animations [this.myFrame];
		}//For loop
	}

	doCollisions()//do the collisions for this object
	{
		//do downward collisons first, then do horizontal collisions, probably if/else
		var charSphere = new THREE.Sphere (this.getPos(), 2);
		var charCube = new THREE.Box3 (new THREE.Vector3 (this.x - 1.9, this.y - 1.9, this.z - 1.9) ,new THREE.Vector3 (this.x + 1.9, this.y + 1.9, this.z + 1.9));
		var inAir = false;
		var highest =- Infinity;
		this.setY (this.y - this.ySpeed);//always apply gravity
		if (this.y > -2.5)//if in air but not while jumping
		{
			this.setY (this.y + this.ySpeed);//if in air temporarily switch off gravity
			var collides = false;
			for (var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.y += this.ySpeed;
				var obsBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children [i].position.y -= this.ySpeed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					collides = true;
					obsBox.setFromObject (this.obstructions.children [i]);
					this.setY (this.y - this.distanceCubeCube (charCube, obsBox));
					break;		
				}
			}
			if (!collides)
			{
				this.setY (this.y - this.ySpeed);//were in the air, switch gravity back on
				
				/*
				if (this.jumping)
				{
					if (this.movingLeft)
					{
						this.setY(this.y + this.ySpeed);
						this.setZ(this.z - this.ySpeed);
					}//If for when jumping in left direction
					if (this.movingRight)
					{
						this.setY(this.y + this.ySpeed);
						this.setZ(this.z + this.ySpeed);
					}//If for when jumping in right direction
					if (this.movingForward)
					{
						this.setY(this.y + this.ySpeed);
						this.setX(this.x + this.ySpeed);
					}//If for when jumping in up direction
					if (this.movingBackward)
					{
						this.setY(this.y + this.ySpeed);
						this.setX(this.x - this.ySpeed);
					}//If for when jumping in down direction
					
				}
				else
				{
					if (this.movingLeft)
					{
						this.setY(this.y - this.ySpeed);
						this.setZ(this.z - this.ySpeed);
					}//If for when jumping in left direction
					if (this.movingRight)
					{
						this.setY(this.y - this.ySpeed);
						this.setZ(this.z + this.ySpeed);
					}//If for when jumping in right direction
					if (this.movingForward)
					{
						this.setY(this.y - this.ySpeed);
						this.setX(this.x + this.ySpeed);
					}//If for when jumping in up direction
					if (this.movingBackward)
					{
						this.setY(this.y - this.ySpeed);
						this.setX(this.x - this.ySpeed);
					}//If for when jumping in down direction	
				}
				*/
				this.movingLeft=false;
				this.movingRight=false;
				this.movingForward=false;
				this.movingBackward=false;
				this.ySpeed+=GRAVITY_CONSTANT; //make falling speed faster every frame
			}
			else
			{
				//this.ySpeed=0;
				this.canJump = true;
			}
		}
		else
		{
			this.ySpeed=0;//on ground, reset gravity
			this.canJump = true;
			if (this.y < -2.5)
			{
				this.setY (-2.5);
			}
		}
	
		if(this.movingLeft)//do the left right forward backwards collisions for actual obstructions
		{
			var collides=false;
			for(var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.z += this.speed;
				var obsBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children [i].position.z -= this.speed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					collides = true;
					obsBox.setFromObject (this.obstructions.children [i]);
					this.setZ (this.z - this.distanceCubeCube (charCube, obsBox));
					break;		
				}	
			}	
			if (!collides)
			{
				this.setZ (this.z - this.speed);
			}
		}
		
		if (this.movingRight)
		{
			var collides = false;
			for (var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.z -= this.speed;
				var obsBox = new THREE.Box3 (new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children [i].position.z += this.speed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					collides = true;
					obsBox.setFromObject (this.obstructions.children [i]);
					this.setZ (this.z + this.distanceCubeCube (charCube, obsBox));
				}	
			}	
			if (!collides)
			{
				this.setZ (this.z + this.speed);
			}
		}

		if (this.movingForward)
		{
			var collides = false;
			for (var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.x -= this.speed;
				var obsBox = new THREE.Box3 (new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children [i].position.x += this.speed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					collides = true;
					obsBox.setFromObject (this.obstructions.children [i]);
					this.setX (this.x + this.distanceCubeCube (charCube, obsBox));
				}	
			}	
			if (!collides)
			{
				this.setX(this.x + this.speed);
			}
		}

		if (this.movingBackward)
		{
			var collides = false;
			for (var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.x += this.speed;
				var obsBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children[i].position.x -= this.speed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					collides = true;
					obsBox.setFromObject (this.obstructions.children [i]);
					this.setX (this.x - this.distanceCubeCube (charCube, obsBox));
				}	
			}	
			if (!collides)
			{
				this.setX (this.x - this.speed);
			}
		}
		//food collisions
		if (this.food != null)
		{
			//sphere/point/food collisions, anything pacman eats is done here, anything paman crashes into is done before this loop
			for(var i = 0; i < this.food.children.length; i++)
			{
				var foodPoint = this.food.children [i].position;
				if (this.SphereIntersect (charSphere,foodPoint))
				{
					this.food.remove (this.food.children [i]);
					this.score++;
					console.log (this.food.children.length);
					return;
				}//if for when food collides with pacman
			}//for loop that distributes over number of foods
		}//if to make sure there are still food pelletes
		if (this.powerPellets != null)
		{
			for (var i = 0; i < this.powerPellets.children.length; i++)
			{
				var pelletPoint = this.powerPellets.children [i].position;
				if (this.SphereIntersect (charSphere,pelletPoint))
				{
					this.powerPellets.remove (this.powerPellets.children [i]);
					powerPelletEaten = true;
					return;
				}//if for when the pellete collides with pacman
			}//for loop that distributes over number of power pelletes
		}//if to make sure there are power pellets
	}//Method that handles all the collisions of the object
	
	canMoveLeft()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3 (this.x - 1.9, this.y - 1.9, this.z - 1.9), new THREE.Vector3 (this.x + 1.9, this.y + 1.9, this.z + 1.9));
		if (true) 
		{
			for(var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.z += this.speed;
				var obsBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children [i].position.z -= this.speed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					return false;	
				}//if for when an obstruction and pacman are going to collide
			}//for loop iterating over obstructions
		}//Honestly donno why this if is ever here
		return true;
	}//Method that checks if the pacman can immediately turn left

	canMoveRight()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3 (this.x - 1.9, this.y - 1.9, this.z - 1.9), new THREE.Vector3 (this.x + 1.9, this.y + 1.9 ,this.z + 1.9));
		if (true)
		{
			for(var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.z -= this.speed;
				var obsBox = new THREE.Box3 (new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children [i].position.z += this.speed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					return false;
				}//if for when an obstruction and pacman are going to collide
			}//for loop iterating over obstructions
		}//wow, heres that if again
		return true;
	}//Method that checks if the pacman can immediately turn right
	
	canMoveForward()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3 (this.x - 1.9, this.y - 1.9, this.z - 1.9), new THREE.Vector3 (this.x + 1.9, this.y + 1.9, this.z + 1.9));
		if (true) 
		{
			for(var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children [i].position.x -= this.speed;
				var obsBox = new THREE.Box3 (new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children [i]);
				this.obstructions.children [i].position.x += this.speed;
				
				if (this.SquareIntersect (charCube, obsBox))
				{
					return false;
				}//if for when an obstruction and pacman are going to collide
			}//for loop iterating over obstructions
		}//ok ye i needa get rid of this one too
		return true;
	}//Method that checks if the pacman can immediately turn up
	
	canMoveBackward()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3 (this.x - 1.9, this.y - 1.9, this.z - 1.9), new THREE.Vector3 (this.x + 1.9, this.y + 1.9,this.z + 1.9));
		
		if (true) 
		{
			for (var i = 0; i < this.obstructions.children.length; i++)
			{
				this.obstructions.children[i].position.x += this.speed;
				var obsBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject (this.obstructions.children[i]);
				this.obstructions.children[i].position.x -= this.speed;
				
				if (this.SquareIntersect (charCube,obsBox))
				{
					return false;
				}//if for when an obstruction and pacman are going to collide
			}//for loop iterating over obstructions
		}//man fml
		return true;
	}//Method that checks if the pacman can immediately turn down
	
	doJump()
	{
		if (!this.jumping)
		{
			this.ySpeed=-1;//set ySpeed for jumping
			//this.setY (-2.4);  //ye i'll get rid of this i promise
			this.jumping = true;
			//this.setY (this.y + 1);
			//this.vAngle += this.ySpeed;
			//this.setY (Math.abs (Math.sin (this.vAngle) * 10) - 3);
			//this.setY (this.y + 0.5);
		}//Gotta make sure he aint already jumping
	}//Method called when pacman jumps
	
	setDirection ()
	{
		if (this.futureDir == "left")
		{
			if (this.canMoveLeft ())
			{
				this.rotation.y =- Math.PI / 2;
				this.moveLeft();
			}//if to check when pacman can actually turn
		}//if for when next wanted turn is a left
		else if (this.futureDir == "right")
		{
			if (this.canMoveRight ())
			{
				this.rotation.y = Math.PI / 2;
				this.moveRight();
			}//if to check when pacman can actually turn
		}//if for when next wanted turn is a right
		else if (this.futureDir == "up")
		{
			if (this.canMoveForward ())
			{
				this.rotation.y = Math.PI;
				this.moveForward();
			}//if to check when pacman can actually turn
		}//if for when next wanted turn is a upwards
		else if (this.futureDir == "down")
		{
			if (this.canMoveBackward ())
			{
				this.rotation.y = 0;
				this.moveBackward();
			}//if to check when pacman can actually turn
		}//if for when next wanted turn is a downwards
	}//Method used to set the direction of pacman's face
	
	SphereIntersect (sphere, point) 
	{
		return sphere.containsPoint (point);
	}//Method that returns boolean of whether the two objects intersect

	SquareIntersect (sphere,Cube)
	{
		return sphere.intersectsBox (Cube);
	}//Method that returns boolean of whether the two objects intersect

	distanceCubeCube (cube1,cube2)
	{
		var center2 = new THREE.Vector3();
		cube2.getCenter (center2);
		var closestPoint1 = new THREE.Vector3();
		cube1.clampPoint (center2, closestPoint1);
		return cube1.distanceToPoint (closestPoint1);
	}//Method that returns distance between cube and other cube mesh collider

	distanceSphereCube (sphere,cube)
	{
		var closestPoint = new THREE.Vector3();
		cube.clampPoint (sphere.center, closestPoint);
		return Math.sqrt (closestPoint.distanceToSquared (sphere.center)) - sphere.radius - 0.1;//last number is offset, the space between the two shapes. the smaller this is, the more ofter unexpected collisions happen	
	}//Method that returns distance between sphere and cube mesh collider
}
