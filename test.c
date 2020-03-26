#include<stdio.h>
#include<stdlib.h>
#include<string.h>
int test(void * point,int size)
{
    point= malloc(size);
    memset(point,0,size);
    return 0;
}
int test2()
{
    int i=1;
    switch (i)
    {
    case 1:
       printf("1");
    }
    return 0 ;
}
int main(){
    char *a; 
    a=(char*) malloc(2);
    for (size_t i = 1; i < 10000; i++)
    {
        a=(char *)realloc(a,i);
        strcat(a,"a");
        printf("%s\n",a);
    }
    
    
    return 0 ;
}