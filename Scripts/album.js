

//from the album object, populates the table with the song
var createSongRow = function(songNumber, songName,songLength){

    var template =
        '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
    var $row = $(template);
    
    var clickHandler=function(){
        var songItemNumber= parseInt($(this).attr("data-song-number"));
        
        if(currentlyPlayingSongNumber===null){
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber=songItemNumber;
            currentSongFromAlbum=currentAlbum.songs[currentlyPlayingSongNumber-1];
            updatePlayerBarSong(currentSongFromAlbum);
        
        }else if(currentlyPlayingSongNumber===songItemNumber){
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber=null;
            currentSongFromAlbum=null;
            $(".main-controls .play-pause").html(playerBarPlayButton);
        
        }else if(currentlyPlayingSongNumber!= songItemNumber){
            
            var $currentlyPlayingSongElement= $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr("data-song-number"));
            
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber=songItemNumber;
            currentSongFromAlbum=currentAlbum.songs[currentlyPlayingSongNumber-1];
            updatePlayerBarSong(currentSongFromAlbum);
        }
    };
    
    var onHover=function(){
        var songItemNumber=parseInt($(this).find(".song-item-number").attr("data-song-number"));
        if(songItemNumber!==currentlyPlayingSongNumber){
            $(this).find(".song-item-number").html(playButtonTemplate);
        }
    };
    
    var offHover=function(){
       var songItemNumber=parseInt($(this).find(".song-item-number").attr("data-song-number"));
       console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
       if(songItemNumber!== currentlyPlayingSongNumber){
            $(this).find(".song-item-number").html(songItemNumber);
        }
    };
    
    
    
    $row.find(".song-item-number").click(clickHandler);
    
    $row.hover(onHover,offHover);
    return $row;
};

var updatePlayerBarSong=function(song){
        $(".player-bar .song-name").text(song["title"]);
        $(".player-bar .artist-name").text(currentAlbum.artist);
        $(".player-bar .artist-song-mobile").text(song["title"]+" - "+currentAlbum.artist)
        $(".main-controls .play-pause").html(playerBarPauseButton);
    };

// this sets the page to the album you pass in 
 var setCurrentAlbum = function(album) {
     currentAlbum=album;
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


var trackIndex= function(album,song){
    return album.songs.indexOf(song);
};

var nextSong=function(){
  //change the symbol in the song that is being LEFT to a number again    
  $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber);  

  //set the song number to the next song. if we're at the end of the list, loop around   
  if (trackIndex(currentAlbum,currentSongFromAlbum)===currentAlbum.songs.length-1 ){
      
      currentlyPlayingSongNumber=1;
  }else{
      
      currentlyPlayingSongNumber++;
  }
  //update what the current song is, and then update the player bar with that info
  currentSongFromAlbum=currentAlbum.songs[currentlyPlayingSongNumber-1];
    
  updatePlayerBarSong(currentSongFromAlbum);
  
  //update the symbol in the currently playing song with a pause button    
  $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
        
};

var previousSong=function(){
  //change the symbol in the song that is being LEFT to a number again    
  $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber);  

  //set the song number to the next song. if we're at the beginning of the list, loop around   
  if (trackIndex(currentAlbum,currentSongFromAlbum)===0 ){
      currentlyPlayingSongNumber=currentAlbum.songs.length;
  }else{
      currentlyPlayingSongNumber--;
  }
  //update what the current song is, and then update the player bar with that info
  currentSongFromAlbum=currentAlbum.songs[currentlyPlayingSongNumber-1];
  updatePlayerBarSong(currentSongFromAlbum);
  
  //update the symbol in the currently playing song with a pause button    
  $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
        
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate= '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//store the currently playing song as null
var currentlyPlayingSongNumber=null;
var currentAlbum=null;
var currentSongFromAlbum=null;

var $previousButton=$(".main-controls .previous");
var $nextButton = $('.main-controls .next');


 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);

 });