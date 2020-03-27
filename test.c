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
    char *a,*b;
    a=malloc(3);
    b=malloc(3);
    char arr1[3]={'a','b','\n'};
    a=arr1;
    for (size_t i = 0; i < 10; i++)
    {
       P_Ap(b,i*3,a,3);
    }
    

    printf("b[]=%s",b);
    return 0 ;
}