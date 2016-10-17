// Global variables
var canvas, engine, scene, camera, score = 0;
var TOAD_MODEL;

// An array to store each ending of the lane
var ENDINGS = [];
var ENEMIES = [];

/* -------------- TEST SI LE NAVIGATEUR EST COMPATIBLE OPEN-GL -----------------*/
document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();
    }
}, false);

/**
 * Creates a new BABYLON Engine and initialize the scene
 */
function initScene() {
/* ------------------ MINIMUM ELEMENT FOR SCENE -----------------*/
    // Get canvas
    canvas = document.getElementById("renderCanvas");
    // Create babylon engine
    engine = new BABYLON.Engine(canvas, true);
    // Create scene
    scene = new BABYLON.Scene(engine);
    // Create the camera
    camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,10));
    camera.attachControl(canvas);
    // Create light
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene);

/* ------------------ ENVIRONEMENT HDRI -----------------------*/
    // The box creation
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    // The sky creation
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/cubemap/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // box + sky = skybox !
    skybox.material = skyboxMaterial;

/* ------------------ MOTEUR DE RENDU 60 FPS-----------------------*/
    /*
    Display 60 frame per minutes et gere le déplacement des énemies (equivaux a la fonction
  update dans unity qui se lance a chaque rendu d'image)
    */
    engine.runRenderLoop(function () {
        scene.render();
        ENEMIES.forEach(function (shroom) {
            if (shroom.killed) {
                // Nothing to do here
            } else {
                shroom.position.z -= 0.5;
                cleanShrooms();
            }
        });
    });

/* ------------------ LANCEMENT DU JEU UNE FOIS QUE LA SCENE EST PRETE ---------*/
    initGame();
}
function initGame() {

      // Number of lanes
      var LANE_NUMBER = 3;
      // Space between lanes
      var LANE_INTERVAL = 5;
      var LANES_POSITIONS = [];

/* ------------------ CREER UNE ROUTE POUR LES CHAMPIGNON---------*/
      var createLane = function (id, position) {
          var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, scene);
          lane.scaling.y = 0.1;
          lane.scaling.x = 3;
          lane.scaling.z = 800;
          lane.position.x = position;
          lane.position.z = lane.scaling.z/2-200;

          var ground = new BABYLON.StandardMaterial("ground", scene);
          var texture = new BABYLON.Texture("assets/ground.jpg", scene);
          texture.uScale = 40;
          texture.vScale = 2;
          ground.diffuseTexture = texture;

          lane.material = ground;
      };

/* ------------------ CREER UNE PLATEFORM ROUGE D4ARRIVE ---------*/
      var createEnding = function (id, position) {
          var ending = BABYLON.Mesh.CreateGround(id, 3, 4, 1, scene);
          ending.position.x = position;
          ending.position.y = 0.1;
          ending.position.z = 1;
          var mat = new BABYLON.StandardMaterial("endingMat", scene);
          mat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);
          ending.material = mat;
          return ending;
      };

/* ----- CREER GRACE AU FONCION CREATRICE LES CHEMIN ET PLAQUE D'ARRIVEE ------*/
      var currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER/2);
      for (var i = 0; i<LANE_NUMBER; i++){
          LANES_POSITIONS[i] = currentLanePosition;
          createLane(i, currentLanePosition);
          var e = createEnding(i, currentLanePosition);
          ENDINGS.push(e);
          currentLanePosition += LANE_INTERVAL;
      }

      // Adjust camera position
      camera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER/2)];

      // The function ImportMesh will import our custom model in the scene given in parameter
      BABYLON.SceneLoader.ImportMesh("", "assets/", "toad.babylon", scene, function (meshes) {
          var m = meshes[0];
          m.position = new BABYLON.Vector3(2, 1,5);

          m.isVisible = false;
          m.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
          TOAD_MODEL = m;
      });


            // Creates a shroom in a random lane
            var createEnemy = function () {
                // The starting position of toads
                var posZ = 100;

                // Get a random lane
                var posX = LANES_POSITIONS[Math.floor(Math.random() * LANE_NUMBER)];

                // Create a clone of our template
                var shroom = TOAD_MODEL.clone(TOAD_MODEL.name);

                shroom.id = TOAD_MODEL.name+(ENEMIES.length+1);
                // Our toad has not been killed yet !
                shroom.killed = false;
                // Set the shroom visible
                shroom.isVisible = true;
                // Update its position
                shroom.position = new BABYLON.Vector3(posX, (shroom.position.y/1)+2, posZ);
                ENEMIES.push(shroom);
            };

            // Creates a clone every 1 seconds
            setInterval(createEnemy, 1000);



}
function cleanShrooms() {
    // For all clones
    for (var n=0; n<ENEMIES.length; n++) {
      if (ENEMIES[n].position.z < -30) {
        var shroom = ENEMIES[n];
          // Destroy the clone !
            shroom.dispose();
            ENEMIES.splice(n, 1);
            n--;
        }
    }
}
