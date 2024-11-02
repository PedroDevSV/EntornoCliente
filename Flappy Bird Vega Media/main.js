let config = {
    type: Phaser.AUTO,
    width: 288,
    height: 512,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// Definimos variables 

let isGameOver = false;
let score = 0;
let scoreText;
let isRefresh = false;
let hitPlayed = false;
let diePlayed = false;
let character;
let background;
let base,
    baseImage,
    baseHeight,
    baseWidth;

let speed = -150;
let spawnTime = 1500;
let gameStart = false;

let game = new Phaser.Game(config);

function preload() {
    // cargamos sprites
    this.load.image("background", "assets/GameObjects/intento1.png");
    this.load.image("farybg", "assets/GameObjects/fary.png");

    this.load.image("character1", "assets/GameObjects/yellowbird-midflap.png");
    this.load.image("character2", "assets/GameObjects/yellowbird-downflap.png");
    this.load.image("character3", "assets/GameObjects/yellowbird-upflap.png");
    this.load.image("character4", "assets/GameObjects/yellowbird-fall.png");
    this.load.image("pillar", "assets/GameObjects/col.png");
    this.load.image("base", "assets/GameObjects/floor.png");
    this.load.image("gameover", "assets/Interfaz/gameover.png");
    this.load.image("score", "assets/Interfaz/score.png");
    this.load.image("retry", "assets/Interfaz/retry.png");
    this.load.image("startGame", "assets/Interfaz/message.png");

    this.load.audio("score", "assets/Audio/point.wav");
    this.load.audio("hit", "assets/Audio/hit.wav");
    this.load.audio("wing", "assets/Audio/wing.wav");
    this.load.audio("die", "assets/Audio/die.wav");
    this.load.audio("carabirubi", "assets/Audio/farycut.wav");
    this.load.audio("star","assets/Audio/starcut.wav")
}

function create() {
    // creamos el fondo, el Tile SPrite en phaser es para un fondo en movimiento, textura que se repite
    background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayheight = this.sys.game.config.height;

    imperial = this.sound.add("star");
    imperial.play();
    
    //sprite de las barras de abajo, tambien con tileSprite
    let baseImage = this.textures.get("base"); //Phaser texture manager, tiene funciones para esto
    let baseHeight = baseImage.getSourceImage().height;
    let baseWidth = baseImage.getSourceImage().width;
    //Ponemos debajo de la imagen "background"
    base = this.add.tileSprite(game.config.width / 2, game.config.height - baseHeight / 2, baseWidth, baseHeight, "base");
    //añadimos fisicas del tile
    this.physics.add.existing(base, true); //true para que sea estático y no se mueva de posicion
    //profundidad del sprite, que no opaque con el personaje
    base.setDepth(1);
    //imagen de la pantalla de inicio
    let startGameImage = this.add.image(game.config.width / 2, game.config.height / 3, "startGame");
    startGameImage.setOrigin(0.5, 0.5);
    
    character = this.physics.add.sprite(game.config.width / 4, game.config.height / 2, "character1");
    character.setDepth(1);
    character.setCollideWorldBounds(true);
    
    //inicialmente false hasta que hagas click
    character.body.allowGravity = false;
    gameStart = false;

    //animaciones
    this.anims.create({
        key: "fly",
        frames: [
            { key: "character1" },
            { key: "character2" },
            { key: "character3" },
        ],
        frameRate: 9,
        repeat: -1, //infinito
    });
    //para caída
    this.anims.create({
        key: "fall",
        frames: [
            { key: "character4" },
        ],
        frameRate: 9,
        repeat: -1,
    });

    character.anims.play("fly", true);
    //cuando hagamos click, comienza el juego
    
    this.input.on("pointerdown", function (pointer) {
        //verificamos que el juego haya empezado
        if (gameStart) return;
        gameStart = true;
        startGameImage.setVisible(false); //quitamos pantalla inicio
        character.body.allowGravity = true;
        // Grupo de fisicas para las tuberías para que todas afecten de la misma manera 
        this.upperPillars = this.physics.add.group();
        this.lowerPillars = this.physics.add.group();
        //generamos las tuberías
        this.spawnPillarPair();
        //colisiones
        this.physics.add.collider(character, this.upperPillars, hitPillar, null, this);
        this.physics.add.collider(character, this.lowerPillars, hitPillar, null, this);
        this.physics.add.collider(character, base, hitBase, null, this); //con el suelo

        //Numero recuento de puntos
        scoreText = this.add.text(game.config.width / 2, 30, "0", {
            fontSize: "32px",
            fontFamily: "Fantasy",
            fill: "white",
        });
        scoreText.setOrigin(0.5, 0.5);
        //profundidad del texto, superposicion
        scoreText.setDepth(1);

        //sonidos
        point = this.sound.add("score");
        hit = this.sound.add("hit");
        wing = this.sound.add("wing");
        die = this.sound.add("die");
        //musica
        carabirubi = this.sound.add("carabirubi");

        //nos aseguramos que no se haya acabado el juego y permitimos movimiento
        this.input.on("pointerdown", function (pointer) {
            if (!isRefresh && !isGameOver) {
                wing.play();
                character.setVelocityY(-230);
            }
            isRefresh = false;
        }, this);
    }, this);
}

function update() {
    // si no se ha acabado, le damos movimiento a la base
    if (!isGameOver) base.tilePositionX += 1;
    if (!gameStart) return;

    let scoreIncremented = false;
    [this.upperPillars, this.lowerPillars].forEach((group) => {
        //Trabajamos con los grupos de tuberias
        group.children.iterate((pillar) => {
            //si no hay tuberia, nada
            if (!pillar) return;
            //si todavia no ha pasado la tuberia y la posicion de la tuberia está a la izq del personaje, es punto
            if (!pillar.hasPassed && pillar.x + pillar.width < character.x) {
                pillar.hasPassed = true;
                // si no has sumado ese punto (para no repetir)
                if (!scoreIncremented) {
                    score++;
                    scoreText.setText(score);
                    point.play();
                    scoreIncremented = true;

                    // Cambiar el fondo de pantalla si el puntaje alcanza 10
                    if (score === 15) {
                        background.setTexture("farybg");
                        imperial.stop();
                        carabirubi.play();
                    }

                }

            }
         
            //si la tuberia está fuera de pantalla, borramos
            if (pillar.x + pillar.width < 0) {
                pillar.destroy();
            }
        });
    });
    scoreIncremented = false;
    //para que sigan generándose, restamos los 1500 menos el tiempo actual, si no ha acbado
    if (this.pillarSpawnTime < this.time.now && !isGameOver) {
        this.spawnPillarPair();
    }

    // Para cambiar el fondo de pantalla si los puntos han llegado a 10ç
    
}

Phaser.Scene.prototype.spawnPillarPair = function () {
    baseImage = this.textures.get("base");
    baseHeight = baseImage.getSourceImage().height;

    let pillarImage = this.textures.get("pillar");
    let pillarHeight = pillarImage.getSourceImage().height;
    
    //JUgamos con la pantalla dividia en 3 partes para que sea responsive

    //Determina la altura de la tubería, que será entre 0 y la mitad de la altura del objeto (para que no se corte)
    let alturaT = (Math.random() * pillarHeight) / 2;
    // n genera -1, 0 o 1 
    let n = Math.floor(Math.random() * 3) - 1;
    // El resultado de alturaT es uno de los 3 tipos de alturas
    alturaT = alturaT * n;

    // espacio entre las tuberias(altura) 1 tercio
    let gapHeight = (1 / 3) * (game.config.height - baseHeight);
    //coordenadas eje Y de las tuberias 
    let lowerY = 2 * gapHeight + pillarHeight / 2 + alturaT;
    let upperY = gapHeight - pillarHeight / 2 + alturaT;

    // COgemos atributos del grupo de tuberias y creamos 1 
    let upperPillar = this.upperPillars.create(game.config.width, upperY, "pillar");
    upperPillar.setAngle(180);

    let lowerPillar = this.lowerPillars.create(game.config.width, lowerY, "pillar");

    upperPillar.body.allowGravity = false;
    lowerPillar.body.allowGravity = false;

    upperPillar.setVelocityX(speed);
    lowerPillar.setVelocityX(speed);
    // intervalo de aparición
    this.pillarSpawnTime = this.time.now + spawnTime;
}
// si cae contra el suelo
function hitBase(character, base) {
    if (!hitPlayed) hit.play();

    character.anims.play("fall", true);
    base.body.enable = false;
    character.setVelocityX(0);
    character.setVelocityY(0);
    character.body.allowGravity = false;

    [this.upperPillars, this.lowerPillars].forEach(group => group.children.iterate(pillar => pillar.body.velocity.x = 0));
    isGameOver = true;
    //mostramos imagen final
    let gameOverImage = this.add.image(game.config.width / 2, game.config.height / 4, "gameover");
    gameOverImage.setOrigin(0.5, 0.5);
    
    
    
 
    //borramos texto 
    scoreText.destroy();
    //para reiniciar 
    let retryImage = this.add.image(game.config.width / 2, game.config.height / 1.5, "retry");
    retryImage.setOrigin(0.5, 0.5);
    retryImage.setScale(0.25);
    retryImage.setInteractive();
    retryImage.on("pointerdown", function (pointer) {
        isGameOver = false;
        score = 0;
        gameStart = false;
        this.scene.restart();
        hitPlayed = false;
        diePlayed = false;
        isRefresh = true;
    }, this);

    //si la canción está sonando
    if (imperial || carabirubi) {
        imperial.stop();
        carabirubi.stop();
    }
}
// colision con pilares 
function hitPillar(character, pillar) {
    if (!hitPlayed && !diePlayed) {
        hit.play();
        die.play();
        hitPlayed = true;
        diePlayed = true;
    }
    character.anims.play("fall", true);
    pillar.body.enable = false;
    character.setVelocityX(0);
    [this.upperPillars, this.lowerPillars].forEach(group => group.children.iterate(pillar => pillar.body.velocity.x = 0));
    isGameOver = true;

   
}