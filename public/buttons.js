


window.docShareAlert = function(msg) {

  $("#info").append('<div class="alert alert-success alert-dismissable">' +
      '<button  class="close" data-dismiss="alert">&times;</button>' +
      msg.owner + ' has shared \"' + msg.title + '\" with you. <button data-dismiss="alert" class="btn btn-xs btn-primary">Accept</button></div>')
      .on('close.bs.alert', '.alert', function () {
          $.get('/user/notify', {fileId:msg.fileId})

      })
      .on('click', ".btn-primary", function() {
        ft.click(msg.fileId )
        window.location.pathname="/"+msg.fileId;
      })


}

window.alert = function(message, alertclass, container, autofade) {
  var alert = $('<div class="alert-' + (alertclass || "info") + '">' +
    (autofade ? '' : '<span class="close"></span>') + (message || "") + '</div>');

  container = container || '#sidebar';
  $(container).css("position", "relative");
  $($(container + ">.alert-position")[0] ||
    $("<div class='alert-position'>").prependTo(container)).prepend(alert);

  if (autofade)
    alert.hide().fadeIn(300).delay(1500).closeAlert()
  else
    alert.find('.close').click(function() {
      $(this).parent().closeAlert()
    })
	return alert;
}
jQuery.fn.closeAlert = function() {
  this.animate({
    "opacity": 0,
    "margin-top": "-50px",
    "display": "none"
  }, "fast").delay(300, function() {
    this.remove()
  });
}



$(document).ready(function() {



  //modal closing

  $(".modal").css("left", ($("#sidebar").width()+35) +"px")

  $(".modal").each(function(){
    $(this).prepend('<span class="close">');
  })
  $(".modal:last").after('<div class="modal-overlay">')
  $(".modal-overlay, .close").click(function (e) {
      $(".modal").hide();
  })


//key shorcuts UHB


  $(document).keydown(function(e){
    if (getSelection().isCollapsed) return;

if (e.which==66 ) {
    document.execCommand('bold');  e.preventDefault()
}
if (e.which==72 ) {
    $("#superreadcard").click();  e.preventDefault()
}
if (e.which==85 ) {
    document.execCommand('underline');  e.preventDefault()
}
})

$(".btn").click(function(){ $(this).blur() })

  //SIDEBAR BUTTONS

  // $('[title]').tooltip();

  //file info modal -- init
  $("#showfileinfo").click(function() {

    if (!ft.selected.id) {
      alert("Select a file to view its information.", "warning", null, true);
      return;
    }



    $("#modal-file").show();


    $("#file-info-title").text(ft.selected.title)

    $("#file-info-created").text(new Date(ft.selected.date_created).toLocaleString())


    $("#file-info-modified").text(new Date(ft.selected.date_updated).toLocaleString())


    $("#file-info-words").text(   ($(".doc:visible").find('u,b').text().split(/\b\S+\b/g).length-1) + " read, " + ($(".doc:visible").text().split(/\b\S+\b/g).length-1) + " total" )

    // if file is shared with you
    if (ft.selected.userid != u._id) {
      $.getJSON("/user/" + ft.selected.userid, function(r) {

        $("#file-info-owner").text(r.name + " (" + r.email + ")")
      })

      $("#file-share-by-owner").hide()

      //remove as collaborator

    } else {



      $("#file-share-by-owner").show()

      //if you are owner of this file
      $("#file-info-owner").text("me")

      $("#file-info-title").attr("contenteditable","true")


      //share
      var share_id = 0;
      if (ft.selected.share == "team") share_id = 1
      if (ft.selected.share == "public") share_id = 2
      if (ft.selected.share == "specific") share_id = 3
      $(".radio-share").eq(share_id).attr('checked', 'checked');


      //pre-populate shareusers
      $('#share-select').empty()
      for (var i in ft.selected.shareusers)
        $('#share-select').append("<option value='"+ft.selected.shareusers[i].id+"' selected>"+ft.selected.shareusers[i].text+"</option>");
      $('#share-select').trigger('change');


    }


  });





$('#share-select').select2({
  ajax: {
    url: "/user/search",
    dataType: 'json',
    delay: 50,
    data: function (params) {
    return {userinfo: params.term};
    },
    processResults: function (data, params) {
      return {results: data.splice(0, u.name ? 5 : 0)}; //Login required to invite users
    },
    cache: true
    },
    minimumInputLength: 4,
    escapeMarkup: function (markup) { return markup; },

    maximumSelectionLength: 9,
    templateResult: function  (sel) {
      return sel.email ? u.name ? "<span><b>" +sel.text + "</b> " + sel.email + "</span>" : "Login required" : sel.text;
    }
    //data: finalList,

})






  //file info modal - delete button: for owner deletes file, for share & public removes from tree
  $(".ft-delete").click(function() {
    var id = ft.selected.id;

    if (ft.selected.userid != u._id) {
      if (!confirm("Are you sure you want to remove yourself as a shared collaborator of the file \"" + ft.selected.title + "\"?"))
        return;

          $.post('/doc/update', {
            id: ft.selected.id,
            shareusers_remove_me: true
          })

    } else {
      if (!confirm("Are you sure you want to delete the file \"" + ft.selected.title + "\"" + (ft.selected.share ? " from yourself and all shared users" : "") + "?"))
        return;

      $.get("/doc/delete", {
        id: id
      });
    }

    //TODO chrome.storage

    $("#" + id).closest('.ft-item').remove();
    u.index = u.index.filter(function(i) {
      return i.id != id;
    });
    $("#doc-" + id).remove();
    ft.selected = {};
    ft.updateIndex();


    $("#modal-file").hide();
  })


  //file info modal -- save title, sharing
  $("#modal-file-submit").click(function(){
      var sharetype = $("#file-share-by-owner input:checked").attr('id').substring(6);

        $.post('/doc/update', {
          id: ft.selected.id,
          title: $("#file-info-title").val(),
          share: sharetype,
          shareusers:  $('#share-select').select2("data").map(function(i){ return {id:i.id,  text:i.text}; })
        })
        //TODO chrome.storage

        //change share color in filetree
        $("#" + ft.selected.id).closest('.ft-item').addClass(sharetype)


          $("#modal-file").hide();

  })










  $("#showsettings").click(function() {


    $('#team-members-select').select2({
      ajax: {
        url: "/user/search",
        dataType: 'json',
        delay: 50,
        tags: true,
        data: function (params) {
        return {userinfo: params.term};
        },
        processResults: function (data, params) {
          return {results: data.splice(0, u.name ? 5 : 0)}; //Login required to invite users
        },
        cache: true
        },
        minimumInputLength: 2,
        escapeMarkup: function (markup) { return markup; },

        maximumSelectionLength: 100,
        templateResult: function  (sel) {
          return sel.email ? u.name ? "<span><b>" +sel.text + "</b> " + sel.email + "</span>" : "Login required" : sel.text;
        }
        //data: finalList,

    })

    if (u.options){
      $(".debatetype").eq(u.options.debatetype-1).prop("checked", true)




      $("#custom-css").val(u.custom_css);
      $("#custom-js").val(u.custom_js);


    }


          $("#settings").show();






  });


  $('#settings_logout').click(function() {
    document.location.pathname = '/logout';
  });

  $('#btn-settings-save').click(function() {

  $.post("/user/update", {
      options: JSON.stringify({debatetype: $(".debatetype:checked").val() }),
        custom_css: encodeURIComponent($("#custom-css").val()),
      custom_js: encodeURIComponent($("#custom-js").val())
    }, function(e) {
      location.reload();
    });

    $("#settings").hide();


  });



  $("#block").click(function() {


    var headingToUse = "h1";
    var parentHeading = $(window.getSelection().anchorNode.parentNode).closest("h1");

    if (parentHeading.length > 0)
      parentHeading[0].outerHTML = parentHeading.html();
    else
    if (!document.execCommand('formatBlock', false, headingToUse)); //CH/FF
    document.execCommand('formatBlock', false, "<" + headingToUse + ">"); //IE




  })


  $("#read").click(function() {
    document.execCommand('bold');
  });


  $("#readcard").click(function() {
    document.execCommand('underline');
  })


  $("body").on("mouseup", ".highlight-mode", function(e) {
  //console.log(e);

  var selectionContents = window.getSelection().getRangeAt(0).cloneContents();
  var div = $("<span>").append(selectionContents);

//  if (     window.highlightSelect == div.html() ) return;

  window.highlightSelect = div.html();

  var colorToUse = "white";

  //if inside selection there is any text range with non-white bg
  if(!div.find("*[style*=background-color]:not(*[style*=white])").length)
      colorToUse = "yellow";

    ///if inside parent thats all highlighted -- white
  var parentColor = $(window.getSelection().anchorNode.parentNode).closest("*[style*=background-color]").css("background-color");

  if ( parentColor && parentColor  != "rgb(255, 255, 255)")
    colorToUse = "white";

  console.log( div.html() )
  document.execCommand('backColor', false, colorToUse);


  //when highlighting United States only highlight US
  /*
  setTimeout(function(){
  if (colorToUse == "yellow"){
    if (  $(getSelection().anchorNode).closest("*").html().search(/( the |United States)/i) > -1)

    $(getSelection().anchorNode).closest("*").html(
      $(getSelection().anchorNode).closest("*").html().replace(/United States/g,
      'U<span style="background-color: white;">nited </span>S<span style="background-color: white;">tates</span>')

      .replace(/>the/gi,'> the').replace(/the</gi,'the <')
      .replace(/(^| )the( |$)/gi,
      '<span style="background-color: white;"> the </span>')


      )

  }


}, 500)*/


  getSelection().collapseToEnd()


});



  $("#superreadcard").click(function() {


    $("#docs").on("mouseenter", function(){
      $("#docs").off("mouseenter")

      if ($("#superreadcard").hasClass("enabled"))
          $("#sw")[0].play()
    })

    $(this).toggleClass("enabled")
    $("#docs, .speech").toggleClass("highlight-mode").trigger("mouseup");



  //  if ( 'ontouchstart' in window && $(window).width() < 700)
  //    $(".doc").attr("contenteditable", !$(this).hasClass("enabled"))

  })


  $("#format-remove").click(function() {


    //document.execCommand('removeFormat');
  //  return;

    var range = window.getSelection().getRangeAt(0);
    var selectionContents = range.toString();
    var div = document.createElement("span");

    div.innerHTML = "</b></u></h1></h4></span>"+selectionContents;
    range.deleteContents();
    range.insertNode(div);


  })


  /// ... end button dropdown menu
  //$('.dropdown-toggle').dropdown()


    $("#ft-collapse-btn").click(function() {

        $(".ft-file.ft-name:not(.collapsed)").siblings(".ft-icon").click()
    })


    $("#ft-minimize-unread").click(function() {

      if ( $('#docs').hasClass('size-mode-1') ){
        $('#docs, .speech').addClass("size-mode-0").removeClass("size-mode-1");

      }else{
          $('#docs, .speech').addClass("size-mode-1").removeClass("size-mode-0");
      }

      $("#ft-minimize-unread .fa-margin").toggleClass('fa-check-square-o').toggleClass('fa-square-o')

    })



  $("#big").click(function() {

    window.setTimeout(function() {

      $(".ft-selected").click();
    }, 1000)

    u.big = !u.big ? 1 : u.big == 2 ? 0 : 2;



    var list = $(".tab-content .active p");

    for (var i = 0; i < list.length; i++)
      if (list[i].getBoundingClientRect().top > 0)
        break;





    if (u.big == 0) {

      $(".doc:visible, .speech").find("*[style]").filter(function() {
        return $(this).css('background-color') != "rgba(0, 0, 0, 0)";
      }).css("font-size", "").css("line-height", "")
      $("#docs, .speech").find("*[style*='yellow'], b, u, h1").css("font-size", "").css("line-height", "")
      $(".doc:visible, .speech").css("font-size", "100%")
    } else if (u.big == 1) {
      $(".doc:visible, .speech").find("*[style]").filter(function() {
        return $(this).css('background-color') != "rgba(0, 0, 0, 0)";
      }).css("font-size", "30pt").css("line-height", "100%");
      $(".doc:visible, .speech").find("*[style*='yellow'], b, u, h1").css("font-size", "30pt").css("line-height", "100%");
      $(".doc:visible, .speech").css("font-size", "30%");
    } else if (u.big == 2) {
      $(".doc:visible, .speech").find("u").css("font-size", "").css("line-height", "")

    }

    // list[i].scrollIntoView();


  })


  $("#showround").click(function() {
    if ($("#round").is(":visible")) {
      $("#round, #timer").hide();
      /*
      if ($(document).width() < 700)
        $("#docs").css("width", "65%");
      else
      */

    } else {
      $("#round, #timer").show();
      round_init()



    }


  });




  //NEW FILE


  $("#file-new").click(function() {

    $("#modal-file-new").show();


    $("#file-new-modal").on('shown.bs.modal', function() {
      $("#filename").focus().keydown(function(e) {
        if (e.keyCode == 13)
          $("#file-new-modal-submit").click();
      })
    });





  });


  $("#file-new-modal-submit").click(function() {

    if ($(".filetype:checked").val() == "file") {


      var fileData = {
        "type": "ft-file ft-selected",
        "title": $("#filename").val(),
        "text": ""
      }


      if (local) {
        var id = "local" + Math.floor((10000 * Math.random()));

        fileData.id = id;

        localStorage["debate_" + id] = JSON.stringify(fileData);

        u.index.push(fileData);

        ft.populate(ft.root, u.index);



      } else {
        $.get("/doc/create", fileData, function(id) {


          fileData.id = id;



          u.index.push(fileData);



          ft.populate(ft.root, u.index);


        })
      }




      $(".ft-name:last").click();


    } else { //new folder

      var folderData = {
        "type": "folder",
        "userid": "local",
        "title": $("#filename").val()
      }


      u.index.push(folderData);

      ft.populate(ft.root, u.index);

      $(".ft-name:last").click();
    }

    $("#modal-file-new").hide();

  });


    $("#import_googledrive").click(function() {

      $('head').append('  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js" async defer></script>'+
      '  <script src="https://apis.google.com/js/client.js?onload=gapiInit" async defer></script>')

      var filePickerResponse = function(pickedFilesData) {

        if (pickedFilesData.action != "picked") return;

        gapi.client.drive.files.get({
          'fileId': pickedFilesData.docs[0].id
        }).execute(function(resp) {
          $.ajax({
            url: resp.exportLinks["text/html"],
            type: 'GET',
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
            },
            success: function(fileHtml) {

              //create new
              $.get("/doc/create", {title: $("#filename").val()    }, function(id) {

                u.index.push({
                  "type": "ft-file ft-selected",
                  "title": resp.title,
                  "id": id
                });

                ft.populate(ft.root, u.index);
                ft.loadFile(id, function() {
                  //paste google doc html into new doc
                  $(".doc:visible").html(fileHtml).find("span, u").each(function() {
                    })

                  /*  if ($(this).css('font-weight') == 'bold')
                      $(this).wrap('<b>');

                //    if ($(this).css('text-decoration') == 'underline')
                  //    $(this).wrap('<u>');

                    if ($(this).css('background-color') != 'rgba(0, 0, 0, 0)' && $(this).css('background-color') != 'transparent')
                      $(this).wrap('<span style="background-color: yellow;">');

                    if ($(this).css('text-align') == 'center')
                      $(this).wrap('<h2>');



                //  $(".doc style").remove()*/

                });

              })

            }
          });
        });

      };

      var view = new google.picker.View(google.picker.ViewId.DOCUMENTS);
      view.setMimeTypes("application/vnd.google-apps.document");

      var picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .addView(view)
        .setOAuthToken(authToken)
        .setDeveloperKey(apiKey)
        .setCallback(filePickerResponse)
        .build();
      picker.setVisible(true);

        $("#file-new-modal").hide();


    });



});
