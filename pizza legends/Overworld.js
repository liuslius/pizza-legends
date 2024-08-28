class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {
        const step = () => {
          //Clear off the canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
          //Establish the camera person
          const cameraPerson = this.map.gameObjects.hero;
    
          //Update all objects
          Object.values(this.map.gameObjects).forEach(object => {
            object.update({
              arrow: this.directionInput.direction,
              map: this.map, 
            })
          })
    
          //Draw Lower layer
          this.map.drawLowerImage(this.ctx, cameraPerson);
    
          //Draw Game Objects
          Object.values(this.map.gameObjects).sort((a,b) => {
              return a.y - b.y;
          }).forEach(object => {
            object.sprite.draw(this.ctx, cameraPerson);
          })
    
          //Draw Upper layer
          this.map.drawUpperImage(this.ctx, cameraPerson);
          
          requestAnimationFrame(() => {
            step();   
          })
        }
        step();
     }

     bindActionInput() {
       new KeyPressListener("Space", () => {
         //is there a person here to talk to?
         this.map.checkForActionCutscene();
       })
     }

     bindHeroPositionCheck() {
       document.addEventListener("PersonWalkingComplete", e => {
         if (e.detail.whoId === "hero") {
           this.map.checkForFootstepCutscene();
         }
       })
     }

     startMap(mapConfig) {
       this.map = new OverworldMap(mapConfig);
       this.map.overworld = this;
       this.map.mountObjects();
     }

    init() {
        this.startMap(window.OverworldMaps.DemoRoom);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        
        this.startGameLoop();

        // this.map.startCutscene([
        //   { type: "changeMap", map: "Street"},
          // { type: "textMessage", text: "why Hello there, move around to meet all the members." },
            // { who: "hero", type: "walk",  direction: "down" },
            // { who: "hero", type: "walk",  direction: "down" },
            // { who: "npcA", type: "walk",  direction: "up" },
            // { who: "npcA", type: "walk",  direction: "left" },
            // { who: "hero", type: "stand",  direction: "right", time: 200 },
            // { type: "textMessage", text: "why Hello there, move around to meet all the members." },
            // // { who: "npcA", type: "walk",  direction: "up" },
            // { who: "npcB", type: "stand",  direction: "left", time: 500 },
            // { who: "npcB", type: "stand",  direction: "right", time: 1200 },
            // { who: "npcB", type: "walk",  direction: "right" },
            // { who: "npcA", type: "walk",  direction: "down" },
            // { who: "npcB", type: "walk",  direction: "left" },
        // ])

    }
}
        // Place the game objects individually above is with sprites as game objects

        // const image = new Image();
        // image.onload = () => {
        //     this.ctx.drawImage(image,0,0)
        // };
        // image.src ="/imgs/maps/DemoLower.png";

        // const hero = new GameObject({
        //     x: 5,
        //     y: 6,
        // })
        // const npc1 = new GameObject({
        //     x: 7,
        //     y: 9,
        //     src: "/imgs/characters/people/npc1.png"
        // })

        // //the image of hero has to be loaded before it can be drawn

        // setTimeout(() => {
        //     hero.sprite.draw(this.ctx);
        //     npc1.sprite.draw(this.ctx);
        // }, 200)
        



        // code for single instance with hardcoded location. 
        //above is using classes to create game objects.

        // const x = 5;
        // const y = 6;

        // const shadow = new Image();
        // shadow.onload = () => {
        //     this.ctx.drawImage(
        //         shadow,
        //         0, // starting point of left crop, left cut
        //         0, // top cut,
        //         32, //width of cut
        //         32, //height of cut
        //         //(the character art is not in the center of the grid so those last few pixels center it)
        //         x * 16 - 8, //position (area grid is 16*16 grids)
        //         y * 16 - 17, //position (*16 compensates for the grid) 
        //         32, //size width
        //         32 //size height
        //         )
        // }
        // shadow.src ="/imgs/characters/shadow.png";


        // const hero = new Image();
        // hero.onload = () => {
        //     this.ctx.drawImage(
        //         hero,
        //         0, // starting point of left crop, left cut
        //         0, // top cut,
        //         32, //width of cut
        //         32, //height of cut
        //         //(the character art is not in the center of the grid so those last few pixels center it)
        //         x * 16 - 8, //position (area grid is 16*16 grids)
        //         y * 16 - 17, //position (*16 compensates for the grid) 
        //         32, //size width
        //         32 //size height
        //         )
        // };

        // hero.src ="/imgs/characters/people/hero.png";
