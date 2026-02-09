$(document).ready(function(){

    let isOverFire = false;

    // move blue circle with mouse
    $(document).mousemove(function(e){
        $("#sprinkler").css({
            left: e.pageX - 20,
            top: e.pageY - 20
        });

        checkOverlap();
    });

    // detect click
    $(document).click(function(){
        if(isOverFire){
            shrinkFire();
        }
    });

    function checkOverlap(){

        let fire = $("#fire")[0].getBoundingClientRect();
        let sprinkler = $("#sprinkler")[0].getBoundingClientRect();

        isOverFire = !(
            sprinkler.right < fire.left ||
            sprinkler.left > fire.right ||
            sprinkler.bottom < fire.top ||
            sprinkler.top > fire.bottom
        );
    }

    function shrinkFire(){

        $("#fire").animate({
            width:"0px",
            opacity:0
        },2000,function(){
            $(this).hide();
        });

    }

});
