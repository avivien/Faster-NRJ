#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# Copyright (C) 2011 Faster NRJ.


"""Bind redirects"""


__author__ = 'Alexandre Vivien (alex@simplecode.fr)'
__version__ = "1"

import logging
import utils

import webapp2


class RedirectHandler(webapp.RequestHandler):  
  def get(self):
    redirect_map = {'/devis':'/commande'}
    target_url = redirect_map.get(self.request.path)
    if target_url:
      query = self.request.query
      if query:
        target_url = target_url + '?' + query
      self.redirect(target_url)
    else:
      logging.warn('RedirectHandler.get - Warning: page not found.')
      self.error(404)
      self.response.out.write(utils.getErrorTemplate(404))
      

application = webapp2.WSGIApplication([('/devis', RedirectHandler)],
                                      debug=True)
