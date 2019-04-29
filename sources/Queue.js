class Queue
{
	constructor()
	{
		this.data = [];
	}
	
	Push_back(record) 
	{
		this.data.unshift(record);
	}
	Pop_back()
	{
		this.data.pop();
	}
	
	first()
	{
		return this.data[0];
	}
	peek() 
	{
		return this.data[this.data.length - 1];
	}
	size()
	{
		return this.data.length;
	}
	empty()
	{
		return this.data.length==0;
	}
}