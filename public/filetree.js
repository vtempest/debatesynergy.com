var ft={init:function(e,t){ft.root=$(e),ft.dragging=!1,ft.selected={},ft.populate(e,t),$("body").on("mouseup",".ft-name",function(e){$(this).attr("contenteditable",!0)}).on("click",".ft-item",ft.click).on("click",".ft-icon",function(e){var t=$(this).closest(".ft-item").find(".ft-name:first");t.toggleClass("collapsed");var i="ft-icon fa fa-";i+=t.hasClass("ft-file")?t.hasClass("collapsed")?"plus":"file":t.hasClass("folder")?t.hasClass("collapsed")?"folder-close":"folder-open":"",$(this).closest(".ft-item").find(".ft-icon").attr("class",i)}).on("keydown",".ft-name",function(e){13==e.which&&($(this).blur(),e.preventDefault())}).on("blur",".ft-name",function(e){var t=$(this).text(),i=$(this).attr("id");if(local){var n=JSON.parse(localStorage["debate_"+i]);n.title=t,localStorage["debate_"+i]=JSON.stringify(q)}else $.post("/doc/update",{title:t,id:i});u.index=u.index.map(function(e){return e.id==i&&(e.title=t),e}),ft.updateIndex()}),$("#filetree").scroll(function(){this.scrollLeft=0}),setInterval(function(){ft.update()},2e4),ft.updateNeeded=!1,$("#docs").keyup(function(e){ft.updateNeeded=!0,$(window.getSelection().anchorNode).closest("h1,h2,h3").length&&ft.update()}),window.setTimeout(function(){},1e3),$("#filetree").on("dragstart",function(e){ft.dragging=$(e.target).closest(".ft-item"),$(e.target).addClass("ft-being-dragged")}),$(document).on("dragover",function(e){e.preventDefault()}).on("dragenter",function(e){e=$(e.target).closest(".ft-item"),e&&e.addClass("ft-dragged-over")}).on("dragleave",function(e){e=$(e.target).closest(".ft-item"),e&&e.removeClass("ft-dragged-over")}).on("drop",function(e){if(!e.originalEvent.dataTransfer||!e.originalEvent.dataTransfer.files.length){e.preventDefault();var t=$(e.target).closest(".ft-item");if(t.length){var i=t.find(".ft-name").attr("class").match(/(file|folder|heading)/gi);i=i.length?i[0]:!1,t.removeClass("ft-dragged-over").css("color","none")}if(ft.dragging.removeClass("ft-being-dragged"),console.log(ft.dragging),console.log(t),t.length){if(ft.dragging.find(".ft-name").hasClass("folder")||ft.dragging.find(".ft-name").hasClass("ft-file"))if("folder"==i&&e.originalEvent.clientX>30)t.find(".ft-list").length||t.append("<div class='ft-list'>"),t.find(".ft-list").append(ft.dragging);else{if("folder"!=i&&"ft-file"!=i)return;t.after(ft.dragging)}else if(ft.dragging.find(".ft-name").hasClass("heading")){if("ft-file"==i)t.find(".ft-list").length||t.append("<div class='ft-list'>"),t.find(".ft-list").append(ft.dragging);else{if("heading"!=i)return;t.after(ft.dragging)}var n=ft.dragging.find(".ft-name").attr("id");n=parseInt(n.substring(n.indexOf("_")+1));var d=parseInt(t.find(".ft-name").attr("id").substring(t.find(".ft-name").attr("id").indexOf("_")+1)),s=$(".doc:visible").find("h1,h2,h3"),l=s.eq(d+1),a=s.eq(n)[0],f=s.eq(1+n).prev()[0],o=document.createRange();o.selectNodeContents(a),o.setEnd(f,f.childNodes.length);var r=$("<span>");r.append(o.extractContents()),console.log(r.html()),l.before(r)}}else $("#filetree > .ft-list > .ft-item:last").after(ft.dragging);$(".ft-being-dragged:first").closest(".ft-item").remove(),u.index=ft.toJSON(),ft.updateIndex()}})},loadFile:function(e,t){function i(){$(".doc:visible").on("scroll",function(e){if(!window.off){for(var t=$(".doc:visible").find("h1, h2, h3"),i=0;i<t.length&&!(t[i].textContent.length>2&&t[i].getBoundingClientRect().bottom>300);i++);$(".ft-selected").removeClass("ft-selected"),$("#"+ft.selected.id+"_"+i).parent().prev().addClass("ft-selected"),i==t.length&&$("#"+ft.selected.id).next().children().last().find(".ft-name").addClass("ft-selected"),$(".ft-selected")[0]&&($(".ft-selected")[0].scrollIntoView(),$(".ft-selected").offset().top<window.innerHeight/2&&($("#filetree")[0].scrollTop-=window.innerHeight/2))}})}if(ft.ongoingXhrId=e,!$(".doc:visible").length||$(".doc:visible").attr("id").substring(4)!=e||ft.selected.id!=e){$(".doc:visible").hide();var n=$("#doc-"+e);if(n.length)return n.show(),ft.selected=n.data("info"),$(".ft-visible").removeClass("ft-visible"),$("#"+e).parent().css("background","").addClass("ft-visible"),$("#"+e).hasClass("collapsed")&&$("#"+e).parent().find(".ft-icon").click(),ft.selected&&(history.pushState(null,"",ft.selected.id),$("#select2-searchtext-container").html(ft.selected.title)),void(t&&t());i(),$(".glyphicon-refresh").removeClass("glyphicon-refresh glyphicon-spin"),$("#"+e+" ").prev().find(".ft-icon").addClass("glyphicon-refresh glyphicon-spin"),$(".ft-visible").removeClass("ft-visible"),$(".ft-file-selected").removeClass("ft-file-selected"),ft.selected={},$.ajax({xhr:function(){var t=new window.XMLHttpRequest;return t.addEventListener("progress",function(i){if(i.lengthComputable){var n=Math.floor(i.loaded/i.total*100);ft.ongoingXhrId==e?($("#"+e).parent().css("background","linear-gradient(90deg, rgb(170, 207, 231) "+n+"%, transparent 0%)"),$("#"+e).next().css("background-color","white")):t.abort()}},!1),t},url:"/doc/read",data:{id:e},error:function(t){"Access denied"==t.responseText&&$(".glyphicon-refresh").removeClass("glyphicon-refresh glyphicon-spin"),$("#info").append('<div class="alert alert-danger alert-dismissable"><button  class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Access denied to file id '+e+"."+($("#filetree #"+e).length?" Remove from file tree?":"")+' <button data-dismiss="alert" class="btn btn-xs btn-primary">Accept</button></div>').on("click",".btn-primary",function(){return $("#filetree #"+e).length?void $("#filetree #"+e).closest(".ft-item").remove():void 0})},success:function(n){if($(".glyphicon-refresh").removeClass("glyphicon-refresh glyphicon-spin"),"Not found"==n&&confirm("File id "+e+" is not found. Remove from file tree?"))return void $(".ft-selected").closest(".ft-item").remove();if($("#"+e).parent().css("background","").addClass("ft-visible"),ft.selected=n,"undefined"==typeof history.pushState?location.hash=ft.selected.id:history.pushState(null,"",ft.selected.id),!$("#doc-"+ft.selected.id).length){if(window.chunk){var d=$("<div>").addClass("doc").attr("id","doc-"+ft.selected.id),s=1e5;chunk_len=Math.ceil(ft.selected.text.length/s);for(var l=0;l<chunk_len;l++)d.append("<div class='chunk' contenteditable='true'>"+ft.selected.text.substring(l*s,(l+1)*s)+"</div>")}else{var d=$("<div>").addClass("doc").attr("id","doc-"+ft.selected.id).attr("contenteditable",!0);d.html(ft.selected.text)}d.appendTo("#docs").show()}delete ft.selected.text,$("#doc-"+ft.selected.id).data("info",ft.selected),i(),$("#"+e).hasClass("collapsed")&&$("#"+e).parent().find(".ft-icon").click(),$("#"+ft.selected.id).length||(u.index||(u.index=[]),u.index.push({id:ft.selected.id,title:ft.selected.title,type:"ft-file ft-selected public"}),"home"==u.index[0].id&&delete u.index[0],ft.populate($("#filetree"),u.index)),t&&t(),document.body.dispatchEvent(new CustomEvent("doc")),$("#select2-searchtext-container").html(ft.selected.title),ft.updateNeeded=!0,ft.update()}})}},populate:function(e,t){ft.root&&e[0]&&e[0].id==ft.root[0].id?e.empty():(e.append('<div class="ft-list">'),e=e.find(".ft-list"));for(var i in t){var n=t[i].type.indexOf("heading")>-1?$('<div class="ft-item'+(t[i].type.indexOf("ft-selected")>-1?" ft-selected":"")+'" draggable="true" ><span  id="'+t[i].id+'" class="ft-name '+t[i].type+'" title="'+t[i].title+'" >'+t[i].title+"</span> </div>"):$('<div class="ft-item" draggable="true"><span class="ft-icon fa fa-'+(t[i].type.indexOf("ft-file")>-1?t[i].type.indexOf("collapsed")>-1?"plus":"file":t[i].type.indexOf("folder")>-1?t[i].type.indexOf("collapsed")>-1?"folder-close":"folder-open":"")+" "+(t[i].type.indexOf("public")>-1?" ft-public ":"")+'" ></span><span  id="'+t[i].id+'" class="ft-name '+t[i].type+'"  >'+t[i].title+"</span></div>");n.appendTo(e),t[i].children&&t[i].children.length&&ft.populate(n,t[i].children)}},toJSON:function(e){"undefined"==typeof e&&(e=$("#filetree"));var t=[];return e.children(".ft-item").each(function(){var e=$(this).find(".ft-name")[0],i={id:e.id,title:e.textContent,type:e.className.replace(/ft-name/gi,"").trim()};i.type+=$(this).hasClass("ft-selected")?" ft-selected":"";var n=$(this).children(".ft-list");n.length&&(i.children=ft.toJSON(n)),t.push(i)}),t},updateIndex:function(){window.off||(local?(localStorage.debate=JSON.stringify(u.index),ft.selected.text=$(".doc:visible").html().replace(/\'/g,"&#39;"),localStorage["debate_"+ft.selected.id]=JSON.stringify(ft.selected)):u.index.length&&u.name&&$.ajax({url:"/user/update",data:{userid:u._id,index:u.index},contentType:"application/x-www-form-urlencoded",type:"POST"}))},update:function(){if(!window.off){if(u.index=ft.toJSON(),ft.selected&&$(".doc:visible").length&&ft.updateNeeded&&ft.selected.id==$(".doc:visible").attr("id").substring(4)){var e=[],t=0,i=-1;$(".ft-selected .ft-name").hasClass("heading")&&(i=parseInt($(".ft-selected .ft-name").attr("id").substring($(".ft-selected .ft-name").attr("id").indexOf("_")+1))),$(".doc:visible:first").find("h1, h2, h3").each(function(){$(this).text().length>2&&e.push({id:ft.selected.id+"_"+t.toString(),title:$(this).text().substring(0,50),type:"heading heading-"+$(this).prop("tagName").toLowerCase()+(i==t?" ft-selected":"")}),t++});for(var t in u.index)if(u.index[t].id==ft.selected.id){u.index[t].children=e;break}$("#"+ft.selected.id).parent().find(".ft-list").remove(),ft.populate($("#"+ft.selected.id).parent(),e),$.post("/doc/update",{text:encodeURIComponent($(".doc:visible:first").html()),id:ft.selected.id}),ft.updateNeeded=!1}ft.updateIndex()}},click:function(e){e="string"==typeof e?$("#"+e):$(e.target).hasClass("ft-name")?$(e.target):$(e.target).find(".ft-name:first");var t=e.attr("id"),i=!1;$(".ft-selected").removeClass("ft-selected"),e.parent().addClass("ft-selected"),e.hasClass("heading")?(i=parseInt(t.substring(t.indexOf("_")+1)),t=t.substring(0,t.indexOf("_")),ft.selected&&ft.selected.id==t&&$(".doc:visible").attr("id").replace("doc-","")==t?$(".doc:visible").find("h1, h2, h3")[i].scrollIntoView():(console.log(111),ft.loadFile(t,function(){$(".doc:visible").find("h1, h2, h3")[i].scrollIntoView()}))):e.hasClass("ft-file")&&!u.name?(ft.selected=u.index[0],$("#doc-"+t).length&&$("#doc-"+t).show()):e.hasClass("ft-file")&&ft.loadFile(t)},dblclick:function(){if($(this).hasClass("heading")){var e=$(this).attr("id"),t=parseInt(e.substring(e.indexOf("_")+1));e=e.substring(0,e.indexOf("_"));var i=$(".doc:visible").find("h1, h2, h3"),n=t==i.length-1?$("#docs>p:last")[0]:i[t+1];range=document.createRange(),range.setStart(i[t],0),range.setEnd(n,0),sel=window.getSelection(),sel.removeAllRanges(),sel.addRange(range)}!$(this).hasClass("ft-file")&&!$(this).hasClass("folder")}};


//TODO create parenting -- when you're dragging the headings  have arrow icon under
//collapsible heading levels and auto load which level
//dragging headigns into another documents

var ft = {
init: function(el, json) {

  ft.root = $(el);
  ft.dragging = false;
  ft.selected = {};

  //populate and events
  ft.populate(el, json);
  $("body")
  .on("mouseup", ".ft-name", function(e){
    $(this).attr('contenteditable', true);
  })
  //clicking item handles the click, loads file
  .on("click", ".ft-item", ft.click)

    //options dropdown shouldnt exit on select users
  /*.on("mousedown", ".ft-item .select2", function(){

    $("body").on("hide.bs.dropdown", ".ft-options", function(e){ console.log(e)
     e.preventDefault();
    })
  })

  .on("blur", ".select2-search__field", function(){
    $("body").unbind("hide.bs.dropdown");
  })*/
  //TODO <> cursor not appearing of file names
  //TODO fodles
  //TODO fix double click on file and check dragging
  .on("click", ".ft-icon", function(e){
    var ftName = $(this).closest('.ft-item').find('.ft-name:first');

    ftName.toggleClass('collapsed');
    var newIcon = "ft-icon fa fa-";

     newIcon += ftName.hasClass("ft-file") ? ftName.hasClass('collapsed') ? 'plus' :  'file'
        : ftName.hasClass("folder") ? ftName.hasClass('collapsed') ?  'folder-close' :  'folder-open' : '';

        $(this).closest('.ft-item').find('.ft-icon').attr('class', newIcon);


  })

  .on("keydown", ".ft-name", function(e){
    if(e.which==13){
      $(this).blur();
      e.preventDefault();
    }
  })
  .on("blur", ".ft-name", function(e){

      // update title: allowed for owner, share; disabled for public
      //if (u._id == ft.selected.userid || ft.selected.share && ft.selected.share.indexOf(u.email) > -1) {



    var newTitle = $(this).text(), id = $(this).attr('id');

    if (local) {
      var itemJSON = JSON.parse(localStorage["debate_"+id]);
      itemJSON.title = newTitle;
      localStorage["debate_"+id] = JSON.stringify( q);
    } else {
      $.post('/doc/update', {
        title: newTitle,
        id: id
      });
    }

    //alter index and upload it
    u.index=u.index.map(function(i){
      if (i.id==id)
        i.title = newTitle
      return i;
    });

    ft.updateIndex();

  })




  $("#filetree").scroll(function(){
    this.scrollLeft=0;
  })





  //update filetree and save every 5s
  setInterval(function() {
   // if (typeof(MutationObserver) == "undefined")
    //  ft.updateNeeded = true;

    ft.update();
  }, 20000);

  //update triggered only when needed
  ft.updateNeeded = false;
/*
  if (typeof MutationObserver != "undefined")
    new MutationObserver(function(m) {
      ft.updateNeeded = true;
    }).observe($("#docs")[0], {
      childList: true,
      subtree: true
    });

  */

  $("#docs").keyup(function(e){
    ft.updateNeeded = true;
    if ($(window.getSelection().anchorNode).closest("h1,h2,h3").length)
      ft.update();

  })


  //click last selected (or first) on first-load
  window.setTimeout(function() { return;
      if ($('.ft-selected').length)
        $('.ft-selected').click();
      else if (u.index[0].id=="home"){
        $('.ft-item:first').click();
        $("#showround").click();
        window.scrollTo(0,0)
      }

  }, 1000);



  //***DRAG HEADINGS and rearrange file order
  $('#filetree').on("dragstart", function(e) {
      ft.dragging = $(e.target).closest('.ft-item');

      $(e.target).addClass("ft-being-dragged");
    })
  $(document).on("dragover", function(e) {
      e.preventDefault();
    })
    .on("dragenter", function(e) {
      e = $(e.target).closest('.ft-item');
      if (e)
        e.addClass("ft-dragged-over")
    })
    .on("dragleave", function(e) {
      e = $(e.target).closest('.ft-item');
      if (e)
        e.removeClass("ft-dragged-over")
    })
    .on("drop", function(e) {
      //this event is doubled by the "drop docx upload" so if file dropped cancel event
      if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) return;

      // prevent default action
      e.preventDefault();
      //ft-item receiving the drop
      var dropItem = $(e.target).closest(".ft-item");

      if (dropItem.length){
        var dropClass = dropItem.find(".ft-name").attr('class').match(/(file|folder|heading)/gi);
        dropClass = dropClass.length ? dropClass[0] : false;
        //remove drop item's highlite
        dropItem.removeClass("ft-dragged-over").css("color", "none");
      }
      //TODO is this a copy?
      ft.dragging.removeClass("ft-being-dragged");

      console.log(ft.dragging);
      console.log(dropItem);

      //dropped outside the tree (no drop item)
      if (!dropItem.length) {
        $('#filetree > .ft-list > .ft-item:last').after(ft.dragging);

        //folder/file: dropped onto: folders (next, child),  files (next)
      } else if (ft.dragging.find(".ft-name").hasClass("folder") || ft.dragging.find(".ft-name").hasClass("ft-file")) {

        if (dropClass=="folder" && e.originalEvent.clientX > 30) { //dropping on folder makes it a child if over px from left
          if (!dropItem.find('.ft-list').length)
            dropItem.append("<div class='ft-list'>")

          dropItem.find('.ft-list').append(ft.dragging);

        } else if (dropClass=="folder" || dropClass=="ft-file") {

          dropItem.after(ft.dragging);
        } else //don't allow others
          return;


      //headings: dropped onto files (child) or headings (next)
      } else if (ft.dragging.find(".ft-name").hasClass("heading")) {

        if (dropClass=="ft-file") {
          if (!dropItem.find('.ft-list').length)
            dropItem.append("<div class='ft-list'>")

          dropItem.find('.ft-list').append(ft.dragging);

        } else if (dropClass=="heading") {

          dropItem.after(ft.dragging);
        } else //don't allow others
          return;

        //TODO headings in other files
        //move text block under the drag heading to the dropped heading location
        var dragId = ft.dragging.find(".ft-name").attr("id");
        dragId = parseInt(dragId.substring(dragId.indexOf("_") + 1));
        var dropId = parseInt(dropItem.find(".ft-name").attr("id").substring(dropItem.find(".ft-name").attr("id").indexOf("_") + 1));
        var headList = $(".doc:visible").find("h1,h2,h3");
        var dropHead = headList.eq(dropId + 1);
        var dragHead = headList.eq(dragId)[0];
        var dragEnd = headList.eq(1 + dragId).prev()[0];


        var range = document.createRange();
        range.selectNodeContents(dragHead);
        range.setEnd(dragEnd, dragEnd.childNodes.length);

        var blockToMove = $("<span>");
        blockToMove.append(range.extractContents());

        console.log(blockToMove.html());
        dropHead.before(blockToMove);
      }

      //remove original item if got to this point
      $(".ft-being-dragged:first").closest('.ft-item').remove();

      //calculate new index JSON and upload it
      u.index = ft.toJSON();
      ft.updateIndex();

    });


  /*/long touch on mobile
  setTimeout(function() {

      .on('touchstart', function() {
        // e.preventDefault();
        window.touchTimer = setTimeout(ft.dblclick, 500);
      })
      .on('touchend', function() {
        clearTimeout(window.touchTimer);
      });


    $(".ft-name").on('touchstart', function(e) {
      window.touchTimer = setTimeout(function() {
        alert()
      }, 500);
    })

    .on('touchend', function() {
      clearTimeout(window.touchTimer);
    });


  }, 500);


  $(".ft-name").on('touchstart', function(e) {
      window.touchTimer = setTimeout(
        ft.doubleclick.call(e.target),
        500);
    })
    .on('touchend', function() {
      clearTimeout(window.touchTimer);
    });
    */







},

loadFile: function(id, callback) {

  //allow only one fileLoad at a time, break older if newer is started
  ft.ongoingXhrId = id;

  //don't reload same file
  if ( $(".doc:visible").length && $(".doc:visible").attr("id").substring(4) == id && ft.selected.id == id )
    return;

  //hide current doc
  $(".doc:visible").hide() //.slideUp();

  //show selected doc if it's loaded before
  var prevDoc = $("#doc-" + id);
  if (prevDoc.length){
      prevDoc.show() //slideDown();
      ft.selected = prevDoc.data("info");

      $(".ft-visible").removeClass("ft-visible");
      $("#"+id).parent().css("background", "").addClass('ft-visible');

      if($("#"+id).hasClass("collapsed"))
        $("#"+id).parent().find(".ft-icon").click()

      if ( ft.selected){
        history.pushState(null, "", ft.selected.id);
        $("#select2-searchtext-container").html(ft.selected.title);
      }
      if (callback)
        callback();
      return;
  }


  function onScroll(){
      // on scroll, update selected header index
      //TODO slowwww
    $(".doc:visible").on("scroll",  function(e) {
      if (window.off) return;




     // return

     // if(!skipScroll){

    //  if( $('body').scrollTop() ) $('body').scrollTop(0)



      var list = $(".doc:visible").find("h1, h2, h3");

      for (var i = 0; i < list.length; i++)
        if (list[i].textContent.length > 2 && list[i].getBoundingClientRect().bottom > 300)
          break;

      $(".ft-selected").removeClass("ft-selected");
      $("#" + ft.selected.id + "_" + i).parent().prev().addClass("ft-selected");

      if (i == list.length)
        $("#" + ft.selected.id).next().children().last().find('.ft-name').addClass("ft-selected");

    //  if ($(".ft-selected")[0] && document.body.scrollIntoViewIfNeeded)
      //  $(".ft-selected")[0].scrollIntoView(true);

      if ($(".ft-selected")[0]){
        $(".ft-selected")[0].scrollIntoView();
        if ( $(".ft-selected").offset().top < window.innerHeight/2)
          $("#filetree")[0].scrollTop -= window.innerHeight/2

       // $("#filetree")[0].scrollTop = $(".ft-selected").position().top-window.innerHeight/2+75
      }

     // }
    });

  };

  onScroll();


  $(".glyphicon-refresh").removeClass("glyphicon-refresh glyphicon-spin");
  $("#" + id + " ").prev().find(".ft-icon").addClass("glyphicon-refresh glyphicon-spin");

  $(".ft-visible").removeClass("ft-visible");



  $(".ft-file-selected").removeClass("ft-file-selected");

  ft.selected = {};


  $.ajax({
    xhr: function() {
      //download percentage as the download is in progress
      var xhr = new window.XMLHttpRequest();
      xhr.addEventListener("progress", function(evt) {





        if (evt.lengthComputable) {
          var percentComplete = Math.floor(evt.loaded / evt.total * 100);

        //  if (percentComplete > 5 && percentComplete < 30){
          //  var x = evt.target.response;
          //  x = x.substring(x.indexOf('"text"')+8);

            //  console.log(x)
            //  $(".doc:visible").html(x);

            //  xhr.abort();



        //  if (!$(".loading-doc").length)
          //  $("#info").html('<span class="loading-doc"></span> <span class="glyphicon glyphicon-refresh glyphicon-spin"></span>');

          if (ft.ongoingXhrId == id){
            $("#"+id).parent().css("background",
              "linear-gradient(90deg, rgb(170, 207, 231) "+percentComplete+"%, transparent 0%)");

              $("#"+id).next().css("background-color","white");
          }else
            xhr.abort();

        }
      }, false);

      return xhr;
    },
    url: "/doc/read",
    data: {id: id},
    error: function(r) {
      if (r.responseText=="Access denied")

          $(".glyphicon-refresh").removeClass("glyphicon-refresh glyphicon-spin");




          $("#info").append('<div class="alert alert-danger alert-dismissable">' +
              '<button  class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
            'Access denied to file id ' + id +  '.' + (($("#filetree #"+id).length) ? ' Remove from file tree?':'') + ' <button data-dismiss="alert" class="btn btn-xs btn-primary">Accept</button></div>')
              .on('click', ".btn-primary", function() {

                  if ($("#filetree #"+id).length){
                    $("#filetree #"+id).closest('.ft-item').remove();
                    return;
                  }
              })




    },
    success: function(r) {

      $(".glyphicon-refresh").removeClass("glyphicon-refresh glyphicon-spin");



      if (r == "Not found" && confirm("File id " + id + " is not found. Remove from file tree?")) {
        $(".ft-selected").closest('.ft-item').remove();
        return;
      }


      $("#"+id).parent().css("background", "").addClass('ft-visible');


      //set as selected doc object and change URL without reloading apge
      ft.selected = r;

      if (typeof history.pushState == "undefined") //ie9
        location.hash=ft.selected.id;
      else
        history.pushState(null, "", ft.selected.id);



      //show doc if not already loaded by the "show previously opened" check

        if (!$("#doc-" + ft.selected.id).length){

          if (window.chunk){

            var doc_div = $("<div>").addClass("doc").attr("id", "doc-" + ft.selected.id) //.attr('contenteditable',true);

              var SIZE = 100000;
              chunk_len = Math.ceil(ft.selected.text.length/SIZE);
              //console.log( ft.selected.text.length)

              for (var i = 0 ; i < chunk_len; i++){

                 doc_div.append("<div class='chunk' contenteditable='true'>"+ft.selected.text.substring(i*SIZE,(i+1)*SIZE)+"</div>")

              }



            // doc_div.html(ft.selected.text)

          } else{

            var doc_div = $("<div>").addClass("doc").attr("id", "doc-" + ft.selected.id).attr('contenteditable',true);




            doc_div.html(ft.selected.text)



          }


              doc_div.appendTo("#docs").show() //slideDown();
              /*
              setTimeout(function(){
                new MediumEditor('.doc', {
                    paste: {
                        cleanPastedHTML: true,
                        forcePlainText: false
                    }
                });

              }, 100);*/


        }

        delete ft.selected.text;
        $("#doc-" + ft.selected.id).data("info", ft.selected);

        onScroll();


      if($("#"+id).hasClass("collapsed"))
        $("#"+id).parent().find(".ft-icon").click()



      //add for public or shared files or files you removed from tree -- not in filetree
      if (!$('#' + ft.selected.id).length) {
        //setTimeout(function(){
          if (!u.index)
            u.index = [];

          u.index.push( {
            "id": ft.selected.id,
            "title": ft.selected.title,
            "type": "ft-file ft-selected public"})

          if (u.index[0].id=="home")
            delete u.index[0];


          ft.populate($("#filetree"),u.index);
          //$("#showround").click()
      //  }, 1000);

      }




      if (callback) callback()
      document.body.dispatchEvent(new CustomEvent("doc"));


      //put current doc title in the search box to improve clarity
      $("#select2-searchtext-container").html(ft.selected.title);


      //populate index with the new doc's headings
      ft.updateNeeded = true;
      ft.update();



    }
  });


},


populate: function(div, json) {

  if (ft.root &&  div[0] && div[0].id == ft.root[0].id){
    div.empty();
  }else{
    div.append('<div class="ft-list">');
    div = div.find('.ft-list');
  }

  for (var i in json) {
    //TODO author/share tooltip info // date crated/ added

    var item = json[i].type.indexOf("heading")>-1 ?
      $('<div class="ft-item' + (json[i].type.indexOf("ft-selected")>-1 ? ' ft-selected' : '') + '" draggable="true" ><span  id="' + json[i].id + '" class="ft-name ' +
        json[i].type + '" title="' + json[i].title + '" >' + json[i].title + '</span> </div>')
      : $('<div class="ft-item" draggable="true">'+

        '<span class="ft-icon fa fa-' +  (
              json[i].type.indexOf("ft-file")>-1 ? json[i].type.indexOf("collapsed")>-1 ? 'plus' :  'file'
               : json[i].type.indexOf("folder")>-1 ?  json[i].type.indexOf("collapsed")>-1 ? 'folder-close' :  'folder-open'
              : "" ) + " " + ( json[i].type.indexOf("public")>-1 ? ' ft-public ' : "") + '" ></span>'+

        '<span  id="' + json[i].id + '" class="ft-name ' + json[i].type + '"  >' + json[i].title + '</span></div>');


    item.appendTo(div)

    if (json[i].children && json[i].children.length)
      ft.populate(item, json[i].children);

  }

},

toJSON: function(startLevel) {
  if (typeof startLevel == 'undefined')
    startLevel = $("#filetree");

  var array = [];
  startLevel.children('.ft-item').each(function() {
    var itemName = $(this).find('.ft-name')[0];
    var item = {
      id: itemName.id,
      title: itemName.textContent,
      type: itemName.className.replace(/ft-name/gi, '').trim()
    };

    item.type += $(this).hasClass("ft-selected") ? " ft-selected" : "";



    var sub = $(this).children('.ft-list');
    if (sub.length)
      item.children = ft.toJSON(sub);
    array.push(item);
  });

  return array;

},

//upload tree index to server
updateIndex: function() {
  if (window.off)return;

  if (local) {
    localStorage.debate = JSON.stringify(u.index);

    ft.selected.text = $(".doc:visible").html().replace(/\'/g, '&#39;');
    localStorage["debate_" + ft.selected.id] = JSON.stringify(ft.selected);
  } else if (u.index.length && u.name)  //upload user as object to POST
    $.ajax({
        url: '/user/update',
        data: {userid: u._id, index:u.index},
        contentType: "application/x-www-form-urlencoded",
        type: 'POST'
    });

},

//save doc to server, update headings into index
update: function() {
  if (window.off)return;

  u.index = ft.toJSON();

  //find the headings
  if (ft.selected && $(".doc:visible").length && ft.updateNeeded && ft.selected.id == $(".doc:visible").attr('id').substring(4) ){
    var headingList = [],  i = 0,  selectedId = -1;

    if ($(".ft-selected .ft-name").hasClass("heading"))
      selectedId = parseInt($(".ft-selected .ft-name").attr("id").substring($(".ft-selected .ft-name").attr("id").indexOf("_") + 1))


    $(".doc:visible:first").find("h1, h2, h3").each(function() {

      if ($(this).text().length > 2) {
        headingList.push({
          'id': ft.selected.id + "_" + i.toString(),
          'title': $(this).text().substring(0, 50),
          'type': 'heading ' + 'heading-' + $(this).prop("tagName").toLowerCase() + (selectedId == i ? " ft-selected" : "")
        });

      }

      i++;

    });



    //add headings as children of current file to indexJSON
    for (var i in u.index)
      if (u.index[i].id == ft.selected.id){
        u.index[i].children = headingList;
        break;
      }





  	//backup for offline cache
  //	localStorage.debate = JSON.stringify(u.index);
  //  localStorage["debate_" + ft.selected.id] = JSON.stringify(ft.selected);




    //recreate index -- but only for the current doc to update its headings
    $("#"+ ft.selected.id).parent().find(".ft-list").remove()
    ft.populate( $("#"+ ft.selected.id).parent(), headingList);

    //upload doc
    $.post('/doc/update', {
      text: encodeURIComponent($(".doc:visible:first").html()),
      id: ft.selected.id
    });

    //5s counter
    ft.updateNeeded = false;
  }

  //save indexJSON
  ft.updateIndex();

},

//click on ft-name event or pass the id to click
click: function(e) {
  e = typeof e == "string" ? $("#" + e) : $(e.target).hasClass('ft-name') ? $(e.target) : $(e.target).find('.ft-name:first');

  var id = e.attr('id');
  var headingId = false;


  //TODO loading file inderectly or always showign the file name selected even as headers change
  $('.ft-selected').removeClass('ft-selected');
  e.parent().addClass('ft-selected');

  //click on heading to go to it and if needed open the file its in
  if (e.hasClass("heading")) {

    headingId = parseInt(id.substring(id.indexOf("_") + 1));
    id = id.substring(0, id.indexOf("_"));

     if (ft.selected && ft.selected.id == id && $(".doc:visible").attr('id').replace("doc-", '') == id)
      $(".doc:visible").find("h1, h2, h3")[headingId].scrollIntoView();
    else {//if clicked on header in unopened file, load that file, then go to header

      console.log(111)
      ft.loadFile(id, function(){
          //scroll to heading if triggered by click on heading within this doc
            $(".doc:visible").find("h1, h2, h3")[headingId].scrollIntoView();
      });
    }
  	//$(".doc:visible").scrollTop($(".doc:visible").scrollTop() - 260);


  //logged out, show homepage manual
  } else if (e.hasClass("ft-file") && !u.name) {


      ft.selected = u.index[0];

      if ($("#doc-" + id).length)
        $("#doc-" + id).show();

  //load file when clicked on filetitle
  } else if (e.hasClass("ft-file")) {
      ft.loadFile(id);

  }

},

dblclick: function() {

  if ($(this).hasClass("heading")) {

    var id = $(this).attr('id');

    var headingId = parseInt(id.substring(id.indexOf("_") + 1));
    id = id.substring(0, id.indexOf("_"));


    var headingList = $(".doc:visible").find("h1, h2, h3");

    var endNode = headingId == headingList.length - 1 ? $("#docs>p:last")[0] : headingList[headingId + 1];


    range = document.createRange();
    range.setStart(headingList[headingId], 0);
    range.setEnd(endNode, 0);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

  }

  if (!$(this).hasClass("ft-file") && !$(this).hasClass("folder"))
    return;
  //TODO what should dblclick/ longtouch on file titles do?

},


};
