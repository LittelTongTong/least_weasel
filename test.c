#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"lib/tool.h"
int test(void * point,int size)
{
    point= malloc(size);
    memset(point,0,size);
    return 0;
}
int test3(void *a )
{
    char * b;
    b=(char *)a;
    *b='a';
    printf("a=%c\n",*((char *)a));
    return 1 ;
}
int main(){
    char * a=malloc(1);
    char b[4]={'a','b','c','d'};
    int j=0;
    
    for (int  i = 0; i < 100; i++)
    {
        j=BBB(&a,j,b,4);
        printf("%d %s\n",i,a);
    }
    printf("%s",a);
}