var is_footer_animation_finish = false;

function do_ajax_request(method, url, body, http_callback, content_callback, page_hash) {
  var async = (http_callback != null);
  
  // Create an XMLHttpRequest request w/ an optional callback handler 
  var req = new XMLHttpRequest();
  req.open(method, url, async);
  if(method == "POST" || method == "PUT") {
    req.setRequestHeader("Content-type", "text/plain");
    req.setRequestHeader("Content-length", body.length);
  }
  //req.setRequestHeader("Connection", "close");

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

function onanimate_footer(now, fx) {
  position_networks_during_scroll();
}

function set_content(status, response, url, content_callback, page_hash) {
  var page_content_1_div = document.getElementById('page_content_1');
  var page_content_2_div = document.getElementById('page_content_2');
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
    
    //get the first <nav> parent classname
    var parent_node = page_link.parentNode;
    while (parent_node.nodeName != 'NAV' && parent_node.nodeName != 'BODY') {
      parent_node = parent_node.parentNode;
    }
    var direction_hide = 'right';
    var direction_show = 'left';
    if (parent_node.nodeName == 'NAV' && parent_node.id) {
      if (parent_node.id == 'right') {
        direction_hide = 'left';
        direction_show = 'right';
      } else if (parent_node.id == 'bottom') {
        direction_hide = 'up';
        direction_show = 'down';
      } 
    }
    
    var old_page_content_div = page_content_1_div;
    var new_page_content_div = page_content_2_div;
    if (page_content_1_div.style.display == 'none') {
      old_page_content_div = page_content_2_div;
      new_page_content_div = page_content_1_div;
    }
    
    new_page_content_div.className = page_name + ' page_content';
    new_page_content_div.innerHTML = response;
    
    $(old_page_content_div).hide("slide", { direction: direction_hide }, 1000, function() {old_page_content_div.innerHTML = '';});
    $("section#main article").animate({height: $(new_page_content_div).outerHeight(true)}, {duration: 1000, step: onanimate_footer});
    $(new_page_content_div).show("slide", { direction: direction_show }, 1000);
    
    if(content_callback != null) {
      content_callback(page_hash);
    }
  } else if(status == 404) {
    var old_page_content_div = page_content_1_div;
    var new_page_content_div = page_content_2_div;
    if (page_content_1_div.style.display == 'none') {
      old_page_content_div = page_content_2_div;
      new_page_content_div = page_content_1_div;
    }
    new_page_content_div.innerHTML = "<h2 class=\"first\">LA PAGE N'EXISTE PAS</h2><p>Cette page n'existe pas sur le site.</p>";
    
    $(old_page_content_div).hide("slide", { direction: 'right' }, 1000);
    $("section#main article").animate({height: $(new_page_content_div).outerHeight(true)}, {duration: 1000, step: onanimate_footer});
    $(new_page_content_div).show("slide", { direction: 'left' }, 1000);
  } else {
    var old_page_content_div = page_content_1_div;
    var new_page_content_div = page_content_2_div;
    if (page_content_1_div.style.display == 'none') {
      old_page_content_div = page_content_2_div;
      new_page_content_div = page_content_1_div;
    }
    new_page_content_div.innerHTML = '<h2 class="first">ERREUR</h2><p>Une erreur inattendue est survenue.</p>';
    
    $(old_page_content_div).hide("slide", { direction: 'right' }, 1000);
    $("section#main article").animate({height: $(new_page_content_div).outerHeight(true)}, {duration: 1000, step: onanimate_footer});
    $(new_page_content_div).show("slide", { direction: 'left' }, 1000);
  }
}

function load_content(page_name) {
  var content_callback;
  var page_hash;
  //Hack pour les sous pages de produits
  if(page_name == "taurine" || page_name == "guarana"){
    page_hash = page_name;
    page_name = "produits";
    content_callback = position_hash;
  }
  do_ajax_request('GET', '/'+page_name+'/content', null, set_content, content_callback, page_hash);
}

function position_networks_during_scroll() {
  var footer_div = document.getElementById('footer');
  var networks_div = document.getElementById('networks');
  var music_div = document.getElementById('music');
  var window_bottom = $(window).scrollTop() + $(window).height();
  //We need to substract the margin-top of the footer element
  if(window_bottom > (footer_div.offsetTop - 19)) {
    networks_div.style.position = 'absolute';
    $(networks_div).css('margin-bottom', '100px');
    music_div.style.position = 'absolute';
    $(music_div).css('margin-bottom', '100px');
  } else {
    networks_div.style.position = 'fixed';
    $(networks_div).css('margin-bottom', '0px');
    music_div.style.position = 'fixed';
    $(music_div).css('margin-bottom', '0px');
  }
}

function position_networks(page_content_height) {
  var window_height = $(window).height();
  var header_height = $("#header").outerHeight(true);
  if (window_height < (page_content_height + header_height)) {
    $("#networks").css('position', 'fixed');
    $("#networks").css('margin-bottom', '0px');
    $("#music").css('position', 'fixed');
    $("#music").css('margin-bottom', '0px');
  } else {
    $("#networks").css('position', 'absolute');
    $("#networks").css('margin-bottom', '100px');
    $("#music").css('position', 'absolute');
    $("#music").css('margin-bottom', '100px');
  }
}

function setContentFromURL(page_name) {
  var initialContentPage = window.location.hash;
  if (initialContentPage) {
    load_content(initialContentPage.substring(1));
  } else {
    var page_content_height = $("#page_content_1").outerHeight(true);
    position_networks(page_content_height);
    //On place le footer dynamiquement
    $("section#main article").css('height', page_content_height);
    is_footer_animation_finish = true;
    $("#networks").css('display', 'block');
    $("#footer").css('display', 'block');
    
    $("#music").css('display', 'block');
    load_music_player(page_name);
  }
}

function load_music_player(page_name) {
  // construct the instance (must be named soundManager, and scoped globally)
  window.soundManager = new SoundManager();
  
  if (navigator.userAgent.match(/webkit/i) && navigator.userAgent.match(/mobile/i)) {
    // iPad, iPhone etc.
    soundManager.useHTML5Audio = true;
  }
  
  soundManager.consoleOnly = true;
  soundManager.flashVersion = 9;
  soundManager.useHighPerformance = true;
  soundManager.useFlashBlock = true;
  
  soundManager.url = '/static/swf/libs/';
  soundManager.preferFlash = false;
  
  //Display the music player
  var threeSixtyPlayer = new ThreeSixtyPlayer();
  soundManager.beginDelayedInit();
  if(page_name != undefined && page_name != '') {
    threeSixtyPlayer.config.autoPlay = true; 
  }
  // hook into SM2 init
  soundManager.onready(threeSixtyPlayer.init);
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
  var page_content_div = document.getElementById('new_page_content');
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
  //window.history.pushState(null, "Faster NRJ" + page_name, '/'+page_url);
  load_content(page_hash);
  return false;
}

function move_menu(event) {
  var left_nav = document.getElementById('left');
  var menu_left = document.getElementById('menu_left');
  var menu_right = document.getElementById('menu_right');
  var window_top = $(window).scrollTop();
  if (window_top > left_nav.offsetTop) {
    menu_left.style.position = 'fixed';
    menu_right.style.position = 'fixed';
  } else {
    menu_left.style.position = 'absolute';
    menu_right.style.position = 'absolute';
  }
  
  if (is_footer_animation_finish == true) {
    position_networks_during_scroll();
  }
}