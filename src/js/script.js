/*-----------------------------------------------------------------------------------*/
/* LOAD THE CHATBOT BUTTON & DIALOG */
/*-----------------------------------------------------------------------------------*/

const loadChatBot = function () {

  const addDialog = document.createElement("div");
  addDialog.id = ('chatBot');
  addDialog.innerHTML = "{{load path='./src/html/dialog.html'}}"; //injected with gulp
  addDialog.className = ('chatbot');
  addDialog.setAttribute('data-chatbot', false);
  document.body.prepend(addDialog);

}

loadChatBot();


/*-----------------------------------------------------------------------------------*/
/* SET THE CHATBOT OPTIONS */
/*-----------------------------------------------------------------------------------*/

let setChatBot;
let timeout = 100;

setChatBot = function (id) {

  setTimeout(function () {
    timeout--;
    if ( typeof loadChatBot !== 'undefined' ) {

      const chatToggle   =   document.querySelector('#chatToggle');
      const chatDialog   =   document.querySelector('#chatDialog');
      
      const chatParent   =   chatDialog.parentElement;
      const chatTxt      =   chatToggle.querySelector('.chatbot__txt');
      const chatEmbed    =   chatDialog.querySelector('iframe');

      const showChat     =   sessionStorage.getItem('chatActive');


      /*-----------------------------------------------------------------------------------*/
      /* OPEN/CLOSE FUNCTIONS */
      /*-----------------------------------------------------------------------------------*/

      function openChat() {

        chatDialog.classList.remove('chatbot__dialog--closed');
        chatDialog.classList.add('chatbot__dialog--open');
        chatDialog.setAttribute('aria-hidden', false);

        chatToggle.classList.remove('chatbot__btn--closed');
        chatToggle.classList.add('chatbot__btn--open');
        chatToggle.setAttribute('aria-expanded', true);

      }

      function openChatSession() {

        sessionStorage.setItem('chatActive', 'true');
        
        chatEmbed.setAttribute('src', chatUrl);
        chatTxt.innerHTML = "Close chat";

        chatDialog.classList.remove('chatbot__dialog--closed');
        chatDialog.classList.add('chatbot__dialog--open');
        chatDialog.setAttribute('aria-hidden', false);

        chatToggle.classList.remove('chatbot__btn--closed');
        chatToggle.classList.add('chatbot__btn--open');
        chatToggle.setAttribute('aria-expanded', true);

      }

      function closeChat() {

        chatDialog.classList.remove('chatbot__dialog--open');
        chatDialog.classList.add('chatbot__dialog--closed');
        chatDialog.setAttribute('aria-hidden', true);
        
        chatToggle.classList.remove('chatbot__btn--open');
        chatToggle.classList.add('chatbot__btn--closed');
        chatToggle.setAttribute('aria-expanded', false);

      }

      function closeChatSession() {

        sessionStorage.setItem('chatActive', 'false');

        chatTxt.innerHTML = "Open chat";

        chatDialog.classList.remove('chatbot__dialog--open');
        chatDialog.classList.add('chatbot__dialog--closed');
        chatDialog.setAttribute('aria-hidden', true);
        
        chatToggle.classList.remove('chatbot__btn--open');
        chatToggle.classList.add('chatbot__btn--closed');
        chatToggle.setAttribute('aria-expanded', false);

      }


      /*-----------------------------------------------------------------------------------*/
      /* CHECK LOCTION OF CHATBOT */
      /*-----------------------------------------------------------------------------------*/

      if( id.chatbot_location == 'right') {
        chatParent.classList.add('chatbot--right');
      } else {
        chatParent.classList.add('chatbot--left');
      }


      /*-----------------------------------------------------------------------------------*/
      /* GET THE ZAPIER EMBEDCODE */
      /*-----------------------------------------------------------------------------------*/

      if( id.chatbot_id ){

        const chatBase     =   "https://interfaces.zapier.com/embed/chatbot/";
        const chatUrl      =   chatBase + id.chatbot_id;


        /*-----------------------------------------------------------------------------------*/
        /* CLICK EVENTS */
        /*-----------------------------------------------------------------------------------*/

        chatToggle.addEventListener("click", function() {

          if (chatDialog.classList.contains('chatbot__dialog--open')) {

            sessionStorage.setItem('chatActive', 'false');

            chatTxt.innerHTML = "Open chat";

            closeChat();


            /* --------------------- GOOGLE TAG MANAGER CUSTOM EVENT TRIGGER (https://www.analyticsmania.com/post/google-tag-manager-custom-event-trigger/) --------------------- */

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'event': 'chatbotClosed'
            });
      
          } else {

            chatEmbed.setAttribute('src', chatUrl);

            sessionStorage.setItem('chatActive', 'true');

            chatTxt.innerHTML = "Close chat";

            openChat();

            /* --------------------- GOOGLE TAG MANAGER CUSTOM EVENT TRIGGER (https://www.analyticsmania.com/post/google-tag-manager-custom-event-trigger/) --------------------- */

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'event': 'chatbotOpened'
            });
      
          }
      
        });


        /*-----------------------------------------------------------------------------------*/
        /* CHATBOT VISIBILITY */
        /*-----------------------------------------------------------------------------------*/

        setTimeout(() => {

          /*-----------------------------------------------------------------------------------*/
          /* CHECK IF CHATBOT NEEDS TO SHOW BETWEEN A TIME FRAME */
          /*-----------------------------------------------------------------------------------*/

          function scheduleChat(time) {

            const startParts = time.start.split(':');
            const endParts = time.end.split(':');
        
            const startHour = parseInt(startParts[0]);
            const startMinute = parseInt(startParts[1]);
        
            const endHour = parseInt(endParts[0]);
            const endMinute = parseInt(endParts[1]); 
        
            var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
        
            return (hours === startHour && minutes >= startMinute) || (hours > startHour && hours < endHour) || (hours === endHour && minutes <= endMinute);

          }

          if (id.chatbot_start) {

            if (scheduleChat({ start: id.chatbot_start, end: id.chatbot_end })) {

              chatParent.setAttribute('data-chatbot', true);
    
            } else {
    
              chatParent.setAttribute('data-chatbot', false);
    
            }

          } else {
    
            chatParent.setAttribute('data-chatbot', true);
  
          }

          /*-----------------------------------------------------------------------------------*/
          /* SHOW ONLOAD */
          /*-----------------------------------------------------------------------------------*/

          if( id.chatbot_onload === true ){
          
            if (!showChat || showChat == 'true') {
              
              chatEmbed.setAttribute('src', chatUrl);

              sessionStorage.setItem('chatActive', 'true');

              chatTxt.innerHTML = "Close chat";

              openChat(); 

            }

            if (showChat == 'false') {

              sessionStorage.setItem('chatActive', 'false');

              chatTxt.innerHTML="Open chat";

              closeChat();

            }

          } else {

            /*-----------------------------------------------------------------------------------*/
            /* DON'T SHOW ONLOAD */
            /*-----------------------------------------------------------------------------------*/

            if (!showChat) {
              
              closeChat();

            }

            if (showChat == 'true') {
              
              chatEmbed.setAttribute('src', chatUrl);

              sessionStorage.setItem('chatActive', 'true');

              chatTxt.innerHTML = "Close chat";

              openChat(); 

            }

            if (showChat == 'false') {

              sessionStorage.setItem('chatActive', 'false');
              
              chatTxt.innerHTML="Open chat";

              closeChat();

            }
          
          }

        }, 1000)

      }

    } else if (timeout > 0) {
      setChatBot();
    } else {
      console.log('No chatEmbed Script Loaded')
    }

  }, 100);

}