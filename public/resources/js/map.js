$(function(){
    //init the map
    var myLatLng = new google.maps.LatLng(31.7833, 35.2167);

    var mapOptions = {
        center: myLatLng,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map($("#map").get(0),
        mapOptions);

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title:"Hello World!"
    });
});