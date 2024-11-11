from django.shorts import render

def index(request):
    return render(request, "multiends/web.html")
