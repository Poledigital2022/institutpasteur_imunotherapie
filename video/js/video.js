var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'uwWwid35PeU',
    enablejsapi: 1,
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    start: 11,
    fs: 0,
    loop: 1,
    modestbranding:0,
    rel:0,
    showinfo:0,
    iv_load_policy: 3,
    events: {
      'onReady': onPlayerReady
      // 'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();
  //event.target.stopVideo();
  event.target.seekTo(11);
  event.target.pauseVideo();
  //event.target.mute();
  event.target.setPlaybackQuality('highres');
  //console.log(event.target);
}
