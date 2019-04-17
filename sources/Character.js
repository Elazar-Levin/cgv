
class Character extends THREE.Object3D
{
	
	constructor (speed, x, y, z, transform, animations,obstructions,surfaces,food=null)
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
		this.surfaces=surfaces;
		this.futureDir="null";
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
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-2,this.y-2,this.z-2),new THREE.Vector3(this.x+2,this.y+2,this.z+2));
		var inAir=false;
		var highest=-Infinity;
		for(var i =0;i<this.surfaces.children.length;i++)
		{
			var obsBox= new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
			obsBox.setFromObject(this.surfaces.children[i]);
			if(this.position.y-PAC_RADIUS-0.001>=this.surfaces.children[i].position.y)// && !this.SquareIntersect(charSphere,obsBox))
			{
				if(this.surfaces.children[i].position.y>=highest)
				{
					inAir=true;
					highest=this.surfaces.children[i].position.y;
				}
			}
		}
		if(inAir && this.position.y-PAC_RADIUS-0.001>highest)
		{
			this.setY(this.position.y-VETICAL_VELOCITY);
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
					this.setZ(this.z-this.distanceSphereCube(charSphere,obsBox));
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
					this.setZ(this.z+this.distanceSphereCube(charSphere,obsBox));
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
					this.setX(this.x+this.distanceSphereCube(charSphere,obsBox));
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
					this.setX(this.x-this.distanceSphereCube(charSphere,obsBox));
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
					return;
				}
			}
		}
	}
	
	canMoveLeft()
	{
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-2,this.y-2,this.z-2),new THREE.Vector3(this.x+2,this.y+2,this.z+2));
		
		
		/*if (this.movingLeft)
		{
			return true;
		}*/
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
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-2,this.y-2,this.z-2),new THREE.Vector3(this.x+2,this.y+2,this.z+2));
	
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
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-2,this.y-2,this.z-2),new THREE.Vector3(this.x+2,this.y+2,this.z+2));
		//if(this.movingForward)
		/*{
			return true;
		}*/
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
		var charCube = new THREE.Box3 (new THREE.Vector3(this.x-2,this.y-2,this.z-2),new THREE.Vector3(this.x+2,this.y+2,this.z+2));
		
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
	
	setDirection ()
	{
		if (this.futureDir == "left")
		{
			if (this.canMoveLeft ())
			{
				this.moveLeft();
			}
		}
		else if (this.futureDir == "right")
		{
			if (this.canMoveRight ())
			{
				this.moveRight();
			}
		}
		else if (this.futureDir == "up")
		{
			if (this.canMoveForward ())
			{
				this.moveForward();
			}
		}
		else if (this.futureDir == "down")
		{
			if (this.canMoveBackward ())
			{
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
	CubeIntersectsCube(cube1,cube2)
	{
		
	}
	distanceCubeCube(cube1,cube2)
	{
		//var center2=new THREE.Vector3();
		//cube2.getCenter();
		var center1=new THREE.Vector3();
		cube1.getCenter(center1);
		var center2=new THREE.Vector3();
		cube2.getCenter(center2);
		var closestPoint1=new THREE.Vector3();
		cube1.clampPoint( center2, closestPoint1 );
		var closestPoint2=new THREE.Vector3();
		cube2.clampPoint( center1, closestPoint2 );
		return Math.sqrt(closestPoint1.distanceToSquared( closestPoint2 ));
		
		//var min1= new Vector3();
		//return Math.abs(cub31.min.x <= cube2.min.x && box.max.x <= this.max.x &&
		//this.min.y <= box.min.y && box.max.y <= this.max.y &&
		//this.min.z <= box.min.z && box.max.z <= this.max.z;
		//0.1
	
	}
	distanceSphereCube(sphere,cube)
	{
		var closestPoint=new THREE.Vector3();
		cube.clampPoint( sphere.center, closestPoint );
		return Math.sqrt(closestPoint.distanceToSquared( sphere.center )) - sphere.radius-0.1;//last number is offset, the space between the two shapes. the smaller this is, the more ofter unexpected collisions happen
					
	}
}
