var sum = 0;
var EVs = [];
var yieldCount = 0;
var singleEVCap = 252;
var totalEVCap = 510;
var specialIndexCap = 21;
var currentGen = 7;
var lastGen = 0;

// Replaces document.getElementById() with $()
function $(id) {
	return document.getElementById(id);
}

// Counts the current value of EV yields from the inputs
function countYield() {
	yieldCount = 0;
	
	for (var index = 6; index < 12; index++) {
		EVs[index - 6] = parseInt(document.getElementsByTagName("input")[index].value);
		yieldCount += EVs[index - 6];
	}
}

// Doubles the EV yields
function doubleEVs() {
	for(var index = 0; index < 6; index++)
		EVs[index] *= 2;
}

// Checks if any EVs are above the allowed maximum
function validateEVs() {
	var EVSpread = document.getElementsByTagName("input");
	for (var index = 0; index < 6; index++) {
		if (EVSpread[index].value > singleEVCap) {
			EVSpread[index].value = singleEVCap;
		} else if (EVSpread[index].value < 0 || isNaN(EVSpread[index].value)) {
			EVSpread[index].value = 0;
		}
	}
}

// Checks if the passed in EV is valid relative to the current EV count
function validateEV(ev) {
	var EV = $(ev).children[0].children[0].value;
	if (isNaN(EV) || EV == "") {
		$(ev).children[0].children[0].value = 0;
	} else {
		validateEVs();
		EV = $(ev).children[0].children[0].value;
		
		if (EV > totalEVCap - sum) {
			var tempSum = sum
			countEVs();
			
			if (sum > totalEVCap && EV > totalEVCap - tempSum) {
				sum -= EV;
				$(ev).children[0].children[0].value = totalEVCap - sum;
			}
		}
		countEVs();
	}
}

// Counts the current EV spread
function countEVs() {
	sum = 0;
	for (var index = 0; index < 6; index++)
		sum += parseInt(document.getElementsByTagName("input")[index].value);
}


// Checks power items and special inputs to calculate effective EV yield
function check() {
	countYield();
	
	if (yieldCount >= 0 && yieldCount <= 3) {
		if (currentGen >= 4) {
			for (var index = 12; index < 18; index++) {
				if (document.getElementsByTagName("input")[index].checked)
					EVs[index - 12] += (currentGen >= 7) ? 8 : 4;
			}			
		}
		
		for (var index = 18; index < specialIndexCap; index++) {
			if (document.getElementsByTagName("input")[index].checked)
				doubleEVs();
		}
		
		update();
	}
}

// Updates the displayed EV spread
function update() {
	for (var index = 0; index < 6; index++) {
		validateEVs();
		countEVs();
		display = parseInt(document.getElementsByTagName("input")[index].value);
		if (sum < totalEVCap) {
			if (EVs[index] > totalEVCap - sum)
				EVs[index] = totalEVCap - sum;
			
			display += EVs[index];
			
			if (display >= singleEVCap)
				display = singleEVCap;
			
			document.getElementsByTagName("input")[index].value = display;
		}
	}
}

// Increments the EV yield to at most 3
function increment(ev) {
	countYield();
	if ($(ev).value < 3 && yieldCount < 3) 
		$(ev).value = parseInt($(ev).value) + 1;
}

// Decrements the EV yield to at most 0
function decrement(ev) {
	if ($(ev).value > 0)
		$(ev).value = parseInt($(ev).value) - 1;
}

// Unchecks all inputs and sets EV yields to 0
function resetForm() {
	for (var index = 6; index < 12; index++) {
		document.getElementsByTagName("input")[index].value = 0;
		document.getElementsByName("held_item")[index - 6].checked = false;
	}
	
	for (var index = 0; index < 3; index++)
		$("special_inputs").children[index].children[0].checked = false;
}

// Resets all EVs to 0
function resetSpread() {
	for (var index = 0; index < 6; index++)
		document.getElementsByTagName("input")[index].value = 0;
}

// Updates the page to reflect the currently selected generation
function updateGen() {
	lastGen = currentGen;
	currentGen = parseInt($("gen_list").value);
	singleEVCap = (currentGen >= 6) ? 252 : 255;
	specialIndexCap = (currentGen >= 7) ? 21 : 20;
	
	updatePage();
	validateEVs();
}

// Updates the page to show or hide the power items and / or SOS Ally depending on the generation
function updatePage() {
	$("ally_label_box").style.display = $("ally_box").style.display = (currentGen <= 6) ? "none" : "block";
	updateMachoBrace();
	$("power_items").style.display = (currentGen <= 3) ? "none" : "block";
	
}

// Updates the Macho Brace as a checkbox or radio button depending on the generation
function updateMachoBrace() {
	if (lastGen == 3 && currentGen != 3) {
		$("brace").setAttribute("type", "radio");
	} else if (lastGen != 3 && currentGen == 3) {
		$("brace").setAttribute("type", "checkbox");
	}
}