$(document).ready(function(){
  $('form').on('submit', function(e){
    e.preventDefault();
    $.ajax({
      // always use this url
      url: 'http://localhost:8080/' + $('.input').val(),
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        console.log('message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('failed to send message');
      }
    });
  })
}); 