$( document ).ready(function() {
    console.log( "ready!" );

    $('.side-nav-element').click( function(){

    		$('.side-nav-element').removeClass("active");
            $(this).addClass("active");

    })

    $('.sigma-scene').click( function(){
    	alert("graph clicked");
    })

});

