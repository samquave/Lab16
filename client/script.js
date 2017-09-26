var $submitBtn = $('#chirp-submit');
var $chirpInput = $('#chirp-input-box');
var $chirpList = $('#chirp-field');

$submitBtn.click(postChirp);

$chirpInput.on('input', function () {
    var isEmpty = $chirpInput.val().length === 0;
    $submitBtn.prop('disabled', isEmpty);
});

function postChirp() {
    var chirp = {
        message: $chirpInput.val(),
        user: 'Sam',

    };
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function (success) {
        $chirpInput.val('');
        $submitBtn.prop('disabled', true);
        getChirps();
    }, function (err) {
        console.log(err);
    })


}
function getChirps() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps'

    }).then(function (chirps) {
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++) {
            var $chirpDiv = $('<div class="chirp-div"></div>');
            var $message = $('<p></p>');
            var $user = $('<h4></h4>');
            var $timestamp = $('<h5></h5>');
            var $deleteBtn = $('<button id="delete-btn"><span class= "glyphicon glyphicon-trash"></span></button>');
            $deleteBtn.click(deleteChirp);



            $message.text(chirps[i].message);
            $user.text(chirps[i].user);
            $timestamp.text(new Date(chirps[i].timestamp).toLocaleString());
            $message.appendTo($chirpDiv);
            $user.appendTo($chirpDiv);
            $timestamp.appendTo($chirpDiv);
            $deleteBtn.appendTo($chirpDiv);
            $chirpDiv.appendTo($chirpList);

            function deleteChirp() {
                $.ajax({
                    method: 'DELETE',
                    url: '/api/chirps',
                    
                }).then(function () {
                    
                    $chirpDiv.remove();
                }), function (err) {
                    console.log(err);
                }
            }



        }

    }, function (err) {
        console.log(err);
    });
}






getChirps();