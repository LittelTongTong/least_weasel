#include<stdio.h>
#include"lib/tool.h"
#include"browser_core.h"
#include<sys/socket.h>
#include"browser.h"
int main()
{
    char s[100];
    //website的socket特性
    struct w_s_d  web_s_data [M_N_W];
    memset(web_s_data,0,sizeof(struct w_s_d)*M_N_W);
    char weblist [M_N_W] [64];
    memset(weblist,0,sizeof(weblist));
    unsigned int n_web; //number of website in website.txt 
    FILE * p_website;
    //把website.txt读入内存
    printf(">>>读入网址<<<\n");
    if((p_website=fopen("website/website.txt","r"))==NULL)
    {
        P_E(-1,"Error:openfile\n");
    }
    while (1)
    {
        char c ; 
        static int row=0 ,column=0;
        
        c=fgetc(p_website);
        if (c=='\n'&& column!=0)
        {
            row++;
            column=0;
        }
        else if (feof(p_website))
        {
            if(weblist[0]!=NULL)
            {
                n_web=row+1;
            }
            else
            {
                n_web=0;
                P_E(-1,"no website input");
            }
            break;
        }
        else
        {
            weblist[row][column++]=c;
        }
    }
    fclose(p_website);
    P_S_l(n_web,weblist);
    printf("|**读入%d个网址**|\n",n_web);
    //以上代码不符合规范，后期修改
    printf(">>>end<<<\n\n");

    //DNS 服务
    printf(">>>DNS<<<\n");
    for (int i = 0; i < n_web; i++)
    {
       DNS(weblist[i],&web_s_data[i]);
       //AI_2_RI(web_s_data[i].website_addrinfo,s);
    }
    printf(">>>end<<<\n\n");

    //建立与服务器连接并传输（接收）数据
    printf(">>connect website server<<\n");
    char * sdata;
    FILE * in;
    int f_s;
    for (int  i = 0; i < n_web; i++)
    { 
        char request_header[4096];
        char URI[1024]="/assortment/stock/list/info/company/index.shtml?COMPANY_CODE=600989";
        memset(request_header,0,4096);
        sprintf(request_header,"GET %s HTTP/1.1\r\nHost: %s\r\n",URI,weblist[i]);
        strcat(request_header,tail);
        C2Ws(&web_s_data[i],request_header,4096);
    }
    return 0;

}