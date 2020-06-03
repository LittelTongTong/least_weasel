#include<stdio.h>
#include<string.h>
#include<sys/socket.h>
#include<netinet/in.h>
#include<arpa/inet.h>
#include<openssl/ssl.h>
#include<openssl/sslerr.h>

#include"../lib/tool.h"
#include"../browser_core.h"
SSL *ssl ;
int sock;
int RecvPacket()
{
    int len;
    char buf[1025];
    do {
        len=SSL_read(ssl, buf, 1024);
        buf[len]=0;
        printf("\n**len:%d**\n,%s",len,buf);
    } while (len > 0);
    printf("***end***");
    if (len < 0) {
        int err = SSL_get_error(ssl, len);
    if (err == SSL_ERROR_WANT_READ)
            return 0;
        if (err == SSL_ERROR_WANT_WRITE)
            return 0;
        if (err == SSL_ERROR_ZERO_RETURN || err == SSL_ERROR_SYSCALL || err == SSL_ERROR_SSL)
            return -1;
    }
}

int SendPacket(const char *buf)
{
    int len = SSL_write(ssl, buf, strlen(buf));
    if (len < 0) {
        int err = SSL_get_error(ssl, len);
        switch (err) {
        case SSL_ERROR_WANT_WRITE:
            return 0;
        case SSL_ERROR_WANT_READ:
            return 0;
        case SSL_ERROR_ZERO_RETURN:
        case SSL_ERROR_SYSCALL:
        case SSL_ERROR_SSL:
        default:
            return -1;
        }
    }
}



int main ()
{
    struct w_s_d * web_so_in;
    memset(web_so_in,0,sizeof(struct w_s_d));
    DNS("hq.sinajs.cn",web_so_in);
    WSD_2_RIP(web_so_in);
    ((struct sockaddr_in *) (web_so_in->website_addrinfo->ai_addr))->sin_port=htons(443);
    int sf=socket(AF_INET,SOCK_STREAM,0);
    P_E(connect(sf,web_so_in->website_addrinfo->ai_addr,web_so_in->website_addrinfo->ai_addrlen),"connect():");
    //SSL 
    SSL_library_init();
    SSLeay_add_ssl_algorithms();
    SSL_load_error_strings();
    const SSL_METHOD * meth = TLSv1_2_client_method();
    SSL_CTX *ctx = SSL_CTX_new(meth);
    ssl = SSL_new(ctx);
    if(!ssl)
    {
        printf("Error createting ssl.\n");
        return -1; 
    }
    sock = SSL_get_fd(ssl);
    SSL_set_fd(ssl, sf);
    int err = SSL_connect(ssl);
    if (err <= 0) 
    {
        printf("Error creating SSL connection.  err=%x\n", err);
    }
    printf ("SSL connection using %s\n", SSL_get_cipher (ssl));
    char *request = "GET /etag.php?rn=1589257954788&list=gb_ba,gb_baba HTTP/1.1\r\n\r\nAccept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7\r\n\r\n";
    SendPacket(request);
    RecvPacket();
    return 0;
}