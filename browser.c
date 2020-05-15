#include<stdio.h>
#include"lib/tool.h"
#include"browser_core.h"
#include<sys/socket.h>
#include"browser.h"
#include<openssl/bio.h>
int main()
{
    int scheme=HTTPS;
    char HOST[1024] ="www.bilibili.com";
    struct w_s_d  web_s_data;
    memset(&web_s_data,0,sizeof(struct w_s_d));
    //DNS 
    printf(">>>DNS<<<\n");
    DNS(HOST,&web_s_data);
    //AI_2_RI(web_s_data.website_addrinfo);
    printf(">>>end<<<\n\n");
    //设置通信端口
    switch (scheme)
    {
    case HTTP:
            switch (web_s_data.website_addrinfo->ai_family)
            {
            case AF_INET:
            ((struct sockaddr_in*)(web_s_data.website_addrinfo->ai_addr))->sin_port=htons(80);
            break;
            case AF_INET6:
            ((struct sockaddr_in6*)(web_s_data.website_addrinfo->ai_addr))->sin6_port=htons(80);
            break;
            }
        break;
    case HTTPS:
            switch (web_s_data.website_addrinfo->ai_family)
            {
            case AF_INET:
            ((struct sockaddr_in*)(web_s_data.website_addrinfo->ai_addr))->sin_port=htons(443);
            break;
            case AF_INET6:
            ((struct sockaddr_in6*)(web_s_data.website_addrinfo->ai_addr))->sin6_port=htons(443);
            break;
            }
        break;
    }
    //设置Request Headers
    char R_H[1024*8];//Request_Headers
    char P_Q[1024]="/";//path and query 
    memset(R_H,0,sizeof(R_H));
    sprintf(R_H,"GET %s HTTP/1.1\r\nHost: %s\r\n",P_Q,HOST);
    strcat(R_H,tail);
    //建立与服务器连接并传输（接收）数据
    printf(">>connect website server<<\n"); 
    C2W(&web_s_data,HTTP,R_H,sizeof(R_H));
    BIO_s_fd();
    return 0;
}