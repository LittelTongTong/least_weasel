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
	printf("runtime:%f\n",i );
	star_t=0;
	end_t=0;
	return  i;
}
void star() //star timmer
{
	star_t=clock();
}

float end() //stop timmer and return runtime
{
	end_t=clock();
	return timer();
}

int P_E(int en, char * msg)//handle error function and print the error massage
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
int P_S_l( int j ,  char list[100][64])//print string list content 
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

int BBB(char **dest,int sz,char *sour,int s_sz)//buffer by buffer and return size of buff_dest (Buff_dest[i+j]=Buff_dest[i]+Buff_sour[j])
{
	char *temp; 
	if((temp=realloc(*dest,sz+s_sz))==NULL)
	{
		perror("realloc");
	}
	*dest=temp;
	for (size_t i = 0; i < s_sz; i++)
	{
		*((*dest)+i+sz) =*(sour+i);
		//printf("%c",*(sour+i));
	}
	return sz+s_sz ;
}