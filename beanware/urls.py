"""beanware URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from beanware.views import IndexView
from enduser.views import EndUser, PollDB
from authentication.views import UserAccount, UserLogin, UserLogout


urlpatterns = [
    url(r'^signup/$', UserAccount.as_view()),
    url(r'^signin/$', UserLogin.as_view()),
    url(r'^signout/$', UserLogout.as_view()),
    url(r'^event_data/', EndUser.as_view()),
    url(r'^watch_db/', PollDB.as_view()),
    url(r'^admin/', admin.site.urls),
    url('^.*$', IndexView.as_view(), name='index'),
]
