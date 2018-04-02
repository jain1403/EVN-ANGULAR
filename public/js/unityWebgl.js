$( "ui-view" ).find( "gameContainer" ).ready(function(){
	var gameInstance = UnityLoader.instantiate("gameContainer", "../Build/unity-export.json");
});
