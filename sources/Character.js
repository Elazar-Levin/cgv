class Character extends THREE.Object3D
{
	constructor (speed, x, y, z, transform, animations, obstructions, food = null, powerPellets = null, tag)
	{
		super();
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.z = z;
		this.transform = transform;
		this.position.set(x,y,z);
		this.transform.position.set(0,0.1,0);
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
		this.highscore = 0;
		this.lives = 3;
		this.tag = tag;
		this.tweening =false;
		this.tweeningAmount=0;
		this.tweeningDir=false;
		this.tweeningTotal=0;
		
	
		// new system. we start at 0, and then every other point is every Pi/6.
		/*
						6
					7		5
				8				4
			9						3
				10				2	
					11		1
						0
		*/
		
		
		this.point=0;
		
		
		this.prevPos=new THREE.Vector3(0,0,0);
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

	resetMovement()
	{
		this.movingLeft=false;
		this.movingRight=false;
		this.movingForward=false;
		this.movingBackward=false;
	}
	
	doCollisions()//do the collisions for this object
	{
		//do downward collisons first, then do horizontal collisions, probably if/else
		var charSphere = new THREE.Sphere (this.getPos(), 2);
		var charCube = new THREE.Box3 (new THREE.Vector3 (this.x - 1.9, this.y - 2, this.z - 1.9) ,new THREE.Vector3 (this.x + 1.9, this.y + 1.9, this.z + 1.9));
		var inAir = false;
		var highest =- Infinity;
		this.setY (this.y - this.ySpeed);//always apply gravity
		if (this.y > -3)//if in air but not while jumping
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
				if(!this.jumping)
				{
					this.resetMovement();
				}
				this.ySpeed+=GRAVITY_CONSTANT; //make falling speed faster every frame
			}
			else
			{
				//this.ySpeed=0;
				this.jumping=false;
				this.canJump = true;
			}
		}
		else
		{
			if(this.jumping && this.ySpeed>0)
			{
				this.jumping=false;
				
			}
			this.ySpeed=0;//on ground, reset gravity
			this.canJump = true;
			if (this.y < -3)
			{
				this.setY (-3);
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
			/*if (this.tag == "pacman")
			{
				if (SquareIntersect (charSphere, ghost.charSphere))
				{
					this.lives--;
				}//If for when you tag the ghost
			}//If for only pacman to do homie*/
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
					if (this.score >= this.highscore)
					{
						this.highscore++;
					}//if for when u gotta add the high score also
				
					return;
				}//if for when food collides with pacman
			}//for loop that distributes over number of foods
		}//if to check if this character can eat
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
		}//if to check if this character can eat
		
		this.prevPos=this.position.clone();
		
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
				/*
				if(this.movingLeft)
				{
					if(this.tweeningTotal<this.tweeningAmount)
					{
						this.tween(this.tweeningDir,this.tweeningTotal);
					}
					//this.tween(false,0);
				}
				else if(this.movingRight)
				{
					this.tween(true,6);
				}
				else if(this.movingForward)
				{
					this.tween(false,3);
				}
				else if(this.movingBackward)
				{
					this.tween(true,3);
				}
				*/	
				this.rotation.y=-Math.PI/2;				
				this.moveLeft();
				
			}//if to check when pacman can actually turn
		}//if for when next wanted turn is a left
		else if (this.futureDir == "right")
		{
			if (this.canMoveRight ())
			{
				/*
				if(this.movingLeft)
				{
					this.tween(true,6);
				}
				else if(this.movingRight)
				{
					if(this.tweeningTotal<this.tweeningAmount)
					{
						this.tween(this.tweeningDir,this.tweeningTotal);
					}
					//this.tween(false,0);
				}
				else if(this.movingForward)
				{
					this.tween(true,3);
				}
				else if(this.movingBackward)
				{
					this.tween(false,3);
				}
				*/
				this.rotation.y=Math.PI/2;				
				this.moveRight();
			}//if to check when pacman can actually turn
		}//if for when next wanted turn is a right
		else if (this.futureDir == "up")
		{
			if (this.canMoveForward ())
			{
				/*
				if(this.movingLeft)
				{
					this.tween(true,3);
				}
				else if(this.movingRight)
				{
					this.tween(false,3);
				}
				else if(this.movingForward)
				{
					if(this.tweeningTotal<this.tweeningAmount)
					{
						this.tween(this.tweeningDir,this.tweeningTotal);
					}
					//this.tween(false,0);
				}
				else if(this.movingBackward)
				{
					this.tween(true,6);
				}
				*/
				this.rotation.y=Math.PI;
				this.moveForward();
			}//if to check when pacman can actually turn
		}//if for when next wanted turn is a upwards
		else if (this.futureDir == "down")
		{
			if (this.canMoveBackward ())
			{
				
				/*
				if(this.movingLeft)
				{
					this.tween(false,6);
				}
				else if(this.movingRight)
				{
					this.tween(true,6);
				}
				else if(this.movingForward)
				{
					this.tween(true,12);
				}
				else if(this.movingBackward)
				{
					if(this.tweeningTotal<=this.tweeningAmount)
					//{
						this.tween(this.tweeningDir,this.tweeningTotal);
					}
					//this.tween(false,0);
				}
				*/
				this.rotation.y=Math.PI*2;
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

	SphereSphere(sphere1,sphere2)
	{
		return sphere1.intersectsSphere(sphere2);
	}
	
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
	
	findChar (char1, no, halloween)
	{	
		/*if (this.movingLeft)
		{
			if(char1.position.z<this.position.z)
			{
				if (this.canMoveLeft)
				{
					this.futureDir = "left";
				}//If for when
				else if (char1.position.x < this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "down";
					}
				}
				else if (char1.position.x > this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "up";
					}
				}
			}
			if(char1.position.z>this.position.z)
			{
				if (this.canMoveRight)
				{
					this.futureDir = "right";
				}//If for when
				else if (char1.position.x < this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "down";	
					}
				}//
				else if (char1.position.x > this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "up";
					}
				}
			}
		}//If for when ghost is moving to the left
		if (this.movingRight)
		{
			if (char1.position.z < this.position.z)
			{
				if (this.canMoveLeft)
				{
					this.futureDir = "left";
				}//If for when
				else if (char1.position.x < this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "down";
					}
				}
				else if (char1.position.x > this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "up";
					}
				}
			}
			if(char1.position.z > this.position.z)
			{
				if (this.canMoveRight)
				{
					this.futureDir = "right";
					char1.score = 50;
				}//If for when
				else if (char1.position.x < this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "down";	
					}
				}//
				else if (char1.position.x > this.position.x)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "up";
						char1.score = 60;
					}
				}
			}	
		}//If for when ghost is moving to the right
		if (this.movingForward)
		{
			if(char1.position.x > this.position.x)
			{
				if (this.canMoveForward)
				{
					this.futureDir = "up";
				}//If for when
				else if (char1.position.z < this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "left";
					}
				}
				else if (char1.position.z > this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "right";
					}
				}
			}
			if(char1.position.x < this.position.x)
			{
				if (this.canMoveRight)
				{
					this.futureDir = "right";
				}//If for when
				else if (char1.position.z < this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "left";	
					}
				}//
				else if (char1.position.z > this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "right";
					}
				}
			}	
		}//If for when ghost is moving to the up
		if (this.movingBackward)
		{
			if(char1.position.x > this.position.x)
			{
				if (this.canMoveForward)
				{
					this.futureDir = "up";
				}//If for when
				else if (char1.position.z < this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "left";
					}
				}
				else if (char1.position.z > this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "right";
					}
				}
			}
			if(char1.position.x < this.position.x)
			{
				if (this.canMoveRight)
				{
					this.futureDir = "right";
				}//If for when
				else if (char1.position.z < this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "left";	
					}
				}//
				else if (char1.position.z > this.position.z)
				{
					if (this.canMoveBackward)
					{
						this.futureDir = "right";
					}
				}
			}
		}//If for when ghost is moving to the down
		
		else if(char1.position.z>this.position.z && this.futureDir!="left")
		{
			this.futureDir="right";
		}
		else if(char1.position.x<this.position.x && this.futureDir!="up")
		{
			this.futureDir="down";
		}
		else if(char1.position.x>this.position.x && this.futureDir!="down")
		{
			this.futureDir="up";
		}*/

		if (char1.futureDir == "null")
		{
			return;
		}//Ghost only moves once pacman moves


		/*if (halloween)
		{
			var dir = Math.floor ((Math.random() * 4) + 1);
			switch (dir)
			{
				
			}//Choosing random direction
			if (this.canMoveForward())
			{
				this.futureDir = "up";
			}//random dirtections
			else if (this.futureDir == "down")
			{
				this.futureDir = "up";
			}//Inverse dirtections
			else if (this.futureDir == "left")
			{
				this.futureDir = "right";
			}//Inverse dirtections
			else if (this.futureDir == "right")
			{
				this.futureDir = "left";
			}//Inverse dirtections
			return;
		}//ghost gonna be running from you, so imma revert his actions*/
		/*
		if (Math.abs (char1.position.x - this.position.x) <= 0.5)
		{
			if (char1.position.z > this.position.z)
			{
				this.futureDir = "right";
			}//If to turn right
			else
			{
				this.futureDir = "left";
			}//else for when u gotta go left instead
		}//if to stop that annoying shit when its on the same axis

		else if (Math.abs (char1.position.z - this.position.z) <= 0.5)
		{
			if (char1.position.x > this.position.x)
			{
				//this.futureDir = "left";
				this.futureDir = "up";
			}//If to turn up
			else
			{
				//this.futureDir = "right";
				this.futureDir = "down";
			}//else for when u gotta go down instead
		}//if to stop that annoying shit when its on the same axis
		*/
		

		if (char1.position.z > this.position.z && this.canMoveRight() &&!this.movingLeft)// this.futureDir != "left")
		{
			this.futureDir = "right";
		}//if for moving right
		else if (char1.position.z < this.position.z && this.canMoveLeft() && !this.movingRight)// this.futureDir != "right")
		{
			this.futureDir = "left";
		}//if for moving left

		else if (char1.position.x < this.position.x && this.canMoveBackward() && !this.movingForward)//this.futureDir != "up")
		{
			this.futureDir = "down";
		}//if for moving down

		else if (char1.position.x > this.position.x && this.canMoveForward() && !this.movingBackward)//this.futureDir != "down")
		{
			this.futureDir = "up";
		}//if for moving up
		
		if(this.movingRight && !this.canMoveRight() && this.futureDir=="right")
		{
			if(this.canMoveForward())
			{
				this.futureDir="up";
			}
			else
			{
				this.futureDir="down";
			}
		}
		else if(this.movingLeft && !this.canMoveLeft() && this.futureDir=="left")
		{
			if(this.canMoveBackward())
			{
				this.futureDir="down";
			}
			else
			{
				this.futureDir="up";
			}
		}
		else if(this.movingForward && !this.canMoveForward() && this.futureDir=="up")
		{
			if(this.canMoveLeft())
			{
				this.futureDir="left";
			}
			else
			{
				this.futureDir="right";
			}
		}
		else if(this.movingBackward && !this.canMoveBackward() && this.futureDir=="down")
		{
			if(this.canMoveRight())
			{
				this.futureDir="right";
			}
			else
			{
				this.futureDir="left";
			}
		}
		
		
		
	
	
	
		/*if (halloween)
		{
			if (this.futureDir == "up")
			{
				if (this.canMoveBackward())
				{
					this.futureDir = "down"	
				}
				else
				{
					if (this.canMoveLeft())
					{
						this.futureDir = "left"
					}
					else
					{
						this.futureDir = "right"
					}
				}
			}
			if (this.futureDir == "down")
			{
				if (this.canMoveForward())
				{
					this.futureDir = "up"	
				}
				else
				{
					if (this.canMoveLeft())
					{
						this.futureDir = "left"
					}
					else
					{
						this.futureDir = "right"
					}
				}
			}
			if (this.futureDir == "left")
			{
				if (this.canMoveRight())
				{
					this.futureDir = "right"	
				}
				else
				{
					if (this.canMoveForward())
					{
						this.futureDir = "up"
					}
					else
					{
						this.futureDir = "down"
					}
				}
			}
			if (this.futureDir == "right")
			{
				if (this.canMoveLeft())
				{
					this.futureDir = "left"	
				}
				else
				{
					if (this.canMoveForward())
					{
						this.futureDir = "up"
					}
					else
					{
						this.futureDir = "down"
					}
				}
			}
		}//If for when u wanna run away from the pacman
		*/
		if (this.inSpawn (no) )//&& !char1.inSpawn (no))
		{
			this.futureDir = "up";
		}

	}
	//dont need this
	setTag (tag)
	{
		this.tag = tag;
	}//Method to set the tag of the object (temporary)
	
	lockToBlock()
	{
		return new THREE.Vector2();
	}
	
	tween()
	{
		/*
						6
					7		5
				8				4
			9						3
				10				2	
					11		1
						0
		*/
		
		this.point=this.point%12;
		if(this.movingBackward && this.point!=0)
		{
			/*
			if(this.point<=6)//move anticlockwise
			{
				this.rotateY(Math.PI/6);
				this.point++;
			}
			else//move clockwise
			{
				this.rotateY(-Math.PI/6);
				this.point--;
			}
			*/
			this.rotateY(Math.PI/6);
			this.point++;
		}
		else if(this.movingRight && this.point!=3)
		{
			/*
			if(this.point<=9 && this.point>3)//move anticlockwise
			{
				this.rotateY(Math.PI/6);
				this.point++;
			}
			else//move clockwise
			{
				this.rotateY(-Math.PI/6);
				this.point--;
			}
			*/
			this.rotateY(Math.PI/6);
			this.point++;
		}
		else if(this.movingForward && this.point!=6)
		{
			/*if(this.point<=12 && this.point>6)//move anticlockwise
			{
				this.rotateY(Math.PI/6);
				this.point++;
			}
			else//move clockwise
			{
				this.rotateY(-Math.PI/6);
				this.point--;
			}*/
			this.rotateY(Math.PI/6);
			this.point++;
		}
		else if(this.movingLeft && this.point!=9)
		{
			/*if(this.point<=3 || (this.point<=12 && this.point>9))//move anticlockwise
			{
				this.rotateY(Math.PI/6);
				this.point++;
			}
			else//move clockwise
			{
				this.rotateY(-Math.PI/6);
				this.point--;
			}
			*/
			this.rotateY(Math.PI/6);
			this.point++;
		}
		
	
	}
	/*
	tween(dir,no)
	{
		this.tweeningTotal=no;
		this.tweeningDir=dir;
		this.tweening=true;
		if(dir)//clockwise
		{
			if(this.tweeningAmount==no)
			{
				this.tweening=false;
				this.tweeningAmount=0;
			}
			else
			{
				this.tweeningAmount++;
				this.rotateY(Math.PI/6);
			}
		}
		else //counter clockwise
		{
			if(this.tweeningAmount==no)
			{
				this.tweening=false;
				this.tweeningAmount=0;
			}
			else
			{
				this.tweeningAmount++;
				this.rotateY(-Math.PI/6);
			}
		}
	*/	
		
		/*
		var tweeningAmount=6;
		this.tweening=true;
		this.tweeningStart=start;
		this.tweeningEnd=end;
		if(this.rotation.y==end)
		{
			this.tweening=false;
		}
		if(this.tweening)
		{
			if(this.tweeningStart>this.tweeningEnd)
			{
				//anticlockwise
				this.rotateY(-(Math.PI)/tweeningAmount);
			}
			else
			{
				//clockwise
				this.rotateY((Math.PI)/tweeningAmount);
								
			}
		}
		*/
	//}
	
	clear ()
	{
		this.score = 0;
		this.highscore = 0;
		this.lives = 3;
		this.vAngle = 0;
		this.myFrame = 0;
		this.rotationY = 0;
		this.futureDir = "null";
		this.jumping = false;
		this.jumpingSpeed = 0.75;
		this.ySpeed = 0.5;
		this.yAccelerataion = 0;
		this.canJump = false;
		this.movingLeft = false;
		this.movingRight = false;
		this.movingForward = false;
		this.movingBackward = false;
	}//called when your lives are over, you wanna play again. Clears all info on last game prretty much

	inSpawn (no)
	{
		if (no == 1)
		{
			if (this.position.z > 3 && this.position.z < 20 && this.position.x >= 12 && this.position.x <= 16)
			{
				return true;
			}//this means u in the spawn, u gotta go up homie
			else
			{
				return false;
			}
		}//If for level 1
		else if (no == 2)
		{
			if (this.position.z > 3 && this.position.z < 20 && this.position.x >= 12 && this.position.x <= 16)
			{
				return true;
			}//this means u in the spawn, u gotta go up homie
			else
			{
				return false;
			}
		}//level 2 spawn
		else if (no == 3)
		{
			if (this.position.z > 3 && this.position.z < 20 && this.position.x >= 12 && this.position.x <= 16)
			{
				return true;
			}//this means u in the spawn, u gotta go up homie
			else
			{
				return false;
			}
		}//level 2 spawn
		
		
		
	}//checks if ghost is in spawing block, prioritize going up if so
}