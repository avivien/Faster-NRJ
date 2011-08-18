function do_ajax_request(method, url, body, http_callback, content_callback, page_hash) {
  var async = (http_callback != null);
  
  // Create an XMLHttpRequest request w/ an optional callback handler 
  var req = new XMLHttpRequest();
  req.open(method, url, async);
  if(method == "POST" || method == "PUT") {
    req.setRequestHeader("Content-type", "text/plain");
    req.setRequestHeader("Content-length", body.length);
  }
  req.setRequestHeader("Connection", "close");

  if (async) {
    req.onreadystatechange = function() {
      if(req.readyState == 4) {
        http_callback(req.status, req.responseText, url, content_callback, page_hash);
      }
    }
  }
 
  // Make the actual request
  if(method == "POST" || method == "PUT") {
    req.send(body);
  } else {
    req.send();
  }
}

function hide_under_products(e) {
  if (!e) var e = window.event;
  var relTarg = e.relatedTarget || e.toElement;
  var relTarg_class = relTarg.className;
  if((relTarg_class.indexOf("under_rub") == -1) && (relTarg_class != "parent_rub")) {
    $('div#under_products').slideUp();
  }
}

function position_hash(page_hash) {
  if(page_hash) {
    window.location.hash = page_hash;
  }
}

function set_content(status, response, url, content_callback, page_hash) {
  var page_content_div = document.getElementById('page_content');
  if(status == 200) {
    var page_name = url.match('^/(.*)/content$')[1];
    var page_link = document.getElementById(page_name+'_link');
    var ajaxlinks = $('a.ajaxylink');
    for (i=0;i<ajaxlinks.length;i++) {
      if (ajaxlinks[i].className.indexOf("under_rub") == -1) {
        ajaxlinks[i].className = "ajaxylink";
      }
    }
    page_link.className = "ajaxylink selected";
    page_content_div.className = page_name;
    page_content_div.innerHTML = response;
    if(content_callback != null) {
      content_callback(page_hash);
    }
  } else if(status == 404) {
    page_content_div.innerHTML = "<h1>LA PAGE N'EXISTE PAS</h1><p>Cette page n'existe pas sur le site.</p>";
  } else {
    page_content_div.innerHTML = '<h1>ERREUR</h1><p>Une erreur inattendue est survenue.</p>';
  }
}

function load_content(page_name) {
  var content_callback;
  var page_hash;
  if(page_name == "taurine" || page_name == "guarana"){
    page_hash = page_name;
    page_name = "produits";
    content_callback = position_hash;
  }
  do_ajax_request('GET', '/'+page_name+'/content', null, set_content, content_callback, page_hash);
}

function setContentFromURL() {
  var initialContentPage = window.location.hash;
  if (initialContentPage) {
    load_content(initialContentPage.substring(1));
  }
}

function hide_announcement() {
  $('div#announcement').fadeOut(1000);
}

function send_devis() {
  var dataString = new String('');
  var devis_text_inputs = $("form#devis_form input[type='text']");
  for (var i = 0; i < devis_text_inputs.length; i++) {
    dataString += devis_text_inputs[i].name + '=' + encodeURIComponent(devis_text_inputs[i].value) + '&';
  }
  var devis_form_obj = document.getElementById('devis_form');
  dataString += devis_form_obj.message.name + '=' + encodeURIComponent(devis_form_obj.message.value) + '&';
  var devis_radio_inputs = devis_form_obj.type;
  for (var j = 0; j < devis_radio_inputs.length; j++) {
   if(devis_radio_inputs[j].checked == true) {
     dataString += devis_radio_inputs[j].name + '=' + devis_radio_inputs[j].value;
   }
  }
  var page_content_div = document.getElementById('page_content');
  $.ajax({
		url: "/envoyer_devis",
		type: "POST",
		dataType: "html",
		data: dataString,
		success: function(data, textStatus, jqXHR) {
      page_content_div.innerHTML = data;
    },
		error: function(jqXHR, textStatus, errorThrown) {
      page_content_div.innerHTML = '<h1>ERREUR</h1><p>Une erreur est survenue lors de l\'envoi du devis. Veuillez rééssayer ultérieurement.</p>';
    }
	});
	return false;
}

function ajaxylink_click(page_name, page_url) {
  //alert('page_name: ' + page_name + ' ,page_url: ' + page_url);
  var page_hash;
  // Fallback for browser that don't support the history API
  if (!('replaceState' in window.history)) {
    if (page_url.indexOf('#') != -1) {
      page_url = page_url.split('#')[1];
      load_content(page_url);
    } else {
      load_content(page_url);
      window.location.hash = page_url;
    }
    return false;
  }
  // Do something awesome, then change the URL
  if (page_url.indexOf('#') != -1) {
    page_hash = page_url.split('#')[1];
    page_url = page_url.split('#')[0];
  } else {
    page_hash = page_url;
  }
  window.history.replaceState(null, "Faster NRJ" + page_name, '/'+page_url);
  load_content(page_hash);
  return false;
}