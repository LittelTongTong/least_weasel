#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"lib/tool.h"
#include"browser_core.h"
void it()
{
    printf("hello\n");
}
struct in {
    int s ;
    int d ;
    void (* fun)();
};
int BFWH_t(void * data,size_t s_data,void * F_EOF,size_t s_F_EOF)//Be a file without header 
{
    int p=FTCE(data,s_data, F_EOF, s_F_EOF);
    FILE *in =fopen("test.png","w");
    fwrite(data+p,s_data-p+1,1,in);
    fclose(in);
    return 0 ;
}
int main ()
{
    char buff[11686];
    memset(buff,0,11686);
    FILE *in =fopen("web/www.sse.com.cn.html","r");
    fread(buff,11686,1,in);
    fclose(in);
    BFWH_t(buff,11686,N_EOF,4);
    
}