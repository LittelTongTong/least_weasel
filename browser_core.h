#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<string.h>
#include<sys/socket.h>
#include<netdb.h>
#include<arpa/inet.h>
#include<unistd.h>
#ifndef LeastWeasel
#define B_BUF 3072
#define HTTP 1 
#define HTTPS 2
#endif
char PNG_EOF[]={0x60,0x82};//PNG EOF 
char H_EOF[]={'\r','\n','\r','\n'};//header EOF
//website socket information 
struct w_s_d
{
    char * website;
    struct addrinfo * website_addrinfo;
};
//Find the customized EOF in BUFF    
void S_P(int port,struct w_s_d web_sock_info)
{

}
int FTCE(void * data,size_t s_data,void * F_EOF,size_t s_F_EOF)
{
    for (size_t i = 0; i < s_data-s_F_EOF; i++)
    {
        if ((memcmp(data+i,F_EOF,s_F_EOF))==0)
        {
            return i+s_F_EOF;
        }
        
    }
    return -1;
}
//Be a file without header 
int BFWH(void * data,size_t s_data,char *name)
{
    
    int p=FTCE(data,s_data, H_EOF, 4);
    FILE *header =fopen("header.txt","w");
    if (header==NULL)
    {
        perror("failed to create header file");
        exit(-1);
    }
    fwrite(data,p,1,header);
    fclose(header);
    FILE *contents =fopen(name,"w");
    if (contents==NULL)
    {
        perror("failed to create content file");
        exit(-1);
    }
    fwrite(data+p,s_data-p,1,contents);
    fclose(contents);
    printf(" %s download successfully",name);
    return 0 ;
}
//split URI
int S_URI(char *uri)
{
    return 0;
}
//convert  addrinfo  to readable ip and print 
char * AI_2_RI(struct addrinfo* info)
{ 
    char * string=NULL; 
    if ((info->ai_family)==AF_INET)
    {
        struct sockaddr_in * ip4_socket_addr=(struct sockaddr_in * )(info->ai_addr);
        inet_ntop(AF_INET,&(ip4_socket_addr->sin_addr),string,ip4_socket_addr->sin_len);
    }
    if ((info->ai_family)==AF_INET6)
    {
        struct sockaddr_in6 * ip6_socket_addr=(struct sockaddr_in6 * )(info->ai_addr);
        inet_ntop(AF_INET6,&(ip6_socket_addr->sin6_addr),string,ip6_socket_addr->sin6_len);
    }
    printf("canonneme:%s 's ip:%s\n",info->ai_canonname,string);
    return string;
}
//DNS服务
int DNS(char *website ,struct w_s_d * web_socket_data)//网址
{
    struct addrinfo hint;
    struct addrinfo *res0;
    memset(&hint,0,sizeof(struct addrinfo));
    hint.ai_family=AF_UNSPEC;
    hint.ai_socktype=SOCK_STREAM;
    P_E(getaddrinfo(website,NULL,&hint,&res0),"getaddinfo");
    printf("|%s| done\n",website);
    web_socket_data->website=website;
    web_socket_data->website_addrinfo=res0;
    return 0;
}
//连接到网站服务器
int C2W(struct w_s_d * web_socket_data,int scheme,char *sdata,int s_size)// C2W(websit server sock info
{
    int sfd,s_n,r_n=0;//socket filedescription
    int d = web_socket_data->website_addrinfo->ai_family;//socket domain 
    int t = web_socket_data->website_addrinfo->ai_socktype;//socket type 
    int p = web_socket_data->website_addrinfo->ai_protocol;//socket protocol 
    size_t len =web_socket_data->website_addrinfo->ai_addr->sa_len;
    char rbuff[B_BUF],*rdata;
    int nbuff=0;
    memset(rbuff,0,B_BUF);
    rdata=(char*)malloc(B_BUF);
    struct  sockaddr * loacl_host;
    if ((sfd = socket(d,t,p)))
    {
        printf("connect to |%s|\n",web_socket_data->website);
        //此处应该增加 ip 连接时则切换 if(web_socker_data->next!=NULL then (web_socker_data=web_socker_data->next)->website_addrinfo->ai_addr)
        switch (scheme)
        {
        case HTTP:
            if ((connect(sfd, web_socket_data->website_addrinfo->ai_addr,len)==-1))
            {
                perror("connect()");
            }
            else
            {
                printf("connect successfully\n");
                if ((send(sfd,sdata,s_size,0)==-1))
                {
                    perror("send()");
                }
                else
                {
                    printf("\n>>>successfully send a request<<<\n%s\n>>>end<<<\n\n",sdata);
                }
                char *eob_p;//end of buff;
                while ((r_n=recv(sfd,rbuff,B_BUF,MSG_EOF))!=-1)
                {
                    BBB(&rdata,nbuff,rbuff,B_BUF);
                    nbuff+=r_n;
                    //detect EOF
                    eob_p=rbuff+r_n-2;
                    //printf("r_n:%d\n",r_n);
                    if((memcmp(eob_p,PNG_EOF,2))==0)//PNG
                    {
                        char NWE[BUFSIZ];//name with extension 
                        sprintf(NWE,"%s.png",web_socket_data->website);
                        BFWH(rdata,nbuff,NWE);
                        break;
                    }
                    if (r_n==0)//plain text 
                    {
                        char NWE[BUFSIZ];
                        sprintf(NWE,"%s",web_socket_data->website);
                        BFWH(rdata,nbuff,NWE);
                        break;
                    }
                    memset(rbuff,0,B_BUF);
                }
                if (r_n==-1)
                {
                    perror("recv()");
                }
            }
            break;
        case HTTPS: //HTTPS

            break;
        }
    }
    else
    {
        perror("socket()");
    }
    close(sfd);
    return 0 ; 
}
