from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center"> 我的第一个网页 </h1>'
    line2 = '<a href="/play/">进入游戏</a>'
    line = '<hr>'
    line3 = '<img src="https://img0.baidu.com/it/u=180300320,2476402890&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800" width="1300" margin-left: auto margin-right: auto>'
    return HttpResponse(line1 + line2 + line + line3)


def play(request):
    line1 = '<h1 style="text-align: center"> 游戏开始 </h1>'
    return HttpResponse(line1)
