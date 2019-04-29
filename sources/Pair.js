class Pair
{
	constructor(x,y)
	{
		
		this.x=x;
		this.y=y;
		
	
	
	
	}

	equals(p)
	{
		return this.x==p.x && this.y==p.y;
	}


	up()
	{
		return new Pair(this.x+1,this.y);
	}
	
	down()
	{
		return new Pair(this.x-1,this.y);
	}
	
	left()
	{
		return new Pair(this.x,this.y-1);
	}
	
	right()
	{
		return new Pair(this.x,this.y+1);
	}




}
