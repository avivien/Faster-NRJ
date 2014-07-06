#!/usr/bin/python
#
# Copyright (C) 2011 Faster NRJ.


"""Bind URL to handlers."""


__author__ = 'Alexandre Vivien (alx.vivien@gmail.com)'
__version__ = "1"

import webapp2

import handlers

application = webapp2.WSGIApplication([('/envoyer_message', handlers.Message),
                                       ('/(.*)/content', handlers.ContentPage),
                                       ('/(.*)', handlers.Page)],
                                      debug=True)
