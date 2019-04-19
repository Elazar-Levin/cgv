
class Character extends THREE.Object3D
{
	
	constructor (speed, x, y, z, transform, animations,obstructions,food=null,powerPellets=null)
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
		this.obstructions=obstructions;
		this.add (transform);
		this.movingLeft = false;
		this.movingRight = false;
		this.movingForward = false;
		this.movingBackward = false;
		//this.movingDown=false;
		this.myFrame = 0;
		this.rotationY=0;
		this.food=food;
		this.futureDir="null";
		this.jumping=false;
		this.jumpingSpeed=0.75;
		this.ySpeed=0.3;
		this.yAccelerataion=0;
		this.canJump=false;
		this.powerPellets=powerPellets;
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
	setX(x)
	{
		this.position.x=x;
		this.x=x;
	}
	setY(y)
	{
		this.position.y=y;
		this.y=y;
	}
	setZ(z)
	{
		this.position.z=z;
		this.z=z;
	}
	getPos()
	{
		return new THREE.Vector3(this.x,this.y,this.z);
	}
	setPos(x,y,z)
	{
		this.x=x;
		this.y=y;
		this.z=z;
		this.position.set(x,y,z);
	}
	animate (frameNumber)
	{
		this.myFrame = frameNumber;
		for (var i = 0; i < this.transform.children.length; i++)
		{
			this.transform.children[i].geometry = this.animations [this.myFrame];
		}//For loop
	}
	doCollisions()//do the collisions for this object
	{
		
		//do downward collisons first, then do horizontal collisions, probably if/else
		var charSphere = new THREE.Sphere(this.getPos(),2);
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-1.9,this.y-1.9,this.z-1.9),new THREE.Vector3(this.x+1.9,this.y+1.9,this.z+1.9));
		var inAir=false;
		var highest=-Infinity;
		
	
		if(this.y>-2.5)//if in air
		{
			
			var collides=false;
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.y+=this.ySpeed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.y-=this.ySpeed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
					
					collides=true;
					obsBox.setFromObject(this.obstructions.children[i]);
					this.setY(this.y-this.distanceCubeCube(charCube,obsBox));
					break;		
				}
			}
			if(!collides)
			{
				this.setY(this.y-this.ySpeed);
				this.movingLeft=false;
				this.movingRight=false;
				this.movingForward=false;
				this.movingBackward=false;
				//this.ySpeed+=GRAVITY_CONSTANT;
			}
			else
			{
				//this.ySpeed=0;
				this.canJump=true;
			}
			
			
		}
		else
		{
			this.canJump=true;
			if(this.y<-2.5)
			{
				this.setY(-2.5);
			}
			
		}
	
		if(this.movingLeft)//do the left right forward backwards collisions for actual obstructions
		{
			var collides=false;
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.z+=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.z-=this.speed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
					collides=true;
					obsBox.setFromObject(this.obstructions.children[i]);
					this.setZ(this.z-this.distanceCubeCube(charCube,obsBox));
					break;		
				}	
			}	
			if(!collides)
			{
				this.setZ(this.z-this.speed);
			}
		}
		
		if(this.movingRight)
		{
			var collides=false;
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.z-=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.z+=this.speed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
					collides=true;
					obsBox.setFromObject(this.obstructions.children[i]);
					this.setZ(this.z+this.distanceCubeCube(charCube,obsBox));
				}	
			}	
			if(!collides)
			{
				this.setZ(this.z+this.speed);
			}
				
		}
		if(this.movingForward)
		{
			var collides=false;
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.x-=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.x+=this.speed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
					collides=true;
					obsBox.setFromObject(this.obstructions.children[i]);
					this.setX(this.x+this.distanceCubeCube(charCube,obsBox));
				}	
			}	
			if(!collides)
			{
				this.setX(this.x+this.speed);
			}
				
			
		}
		if(this.movingBackward)
		{
			var collides=false;
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.x+=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.x-=this.speed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
					collides=true;
					obsBox.setFromObject(this.obstructions.children[i]);
					this.setX(this.x-this.distanceCubeCube(charCube,obsBox));
				}	
			}	
			if(!collides)
			{
				this.setX(this.x-this.speed);
			}
		}
		//food collisions
		if(this.food!=null)
		{
			//sphere/point/food collisions, anything pacman eats is done here, anything paman crashes into is done before this loop
			for(var i=0;i<this.food.children.length;i++)
			{
				var foodPoint=this.food.children[i].position;
				if(this.SphereIntersect(charSphere,foodPoint))
				{
					this.food.remove(this.food.children[i]);
					score++;
					return;
				}
			}
			
			
		}
		if(this.powerPellets!=null)
		{
			for(var i=0;i<this.powerPellets.children.length;i++)
			{
				var pelletPoint=this.powerPellets.children[i].position;
				if(this.SphereIntersect(charSphere,pelletPoint))
				{
					this.powerPellets.remove(this.powerPellets.children[i]);
					powerPelletEaten=true;
					return;
				}
			}
		}
	}
	
	canMoveLeft()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-1.9,this.y-1.9,this.z-1.9),new THREE.Vector3(this.x+1.9,this.y+1.9,this.z+1.9));
		if (true) 
		{
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.z+=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.z-=this.speed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
					return false;	
				}	
			}
		}
		return true;
	}

	
	canMoveRight()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-1.9,this.y-1.9,this.z-1.9),new THREE.Vector3(this.x+1.9,this.y+1.9,this.z+1.9));
	
		if (true)
		{
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.z-=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.z+=this.speed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
				
					return false;
				}	
			}
		}
		return true;
	}
	
	canMoveForward()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-1.9,this.y-1.9,this.z-1.9),new THREE.Vector3(this.x+1.9,this.y+1.9,this.z+1.9));
		if (true) 
		{
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.x-=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.x+=this.speed;
				
				if(this.SquareIntersect(charCube,obsBox))
				{
					return false;
				}
			}	
		}
		return true;
	}
	
	canMoveBackward()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-1.9,this.y-1.9,this.z-1.9),new THREE.Vector3(this.x+1.9,this.y+1.9,this.z+1.9));
		
		if (true) 
		{
			for(var i=0;i<this.obstructions.children.length;i++)
			{
				this.obstructions.children[i].position.x+=this.speed;
				var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
				obsBox.setFromObject(this.obstructions.children[i]);
				this.obstructions.children[i].position.x-=this.speed;
				
				if (this.SquareIntersect(charCube,obsBox))
				{
					return false;
				}	
			}	
		}
		return true;
	}
	
	doJump()
	{
		if(this.canJump)
		{
			this.ySpeed-=15;
		}
	}
	
	setDirection ()
	{
		if (this.futureDir == "left")
		{
			if (this.canMoveLeft ())
			{
				this.rotation.y=-Math.PI/2;
				this.moveLeft();
			}
		}
		else if (this.futureDir == "right")
		{
			if (this.canMoveRight ())
			{
				this.rotation.y=Math.PI/2;
				this.moveRight();
			}
		}
		else if (this.futureDir == "up")
		{
			if (this.canMoveForward ())
			{
				this.rotation.y=Math.PI;
				this.moveForward();
			}
		}
		else if (this.futureDir == "down")
		{
			if (this.canMoveBackward ())
			{
				this.rotation.y = 0;
				this.moveBackward();
			}
		}
	}
	
	
	
	SphereIntersect(sphere, point) 
	{
		return sphere.containsPoint(point);
	}

	SquareIntersect(sphere,Cube)
	{
		return sphere.intersectsBox(Cube);
	}

	distanceCubeCube(cube1,cube2)
	{
		var center2=new THREE.Vector3();
		cube2.getCenter(center2);
		var closestPoint1=new THREE.Vector3();
		cube1.clampPoint( center2, closestPoint1 );
		return cube1.distanceToPoint(closestPoint1);

	}
	distanceSphereCube(sphere,cube)
	{
		var closestPoint=new THREE.Vector3();
		cube.clampPoint( sphere.center, closestPoint );
		return Math.sqrt(closestPoint.distanceToSquared( sphere.center )) - sphere.radius-0.1;//last number is offset, the space between the two shapes. the smaller this is, the more ofter unexpected collisions happen
					
	}
}
