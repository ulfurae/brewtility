'use strict';

$(document).ready(function () {
	primingCalculator.init();
});

var primingCalculator = (function () {
	var amountField;
	var temperField;
	var targetCo2Field;

	function init() {
		amountField = $('#amountField');
		temperField = $('#temperatureField');
		targetCo2Field = $('#targetCo2Field');

		$('.calculate').click(updateCalculator);
		amountField.change((e) => updateCalculator(e)); // jshint ignore:line
		temperField.change((e) => updateCalculator(e)); // jshint ignore:line
		targetCo2Field.change((e) => updateCalculator(e)); // jshint ignore:line
	}

	function updateCalculator(e) {
		e.preventDefault();
	
		if (validateInput()) {
			var amounts = calculatePrimingSugar();
			showResults(amounts);
		}
		else {
			window.alert('All input fields must be filled out');
		}
	}

	function calculatePrimingSugar() {
		var beerTemp = parseFloat(temperField.val());
		var finalC02 = parseFloat(targetCo2Field.val());
		var beerVolume = parseFloat(amountField.val());

		var initialC02 = (0+1.013)*Math.pow(2.71828182845904, (-10.73797+(2617.25/(beerTemp+273.15))))*10; // jshint ignore:line
		var finalCarb = Math.round(((finalC02 - initialC02) * beerVolume/0.5) * 10) / 10; // jshint ignore:line

		var tableSugar = { name: 'Table Sugar: ', value: finalCarb };
		
		return [tableSugar];
	}

	function showResults(calculations) {
		var calculator = $('#calculator');
		$('.results').remove();

		calculations.forEach(function(element) {
			$('<span class="results">' + element.name + '</span>').appendTo(calculator); // jshint ignore:line
			$('<b class="results results-st">' + element.value + '</b>').appendTo(calculator); // jshint ignore:line
		});
	}

	function validateInput() {
		var amount = amountField.val() !== '';
		var temp = temperField.val() !== '';
		var co2 = targetCo2Field.val() !== '';

		return amount && temp && co2;
	}

	return {
		init: init
	};
})();
