$( document ).ready(function() {
    console.log( "ready!" );

    $('.recent-activity-notifications').click( function(){
        alert("Shows recent activity list similar to Facebook");
    })

    $('.user-avatar').click( function(){
        alert("Shows basic user information on hover. User can navigate to full-user page from there.");
        window.location = "./home.userDetails.html"
    })

    $('.add-contribution').click( function(){
    	$('.add-contribution-dialog').show();
    })

    $('#cancel').click( function(){
    	$('.add-contribution-dialog').hide();
    })


    $('#submit').click( function(){
    	$('.add-contribution-dialog').hide();
    })


    $('.side-nav-element').click( function(){

    		$('.side-nav-element').removeClass("active");
            $(this).addClass("active");

    })

    $('.sigma-scene').click( function(){
    	alert("graph clicked");
    })

});

