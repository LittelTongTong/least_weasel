#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<string.h>
#include<sys/socket.h>
#include<netdb.h>
#include<arpa/inet.h>
#include<unistd.h>
#define M_N_W 100 
#define N_BUFSIZ 1024
//website socket information 
struct w_s_d
{
    char * website;
    struct addrinfo * website_addrinfo;
};
//convert  addrinfo  to readable ip and print 
int AI_2_RI(struct addrinfo* info,char *string )
{ 
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
    return 0;
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
int C2Ws(struct w_s_d * web_socket_data,char *sdata)// C2Ws(websit server sock info
{
    int sfd,s_n,r_n;//socket filedescription
    int d = web_socket_data->website_addrinfo->ai_family;//socket domain 
    int t = web_socket_data->website_addrinfo->ai_socktype;//socket type 
    int p = web_socket_data->website_addrinfo->ai_protocol;//socket protocol 
    size_t len =web_socket_data->website_addrinfo->ai_addr->sa_len;
    char rbuff[N_BUFSIZ],*rdata;
    int nbuff=0;
    memset(rbuff,0,N_BUFSIZ);
    rdata=(char*)malloc(N_BUFSIZ);
    FILE *out;
    if ((sfd = socket(d,t,p)))
    {
        //set port number F!U!C!K! 否则会报错 “connect(): Can't assign requested address ” ！！！！！！
        switch (d)
        {
        case AF_INET:
            ((struct sockaddr_in*)(web_socket_data->website_addrinfo->ai_addr))->sin_port=htons(80);
            break;
        case AF_INET6:
            ((struct sockaddr_in6*)(web_socket_data->website_addrinfo->ai_addr))->sin6_port=htons(80);
        default:
            break;
        }
        printf("connect to |%s|\n",web_socket_data->website);
        //此处应该增加 ip 连接时则切换 if(web_socker_data->next!=NULL then (web_socker_data=web_socker_data->next)->website_addrinfo->ai_addr)
        if ((connect(sfd, web_socket_data->website_addrinfo->ai_addr,len)==-1))
        {
            perror("connect()");
        }
        else
        {
            printf("connect successfully\n");
            //send and receive data  both max size is 1Mb
            if ((send(sfd,sdata,N_BUFSIZ,0)==-1))
            {
                perror("send()");
            }
            else
            {
                printf("\n>>>successfully send a request<<<\n%s\n>>>end<<<\n\n",sdata);
                
            }
            do
            {
                r_n=recv(sfd,rbuff,N_BUFSIZ,0);
                BBB(&rdata,nbuff,rbuff,N_BUFSIZ);
                memset(rbuff,0,N_BUFSIZ);
                nbuff+=N_BUFSIZ;

            } while (r_n);
            printf("---received data---\n\n%s\n\n---end---\n",rdata);
            if (r_n==-1)
            {
                printf("flik\n");
                perror("recv()");
            }
            if ((out=fopen("web/1.html","w"))==NULL)
            {
                P_E(errno,"create");
            }
            
            fprintf(out,"%s",rdata);
        }
    }
    else
    {
        perror("socket()");
    }
    close(sfd);

    return 0 ; 
}
