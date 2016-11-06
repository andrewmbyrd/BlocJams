

//from the album object, populates the table with the song
var createSongRow = function(songNumber, songName,songLength){

    var template =
        '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;
 
    var $row = $(template);
    
    var clickHandler=function(){
        var songItemNumber= parseInt($(this).attr("data-song-number"));
        
        if(currentlyPlayingSongNumber===null){
            $(this).html(pauseButtonTemplate);
            setSong(songItemNumber);
            updatePlayerBarSong(currentSongFromAlbum);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updateSeekPercentage($(".player-bar .volume .seek-bar"),currentVolume/$(".player-bar .volume .seek-bar").width());
        
        }else if(currentlyPlayingSongNumber===songItemNumber){
            $(this).html(playButtonTemplate);
            //currentlyPlayingSongNumber=null;
            //currentSongFromAlbum=null;
            if(currentSoundFile.isPaused()){
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $(this).html(pauseButtonTemplate);
                $(".main-controls .play-pause").html(playerBarPauseButton);
            }else{
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $(".main-controls .play-pause").html(playerBarPlayButton);
            }
        
        }else if(currentlyPlayingSongNumber!= songItemNumber){
            
            var $currentlyPlayingSongElement= getSongNumberCell(currentlyPlayingSongNumber);
            
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr("data-song-number"));
            
            $(this).html(pauseButtonTemplate);
            setSong(songItemNumber);
            updatePlayerBarSong(currentSongFromAlbum);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
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

var setSong=function(songNumber){
  if(currentSoundFile){
      currentSoundFile.stop();
  }    
  currentlyPlayingSongNumber=parseInt(songNumber);
  currentSongFromAlbum=currentAlbum.songs[currentlyPlayingSongNumber-1];
  currentSoundFile=new buzz.sound(currentSongFromAlbum.audioURL,{formats: ['mp3'], preload: true});
    
  setVolume(currentVolume);
};

var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};

var seek = function(time){
    if(currentSoundFile){
        currentSoundFile.setTime(time);
    }
};
var getSongNumberCell=function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};


var updatePlayerBarSong=function(song){
        $(".player-bar .song-name").text(song["title"]);
        $(".player-bar .artist-name").text(currentAlbum.artist);
        $(".player-bar .artist-song-mobile").text(song["title"]+" - "+currentAlbum.artist);
        $(".main-controls .play-pause").html(playerBarPauseButton);
        setTotalTimeInPlayerBar(song["duration"]);
};

var togglePlayFromPlayerBar=function(){
    if(currentSoundFile){
      if(currentSoundFile.isPaused()){
        $(getSongNumberCell(currentlyPlayingSongNumber)).html(pauseButtonTemplate);
        $mainPlay.html(playerBarPauseButton);
        currentSoundFile.play();
     }else{
        $(getSongNumberCell(currentlyPlayingSongNumber)).html(playButtonTemplate);
        $mainPlay.html(playerBarPlayButton);
        currentSoundFile.pause();
     }
     }else{
         alert("Select a song to play first!");
     } 
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

var setCurrentTimeInPlayerBar=function(currentTime){
        $(".current-time").text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar=function(totalTime){
    $(".total-time").text(filterTimeCode(totalTime));
};

var filterTimeCode=function(timeInSeconds){
    var t=parseFloat(timeInSeconds);
    var minutes=Math.floor(t/60);
    var seconds=Math.floor(t%60);
    if(seconds<10){
        return minutes+":0"+seconds;
    }
    return minutes+":"+seconds;
};

var updateSeekBarWhileSongPlays=function(){
    if (currentSoundFile) {
         currentSoundFile.bind('timeupdate.normal', function(event) {
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
             setCurrentTimeInPlayerBar(this.getTime());
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
    
};

var updateSeekPercentage=function($seekBar, seekBarFillRatio){
    var offsetXPercent=seekBarFillRatio*100;
    offsetXPercent=Math.max(0,offsetXPercent);
    offsetXPercent=Math.min(100,offsetXPercent);
    
    var percentageString=offsetXPercent+"%";
    $seekBar.find(".fill").width(percentageString);
    $seekBar.find(".thumb").css({left: percentageString});
};

var setupSeekBars = function(){
    var $seekBars =$(".player-bar .seek-bar");
    
    $seekBars.click(function(event){
        var offsetX =event.pageX - $(this).offset().left;
        var barWidth =$(this).width();
        
        var seekBarFillRatio = offsetX/barWidth;
        
        
        
        updateSeekPercentage($(this),seekBarFillRatio);
    
       if(this.parentElement.className==="seek-control"){
            if(currentSoundFile){
                seek(seekBarFillRatio*currentSoundFile.getDuration());
            }
        }else{
            setVolume(seekBarFillRatio*100);
        }
    });
    
     $seekBars.find('.thumb').mousedown(function(event) {
         
         var $seekBar = $(this).parent();
 
         var grandpa=this.parentElement.parentElement.className;
         $(document).bind('mousemove.thumb', function(event){
             
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             updateSeekPercentage($seekBar, seekBarFillRatio); 
          
             
             
        if(grandpa=="seek-control"){
                if(currentSoundFile){
                    seek(seekBarFillRatio*currentSoundFile.getDuration());
                    setCurrentTimeInPlayerBar(seekBarFillRatio*currentSoundFile.getDuration());
                }
        }else{
            setVolume(seekBarFillRatio*100);
        }
            
         });
 
         
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });

};

var trackIndex= function(album,song){
    return album.songs.indexOf(song);
};

var nextSong=function(){
  //change the symbol in the song that is being LEFT to a number again
  getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber); 

  //set the song number to the next song. if we're at the end of the list, loop around   
  if (trackIndex(currentAlbum,currentSongFromAlbum)===currentAlbum.songs.length-1 ){
      
      currentlyPlayingSongNumber=1;
  }else{
      
      currentlyPlayingSongNumber++;
  }
  //update what the current song is, and then update the player bar with that info
  setSong(currentlyPlayingSongNumber);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();    
    
  updatePlayerBarSong(currentSongFromAlbum);
  
  //update the symbol in the currently playing song with a pause button 
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        
};

var previousSong=function(){
  //change the symbol in the song that is being LEFT to a number again    
  getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);  

  //set the song number to the next song. if we're at the beginning of the list, loop around   
  if (trackIndex(currentAlbum,currentSongFromAlbum)===0 ){
      currentlyPlayingSongNumber=currentAlbum.songs.length;
  }else{
      currentlyPlayingSongNumber--;
  }
  //update what the current song is, and then update the player bar with that info
  setSong(currentlyPlayingSongNumber);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong(currentSongFromAlbum);
  
  //update the symbol in the currently playing song with a pause button    
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        
};


var $mainPlay=$(".main-controls .play-pause");
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate= '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//store the currently playing song as null
var currentlyPlayingSongNumber=null;
var currentAlbum=null;
var currentSongFromAlbum=null;
var currentSoundFile=null;
var currentVolume=80;

var $previousButton=$(".main-controls .previous");
var $nextButton = $('.main-controls .next');


 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $mainPlay.click(togglePlayFromPlayerBar);
     setupSeekBars();

 });