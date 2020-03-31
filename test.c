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
    char b[18]="d<>/\n\rj做ai";
    for (int i = 0; i < 18; i++)
    {
        printf("%c",b[i]);
    }
    FILE *in= fopen("1","w");
    for (int i = 0; i < 18; i++)
    {
        fputc(b[i],in);
    }
    
}