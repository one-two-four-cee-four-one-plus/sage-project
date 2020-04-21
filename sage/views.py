from django.shortcuts import render, redirect
from django.views import View
from sage import models


class Index(View):
    def get(self, request):
        return render(request,
                      'index.html')
