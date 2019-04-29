class GetShortestPath
{
	constructor(data,start,rows=50,columns=50)
	{
		this.data=data;
		this.visited =[];
		for(var i=0;i<50;i++)
		{
			this.visited[i]=[];
		}
		this.m_parents=[];
		for(var i=0;i<1000;i++)
		{
			this.m_parents=[];
		}
		this.goal=new Pair(-1,-1);
		this.start=new Pair(-1,-1);
		this.rows=rows;
		this.nextMove = new Pair(0,0);
		this.count = 0;
		this.columns=columns;
	
	}
	setParent(coord,parent) //  adds a parent node to a matrix m_parents
    {
		this.m_parents[coord.x][coord.y] = parent;
    }
	

	isValid (data ,temp) // variety of checks to see if a node is appropriate or not 
    {
		if ( ( temp.x >= 0 && temp.x < this.rows ) &&  ( temp.y >= 0 && temp.y < this.columns))
		{
			return data[temp.x][temp.y] == 0 || data[temp.x][temp.y] == 6;
		}
		return false;
		
    }
    
	
	BFS(data)
	{
		var curr = new Pair(-1,-1);
		var temp = new Pair(-1,-1);
		var x = new Pair(-1,-1);
		var y = new Pair(-1,-1);
		var q = new Queue();
		// queue will be storing a pair , every time you want to add a new Pair to the queue you need to initialize a new pair object.
		var count = 0 ;
		
		this.reset();
		q.Push_back(this.start); // begins by adding start to the top of the queue
		this.visited[this.start.x][this.start.y] = 1;
		while ( ( !q.empty() ) && ( !this.contains(goal )  ) )
		{
			curr = q.peek(); // sets curr to the value on top of the queue.
			q.Pop_back(); // removes the value at the front of the queue.
			
			temp = curr.up();
			if (!this.contains(temp ) && this.isValid(data , temp)) //  check if the the node being acsessed is a wall or out of bounds, as well if  has been acsessed before
			{
				x = new Pair(curr.x,curr.y); // x and y have to be initialized every time you want to add a pair to the queue or the parent array.
				y = new Pair(temp.x,temp.y); //  x is parent node of y .
				this.setParent(y,x); //  add x to the parent array at position y.
				q.Push_back(y);
				this.visited[temp.x][temp.y] = 1; // add y to the visisted array so that it wont be acsessed again.
				count++;
			}
			
			temp = curr.down();
			if (!this.contains(temp ) && this.isValid(data , temp)) // repeats the process for every possible surrounding "child node  of the parent  node
			{
				x = new Pair(curr.x,curr.y);
				y = new Pair(temp.x,temp.y);
				this.setParent(y,x);
				q.Push_back(y);
				this.visited[temp.x][temp.y] = 1;
				count++;
			}
			
			temp = curr.left();
			if (!this.contains(temp ) && this.isValid(data , temp))
			{
				x = new Pair(curr.x,curr.y);
				y = new Pair(temp.x,temp.y);
				this.setParent(y,x);
				q.Push_back(y);
				this.visited[temp.x][temp.y] = 1;
				count++;
			}
			
			temp  = curr.right();
			if ( !this.contains(temp ) && this.isValid(data , temp))
			{
				x = new Pair(curr.x,curr.y);
				y = new Pair(temp.x,temp.y);
				this.setParent(y,x);
				q.Push_back(y);
				this.visited[temp.x][temp.y] = 1;
				count++;
			}
			
					
			
		}

		if (!this.contains(this.goal)) // makes sure that the goal node was actaually found , if not there is no solution to the maze.
		{
			return 0 ;
		}
		else 
		{
		    return 1;
		}

	}
	
	
	
	contains(temp) // over loads the contain method to check if a node has been acsessed yet.
	{
	    if (temp.x >= 0  && temp.x < this.rows && temp.y>=0 && temp.y<this.columns )
		{
			if (this.visited[temp.x][temp.y] == 1)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
	
	getPath(goal)
	{
		this.goal = goal;
		
		if (this.BFS(this.data) == 1)
		{
		    temp = new Pair(goal.x,goal.y);
		    temp2 = new Pair(0,0);
		    while (!temp.equals(this.start)) // after the BFS() the algorithm will follow  the parent array back to the start , this will be the shortest distance.
		    {
			    //data[temp.x][temp.y] =0;
			    temp2 = this.m_parents[temp.x][temp.y];
			    if (temp2.equals(this.start))
			    {
					this.nextMove =  temp;
			    }
			    temp = this.m_parents[temp.x][temp.y];
			    this.count ++;
		    }
		    return true;
		}
		else
		{
		    return false;
		}
	}

	reset()
	{
	    for(var k  = 0 ;  k < this.rows; k++) {
			for (var c = 0 ; c < this.columns; c++){
				this.visited[k][c] = 0 ;
			}
	    }
	    
	}



}
