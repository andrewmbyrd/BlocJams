//creates album objects
var albumPicasso={
    title: "The Colors",
    artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
    
};

var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

//loops through the song array full of objects in the album object and populates a //table with the song
var createSongRow = function(songNumber, songName,songLength){

    var template =
        '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return $(template);
};


// this sets the page to the album you pass in 
 var setCurrentAlbum = function(album) {
     
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     
     $albumSongList.empty();
 
     
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow= createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

//use this function to pass in an element and its parent element you're looking for. //It will return the ancestor if it exists
var findParentByClassName=function(element,parentClass){
    if(element!==null){
        
    
    while(element.parentElement.className!==null){
        if(element.parentElement.className==parentClass){
            return element.parentElement;
        }
        element=element.parentElement;
    }
    }
    
};





//returns the song item number associated with the current element

var getSongItem = function(givenElement){
    
    switch(givenElement.className){
        case "album-view-song-item":
            return givenElement.querySelector(".song-item-number");
        case "song-item-number":
            return givenElement;
        case "song-item-title":
        case "song-item-duration":
        case "album-song-button":
        case "ion-play":
        case "ion-pause":
            return findParentByClassName(givenElement,"album-view-song-item").querySelector(".song-item-number");
            
    }
    
    
};


//handles what to do on clicks
var clickHandler =function(targetElement){
    //gets the song-item-number of the element passed in
    var songItemNumber = getSongItem(targetElement);
    
    //if that is null, then nothing has been clicked yet. so this song has started playing, and so we need to changed its symbol to a pause button. then update what the currently playing song is
    if(currentlyPlayingSong===null){
        songItemNumber.innerHTML=pauseButtonTemplate;
        currentlyPlayingSong= songItemNumber.getAttribute("data-song-number");
    
    
    //then if its not null, and we click on this same song again, then we effectively paused the thing so we need to change the symbol back to a play button. nothing is playing now, so we set currentlyplayingSong back to null
    }else if(currentlyPlayingSong==songItemNumber.getAttribute("data-song-number")){
        songItemNumber.innerHTML=playButtonTemplate;
        currentlyPlayingSong=null;
    
    
    /*if, while one song is playing, we click another song, then we need to effectively pause the first song, but its not "active" anymore so we just set its song-item-number back to a number. then, on whatever song we clicked, it's now effectively playing so we need to update its symbol to a pause button, and then change currently playing song to it*/
    }else if (currentlyPlayingSong != songItemNumber.getAttribute('data-song-number')) {
        
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        
         songItemNumber.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItemNumber.getAttribute('data-song-number');
        
     }
};

var songListContainer = document.getElementsByClassName("album-view-song-list")[0];
var songRows = document.getElementsByClassName('album-view-song-item');


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate= '<a class="album-song-button"><span class="ion-pause"></span></a>';

//store the currently playing song as null
var currentlyPlayingSong=null;


 window.onload = function() {
     setCurrentAlbum(albumPicasso);
     
    songListContainer.addEventListener("mouseover",function(event){
    
        var songItem=getSongItem(event.target);
        var songItemNumber=songItem.getAttribute("data-song-number");
        
        if (songItemNumber!=currentlyPlayingSong) {
            songItem.innerHTML = playButtonTemplate;
         }
});




     for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             //gets the song-item-number ELEMENT of the ROW we just left
             var songItem=getSongItem(event.target);
             //gets the actual DATA in the song-item-number ELEMENT
             var songItemNumber=songItem.getAttribute("data-song-number");
             
             //as long as the item we're leaving isn't the currently playing song, then go ahead and change the data to be a number again
             if(songItemNumber!=currentlyPlayingSong){
                 songItem.innerHTML =songItemNumber;
             }
         });    
         
         songRows[i].addEventListener("click",function(event){
            clickHandler(event.target);  
         });
         
     }

 };