#include<stdio.h>
#include"lib/tool.h"
#include"browser_core.h"
#include<sys/socket.h>
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
        if ((in=fopen("template/request","rb"))==NULL) // request list 替代
        {
            P_E(errno,"open request.txt");
        }
        fseek(in,0,SEEK_END);
        f_s=ftell(in);
        printf("size_%d,%lu\n",f_s,sizeof(char)*f_s);
        rewind(in);
        sdata = malloc(sizeof(char)*f_s+3);
        memset(sdata,0,sizeof(char)*f_s+3);
        fread(sdata,sizeof(char)*f_s,1,in);
        sdata[f_s]='\n';
        sdata[f_s+1]='\r';
        sdata[f_s+2]='\n';
        fclose(in);
        char * sdata2=\
        "\
GET /assortment/stock/list/info/company/index.shtml?COMPANY_CODE=600989 HTTP/1.1\r\n\
Host: www.sse.com.cn\r\n\
Connection: keep-alive\r\n\
Cache-Control:\r\n\
Upgrade-Insecure-Requests: 1\r\n\
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8\r\n\
Accept-Encoding: deflate\r\n\
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\n\
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36\r\n\
\r\n";  
        printf("time:%ld",time(NULL));
        clock_t star= clock();
        C2Ws(&web_s_data[i],sdata2,strlen(sdata2));
        printf("runtime:%f",difftime(clock(),star)/ CLOCKS_PER_SEC );
        printf("time:%ld",time(NULL));
        
    }
    return 0;

}