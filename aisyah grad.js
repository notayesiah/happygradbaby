(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"aisyah grad_atlas_1", frames: [[765,482,1228,138],[0,865,1254,178],[0,0,1432,251],[0,1351,852,227],[0,1580,814,227],[0,1809,789,227],[765,253,751,227],[725,1045,706,227],[854,1496,680,227],[816,1725,691,209],[1256,834,725,187],[854,1274,716,220],[0,1045,723,304],[0,559,735,304],[737,622,767,210],[0,253,763,304]]},
		{name:"aisyah grad_atlas_2", frames: [[0,885,712,98],[1652,108,70,38],[1441,1429,191,73],[1520,108,130,60],[639,1407,230,73],[0,1093,290,82],[770,0,748,172],[0,985,394,106],[714,928,394,117],[1110,997,370,106],[1234,889,456,106],[1520,0,522,106],[588,712,522,106],[714,820,518,106],[0,367,577,128],[1351,174,668,178],[666,174,683,181],[0,173,664,192],[666,357,699,173],[1367,354,666,173],[1929,1069,119,178],[131,1177,125,178],[0,532,692,171],[1421,1177,125,178],[0,0,768,171],[1870,709,156,178],[1798,1069,129,178],[1929,1249,119,178],[685,1227,125,178],[812,1227,125,178],[1028,1105,129,178],[0,1357,119,178],[1692,889,156,178],[1548,1249,125,178],[1675,1249,125,178],[1159,1105,129,178],[121,1357,119,178],[1850,889,156,178],[1802,1249,125,178],[939,1285,125,178],[1290,1105,129,178],[396,985,156,178],[1320,1357,119,178],[1066,1285,125,178],[1193,1285,125,178],[292,1165,129,178],[258,1345,125,178],[385,1345,125,178],[554,985,156,178],[423,1165,129,178],[1482,997,156,178],[712,1047,156,178],[554,1165,129,178],[0,1177,129,178],[870,1047,156,178],[512,1345,125,178],[1640,1069,156,178],[1955,529,53,178],[871,1407,53,178],[1634,1429,53,178],[1689,1429,53,178],[1744,1429,53,178],[1799,1429,53,178],[1367,529,586,178],[694,532,586,178],[0,705,586,178],[1282,709,586,178]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_84 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_82 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_78 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_80 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_76 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_83 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_85 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_74 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_75 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_73 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_72 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["aisyah grad_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(55);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(56);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(57);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(58);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(59);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(60);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(61);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(62);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(63);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(64);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(65);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["aisyah grad_atlas_2"]);
	this.gotoAndStop(66);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_90 = function() {
	this.initialize(img.CachedBmp_90);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2563,1444);


(lib.CachedBmp_21 = function() {
	this.initialize(img.CachedBmp_21);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2573,1454);


(lib.CachedBmp_87 = function() {
	this.initialize(img.CachedBmp_87);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2563,1444);


(lib.taptap = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_87();
	this.instance.setTransform(-640.75,-360.85,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_90();
	this.instance_1.setTransform(-640.75,-360.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-640.7,-360.8,1281.5,722);


(lib.tapscreen = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_86();
	this.instance.setTransform(-306.9,-34.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},6).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-306.9,-34.6,614,69);


(lib.graduation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(-313.55,-44.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-313.5,-44.4,627,89);


(lib.box = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_85();
	this.instance.setTransform(-187.85,-32.9,0.2625,0.2625);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-187.8,-32.9,375.9,65.9);


// stage content:
(lib.aisyahgrad = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0,78];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_78 = function() {
		/* Stop at This Frame
		The  timeline will stop/pause at the frame where you insert this code.
		Can also be used to stop/pause the timeline of movieclips.
		*/
		
		this.stop();
		
		/* Click to Go to Frame and Play
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		this.button_1.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay(79);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(78).call(this.frame_78).wait(2));

	// button
	this.button_1 = new lib.taptap();
	this.button_1.name = "button_1";
	this.button_1.setTransform(638.75,358.85);
	this.button_1._off = true;
	new cjs.ButtonHelper(this.button_1, 0, 1, 2, false, new lib.taptap(), 3);

	this.timeline.addTween(cjs.Tween.get(this.button_1).wait(78).to({_off:false},0).to({_off:true},1).wait(1));

	// tap_screen
	this.instance = new lib.tapscreen();
	this.instance.setTransform(635.55,83.1);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(78).to({_off:false},0).to({_off:true},1).wait(1));

	// aisyah____
	this.instance_1 = new lib.CachedBmp_33();
	this.instance_1.setTransform(474.45,378,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_35();
	this.instance_2.setTransform(761.55,378,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_34();
	this.instance_3.setTransform(468.45,378,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_38();
	this.instance_4.setTransform(781.85,378,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_37();
	this.instance_5.setTransform(755.55,378,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_36();
	this.instance_6.setTransform(462.45,378,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_42();
	this.instance_7.setTransform(790.15,378,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_41();
	this.instance_8.setTransform(763.85,378,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_40();
	this.instance_9.setTransform(737.55,378,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_39();
	this.instance_10.setTransform(444.45,378,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_1}]},29).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_6},{t:this.instance_5},{t:this.instance_4}]},1).to({state:[{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7}]},1).wait(48));

	// happy
	this.instance_11 = new lib.CachedBmp_1();
	this.instance_11.setTransform(489.85,200.3,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_3();
	this.instance_12.setTransform(556.05,200.3,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_2();
	this.instance_13.setTransform(489.85,200.3,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_6();
	this.instance_14.setTransform(608.6,200.3,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_5();
	this.instance_15.setTransform(556.05,200.3,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_4();
	this.instance_16.setTransform(489.85,200.3,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_10();
	this.instance_17.setTransform(655.6,200.3,0.5,0.5);

	this.instance_18 = new lib.CachedBmp_9();
	this.instance_18.setTransform(608.6,200.3,0.5,0.5);

	this.instance_19 = new lib.CachedBmp_8();
	this.instance_19.setTransform(556.05,200.3,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_7();
	this.instance_20.setTransform(489.85,200.3,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_15();
	this.instance_21.setTransform(708.05,200.3,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_14();
	this.instance_22.setTransform(655.6,200.3,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_13();
	this.instance_23.setTransform(608.6,200.3,0.5,0.5);

	this.instance_24 = new lib.CachedBmp_12();
	this.instance_24.setTransform(556.05,200.3,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_11();
	this.instance_25.setTransform(489.85,200.3,0.5,0.5);

	this.instance_26 = new lib.CachedBmp_20();
	this.instance_26.setTransform(708.05,200.3,0.5,0.5);

	this.instance_27 = new lib.CachedBmp_19();
	this.instance_27.setTransform(655.6,200.3,0.5,0.5);

	this.instance_28 = new lib.CachedBmp_18();
	this.instance_28.setTransform(608.6,200.3,0.5,0.5);

	this.instance_29 = new lib.CachedBmp_17();
	this.instance_29.setTransform(556.05,200.3,0.5,0.5);

	this.instance_30 = new lib.CachedBmp_16();
	this.instance_30.setTransform(489.85,200.3,0.5,0.5);

	this.instance_31 = new lib.CachedBmp_26();
	this.instance_31.setTransform(708.05,200.3,0.5,0.5);

	this.instance_32 = new lib.CachedBmp_25();
	this.instance_32.setTransform(655.6,200.3,0.5,0.5);

	this.instance_33 = new lib.CachedBmp_24();
	this.instance_33.setTransform(608.6,200.3,0.5,0.5);

	this.instance_34 = new lib.CachedBmp_23();
	this.instance_34.setTransform(556.05,200.3,0.5,0.5);

	this.instance_35 = new lib.CachedBmp_22();
	this.instance_35.setTransform(489.85,200.3,0.5,0.5);

	this.instance_36 = new lib.graduation("synched",0);
	this.instance_36.setTransform(628.9,333.55);

	this.instance_37 = new lib.CachedBmp_31();
	this.instance_37.setTransform(708.05,200.3,0.5,0.5);

	this.instance_38 = new lib.CachedBmp_30();
	this.instance_38.setTransform(655.6,200.3,0.5,0.5);

	this.instance_39 = new lib.CachedBmp_29();
	this.instance_39.setTransform(608.6,200.3,0.5,0.5);

	this.instance_40 = new lib.CachedBmp_28();
	this.instance_40.setTransform(556.05,200.3,0.5,0.5);

	this.instance_41 = new lib.CachedBmp_27();
	this.instance_41.setTransform(489.85,200.3,0.5,0.5);

	this.instance_42 = new lib.CachedBmp_47();
	this.instance_42.setTransform(708.05,200.3,0.5,0.5);

	this.instance_43 = new lib.CachedBmp_46();
	this.instance_43.setTransform(655.6,200.3,0.5,0.5);

	this.instance_44 = new lib.CachedBmp_45();
	this.instance_44.setTransform(608.6,200.3,0.5,0.5);

	this.instance_45 = new lib.CachedBmp_44();
	this.instance_45.setTransform(556.05,200.3,0.5,0.5);

	this.instance_46 = new lib.CachedBmp_43();
	this.instance_46.setTransform(489.85,200.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_11}]}).to({state:[{t:this.instance_13},{t:this.instance_12}]},3).to({state:[{t:this.instance_16},{t:this.instance_15},{t:this.instance_14}]},3).to({state:[{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17}]},3).to({state:[{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21}]},3).to({state:[{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26}]},3).to({state:[{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31}]},3).to({state:[{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36}]},11).to({state:[{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_36}]},3).wait(48));

	// graduation
	this.instance_47 = new lib.graduation("synched",0);
	this.instance_47.setTransform(628.9,333.55,0.1802,0.1802,0,180,0);
	this.instance_47._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_47).wait(18).to({_off:false},0).to({scaleX:1,scaleY:1,skewX:0},11).to({startPosition:0},1).to({startPosition:0},2).wait(48));

	// Layer_6
	this.instance_48 = new lib.CachedBmp_48();
	this.instance_48.setTransform(470.95,522.15,0.5,0.5);

	this.instance_49 = new lib.CachedBmp_49();
	this.instance_49.setTransform(489.85,522.15,0.5,0.5);

	this.instance_50 = new lib.CachedBmp_50();
	this.instance_50.setTransform(488.85,516.8,0.5,0.5);

	this.instance_51 = new lib.CachedBmp_51();
	this.instance_51.setTransform(484.9,503.95,0.5,0.5);

	this.instance_52 = new lib.CachedBmp_52();
	this.instance_52.setTransform(483.95,503.95,0.5,0.5);

	this.instance_53 = new lib.CachedBmp_53();
	this.instance_53.setTransform(482.95,507.95,0.5,0.5);

	this.instance_54 = new lib.CachedBmp_54();
	this.instance_54.setTransform(491.95,513.95,0.5,0.5);

	this.instance_55 = new lib.CachedBmp_55();
	this.instance_55.setTransform(482.95,517.45,0.5,0.5);

	this.instance_56 = new lib.CachedBmp_56();
	this.instance_56.setTransform(486.95,519.45,0.5,0.5);

	this.instance_57 = new lib.CachedBmp_57();
	this.instance_57.setTransform(481.45,516.95,0.5,0.5);

	this.instance_58 = new lib.CachedBmp_58();
	this.instance_58.setTransform(486.95,518.95,0.5,0.5);

	this.instance_59 = new lib.CachedBmp_59();
	this.instance_59.setTransform(490.95,522.15,0.5,0.5);

	this.instance_60 = new lib.CachedBmp_60();
	this.instance_60.setTransform(490.45,522.15,0.5,0.5);

	this.instance_61 = new lib.CachedBmp_61();
	this.instance_61.setTransform(490.95,522.15,0.5,0.5);

	this.instance_62 = new lib.CachedBmp_62();
	this.instance_62.setTransform(486.45,522.15,0.5,0.5);

	this.instance_63 = new lib.CachedBmp_63();
	this.instance_63.setTransform(486.45,519.45,0.5,0.5);

	this.instance_64 = new lib.CachedBmp_64();
	this.instance_64.setTransform(482.45,520.55,0.5,0.5);

	this.instance_65 = new lib.CachedBmp_65();
	this.instance_65.setTransform(483.45,513.45,0.5,0.5);

	this.instance_66 = new lib.CachedBmp_66();
	this.instance_66.setTransform(481.45,520.45,0.5,0.5);

	this.instance_67 = new lib.CachedBmp_67();
	this.instance_67.setTransform(477.95,533.95,0.5,0.5);

	this.instance_68 = new lib.CachedBmp_68();
	this.instance_68.setTransform(477.95,560.45,0.5,0.5);

	this.instance_69 = new lib.CachedBmp_69();
	this.instance_69.setTransform(512.95,558.95,0.5,0.5);

	this.instance_70 = new lib.CachedBmp_70();
	this.instance_70.setTransform(526.95,557.45,0.5,0.5);

	this.instance_71 = new lib.CachedBmp_71();
	this.instance_71.setTransform(539.45,555.55,0.5,0.5);

	this.instance_72 = new lib.CachedBmp_72();
	this.instance_72.setTransform(554.6,555.55,0.5,0.5);

	this.instance_73 = new lib.CachedBmp_73();
	this.instance_73.setTransform(576.1,555.55,0.5,0.5);

	this.instance_74 = new lib.CachedBmp_74();
	this.instance_74.setTransform(584.45,555.55,0.5,0.5);

	this.instance_75 = new lib.CachedBmp_75();
	this.instance_75.setTransform(603.45,559.95,0.5,0.5);

	this.instance_76 = new lib.CachedBmp_76();
	this.instance_76.setTransform(635.5,559.95,0.5,0.5);

	this.instance_77 = new lib.CachedBmp_77();
	this.instance_77.setTransform(649.9,558.3,0.5,0.5);

	this.instance_78 = new lib.CachedBmp_78();
	this.instance_78.setTransform(668.3,558.3,0.5,0.5);

	this.instance_79 = new lib.CachedBmp_80();
	this.instance_79.setTransform(696.25,559.5,0.5,0.5);

	this.instance_80 = new lib.CachedBmp_82();
	this.instance_80.setTransform(727.45,570.3,0.5,0.5);

	this.instance_81 = new lib.box("synched",0);
	this.instance_81.setTransform(1095.65,632.75,1.9048,1);
	this.instance_81._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_48}]},33).to({state:[{t:this.instance_49}]},1).to({state:[{t:this.instance_50}]},1).to({state:[{t:this.instance_51}]},1).to({state:[{t:this.instance_52}]},1).to({state:[{t:this.instance_53}]},1).to({state:[{t:this.instance_54}]},1).to({state:[{t:this.instance_55}]},1).to({state:[{t:this.instance_56}]},1).to({state:[{t:this.instance_57}]},1).to({state:[{t:this.instance_58}]},1).to({state:[{t:this.instance_59}]},1).to({state:[{t:this.instance_60}]},1).to({state:[{t:this.instance_61}]},1).to({state:[{t:this.instance_62}]},1).to({state:[{t:this.instance_63}]},1).to({state:[{t:this.instance_64}]},1).to({state:[{t:this.instance_65}]},1).to({state:[{t:this.instance_66}]},1).to({state:[{t:this.instance_67}]},1).to({state:[{t:this.instance_68}]},1).to({state:[{t:this.instance_69}]},1).to({state:[{t:this.instance_70}]},1).to({state:[{t:this.instance_71}]},1).to({state:[{t:this.instance_72}]},1).to({state:[{t:this.instance_73}]},1).to({state:[{t:this.instance_74}]},1).to({state:[{t:this.instance_75}]},1).to({state:[{t:this.instance_76}]},1).to({state:[{t:this.instance_77}]},1).to({state:[{t:this.instance_78}]},1).to({state:[{t:this.instance_79,p:{x:696.25,y:559.5}}]},1).to({state:[{t:this.instance_79,p:{x:708.85,y:560.7}}]},1).to({state:[{t:this.instance_80,p:{x:727.45,y:570.3}}]},1).to({state:[{t:this.instance_80,p:{x:741.05,y:570.7}}]},1).to({state:[]},1).to({state:[{t:this.instance_81}]},1).to({state:[{t:this.instance_81}]},8).to({state:[]},1).to({state:[]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_81).wait(69).to({_off:false},0).to({scaleX:0.1325,x:1082.95,y:634.75},8).to({_off:true},1).wait(2));

	// Layer_5
	this.instance_82 = new lib.CachedBmp_83();
	this.instance_82.setTransform(444.45,522.15,0.5,0.5);
	this.instance_82._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_82).wait(33).to({_off:false},0).wait(47));

	// Layer_7
	this.instance_83 = new lib.CachedBmp_84();
	this.instance_83.setTransform(718.2,618.35,0.5,0.5);
	this.instance_83._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_83).wait(69).to({_off:false},0).wait(11));

	// background
	this.instance_84 = new lib.CachedBmp_21();
	this.instance_84.setTransform(-6.4,-4.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_84).wait(80));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(633.6,355.6,820.1999999999999,367);
// library properties:
lib.properties = {
	id: 'DDA554EF60B94467A3F48E8259EF936F',
	width: 1280,
	height: 720,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_90.png", id:"CachedBmp_90"},
		{src:"images/CachedBmp_21.png", id:"CachedBmp_21"},
		{src:"images/CachedBmp_87.png", id:"CachedBmp_87"},
		{src:"images/aisyah grad_atlas_1.png", id:"aisyah grad_atlas_1"},
		{src:"images/aisyah grad_atlas_2.png", id:"aisyah grad_atlas_2"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['DDA554EF60B94467A3F48E8259EF936F'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;