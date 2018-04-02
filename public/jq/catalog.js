$(document).ready(function(){
	// Base Page
	$(".cat-card").show();

	// Filters
	$("#performance-model-filter").click(function(){
	    $(this).toggleClass("-fill--outline");
	    $(".card-performance").toggle();
	});
	$("#lifing-model-filter").click(function(){
	    $(this).toggleClass("-fill--outline");
	    $(".card-lifing").toggle();
	});
	$("#anomaly-model-filter").click(function(){
	    $(this).toggleClass("-fill--outline");
	    $(".card-anomaly").toggle();
	});

	// Sidebar
	$("#side-item-condenser").click(function(){
		$(".cat-card").hide();
	    $(".card-item-condenser").show();
	});


	// Coming Soon
	$("#run-analytic-coming").hide();
	$("#deploy-analytic-coming").hide();
	$("#run-analytic-button").click(function(){
	    $("#run-analytic-coming").show();
	});
	$("#deploy-analytic-button").click(function(){
	    $("#deploy-analytic-coming").show();
	});


});