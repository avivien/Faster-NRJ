#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# Copyright (C) 2011 Faster NRJ.

__author__ = 'Alexandre Vivien (alx.vivien@gmail.com)'
__version__ = "1"

import logging
import os
import traceback

from google.appengine.api import mail
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import utils

class Page(webapp.RequestHandler):
  def get(self, page):
    try:
      page_content_template = None
      if page:
        page_content_template = page + '.html'
      else:
        page_content_template = 'index.html'
      path = os.path.join(os.path.dirname(__file__), 'templates/base.html')
      response_text = template.render(path, {'init': True,
                                             'page_name': page,
                                             'page_content_template': page_content_template})
    except template.django.template.TemplateDoesNotExist:
      logging.warn('Page.get - Warning: page %s not found.'%(page))
      self.error(404)
      response_text = utils.getErrorTemplate(404)
    except:
      logging.error('Page.get - Error: ' + traceback.format_exc())
      self.error(500)
      response_text = utils.getErrorTemplate(500)
    self.response.out.write(response_text)

class ContentPage(webapp.RequestHandler):
  def get(self, page):
    try:
      path = os.path.join(os.path.dirname(__file__), 'templates/' + page + '.html')
      response_text = template.render(path, {'init': True})
    except template.django.template.TemplateDoesNotExist:
      logging.warn('ContentPage.get - Warning: page %s not found.'%(page))
      self.error(404)
      response_text = utils.getErrorTemplate(404)
    except:
      logging.error('ContentPage.get - Error: ' + traceback.format_exc())
      self.error(500)
      response_text = utils.getErrorTemplate(500)
    self.response.out.write(response_text)

class Message(webapp.RequestHandler):
  def post(self):
    try:
      nom = self.request.POST.get('nom')
      email = self.request.POST.get('email')
      tel = self.request.POST.get('tel')
      message = self.request.POST.get('message')
      if nom and email and message:
        if utils.validateEmail(email):
          email_template_path = os.path.join(os.path.dirname(__file__), 'templates/email_message.html')
          html_body = template.render(email_template_path, {'nom': nom,
                                                            'email': email,
                                                            'tel': tel,
                                                            'message': message})
          mail.send_mail(sender='Faster\'s energy <webmaster@faster-nrj.fr>', 
                         to='contact@faster-drink.fr',
                         subject='Message de la part de ' + nom,
                         body=html_body,
                         html=html_body)
          path = os.path.join(os.path.dirname(__file__), 'templates/contactez-nous.html')
          response_text = template.render(path, {'init': False,
                                                 'success': True,
                                                 'response': u'Message envoyé.'})
        else:
          path = os.path.join(os.path.dirname(__file__), 'templates/contactez-nous.html')
          response_text = template.render(path, {'init': False,
                                                 'success': False,
                                                 'nom':nom,
                                                 'email':email,
                                                 'tel': tel,
                                                 'message': message,
                                                 'response': u'L\'email renseigné n\'est pas valide.'})
      else:
        if not nom:
          response = u'Le nom est obligatoire.'
        elif not email:
          response = u'L\'email est obligatoire.'
        elif not message:
          response = u'Vous devez mettre un message.'
        path = os.path.join(os.path.dirname(__file__), 'templates/contactez-nous.html')
        response_text = template.render(path, {'init': False,
                                               'success': False,
                                               'nom':nom,
                                               'email':email,
                                               'tel': tel,
                                               'message': message,
                                               'response': response})
    except:
      logging.error('Message.post - Error : ' + traceback.format_exc())
      self.error(500)
      response_text = utils.getErrorTemplate(500)
    self.response.out.write(response_text)
