// start global variables //
	// Ranking Poker Hands
var handType = {
	'royalFlush': 10,
	'straightFlush': 9,
	'fourOfKind': 8,
	'fullHouse': 7,
	'flush': 6,
	'straight': 5,
	'threeOfKind': 4,
	'twoPair': 3,
	'onePair': 2,
	'highCard': 1
}

var Result = { "win": 1, "loss": 2, "tie": 3 }
// end global variables //


// start global functions //
function sortWithFrequency(list){
	map = repeatationMap(list);

	function compareFrequency(a, b) {
		a = parseInt(a);
		b = parseInt(b);
		if (map[a] != map[b]){
			return map[b] - map[a];
		}
		else{
			return a > b? -1:1;
		}
	}

	return Object.keys(map).sort(compareFrequency);
}

function repeatationMap(list){
	var map = {};
	list.forEach(elm => {
		if (map.hasOwnProperty(elm)){
			map[elm] += 1;
		}else {
			map[elm] = 1;
		}
	});
	return map;
}
// end global functions //



// start poker functions //
function splitHand(hand){
	// split cards 
	// split every card to value and suit  
	// [[val, suit], [val, suit],....]
	var arr = Array();
	hand.split(' ').forEach( card => {
		card = card.split('');
		suit = card.pop();
		val  = card.join(''); 
		arr.push([val, suit]); 
	});
	return arr;
}

function isSequence(list){
	// replace every value with number
	// sort accroding to numbers
	// compare every elm with prev differ must be one
	var map = {'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
	list = list.map((value, index)=>{if(map.hasOwnProperty(value)){return map[value]}else{return parseInt(value)} })
	list = list.sort((a,b)=>{return a - b});
	var sequence = true, 
		prev = list.shift();
	for (elm of list){
		if(elm - prev !== 1){
			sequence = false;
			break;
		}
		prev = elm;
	}
	return sequence;
}

function handRank(hand) {
	hand  = splitHand(hand);
	vals  = hand.map( (value, index) => {return value[0];} );
	suits = hand.map( (value, index) => {return value[1];} );

	suitsMap  = repeatationMap(suits);
	valsMap = repeatationMap(vals);

	if(Object.keys(suitsMap).length === 1){
		// royal flush  // straight flush  // flush
		if(isSequence(vals)){
			if(vals.includes('A')){
				return handType.royalFlush;
			}else{
				return handType.straightFlush;
			}
		}else {
			return handType.flush;
		}
	}else{
		var rank;
		switch (Object.values(valsMap).length) {
			case 2:
				rank = Object.values(valsMap).includes(4) ? handType.fourOfKind : handType.fullHouse;
				break;
			case 3:
				rank = Object.values(valsMap).includes(3) ? handType.threeOfKind : handType.twoPair;
				break;
			case 4:
				rank = handType.onePair;
				break;
			case 5:
				rank = isSequence(vals) ? handType.straight : handType.highCard;
				break;
		}
		return rank;
	}
}

function compareHandDegree(hand1, hand2){
	// if ranks are equal
	var valuesMap = {'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};

	hand1 = splitHand(hand1);
	hand2 = splitHand(hand2);

	vals1  = hand1.map( (value, index) => {return value[0];} );
	vals1  = vals1.map( (value, index) => { if(valuesMap.hasOwnProperty(value)){return valuesMap[value]}else{return value} } )
	vals2  = hand2.map( (value, index) => {return value[0];} );
	vals2  = vals2.map( (value, index) => { if(valuesMap.hasOwnProperty(value)){return valuesMap[value]}else{return value} } )

	order1 = sortWithFrequency(vals1);
	order2 = sortWithFrequency(vals2);

	var result, elm1, elm2;
	for(var i=0; i < order1.length; i++){
		elm1 = parseInt( order1[i] );
		elm2 = parseInt( order2[i] );

		if(elm1 > elm2){
			result = Result.win;
			break;
		}else if (elm2 > elm1){
			result = Result.loss;
			break;
		}
	}
	result = result? result: Result.tie;
	return result;
}

function PokerHand(hand) {
	this.hand = hand;
	this.rank = handRank(hand);

	this.compareWith = other => {
		if (this.rank > other.rank) {
			return Result.win;
		}
		else if (this.rank < other.rank) {
			return Result.loss;
		}
		else {
			if (this.rank == other.rank){
				return compareHandDegree(this.hand, other.hand);
			}else{
				return Result.tie;
			}
		}
	}
}
// end poker functions //

hand1  = '2S 3H 6H 7S 9C'; // high card rank 1  degrees 9  7 6 3 2
hand2  = '7H 3C TH 6H 9S'; // high card rank 1  degrees 10 9 7 6 3

player1 = new PokerHand(hand1);
player2 = new PokerHand(hand2);

x = player1.compareWith(player2); // loss -> 2
y = player2.compareWith(player1); // win  -> 1
z = player1.compareWith(player1); // tie  -> 3

console.log('player1 to player 2: ', x)
console.log('player2 to player 1: ', y)
console.log('player1 to player 1: ', z)


