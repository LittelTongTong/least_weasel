#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <time.h>
#include <string.h>
time_t star_t,end_t;
float timer()
{
	float i=difftime(end_t,star_t);
	printf("runtime:%f\n",i/CLOCKS_PER_SEC);
	star_t=0;
	end_t=0;
	return  i;
}
//star timmer
void star() 
{
	star_t=clock();
}

 //stop timmer and return runtime
float end()
{
	end_t=clock();
	return timer();
}
//handle error function and print the error massage
int P_E(int en, char * msg)
{
	if (en!=0)//failure
	{
		errno=en;
		//printf("errno:%d",errno);
		perror(msg);
		exit(en);
	}
	else//success
	{
		return 1;
	}

}
//print string list content 
int P_S_l( int j ,  char list[100][64])
{
	for (int i = 0; i < j; i++)
	{
		printf("[%d]=%s\n",i,list[i]);
	}
	
	return 0;
}
int PL( int j ,  char *list)//print string list content 
{
	for (int i = 0; i < j; i++)
	{
		printf("[%d]=%s\n",i,list+i);
	}
	return 0;
}
//buffer by buffer and return size of buff_dest (Buff_dest[i+j]=Buff_dest[i]+Buff_sour[j])

int BBB( char **dest,int sz,char *sour,int s_sz)
{
	char *temp; 
	if((temp=realloc(*dest,sz+s_sz))==NULL)
	{
		perror("realloc");
	}
	*dest=temp;
	for (size_t i = 0; i < s_sz; i++)
	{
		*(temp+i+sz) =*(sour+i);
		//printf("%c",*(sour+i));
	}
	return sz+s_sz ;
}