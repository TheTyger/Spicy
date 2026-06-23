// Main class to hold current player info
class Player {
    constructor(name, sex, clothing){
        this.name = name;
        this.sex = sex;
        this.clothing = clothing;
        this.body = new Body(this.sex);

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
        this.head = {"Scalp":0, "Neck":0, "Temples":0, "Face":0, "Ears":0, "Lips":0};
        this.limbs = {"Upper_Arms":0, "Forearms":0, "Wrists":0, "Hands":0, "Fingers":0, "Lower_Thigh":0, "Calves":0, "Ankles":0, "Feet":0, "Toes":0 };
        
        if (s == "m") {
            this.torso = {"Upper_Back":0, "Lower_Back":0, "Collar":0, "Chest":0, "Nipples":0, "Abs":0, "Ribs":0, "Sides":0, "Navel":0};
            this.groin = {"Butt":0, "Hips":0, "Balls":0, "Pubic_Bone":0, "Inner_Thigh":0, "Cock":0};
        } else {
            this.torso = {"Upper_Back":0, "Lower_Back":0, "Collar":0, "Tits":0, "Nipples":0, "Abs":0, "Ribs":0, "Sides":0, "Navel":0};
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
    static onSkin = ["Kiss","Lick","Suck","Blow_On","Nibble","Bite"];
    static overClothes = ["Pinch","Massage","Stroke","Caress","Rub","Squeeze","Embrace"];
    static position = ["Standing", "Sitting","Lay_On_Back", "Lay_On_Stomach","Sit_On_Lap", "Straddle"];
    static extra = ["Blindfolded", "Tied_Up", "Silent", "Loud", "Ice", "Location"];
    static duration = [1,2,3,5,0];

    static Roll(actor, target, round, opt){
        var avAction;
        var aName = actor.name;
        var tName = target.name;
        var rnd1Body = {...target.body.limbs, ...target.body.head};
        var rnd2Body = {...target.body.limbs, ...target.body.head, ...target.body.torso,  ...target.body.groin};
        var tbody;
        if (round > 1) {
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
        var dur = this.duration[Math.floor(Math.random()*5)];
        var pos = this.position[Math.floor(Math.random()*6)];
        var xxxtra = this.extra[Math.floor(Math.random()*6)];
        return  {Actor:aName, Target:tName, Action:actionRoll, Bodypart:bodyPart, Duration:dur, Position:pos, Spicy:xxxtra};
        // player picks between an a or b card (gives opt)
        // opts direct the randomizer
        // roll returns "points"
        // points guide escalation
        // hands, mouth, high, low, 
    }        
    
}

// WORKLIST
// Build Action list, restrictions, timers, round escalation