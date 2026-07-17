let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Screen Wake Lock is active!');
  } catch (err) {
    console.error(`Wake lock request failed: ${err.name}, ${err.message}`);
  }
}

function releaseWakeLock() {
  if (wakeLock !== null) {
    wakeLock.release()
      .then(() => { wakeLock = null; })
      .catch(err => console.error(err));
  }
}

// Automatically re-acquire the lock if the page becomes visible again
document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
});


// Main class to hold current player info
class Player {
    constructor(name, sex, clothing){
        this.name = name;
        this.sex = sex;
        this.clothing = clothing;
        this.body = new Body(this.sex);
        if (sex == "m"){
            this.iWantto ="I want to cover you in Whipped Cream and lick it slowly off";
            this.iWantYouto = "I want you to put on a pair of my underwear and give me a lapdance, then eat my pussy until I cum";
            this.IWantUsto = "I want to drench us in oil wrestling until one of us gets pinned, then shower and clean eachother off";
        } else {
            this.iWantto = "I want to tie you up, blindfold you, and tease you until you beg me to do anything I want to you.";
            this.iWantYouto = "I want you to pin my face down with your legs and fuck my face until you can't take it anymore. Smother me with your delicious pussy.";
            this.IWantUsto = "I want us to move from room to room finding a place for me to make you cum in each room. Let's make every part of the house a sexy memory.";
        }
        
    }
    getName() {return this.name;}
    getSex() {return this.sex;}
    getCurrentClothing() {return this.clothing;}
    setCoverage(){
        Object.keys(this.body.torso).forEach (key => {this.body.torso[key] = 0;});
        Object.keys(this.body.groin).forEach (key => {this.body.groin[key] = 0;});
        Object.keys(this.body.head).forEach (key => {this.body.head[key] = 0;});
        Object.keys(this.body.limbs).forEach (key => {this.body.limbs[key] = 0;});
        for (var i=0;i<this.clothing.length;i++){
            var curItem = (Clothing.getCoverage(this.clothing[i]));
            for (var j=0; j<curItem.length;j++ ){
                var cov = curItem[j];
                if (cov == "Torso"){
                        Object.keys(this.body.torso).forEach (key => {
                            this.body.torso[key] = 1;
                        });
                    } else if (cov == "Head"){
                        Object.keys(this.body.head).forEach (key => {
                            this.body.head[key] = 1;
                        });
                    } else if (cov == "Groin"){
                        Object.keys(this.body.groin).forEach (key => {
                            this.body.groin[key] = 1;
                        });   
                    } else if (cov == "Limbs"){
                        Object.keys(this.body.limbs).forEach (key => {
                            this.body.limbs[key] = 1;
                        });
                    }
                    else {
                        // single items that are not full body list
                        Object.keys(this.body.torso).forEach (key => {if (cov == key) this.body.torso[key] = 1;});
                        Object.keys(this.body.groin).forEach (key => {if (cov == key) this.body.groin[key] = 1;});
                        Object.keys(this.body.head).forEach (key => {if (cov == key) this.body.head[key] = 1;});
                        Object.keys(this.body.limbs).forEach (key => {if (cov == key) this.body.limbs[key] = 1;});
                    }
                }
            }
        }
    }

class Body {
    constructor (s) {
        this.head = {"Neck":0, "Head":0, "Face":0, "Ears":0, "Lips":0};
        this.limbs = {"Upper_Arms":0, "Forearms":0, "Hands":0, "Lower_Thigh":0, "Calves":0, "Feet":0 };
        
        if (s == "m") {
            this.torso = {"Upper_Back":0, "Lower_Back":0, "Collarbone":0, "Chest":0, "Nipples":0, "Abs":0, "Ribs":0};
            this.groin = {"Butt":0, "Hips":0, "Balls":0, "Pubic_Bone":0, "Inner_Thigh":0, "Cock":0};
        } else {
            this.torso = {"Upper_Back":0, "Lower_Back":0, "Collarbone":0, "Breasts":0, "Nipples":0, "Abs":0, "Ribs":0};
            this.groin = {"Butt":0, "Hips":0, "Clit":0, "Pubic_Bone":0, "Inner_Thigh":0, "Pussy":0};   
        }
        
    }
}

class Clothing {
    constructor(type) {
        this.type = type;
    }
    static getCoverage(type) {
        switch(type){
            case "Tank":
                return ["Upper_Back", "Lower_Back", "Chest", "Nipples", "Abs", "Ribs"];
            case "Top-L":
                return ["Torso", "Upper_Arms", "Forearms"];
            case "Top-S":
                return ["Torso", "Upper_Arms"];
            case "Bra":
                return ["Tits", "Nipples"];
            case "Panties":
                return ["Pussy", "Clit", "Butt"];
            case "Thong":
                return ["Pussy", "Clit"];
            case "Briefs":
                return ["Groin"];
            case "Bottom-S":
                return ["Groin", "Lower_Thigh"];
            case "Bottom-L":
                return ["Groin", "Lower_Thigh", "Calves"];

        }
    }
}

 class RollActions{
    constructor(){
    }
    // number listed is min-round
    static onSkin = ["Kiss","Lick","Suck","Blow_On","Nibble","Use", "Savor", "Taste", "Explore"];
    static overClothes = ["Knead","Massage","Stroke","Caress","Rub","Squeeze","Embrace", "Tease", "Worship", "Feel", "Graze"];
    static position = ["Standing", "Sitting","Lay","Mount", "Straddle","Ride"];
    static extra = ["A_Blindfold", "Restraints", "No_Sounds", "Dirty_Talk", "Ice", "Oil/Syrup/etc" ];
    static duration = [1,2,3,0,1,1,1,2,2,3];

    static Roll(actor, target, round, opt){
        var avAction;
        var aName = actor.name;
        var tName = target.name;
        var rnd1Body = {...target.body.limbs, ...target.body.head, ...target.body.torso};
        var rnd2Body = {...target.body.limbs, ...target.body.head, ...target.body.torso,  ...target.body.groin};
        var tbody;
        if (round <= 1) {
            tbody = rnd1Body
        } else{
            tbody = rnd2Body
        }
        var bodySelection = Math.floor(Math.random()*Object.keys(tbody).length);
        var bodyPart = Object.keys(tbody)[bodySelection];
        // Selects the appropriate body part and action based on whether the clothing under is or not.  
        if (tbody[bodyPart] != 1) {
            var avAction = [...this.onSkin,...this.overClothes];
        } else {
            var avAction = [...this.overClothes];
        }
        var actionRoll = avAction[Math.floor(Math.random()*avAction.length)];
        var dur = this.duration[Math.floor(Math.random()*this.duration.length)];
        var pos = this.position[Math.floor(Math.random()*this.position.length)];
        var xxxtra = this.extra[Math.floor(Math.random()*this.extra.length)];
        return  {Actor:aName, Target:tName, Action:actionRoll, Bodypart:bodyPart, Duration:dur, Position:pos, Spicy:xxxtra, Round:round};
        // player picks between an a or b card (gives opt)
        // opts direct the randomizer
        // roll returns "points"
        // points guide escalation
        // hands, mouth, high, low, 
    }        
    
}

// WORKLIST
// Build Action list, restrictions, timers, round escalation

class Game {
  constructor() {
    this.state = 'START';
    this.turnCount = 0;
    this.round = 1;
    this.players;
    this.turn = 0;
    this.prizes = 0;
    // mitigate luck here to ensure more variety
  }
//TODO: Convert to iterate over players based on init 
  run() {
    // Update UI to play mode
    document.getElementById("settingsPane").classList.add("notShown");
    document.getElementById("ActionRoller").classList.remove("notShown");
    //Use all checkbox Ids to build out initialization array.
    var p1ClothingIdArray = ["p1-Top-S", "p1-Top-L", "p1-Bra", "p1-Bottom-S", "p1-Bottom-L", "p1-Panties", "p1-Thong"];
    var p1cList = [];
    for (var i=0;i<p1ClothingIdArray.length;i++){
        if (document.getElementById(p1ClothingIdArray[i]).checked)
        p1cList.push(p1ClothingIdArray[i].substring(3, p1ClothingIdArray[i].length));
    }
    console.log(p1cList);
    var p2ClothingIdArray = ["p2-Top-S", "p2-Top-L", "p2-Bottom-S", "p2-Bottom-L", "p2-Briefs", "p2-Tank"];
    var p2cList = [];
    for (var i=0;i<p2ClothingIdArray.length;i++){
        if (document.getElementById(p2ClothingIdArray[i]).checked)
        p2cList.push(p2ClothingIdArray[i].substring(3, p2ClothingIdArray[i].length));
    }
    console.log(p2cList);

    var p1 = new Player(document.getElementById("p1name").value, "f", p1cList);
    p1.setCoverage();
    var p2 = new Player(document.getElementById("p2name").value, "m", p2cList);
    p2.setCoverage();
    this.players = [p1,p2];

  }

//TODO: Build logic for player turn here
  handlePlayerTurn(type, opts) {
      var pDo;
      var pRe;
      if (this.turn == 0){
        pDo = this.players[0];  
        pRe = this.players[1];
      } else {
        pDo = this.players[1];  
        pRe = this.players[0];
      }
    switch(type){
        case "roll":
            document.getElementById("prize").classList.add("notShown");
            document.getElementById("ActionRoller").classList.remove("notShown");
            // check here to see if we route into special instead
            var rollResult = RollActions.Roll(pDo, pRe, this.round, {});
            console.log(rollResult);
            document.getElementById("arname").textContent = rollResult.Actor;
            document.getElementById("arpart").textContent = rollResult.Bodypart.replace("_", " ");
            document.getElementById("ardur").textContent = rollResult.Duration;
            document.getElementById("aract").textContent = rollResult.Action.replace("_", " ");
            if (rollResult.Duration == 0) {
                document.getElementById("ardur").textContent = "Any Number of";
                document.getElementById("timerDisplay").textContent = "99:99";
                totalSeconds = 3600;
            }
            else {
                document.getElementById("ardur").textContent = rollResult.Duration;
                document.getElementById("timerDisplay").textContent = "0" + rollResult.Duration + ":00";
                totalSeconds = rollResult.Duration * 60;
            }
            if (this.round > 3){
                 document.getElementById("arextra").textContent = rollResult.Spicy.replace("_", " ");
            };
            // if (this.round> 5) {
            //     document.getElementById("arextra").textContent = rollResult.Spicy.replace("_", " ");
            // }
            
            resetTimer();
            
            //do the action roll
            break;
        case "strip":
            var xxx = Math.floor(Math.random()*2);
            var artRem;
            this.players[xxx];
            
            if (this.players[xxx].clothing.length == 0) {
                this.handlePlayerTurn("special", {Player:this.players[xxx], Reason:"naked" });
            } else {
                if(this.players[xxx].clothing.includes("Top-L")) {
                    artRem = "Top";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Top-L"), 1);
                } else if(this.players[xxx].clothing.includes("Top-S")) {
                    artRem = "Shirt";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Top-S"), 1);
                } else if(this.players[xxx].clothing.includes("Bottom-L")) {
                    artRem = "Skirt/Pants";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Bottom-L"), 1);
                } else if(this.players[xxx].clothing.includes("Bottom-S")) {
                    artRem = "Skirt/Shorts";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Bottom-S"), 1);
                } else if(this.players[xxx].clothing.includes("Tank")) {
                    artRem = "Tank-top";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Tank"), 1);
                } else if(this.players[xxx].clothing.includes("Bra")) {
                    artRem = "Bra";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Bra"), 1);
                } else if(this.players[xxx].clothing.includes("Panties")) {
                    artRem = "Panties";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Panties"), 1);
                } else if(this.players[xxx].clothing.includes("Thong")) {
                    artRem = "Thong";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Thong"), 1);
                } else if(this.players[xxx].clothing.includes("Briefs")) {
                    artRem = "Underwear";
                    this.players[xxx].clothing.splice(this.players[xxx].clothing.indexOf("Briefs"), 1);
                }
                alert(this.players[xxx].name + " Remove your " + artRem);
                this.players[xxx].setCoverage();
            }
            console.log(this.players[xxx]);

            //remove clothing from player
            // If both players are totally naked, move to special
            break;
        case "special":
            // if (this.players[0].clothing.length == 0 && this.players[1].clothing.length == 0 && this.prizes > 2) {
            //     //both players are naked, load a group of 10/10 options
            // } else
            // TODO: something else here for more fun?
             if (opts.Player.clothing.length == 0) {
                //someone is naked and ready to be used
                document.getElementById("prize").classList.remove("notShown");
                document.getElementById("ActionRoller").classList.add("notShown");
                document.getElementById("iwant").textContent = opts.Player.iWantto;
                document.getElementById("iwantyou").textContent = opts.Player.iWantYouto;
                document.getElementById("iwantus").textContent = opts.Player.IWantUsto;
                document.getElementById("prizeRnd").textContent = opts.Player.name;
                this.prizes++;
            };
            
            //other?
            break;
    }
    if (this.turn == 0) this.turn = 1;
    else {
        this.turn = 0;
        this.turnCount++;
    }
    if (this.turnCount == 5) {
        if (this.turn == 0) this.turn = 1;
        else this.turn = 0;
        this.turnCount = 0;
        this.round++;
        // roll to see if we go to strip or special
        this.handlePlayerTurn("strip");
    }
    //advance turn
    //check advance round

  }

}
//TODO: Move game start to button
// Start the game
const game = new Game();
//game.run();

