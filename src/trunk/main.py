#!/usr/bin/python
#
# Copyright (C) 2011 Faster NRJ.


"""Bind URL to handlers."""


__author__ = 'Alexandre Vivien (alx.vivien@gmail.com)'
__version__ = "1"

from google.appengine.dist import use_library
use_library('django', '1.2')

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

import handlers

application = webapp.WSGIApplication([('/envoyer_devis', handlers.Devis),
                                      ('/(.*)/content', handlers.ContentPage),
                                      ('/(.*)', handlers.Page)],
                                     debug=True)


def main():
  run_wsgi_app(application)

if __name__ == '__main__':
  main()