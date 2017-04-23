// Fish-tank project
// version 1: no inheritance, Tank, Fish and Catfish constructors, ui script is separated 

var tank = new Tank(document.querySelector(".container"));
var tankWidth = parseInt(window.getComputedStyle(document.querySelector(".container")).width, 10);
var tankHeight = parseInt(window.getComputedStyle(document.querySelector(".container")).height, 10);
var goldMax = 3;
var catMax = 7;
var $modal = document.querySelector(".modal-background");

function Fish(imageUrl, $container) {
    var $fishImg = document.createElement("img");
    $fishImg.setAttribute("src", imageUrl);
    $fishImg.className = 'fish';
    $fishImg.style.width = "80px"; 
    $fishImg.style.height = "80px"; 
    $container.appendChild($fishImg);

    this.swim = function() {
        var maxTop = tankHeight - 160 - 5; // tank's height - max fish height - padding;
        $fishImg.style.top = Math.floor(Math.random() * (maxTop - 50 + 1)) + 50 + "px";
        $fishImg.style.right = "50px"; 
        var fishSpeed = Math.floor(Math.random() * (20 - 1)) + 1;
        
        setInterval(function () {
            var right = parseInt($fishImg.style.right, 10);

            if (right >= (tankWidth-(parseInt($fishImg.style.width,10))) && $fishImg.className === 'fish') {
                $fishImg.className = 'fish-back';
            } else if (right <= 50 && $fishImg.className === 'fish-back') {
                $fishImg.className = 'fish';
            } else if ($fishImg.className.includes('fish-dead')) {
                return;
            }

            if ($fishImg.className === 'fish-back') {
                $fishImg.style.right = (right - fishSpeed) + "px";
            } else {
                $fishImg.style.right = (right + fishSpeed) + "px";
            }

        },50)   
    }

    this.eat = function () {
        var width = parseInt($fishImg.style.width,10);
        var height = parseInt($fishImg.style.height,10);
        if (width < 160) {
            $fishImg.style.width = (width + 20) + "px";
            $fishImg.style.height = (height + 20) + "px";
        }
    }

    this.die = function () {
        $fishImg.classList.add("fish-dead");
        setTimeout(function(){ 
            $container.removeChild($fishImg); 
        }, 6000);
    }

}

function Catfish(imageUrl, $container) {
    var $fishImg = document.createElement("img");
    $fishImg.setAttribute("src", imageUrl);
    $fishImg.className = 'catfish';
    $fishImg.style.width = "80px"; 
    $fishImg.style.height = "80px"; 
    $container.appendChild($fishImg);

    this.swim = function() {
        var maxTop = tankHeight - 80; // tank's height - max catfish height;
        $fishImg.style.top = maxTop + "px"; 
        $fishImg.style.left = Math.floor(Math.random() * ((tankWidth - 80 - 10) + 1)) + "px"; // tank's width -  catfish width - padding;
        var fishSpeed = Math.floor(Math.random() * (5 - 1)) + 1;
        
        setInterval(function () {
            var left = parseInt($fishImg.style.left, 10);

            if (left >= (tankWidth-(parseInt($fishImg.style.width,10))) && $fishImg.className === 'catfish') {
                $fishImg.className = 'catfish-back';
            } else if (left <= 50 && $fishImg.className === 'catfish-back') {
                $fishImg.className = 'catfish';
            } else if ($fishImg.className.includes('catfish-dead')) {
                return;
            }

            if ($fishImg.className === 'catfish-back') {
                $fishImg.style.left = (left - fishSpeed) + "px";
            } else {
                $fishImg.style.left = (left + fishSpeed) + "px";
            }

        },50)   
    }

    this.clean = function () {
        var width = parseInt($fishImg.style.width,10);
        var height = parseInt($fishImg.style.height,10);
        var top = parseInt($fishImg.style.top, 10);
        if (width < 160) {
            $fishImg.style.top = (top - 12) + "px";
            $fishImg.style.width = (width + 20) + "px";
            $fishImg.style.height = (height + 20) + "px";
        }
    }

    this.die = function () {
        $fishImg.classList.add("fish-dead");
        setTimeout(function(){ 
            $container.removeChild($fishImg); 
        }, 6000);
    }

}

function Tank ($container) {
    fishArr = [];
    catfishArr = [];
    var styleEl = document.createElement('style');
    var styleSheet;

    document.head.appendChild(styleEl);
    var styleSheet = styleEl.sheet;
    styleSheet.insertRule('.container:after {opacity:0.05;}', 0);
    var opacity = parseFloat(window.getComputedStyle(document.querySelector('.container'), ':after').getPropertyValue('opacity')); 

    this.addFishFunc = function(event) {
        var fishType = event.currentTarget.className;
        try {
            tank.checkFishType(fishType);
        } catch (e) {
            tank.displayModal(e.message);
        }
    }

    this.checkFishType = function (fishType) {
        if (fishType.includes('add-btn')) {
            fishType = 'img/babelfish.png';
            this.addFish(fishType);
        } else {
            fishType = 'img/catfish.png';
            this.addCatfish(fishType);
        }
    }

    this.addFish = function (fishType) {
        if (fishArr.length % 3 == 0 && fishArr.length/catfishArr.length > 3 && fishArr.length) {
            throw new Error("There are too many Goldfish in the tank. Please, add a Catfish.");
        } else {
            var fish = new Fish(fishType, $container);   
            fish.swim();
            fishArr.push(fish);
        }
    }

    this.addCatfish = function (fishType) {
        var count = catfishArr.length / fishArr.length;
        if ( count >= catMax - 1) {
            throw new Error("There are too many Catfish in the tank. Please, add a Goldfish.");
        } else {
            var catfish = new Catfish(fishType, $container);   
            catfish.swim();
            catfishArr.push(catfish);
        }
    }

    this.displayModal = function (e) {
        var $error = document.querySelector(".error-msg");
        $modal.style.display = "block";
        $error.textContent = e;
    }

    this.closeModal = function () {
        $modal.style.display = "";
    }

    this.feed = function () {
        var deadArr = [];
        var deadCatfishArr = [];

        for (var i = fishArr.length-1; i >= 0; i--) {
            if (i >= (fishArr.length-goldMax)) {
                fishArr[i].eat();
                this.dirt();
            } else {
                deadArr.push(fishArr[i]);
                fishArr[i].die();
            }
        }
        fishArr.splice(0, deadArr.length);

        for (var i = catfishArr.length-1; i >= 0; i--) {
            if (opacity >  0.05) {
                catfishArr[i].clean();
                this.clearing();
            } else {
                deadCatfishArr.push(catfishArr[i]);
                catfishArr[i].die();
            }
        }
        catfishArr.splice(0, deadCatfishArr.length);
    }

    this.dirt = function () {
        if (opacity >= 0.8) {
            this.displayModal("Your tank is too much dirty. All fish are dead. The game is over.");
            while ($container.firstChild) {
                $container.removeChild($container.firstChild);
            }
            fishArr = [];
            catfishArr = [];
            $addGold.removeEventListener("click", addFishFunc);
            $addCat.removeEventListener("click", addFishFunc);
            $feed.addEventListener("click", function() {
                tank.feed();
            })
        } else {
            opacity = Math.round((opacity + 0.01)*100)/100; 
            styleSheet.cssRules[0].style.opacity = opacity;
        }
    }

    this.clearing = function () {
        opacity = Math.round((opacity - 0.01)*100)/100; 
        styleSheet.cssRules[0].style.opacity = opacity;
    }

    this.print = function () {
        console.log(fishArr);
        console.log(catfishArr);
    }
}


