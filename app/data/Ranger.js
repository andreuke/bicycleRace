// Draft uses global variables new_labels and new_data

var dataElaboration = {
	ranger: function(data, labels, range) {
		var num_buckets = Math.floor(d3.max(labels, function(d) {
			return parseInt(d, 10)
		}) / range) + 1;
		var bucket = 0;
		var object = {}
		var result = [];
		var new_labels = [];
		result[0] = 0;
		for (var i = 0; i < labels.length; i++) {
			if (parseInt(labels[i], 10) > range * (bucket + 1)) {
				bucket++;
				result[bucket] = 0;
			}
			result[bucket] += data[i];
		}
		for (var i = 0; i < num_buckets; i++) {
			new_labels[i] = "" + range * (i + 1);
		}
		return {
			data: result,
			labels: new_labels
		}
	},

	getFromJSON: function(json, what, enableParse) {
		var tmpArray = [];
		for (var i = 0; i < json.data.length; i++) {
			if (enableParse === true) {
				tmpArray.push(parseInt(json.data[i][what], 10));
			} else {
				tmpArray.push(json.data[i][what]);
			}
		}
		return tmpArray;
	},
}