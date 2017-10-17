//10-17两个待解决bug
//Line192
//Line201

var TIMES=4;
var timeSum=0;
var restValue,availValue;
var sequence=new Array();
var rssequence = new Array();  //先声明一维
var totalNum=0;
var y=0;
for(var k=0;k<1000;k++)
{    //一维长度为i,i为变量，可以根据实际情况改变
	rssequence[k]=new Array();  //声明二维，每一个一维数组里面的一个元素都是一个数组；	
	for(var j=0;j<TIMES;j++)
	{   //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；	
		rssequence[k][j]=-1;    //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值
	}
}

for(i=0;i<TIMES;i++)
{
	sequence[i]=-1;
}


function getNum()
{
	var wf=new Array();
	//var obj=new Workflow(parseInt(document.getElementById('obj11').value),parseInt(document.getElementById('obj12').value),parseInt(document.getElementById('obj13').value),parseInt(document.getElementById('obj14').value)); 
	var obj=new Workflow(1,4,10,2);
	wf[0]=obj;
	//var obj=new Workflow(parseInt(document.getElementById('obj21').value),parseInt(document.getElementById('obj22').value),parseInt(document.getElementById('obj23').value),parseInt(document.getElementById('obj24').value)); 
	var obj=new Workflow(2,3,8,3);
	wf[1]=obj;
	//var obj=new Workflow(parseInt(document.getElementById('obj31').value),parseInt(document.getElementById('obj32').value),parseInt(document.getElementById('obj33').value),parseInt(document.getElementById('obj34').value)); 
	var obj=new Workflow(3,2,4,3);
	wf[2]=obj;
	//var obj=new Workflow(parseInt(document.getElementById('obj41').value),parseInt(document.getElementById('obj42').value),parseInt(document.getElementById('obj43').value),parseInt(document.getElementById('obj44').value)); 
	var obj=new Workflow(4,1,2,6);
	wf[3]=obj;
	//for(var i=0;i<4;i++)
	//document.write(wf[i].cost+"\n");
	return wf;	
}

function Workflow(id,cost,deadline,value)
{
this.id=id;
this.cost=cost;
this.deadline=deadline;
this.value=value;
}

//number of jobs


function minValue(a,b)
{
	if(a>b)
	return b;
	else
	return a;
}

function jobSequencingWithDeadline(wf)
{
	for(i=1;i<TIMES;i++)
	{
		for(k=0;k<TIMES-i;k++)
		if(wf[k].deadline>wf[k+1].deadline)		
			swop(wf[k],wf[k+1]);		
	}

}

function swop(a,b)
{
	var temp_id,temp_cost,temp_deadline,temp_value;
	temp_id=a.id;
	temp_cost=a.cost;
	temp_deadline=a.deadline;
	temp_value=a.value;
	a.id=b.id;
	a.cost=b.cost;
	a.deadline=b.deadline;
	a.value=b.value;
	b.id=temp_id;
	b.cost=temp_cost;
	b.deadline=temp_deadline;
	b.value=temp_value;

}

function sumValue(wf)
{
	var rs=0;
	for(i=0;i<TIMES;i++)
	{
		rs=rs+wf[i].value;
	}
	return rs;
}

function sumRest(wf,sequence,timeSum)
{
	var rs1=0;
	var m;

	for(var i=0;i<TIMES;i++)
	{
		for(var m=0;m<TIMES;m++)
		{
			if(wf[i].id==sequence[m])
			break;								
		}
		if(m!=TIMES)
		continue;
		else
		{
			if(wf[i].deadline>(timeSum+wf[i].cost)||wf[i].deadline==(timeSum+wf[i].cost))
			rs1=rs1+wf[i].value;
		}
	}
	return rs1;
}

function addIn(sequence,rssequence,totalNum)
{
	for(var i=0;i<TIMES;i++)
	{
		rssequence[totalNum][i]=sequence[i];
	}
	return totalNum+1;
}

function findTheBest(rssequence,totalNum)
{
	var bestId;
	var totalValue=0;
	var maxValue=0;
	for(var k=0;k<totalNum;k++)
	{    
		
		for(var j=0;j<TIMES;j++)
		{
			totalValue=totalValue+rssequence[k][j]
		}
		if(totalValue>maxValue)
		maxValue=totalValue;
		bestId=k;
	}
	document.write("The best work sequence is:");
	for(var i=0;i<TIMES;i++)
	{
		if(rssequence[bestId][i]==-1)
		{
			break;
		}
		else
		{
			if(i<TIMES-1)
			document.write("J"+rssequence[bestId][i]+"-->");
			else
			document.write("J"+rssequence[bestId][i]);
		}
		
	}


}

function timeCost(sequence,wf)
{
	var results=0;
	for(var i=0;i<TIMES;i++)
	{
		for(var m=0;m<TIMES;m++)
		{
			if(sequence[i]==wf[m].id)
				results=results+wf[m].cost;
		}
	}
	return results;
}


function jobSequencing(wf,timeSum,restValue,availValue,sequence,y)
{
	var x;

	jobSequencingWithDeadline(wf);

	for(x=0;x<TIMES;x++)
	{
		if(sequence[x]!=-1)
		continue;
		for(;y<TIMES;y++)
		{

			//这里还是有问题，如何调整递归之后避免走之前走过的路线
			if(wf[y].id==sequence[0]||wf[y].id==sequence[1]||wf[y].id==sequence[2]||wf[y].id==sequence[3])
			continue;
			if(totalNum>0&&wf[y].id==rssequence[totalNum-1][x])
			continue;			
			sequence[x]=wf[y].id;
			timeSum=timeCost(sequence,wf);
			restValue=restValue-wf[y].value;
			availValue=sumRest(wf,sequence,timeSum);
			if(availValue!=0)
			break;
			// if(availValue==0&&sequence[TIMES-1]==-1)
			// {
			// 	//addIn函数似乎工作不能正常，出现第二个可行序列时将第一序列覆盖了，可能是totalNum的问题？
			// 	totalNum=addIn(sequence,rssequence,totalNum);
			// 	sequence[x]=-1;
			// 	timeSum=timeSum-wf[y].cost;
			// 	jobSequencing(wf,timeSum,restValue+wf[y].value,availValue,sequence,y);
			// }
			if(availValue==0&&sequence[TIMES-1]!=-1)
			{
				totalNum=addIn(sequence,rssequence,totalNum);
				sequence[x]=-1;
				sequence[x-1]=-1;
				timeSum=timeSum-wf[y].cost-wf[y-1].cost;
				jobSequencing(wf,timeSum,restValue+wf[y].value,availValue,sequence,y);
			}

			// else
			// {
			// 	break;
			// }
				
		}y=0;
		
	}

	
	findTheBest(rssequence,totalNum);

}