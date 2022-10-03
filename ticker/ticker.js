var wintitle = document.title;
if(true) {
	if('undefined' !== typeof WebSocket) {
		var stream = 'wss://stream.binance.com:9443/stream?streams=luncbusd@miniTicker/ustcbusd@miniTicker';
		let socket = new WebSocket(stream);
	
		socket.onopen = function(e) {
		};
	
		socket.onmessage = function(event) {
			let json = JSON.parse(event.data);
			let id = '';
			if(json['data']['s'] === 'LUNCBUSD') {
			  id = 'ticker-lunc';
			} else if(json['data']['s'] === 'USTCBUSD') {
			  id = 'ticker-ustc';
			}
	
			let price = json['data']['c'];
	
			if(!prev[id]) {
				prev[id] = price;
			}
			let cl = 'text-white';
			if(prev[id] > price) {
				cl = 'text-danger';
			} else if(prev[id] < price) {
				cl = 'text-success';
			}
			$('#' + id).text('$ ' + price).removeClass('text-white text-danger text-success').addClass(cl);
			if(json['data']['s'] === 'LUNCBUSD') {
				document.title = 'LUNC: $' + price + ' – ' + wintitle;
			}
			prev[id] = price;
		};
	
		socket.onclose = function(event) {
			if(!event.wasClean) {
				console.log('ws closed');
			}
		};
	
		socket.onerror = function(error) {
			console.log(error.message);
		};
	}

	function blockHeight() {
		$.getJSON('/data/block_height.html', function(data) {
			$('#ticker-height').html(data.height);
			$('#ticker-epoch').html(data.epoch);
			$('#ticker-height-epoch').html(data.epoch_until);
			$('#ticker-height-staking').html(data.staking);
			$('#ticker-height-validators').html(data.validators);
			$('#ticker-height-tax').html(data.tax);
			$('#ticker-height-taxa').html(data.taxa);
			$('#ticker-burned-tax').html(data.taxburn);
		});
		window.setTimeout(function() { blockHeight(); }, 2500);
	}

	blockHeight();
}
