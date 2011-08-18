#!/usr/bin/python

__author__ = 'Brieuc Schaff (brieuc.schaff@capgemini.com)'
__version__ = "1"


import logging
import os
import re

from google.appengine.ext.webapp import template


def getErrorTemplate(error_code, message=None):
  if error_code and type(error_code) is int:
    path = os.path.join(os.path.dirname(__file__), 'templates/errors/' + str(error_code) + '.html')
    html_page = template.render(path, {'message': message})
  else:
    logging.error('utils.getErrorTemplate - Error : Bad error_code given (' + str(error_code) + ')')
    html_page = ''
  return html_page

def validateEmail(value):
  if value:
    if not re.match('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$', value, re.IGNORECASE):
      return False
    else:
      return True
  else:
    return False