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

float end() //stop timmer and return  runtime
{
	end_t=clock();
	return timer();
}

int P_E(int en, char * msg)//handle error function and print the error massage
{
	if (en!=0)//failure
	{
		errno=en;
		printf("errno:%d",errno);
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