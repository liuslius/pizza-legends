class OverworldMap {
    constructor(config) {
      this.overworld = null;
      this.gameObjects = config.gameObjects;
      this.cutsceneSpaces = config.cutsceneSpaces || {};
      this.walls = config.walls || {};
  
      this.lowerImage = new Image();
      this.lowerImage.src = config.lowerSrc;
  
      this.upperImage = new Image();
      this.upperImage.src = config.upperSrc;
  
      this.isCutscenePlaying = false;
    }
  
    drawLowerImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.lowerImage, 
        utils.withGrid(10.5) - cameraPerson.x, 
        utils.withGrid(6) - cameraPerson.y
        )
    }
  
    drawUpperImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.upperImage, 
        utils.withGrid(10.5) - cameraPerson.x, 
        utils.withGrid(6) - cameraPerson.y
      )
    } 
  
    isSpaceTaken(currentX, currentY, direction) {
      const {x,y} = utils.nextPosition(currentX, currentY, direction);
      return this.walls[`${x},${y}`] || false;
    }
  
    mountObjects() {
      Object.keys(this.gameObjects).forEach(key => {
  
        let object = this.gameObjects[key];
        object.id = key;
  
        //TODO: determine if this object should actually mount
        object.mount(this);
  
      })
    }
  
    async startCutscene(events) {
      this.isCutscenePlaying = true;
  
      for (let i=0; i<events.length; i++) {
        const eventHandler = new OverworldEvent({
          event: events[i],
          map: this,
        })
        await eventHandler.init();
      }
  
      this.isCutscenePlaying = false;

      //reset NPC to do their idle behavior
      Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutscene() {
      const hero = this.gameObjects["hero"];
      const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
      const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
      });
      if (!this.isCutscenePlaying && match && match.talking.length) {
        this.startCutscene(match.talking[0].events)
      }
    }

    checkForFootstepCutscene() {
      const hero = this.gameObjects["hero"];
      const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
      if (!this.isCutscenePlaying && match) {
        this.startCutscene( match[0].events )
      }
    }
  
    addWall(x,y) {
      this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y) {
      delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
      this.removeWall(wasX, wasY);
      const {x,y} = utils.nextPosition(wasX, wasY, direction);
      this.addWall(x,y);
    }
  
  }
  
  window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "/imgs/maps/DemoLower.png",
      upperSrc: "/imgs/maps/DemoUpper.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(8),
        }),
        npcA: new Person({
          x: utils.withGrid(7),
          y: utils.withGrid(9),
          src: "/imgs/characters/people/foxy.png",
          behaviorLoop: [
            { type: "stand",  direction: "left", time: 800 },
            { type: "stand",  direction: "up", time: 800 },
            { type: "stand",  direction: "right", time: 1200 },
            { type: "stand",  direction: "up", time: 300 },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "sorry, I can't talk right now", faceHero: "npcA" },
                { type: "textMessage", text: "I'm looking for my friends."},
                { type: "textMessage", text: "maybe they're outside."},
                // { who: "hero", type: "walk",  direction: "left" },
              ]
            }
          ]
        }),
        npcB: new Person({
          x: utils.withGrid(9),
          y: utils.withGrid(5),
          src: "/imgs/characters/people/boo.png",
          behaviorLoop: [
            { type: "walk",  direction: "left" },
            { type: "stand",  direction: "left", time: 800 },
            { type: "walk",  direction: "right" },
            { type: "stand",  direction: "right" },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "Welcome to the itty Bitty Dog Committee!", faceHero: "npcB" },
                { type: "textMessage", text: "I'm Boo the swift. WOOF!"},
                { type: "textMessage", text: "you should go meet all the members."},
                // { who: "hero", type: "walk",  direction: "left" },
              ]
            }
          ]
        }),
      },
      walls: {
        [utils.asGridCoord(7,6)] : true, 
               [utils.asGridCoord(8,6)] : true, 
               [utils.asGridCoord(7,7)] : true, 
               [utils.asGridCoord(8,7)] : true, 
               [utils.asGridCoord(11,4)] : true, 
               [utils.asGridCoord(11,5)] : true, 
               [utils.asGridCoord(11,6)] : true, 
               [utils.asGridCoord(11,7)] : true,
               [utils.asGridCoord(11,8)] : true,
               [utils.asGridCoord(11,9)] : true, 
               [utils.asGridCoord(11,10)] : true, 
               [utils.asGridCoord(10,3)] : true, 
               [utils.asGridCoord(9,3)] : true,
               [utils.asGridCoord(11,10)] : true, 
               [utils.asGridCoord(10,10)] : true, 
               [utils.asGridCoord(9,10)] : true, 
               [utils.asGridCoord(8,10)] : true, 
               [utils.asGridCoord(7,10)] : true, 
               [utils.asGridCoord(6,10)] : true, 
               [utils.asGridCoord(5,11)] : true, 
               [utils.asGridCoord(4,10)] : true, 
               [utils.asGridCoord(3,10)] : true, 
               [utils.asGridCoord(2,10)] : true, 
               [utils.asGridCoord(1,10)] : true, 
               [utils.asGridCoord(8,4)] : true, 
               [utils.asGridCoord(7,3)] : true,
               [utils.asGridCoord(6,4)] : true, 
               [utils.asGridCoord(5,3)] : true, 
               [utils.asGridCoord(4,3)] : true,
               [utils.asGridCoord(3,3)] : true, 
               [utils.asGridCoord(2,3)] : true,
               [utils.asGridCoord(1,3)] : true,
               [utils.asGridCoord(0,4)] : true, 
               [utils.asGridCoord(0,5)] : true, 
               [utils.asGridCoord(0,6)] : true, 
               [utils.asGridCoord(0,7)] : true,
               [utils.asGridCoord(0,8)] : true, 
               [utils.asGridCoord(0,9)] : true,
      },

      cutsceneSpaces: {
        [utils.asGridCoord(7,4)]: [
          {
            events: [
              { who: "npcB", type: "walk",  direction: "left" },
              { who: "npcB", type: "stand",  direction: "up", time: 500 },
              { type: "textMessage", text:"We're not allowed in the kitchen."},
              { who: "npcB", type: "walk",  direction: "right" },
              { who: "npcB", type: "walk",  direction: "right" },
              { who: "hero", type: "walk",  direction: "down" },
              { who: "hero", type: "walk",  direction: "left" },
            ]
          }
        ],
        [utils.asGridCoord(5,10)]: [
          {
            events: [
              { type: "changeMap", map: "Street" },
            ]
          }
        ]
      }
    },
    Street: {
      lowerSrc: "/imgs/maps/StreetLower.png",
      upperSrc: "/imgs/maps/StreetUpper.png",
      gameObjects: {
        hero: new Person({
          x: utils.withGrid(5),
          y: utils.withGrid(10),
          isPlayerControlled: true,
        }),
        npcA: new Person({
          x: utils.withGrid(20),
          y: utils.withGrid(15),
          src: "/imgs/characters/people/boo.png",
          behaviorLoop: [
            { type: "walk",  direction: "left" },
            { type: "stand",  direction: "left", time: 800 },
            { type: "walk",  direction: "right" },
            { type: "stand",  direction: "right" },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "you made it!", faceHero: "npcA" },
                { type: "textMessage", text: "make sure you meet all 5 members."},
                { type: "textMessage", text: "then I'll tell you how to go to the next level."},
                // { who: "hero", type: "walk",  direction: "left" },
              ]
            }
          ]
        }),
        npcB: new Person({
          x: utils.withGrid(30),
          y: utils.withGrid(15),
          src: "/imgs/characters/people/foxy.png",
          behaviorLoop: [
            { type: "stand",  direction: "left", time: 800 },
            { type: "stand",  direction: "up", time: 800 },
            { type: "stand",  direction: "right", time: 1200 },
            { type: "stand",  direction: "up", time: 300 },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "Hi!, I'm Foxy.", faceHero: "npcB" },
                { type: "textMessage", text: "I see Honey is over there.."},
                { type: "textMessage", text: "but where is Bozo?"},
                // { who: "hero", type: "walk",  direction: "left" },
              ]
            }
          ]
        }),
        npcC: new Person({
          x: utils.withGrid(10),
          y: utils.withGrid(15),
          src: "/imgs/characters/people/npc1.png",
          behaviorLoop: [
            { type: "stand",  direction: "left", time: 800 },
            { type: "stand",  direction: "up", time: 800 },
            { type: "stand",  direction: "right", time: 1200 },
            { type: "stand",  direction: "up", time: 300 },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "I'm Mochi the manatee.", faceHero: "npcC" },
                { type: "textMessage", text: "Nice to meet ya!"},
                { type: "textMessage", text: "psst.. check by the bushes"},
                // { who: "hero", type: "walk",  direction: "left" },
              ]
            }
          ]
        }),
        npcD: new Person({
          x: utils.withGrid(33),
          y: utils.withGrid(12),
          src: "/imgs/characters/people/npc3.png",
          behaviorLoop: [
            { type: "stand",  direction: "left", time: 800 },
            { type: "stand",  direction: "up", time: 800 },
            { type: "stand",  direction: "right", time: 1200 },
            { type: "stand",  direction: "up", time: 300 },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "You found me!", faceHero: "npcD" },
                { type: "textMessage", text: "They call me Bozo the balloon."},
                { type: "textMessage", text: "I wonder where Mochi is hiding."},
                // { who: "hero", type: "walk",  direction: "left" },
              ]
            }
          ]
        }),
      },
      cutsceneSpaces: {
        [utils.asGridCoord(5,9)]: [
          {
            events: [
              { type: "changeMap", map: "DemoRoom" }
            ]
          }
        ]
    }}
  }