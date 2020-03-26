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
    int a[13];
    if ((int) a==(int) &a)
    {
        printf("=\n");
    }
    
    return 0 ;
}