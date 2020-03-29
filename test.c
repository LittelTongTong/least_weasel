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
    char a[3]={'1','2','3'};
    char *b;
    b=malloc(1);
    *b='a';
    BBB(b,1,a,3);
    char * char_a;
    int * int_a;
    printf("char*: %lu ,int *:%lu\n",sizeof(char_a),sizeof(int_a));
    printf("%s",b);
}