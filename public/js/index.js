//NO AUTO GLOBALS!!!
"use strict";

const MAXIMUM_PHONE_WIDTH = 720;

//CLOSURES

//Sizing functions - Done as closure to hide globals.
//var fitContentToScreen = (function() {
//    //Getting elements on screen.
//    var middleDiv = $("#middle-div");
//    var leftDiv = $("#left-div");
//    var rightDiv = $("#right-div");
//    //Getting width of screen.
//    var oldWidth = $(window).width();
//    return function(firstTime) {
//        var width = $(window).width();
//        if (((width > MAXIMUM_PHONE_WIDTH) && (oldWidth < MAXIMUM_PHONE_WIDTH)) || (firstTime && (width > MAXIMUM_PHONE_WIDTH))) {
//            middleDiv.removeClass("col-xs-12");
//            middleDiv.addClass("col-xs-7");
//            rightDiv.removeClass("hidden");
//            leftDiv.removeClass("hidden");
//        }
//        if ((width < MAXIMUM_PHONE_WIDTH) && (oldWidth > MAXIMUM_PHONE_WIDTH) || (firstTime && (width < MAXIMUM_PHONE_WIDTH))) {
//            middleDiv.addClass("col-xs-12");
//            middleDiv.removeClass("col-xs-7");
//            rightDiv.addClass("hidden");
//            leftDiv.addClass("hidden");
//        }
//        oldWidth = width;
//    };
//})();

//This function makes a request to the conversation resource of the Watson Conversation API. 
//It also calls the talk function which shows what each user has said in the chat box element.
var converse = (function() {
    var context;
    var chatInput = $("#chat-input");
    var chatInput2 = $("#chat-input2");
    var loader = $("#loader");
    return function(userText) {
        loader.show();

        // check if the user typed text or not
        if (typeof(userText) !== undefined && $.trim(userText) !== "") {
            submitMessage(userText);
        }
        // build the conversation parameters to send to the Watson API.
        var params = {
            input: userText
        };

        // check if there is a conversation in place and continue that
        // by specifing the conversation_id and client_id
        if (context) {
            params.context = context; //These params are only sent if they were sent from the API.
        }
        //Making POST request to Watson Dialog API.
        $.ajax({
                type: "POST",
                url: "/conversation",
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json"
            })
            .done(function onSuccess(returnedJson) {
                chatInput.val("");
		chatInput2.val("");// clear the text input
                // Updating conversation API response variables.
                context = returnedJson.context;
                var texts = returnedJson.output.text;
                //Resetting variables that handle ratings.
                var eventHandlersToAdd;
                var showRating = false;
                var currentQuestionID = null;
                //Removes emtpy array elements in the response.
                for (var i = 0; i < texts.length; i++) {
                    if (texts[i].length == 0 || texts[i] == null || texts[i] == undefined) {
                        texts.splice(i, 1);
                    }
                    //parsing MCT auto learn items.
                    /* //Parsing MCT autolearnitems.
        	if (texts[i].indexOf("<start>") > -1){
        		texts[i] = texts[i].replace("<start>", "");
        		$.post('servlet/initialize_records', {conversation_id: conversation_id, client_id: client_id})
        			.done(function onSuccess(response) {
        			console.log("records initialized");
      	  	  })
      	  	  .fail(function onError(error) {
      	  	     alert(error);
      	  	  })
        	}
        	//parsing MCT auto learn items.
        	if (texts[i].indexOf("<mct:autolearnitems>") > -1) {
        		console.log(texts[i]);
        		//Regex to match everything not inside html tags
        		var regex = /([^>]+)(?!([^<]+)?>)/g;
        		var regexMatches = texts[i].match(regex);
        		console.log(regexMatches.length);
        		console.log(regexMatches);
        		//turning auto learn items in ul links.
        		var newText = "<ul>";
        		for (var x = 0; x < regexMatches.length; x++) {
        			newText += ("<li class = 'auto-learn-item'>" + regexMatches[x] + "</li>");
        		}
        		newText += "</ul>";
        		console.log(newText);
        		texts[i] = newText;
        		eventHandlersToAdd = true;
        		complexMessage = true;
        	}
        	//Parsing MCT inputs.
        	if (texts[i].indexOf("<mct:input>") > -1) {
        		console.log(texts[i]);
        		//Regex to match everything not inside html tags
        		var regex = /<mct:input>([\s\S]*?)<\/mct:input>/g;
        		var regexMatches = texts[i].match(regex);
        		//turning auto learn items in ul links.
        		var newText = "<ul>";
        		for (var x = 0; x < regexMatches.length; x++) {
        			regexMatches[x] = regexMatches[x].replace("<mct:input>", "");
        			regexMatches[x] = regexMatches[x].replace("<\/mct:input>", "");
        			newText += ("<li class = 'auto-learn-item'>" + regexMatches[x] + "</li>");
        		}
        		newText += "</ul>";
        		console.log(newText);
        		texts[i] = texts[i].replace(/(<ul>[\S\s]*<\/ul>)/, newText);
        		eventHandlersToAdd = true;
        		complexMessage = true;
        	}
        	if (texts[i].indexOf("<mct:link>") > -1) {
        		console.log(texts[i]);
        		//Regex to match urls
        		var regexForUrl = /<mct:url>([\s\S]*?)<\/mct:url>/g;
        		var regexMatchesForUrl = texts[i].match(regexForUrl);
        		//regex to match labels.
        		var regexForLabel = /<mct:label>([\s\S]*?)<\/mct:label>/g;
        		var regexMatchesForLabel = texts[i].match(regexForLabel);
        		var newText2 = texts[i];
        		//Iterating through all mct:links found and replacing them with appropriate HTML tags: anchors, etc.
        		for (var y = 0; y < regexMatchesForUrl.length; y++) {
        			regexMatchesForUrl[y] = regexMatchesForUrl[y].replace(/<mct:url>/g, "");
        			regexMatchesForUrl[y] = regexMatchesForUrl[y].replace(/<\/mct:url>/g, "");
        			regexMatchesForLabel[y] = regexMatchesForLabel[y].replace(/<mct:label>/g, "");
        			regexMatchesForLabel[y] = regexMatchesForLabel[y].replace(/<\/mct:label>/g, "");
        			var aTag = "<a target = '_blank' href = '" + regexMatchesForUrl[y] + "'" + ">" + regexMatchesForLabel[y] + "</a>";
        			newText2 = newText2.replace(/<mct:link>([\s\S]*?)<\/mct:link>/, aTag);
        		}
        		newText2 = newText2.replace("<mct:link>", "");
        		newText2 = newText2.replace("<\/mct:link>", "");
        		console.log(newText2);
        		texts[i] = newText2;
        		complexMessage = true;
        	} */
                    if (context.questionID) {
                        currentQuestionID = context.questionID;
                    }
                    //if (texts[i].indexOf("<finish>") > -1){
                    //texts[i] = texts[i].replace("<finish>", "");
                    //texts[i] = texts[i].replace("<\/finish>", "");
                    //finishConversation();
                    //}
                }
                /*var logParams = {client_id: params.client_id, response: cleanedResponse, input: dialog.input, conversation_id: conversation_id, confidence: dialog.confidence};
        $.post('servlet/log_message', logParams)
	  	  .done(function onSuccess(response) {
	  		  console.log("response");
	  		 //var parsedResponse = JSON.parse(response);
	  		 //alert(parsedResponse);
	  	  })
	  	  .fail(function onError(error) {
	  	     alert(error);
	  	 })*/

                chatInput.show();
                chatInput.focus();


                //Call talk function to show Watson response in chatbox.
                talk("WATSON", texts.join(". "), eventHandlersToAdd, currentQuestionID); // show

                //getProfile();
            })
            .always(function always() {
                loader.hide();
                scrollChatToBottom();
                chatInput.focus();
            });

    }
})();

//ON READY FUNCTION

//Function that runs when the page loads - initializes key variables.
$(document).ready(function() {

    //Resizing screen to device.
    //fitContentToScreen(true);

    hideScrollBar();

    //EVENT HANDLERS

    $("#options-menu").click(function(event) {
        $(".dropdown-content").show();
    });


    $(".common-question-button").click(function(event) {
        converse($(this).text());
    });


    //This event handler binds the rate button logic to rating buttons as they are created.
    $("#chat-div").on("click", ".rating-button", function(event) {
        var questionSentiment = $(this).attr("data-question-sentiment");
        $(this).siblings(".rating-button").css("visibility", "hidden");
        var questionID = $(this).attr("data-question-id");
        var params = {
            questionID: questionID,
            questionSentiment: questionSentiment
        };
        $.post("/rate_question", params)
            .done(function onSuccess(response) {
                console.log("response");
                //var parsedResponse = JSON.parse(response);
                //alert(parsedResponse);
            })
            .fail(function onError(jqHXR, textStatus, errorThrown) {
                console.log(errorThrown);
            })
    });


    //Function that runs when the window size changes. Adds content is screen is too big/removes content if screen is too small.
//    $(window).resize(function() {
//        fitContentToScreen(false);
//    });


    //Binds an event handler for enter to the input box that starts the converse method.
    $("#chat-input").keyup(function(event) {
        if (event.keyCode === 13) {
            //Passing the text the user typed in to the converstation function.
            if(!($(this).val().trim() === "")){
            	 converse($(this).val());
            }
        }
        $("chat-input").val("");
    });
	
	$("#chat-input2").keyup(function(event) {
        if (event.keyCode === 13) {
            //Passing the text the user typed in to the converstation function.
            if(!($(this).val().trim() === "")){
            	 converse($(this).val());
            }
        }
        $("chat-input2").val("");
    });
	
	
	
	
	
	

    //Binds an event handler that submits the users message when they press the send button.
         $("#send-button").click(function(event) {
    
    	//if(!($(this).val().trim() != "")){
        	//converse($("#chat-input").val());
        	converse($("#chat-input").val());
        //}
        $("chat-input").val("");
    });

    
     $("#send-button2").click(function(event) {
    
    	//if(!($(this).val().trim() != "")){
        	//converse($("#chat-input").val());
        	converse($("#chat-input2").val());
        //}
        $("chat-input2").val("");
    });

    
    
    
    converse("");
    scrollToInput();
});

//Binds an event handler that submits the users message when they press the generate button.
         $("#generate-button").click(function(event) {
         	
         	openInNewTab('https://www.ibm.com/support/servicerequest/');
         	
         	
    
    	//if(!($(this).val().trim() != "")){
        	//converse($("#chat-input").val());
        	//converse($("#chat-input").val());
        //}
        //$("chat-input").val("");
    });


//FUNCTION DECLARATIONS

//Hides the scrollbar in the chat-div when the page loads.
function hideScrollBar() {
    //OffsetWidth and clientWidth not accessiable through JQuery object.
    var chatDiv = document.getElementById("chat-div");
    var scrollBarWidth = chatDiv.offsetWidth - chatDiv.clientWidth;
    $(chatDiv).css("width", "calc(100% + " + scrollBarWidth + "px)");
}

function rateQuestion(textElement) {
	var questionSentiment = $(this).attr("data-question-sentiment");
    $(this).siblings(".rating-button").css("visibility", "hidden");
    var questionID = $(this).attr("data-question-id");
    var params = {
        questionID: questionID,
        questionSentiment: questionSentiment
    };
    $.post("servlet/rate_question", params)
        .done(function onSuccess(response) {
            console.log(response);
        })
        .fail(function onError(jqHXR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
}


// funcion abrir url

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}


//This function sends a post request to the server to save the users details in the database.
function finishConversation() {
    var params = {
        client_id: client_id,
        conversation_id: conversation_id
    };
    $.post("servlet/finish_conversation", params)
        .done(function onSuccess(response) {})
        .fail(function onError(jqHXR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
}

//Function that starts an animation that takes 420 milliseconds and scroll the vertical 
//scroll bar of the first element of the chatbox pane all the way to the bottom. Used when a new message 
//is shown in the chat box to display the message clearly.
function scrollChatToBottom() {
    var element = $("#chat-div");
    element.animate({
        scrollTop: element[0].scrollHeight
    }, 420);
};

//Scrolls the chat-div down to see new messages.
function scrollToInput() {
    var element = $("#chat-input");
    $("body, html").animate({
        scrollTop: (element.offset().top - window.innerHeight + element[0].offsetHeight) + 20 + "px"
    });
};

//Creates a new chatBubble based of what type of message need to be displayed.
function createChatBubbleHtmlElement(origin, currentQuestionID) {
    var chatBox;
    if (currentQuestionID) {
        //Setting event handler of rating buttons.
        chatBox = $(".chat-bar_WATSONRATING").first().clone();
        chatBox.find(".rating-button").attr("data-question-id", currentQuestionID);
    } else {
        chatBox = $(".chat-bar_" + origin).first().clone();
    }
    return chatBox;
};

/*Function that adds a new chat-box--item div when someone speaks in the chat. 
 * It clones the first Chatbox item based on who spoke, inserts the text that was said between the p tags in the chatbox
 *  and inserts it before the loader div.*/
function talk(origin, text, eventHandlersToAdd, currentQuestionID) {
    var chatBox = createChatBubbleHtmlElement(origin, currentQuestionID);
    //Add text to element.
    chatBox.find("p").html(text);
    //Adding onclick events to autolearnitems now that they are part of the DOM.
    chatBox.addClass("chat-bar_TRANSITION");
    chatBox.removeClass("chat-bar_HIDDEN");
    chatBox.insertBefore($("#loader"));
    if (eventHandlersToAdd) {
        chatBox.find(".clickable-element").on("click", function() {
            converse($(this).text());
        });
    }
    setTimeout(function() {
        chatBox.removeClass("chat-bar_TRANSITION");
    }, 100);
};

//Function that shows a message the user types in the chatbox and scrolls the chat window to the bottom.
function submitMessage(text) {
    talk("USER", text, false, false);
    scrollChatToBottom();
};


function get_current_page() 
        {
        var pathArray = window.location.pathname.split( '/' );
          var current_page = pathArray[pathArray.length-1];
          current_page_array = current_page.split(".");
          current_page = current_page_array[0];



          if (current_page =='students' || current_page=='my-profile' ||  current_page=='faqs' || current_page == 'forecast-career'){
            document.getElementById("joinuslist").className += " active";
            document.getElementById("joinus").className += " in";

            if (current_page == 'students') {
              document.getElementById("students").className += " active";
            }
            else if (current_page == 'faqs') {
              document.getElementById("faqs").className += " active";
            }
            else if (current_page == 'forecast-career') {
              document.getElementById("forecast-career").className += " active";
            }
            else if (current_page == 'my-profile') {
              document.getElementById("my-profile").className += " active";
            }
            else{
            }
          }
          else if(current_page == 'values' || current_page == 'ambassadors' || current_page == 'documentary'){


              if(current_page== 'values'){ 
                document.getElementById("values").className += " active"; 
              }
              else if (current_page== 'ambassadors') { 
                document.getElementById("ambassadors").className += " active"; 
              } 
                else if (current_page== 'documentary') { 
                document.getElementById("documentary").className += " active"; 
              }
              else{

              }

            }

        }
