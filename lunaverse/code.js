"use strict";

console.log("yo");
var MSP = function(json) {
  var WIDTH = 64;
  var HEIGHT = 32;
  var scale = 1;
  var CAPE_WIDTH = 64;
  var CAPE_HEIGHT = 32;
  var cape_scale = 1;

  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  var supportWebGL =
    !!document.createElement("canvas").getContext("experimental-webgl") ||
    !!document.createElement("canvas").getContext("webgl");
  var container = document.querySelector(json.container || "#div2");
  if (!supportWebGL) {
    var noWebGL = document.createElement("div");
    noWebGL.innerHTML =
      '<strong>Warning:</strong> No <a href="http://en.wikipedia.org/wiki/WebGL" target="_blank">WebGL</a> drawing context available, falling back to canvas.';
    noWebGL.style.fontStyle = "italic";
    noWebGL.style.fontSize = "13px";
    container.appendChild(noWebGL);
  }
  var length = WIDTH;
  var cw = 200,
    ch = 300;
  var tileUvWidth = 1 / WIDTH;
  var tileUvHeight = 1 / HEIGHT;

  var skinBig = document.createElement("canvas");
  var sbc = skinBig.getContext("2d");
  var sizeRatio = 8;
  skinBig.width = WIDTH * sizeRatio;
  skinBig.height = HEIGHT * sizeRatio;

  var skincanvas = document.createElement("canvas");
  var skinc = skincanvas.getContext("2d");
  skincanvas.width = WIDTH;
  skincanvas.height = HEIGHT;
  var capecanvas = document.createElement("canvas");
  var capec = capecanvas.getContext("2d");
  capecanvas.width = WIDTH;
  capecanvas.height = HEIGHT;

  var isRotating = json.spin || false;
  var isCapeVisable = true;
  var isPaused = false;
  var isYfreezed = json.freezecamera || false;
  var isFunnyRunning = json.running || false;

  var getMaterial = function(img, trans) {
    var material = new THREE.MeshBasicMaterial({
      map: new THREE.Texture(
        img,
        new THREE.UVMapping(),
        THREE.ClampToEdgeWrapping,
        THREE.ClampToEdgeWrapping,
        THREE.NearestFilter,
        THREE.NearestFilter,
        trans ? THREE.RGBAFormat : THREE.RGBFormat
      ),
      transparent: trans
    });
    material.map.needsUpdate = true;
    return material;
  };
  var uvmap = function(mesh, face, x, y, w, h, rotateBy) {
    if (!rotateBy) rotateBy = 0;

    var uvs = mesh.geometry.faceVertexUvs[0][face];

    var tileU = x;
    var tileV = y;

    uvs[(0 + rotateBy) % 4].u = tileU * tileUvWidth;
    uvs[(0 + rotateBy) % 4].v = tileV * tileUvHeight;
    uvs[(1 + rotateBy) % 4].u = tileU * tileUvWidth;
    uvs[(1 + rotateBy) % 4].v = tileV * tileUvHeight + h * tileUvHeight;
    uvs[(2 + rotateBy) % 4].u = tileU * tileUvWidth + w * tileUvWidth;
    uvs[(2 + rotateBy) % 4].v = tileV * tileUvHeight + h * tileUvHeight;
    uvs[(3 + rotateBy) % 4].u = tileU * tileUvWidth + w * tileUvWidth;
    uvs[(3 + rotateBy) % 4].v = tileV * tileUvHeight;
  };
  var cubeFromPlanes = function(size, mat) {
    var cube = new THREE.Object3D();
    var meshes = [];
    for (var i = 0; i < 6; i++) {
      var mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
      mesh.doubleSided = true;
      cube.add(mesh);
      meshes.push(mesh);
    }
    // Front
    meshes[0].rotation.x = Math.PI / 2;
    meshes[0].rotation.z = -Math.PI / 2;
    meshes[0].position.x = size / 2;

    // Back
    meshes[1].rotation.x = Math.PI / 2;
    meshes[1].rotation.z = Math.PI / 2;
    meshes[1].position.x = -size / 2;

    // Top
    meshes[2].position.y = size / 2;

    // Bottom
    meshes[3].rotation.y = Math.PI;
    meshes[3].rotation.z = Math.PI;
    meshes[3].position.y = -size / 2;

    // Left
    meshes[4].rotation.x = Math.PI / 2;
    meshes[4].position.z = size / 2;

    // Right
    meshes[5].rotation.x = -Math.PI / 2;
    meshes[5].rotation.y = Math.PI;
    meshes[5].position.z = -size / 2;

    return cube;
  };

  var charMaterial = getMaterial(skincanvas, false);
  var charMaterialTrans = getMaterial(skincanvas, true);
  var capeMaterial = getMaterial(capecanvas, false);

  var camera = new THREE.PerspectiveCamera(35, cw / ch, 1, 1000);
  camera.position.z = 48;
  //camera.target.position.y = -2;
  var scene = new THREE.Scene();
  scene.add(camera);

  var headgroup = new THREE.Object3D();
  var upperbody = new THREE.Object3D();

  // Left leg
  var leftleggeo = new THREE.CubeGeometry(4, 12, 4);
  for (var i = 0; i < 8; i += 1) {
    leftleggeo.vertices[i].y -= 6;
  }
  var leftleg = new THREE.Mesh(leftleggeo, charMaterial);
  leftleg.position.z = -2;
  leftleg.position.y = -6;
  uvmap(leftleg, 0, 8 * scale, 20 * scale, -4 * scale, 12 * scale);
  uvmap(leftleg, 1, 16 * scale, 20 * scale, -4 * scale, 12 * scale);
  uvmap(leftleg, 2, 4 * scale, 16 * scale, 4 * scale, 4 * scale, 3);
  uvmap(leftleg, 3, 8 * scale, 16 * scale, 4 * scale, 4 * scale, 1);
  uvmap(leftleg, 4, 12 * scale, 20 * scale, -4 * scale, 12 * scale);
  uvmap(leftleg, 5, 4 * scale, 20 * scale, -4 * scale, 12 * scale);

  // Right leg
  var rightleggeo = new THREE.CubeGeometry(4, 12, 4);
  for (var i = 0; i < 8; i += 1) {
    rightleggeo.vertices[i].y -= 6;
  }
  var rightleg = new THREE.Mesh(rightleggeo, charMaterial);
  rightleg.position.z = 2;
  rightleg.position.y = -6;
  uvmap(rightleg, 0, 4 * scale, 20 * scale, 4 * scale, 12 * scale);
  uvmap(rightleg, 1, 12 * scale, 20 * scale, 4 * scale, 12 * scale);
  uvmap(rightleg, 2, 8 * scale, 16 * scale, -4 * scale, 4 * scale, 3);
  uvmap(rightleg, 3, 12 * scale, 16 * scale, -4 * scale, 4 * scale, 1);
  uvmap(rightleg, 4, 0 * scale, 20 * scale, 4 * scale, 12 * scale);
  uvmap(rightleg, 5, 8 * scale, 20 * scale, 4 * scale, 12 * scale);

  // Body
  var bodygeo = new THREE.CubeGeometry(4, 12, 8);
  var bodymesh = new THREE.Mesh(bodygeo, charMaterial);
  uvmap(bodymesh, 0, 20 * scale, 20 * scale, 8 * scale, 12 * scale);
  uvmap(bodymesh, 1, 32 * scale, 20 * scale, 8 * scale, 12 * scale);
  uvmap(bodymesh, 2, 20 * scale, 16 * scale, 8 * scale, 4 * scale, 1);
  uvmap(bodymesh, 3, 28 * scale, 16 * scale, 8 * scale, 4 * scale, 3);
  uvmap(bodymesh, 4, 16 * scale, 20 * scale, 4 * scale, 12 * scale);
  uvmap(bodymesh, 5, 28 * scale, 20 * scale, 4 * scale, 12 * scale);
  upperbody.add(bodymesh);

  // Left arm
  var leftarmgeo = new THREE.CubeGeometry(4, 12, 4);
  for (var i = 0; i < 8; i += 1) {
    leftarmgeo.vertices[i].y -= 4;
  }
  var leftarm = new THREE.Mesh(leftarmgeo, charMaterial);
  leftarm.position.z = -6;
  leftarm.position.y = 4;
  leftarm.rotation.x = Math.PI / 32;
  uvmap(leftarm, 0, 48 * scale, 20 * scale, -4 * scale, 12 * scale);
  uvmap(leftarm, 1, 56 * scale, 20 * scale, -4 * scale, 12 * scale);
  uvmap(leftarm, 2, 48 * scale, 16 * scale, -4 * scale, 4 * scale, 1);
  uvmap(leftarm, 3, 52 * scale, 20 * scale, -4 * scale, -4 * scale, 3); //facebottom
  uvmap(leftarm, 4, 52 * scale, 20 * scale, -4 * scale, 12 * scale);
  uvmap(leftarm, 5, 44 * scale, 20 * scale, -4 * scale, 12 * scale);
  upperbody.add(leftarm);

  // Right arm
  var rightarmgeo = new THREE.CubeGeometry(4, 12, 4);
  for (var i = 0; i < 8; i += 1) {
    rightarmgeo.vertices[i].y -= 4;
  }
  var rightarm = new THREE.Mesh(rightarmgeo, charMaterial);
  rightarm.position.z = 6;
  rightarm.position.y = 4;
  rightarm.rotation.x = -Math.PI / 32;
  uvmap(rightarm, 0, 44 * scale, 20 * scale, 4 * scale, 12 * scale);
  uvmap(rightarm, 1, 52 * scale, 20 * scale, 4 * scale, 12 * scale);
  uvmap(rightarm, 2, 44 * scale, 16 * scale, 4 * scale, 4 * scale, 1);
  uvmap(rightarm, 3, 48 * scale, 20 * scale, 4 * scale, -4 * scale, 3); //facebottom
  uvmap(rightarm, 4, 40 * scale, 20 * scale, 4 * scale, 12 * scale);
  uvmap(rightarm, 5, 48 * scale, 20 * scale, 4 * scale, 12 * scale);
  upperbody.add(rightarm);

  //Head
  var headgeo = new THREE.CubeGeometry(8, 8, 8);
  var headmesh = new THREE.Mesh(headgeo, charMaterial);
  headmesh.position.y = 2;
  uvmap(headmesh, 0, 8 * scale, 8 * scale, 8 * scale, 8 * scale);
  uvmap(headmesh, 1, 24 * scale, 8 * scale, 8 * scale, 8 * scale);
  uvmap(headmesh, 2, 8 * scale, 0 * scale, 8 * scale, 8 * scale, 1);
  uvmap(headmesh, 3, 16 * scale, 0 * scale, 8 * scale, 8 * scale, 3);
  uvmap(headmesh, 4, 0 * scale, 8 * scale, 8 * scale, 8 * scale);
  uvmap(headmesh, 5, 16 * scale, 8 * scale, 8 * scale, 8 * scale);
  headgroup.add(headmesh);

  var helmet = cubeFromPlanes(9, charMaterialTrans);
  helmet.position.y = 2;
  uvmap(
    helmet.children[0],
    0,
    (32 + 8) * scale,
    8 * scale,
    8 * scale,
    8 * scale
  );
  uvmap(
    helmet.children[1],
    0,
    (32 + 24) * scale,
    8 * scale,
    8 * scale,
    8 * scale
  );
  uvmap(
    helmet.children[2],
    0,
    (32 + 8) * scale,
    0 * scale,
    8 * scale,
    8 * scale,
    1
  );
  uvmap(
    helmet.children[3],
    0,
    (32 + 16) * scale,
    0 * scale,
    8 * scale,
    8 * scale,
    3
  );
  uvmap(
    helmet.children[4],
    0,
    (32 + 0) * scale,
    8 * scale,
    8 * scale,
    8 * scale
  );
  uvmap(
    helmet.children[5],
    0,
    (32 + 16) * scale,
    8 * scale,
    8 * scale,
    8 * scale
  );

  headgroup.add(helmet);

  var ears = new THREE.Object3D();

  var eargeo = new THREE.CubeGeometry(1, 9 / 8 * 6, 9 / 8 * 6);
  var leftear = new THREE.Mesh(eargeo, charMaterial);
  var rightear = new THREE.Mesh(eargeo, charMaterial);

  leftear.position.y = 2 + 9 / 8 * 5;
  rightear.position.y = 2 + 9 / 8 * 5;
  leftear.position.z = -(9 / 8) * 5;
  rightear.position.z = 9 / 8 * 5;

  // Right ear share same geometry, same uv-maps

  uvmap(leftear, 0, 25, 1, 6, 6); // Front side
  uvmap(leftear, 1, 32, 1, 6, 6); // Back side

  uvmap(leftear, 2, 25, 0, 6, 1, 1); // Top edge
  uvmap(leftear, 3, 31, 0, 6, 1, 1); // Bottom edge

  uvmap(leftear, 4, 24, 1, 1, 6); // Left edge
  uvmap(leftear, 5, 31, 1, 1, 6); // Right edge

  ears.add(leftear);
  ears.add(rightear);

  //leftear.visible = rightear.visible = false;

  //headgroup.add(ears);
  headgroup.position.y = 8;

  var capeOrigo = new THREE.Object3D();
  var capegeo = new THREE.CubeGeometry(1, 16, 10);
  var capemesh = new THREE.Mesh(capegeo, capeMaterial);
  capemesh.position.y = -8;
  capemesh.visible = false;

  uvmap(
    capemesh,
    0,
    1 * cape_scale,
    1 * cape_scale,
    10 * cape_scale,
    16 * cape_scale
  ); // Front side
  uvmap(
    capemesh,
    1,
    12 * cape_scale,
    1 * cape_scale,
    10 * cape_scale,
    16 * cape_scale
  ); // Back side
  uvmap(
    capemesh,
    2,
    1 * cape_scale,
    0 * cape_scale,
    10 * cape_scale,
    1 * cape_scale
  ); // Top edge
  uvmap(
    capemesh,
    3,
    11 * cape_scale,
    0 * cape_scale,
    10 * cape_scale,
    1 * cape_scale,
    1
  ); // Bottom edge
  uvmap(
    capemesh,
    4,
    0 * cape_scale,
    1 * cape_scale,
    1 * cape_scale,
    16 * cape_scale
  ); // Left edge
  uvmap(
    capemesh,
    5,
    11 * cape_scale,
    1 * cape_scale,
    1 * cape_scale,
    16 * cape_scale
  ); // Right edge

  capeOrigo.rotation.y = Math.PI;

  capeOrigo.position.x = -2;
  capeOrigo.position.y = 6;

  capeOrigo.add(capemesh);

  var playerModel = new THREE.Object3D();

  playerModel.add(leftleg);
  playerModel.add(rightleg);

  playerModel.add(upperbody);
  playerModel.add(headgroup);

  playerModel.add(capeOrigo);

  playerModel.position.y = 6;

  var playerGroup = new THREE.Object3D();

  playerGroup.add(playerModel);

  scene.add(playerGroup);

  var mouseX = 0;
  var mouseY = 0.1;
  var originMouseX = 0;
  var originMouseY = 0;

  var rad = 0;

  var isMouseOver = false;
  var isMouseDown = false;

  var counter = 0;
  var firstRender = true;

  var startTime = Date.now();
  var pausedTime = 0;

  var render = function() {
    requestAnimFrame(render, renderer.domElement);
    var oldRad = rad;

    var time = (Date.now() - startTime) / 1000;

    if (!isMouseDown) {
      //mouseX*=0.95;
      if (!isYfreezed) {
        mouseY *= 0.97;
      }
      if (isRotating) {
        rad += 2;
      }
    } else {
      rad = mouseX;
    }
    if (mouseY > 500) {
      mouseY = 500;
    } else if (mouseY < -500) {
      mouseY = -500;
    }

    camera.position.x = -Math.cos(rad / (cw / 2) + Math.PI / 0.9);
    camera.position.z = -Math.sin(rad / (cw / 2) + Math.PI / 0.9);
    camera.position.y = mouseY / (ch / 2) * 1.5 + 0.2;
    length = clamp(length, 20, 300);
    camera.position.setLength(length);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    if (!isPaused) {
      counter += 0.01;
      headgroup.rotation.y = Math.sin(time * 1.5) / 5;
      headgroup.rotation.z = Math.sin(time) / 6;

      if (isFunnyRunning) {
        rightarm.rotation.z = 2 * Math.cos(0.6662 * time * 10 + Math.PI);
        rightarm.rotation.x = 1 * (Math.cos(0.2812 * time * 10) - 1);
        leftarm.rotation.z = 2 * Math.cos(0.6662 * time * 10);
        leftarm.rotation.x = 1 * (Math.cos(0.2312 * time * 10) + 1);

        rightleg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10);
        leftleg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10 + Math.PI);

        playerGroup.position.y = -6 + 1 * Math.cos(0.6662 * time * 10 * 2); // Jumping
        playerGroup.position.z = 0.15 * Math.cos(0.6662 * time * 10); // Dodging when running
        playerGroup.rotation.x = 0.01 * Math.cos(0.6662 * time * 10 + Math.PI); // Slightly tilting when running

        capeOrigo.rotation.z =
          0.1 * Math.sin(0.6662 * time * 10 * 2) + Math.PI / 2.5;
      } else {
        leftarm.rotation.z = -Math.sin(time * 3) / 2;
        leftarm.rotation.x = (Math.cos(time * 3) + Math.PI / 2) / 30;
        rightarm.rotation.z = Math.sin(time * 3) / 2;
        rightarm.rotation.x = -(Math.cos(time * 3) + Math.PI / 2) / 30;

        leftleg.rotation.z = Math.sin(time * 3) / 3;
        rightleg.rotation.z = -Math.sin(time * 3) / 3;
        capeOrigo.rotation.z = Math.sin(time * 2) / 15 + Math.PI / 15;

        playerGroup.position.y = -6; // Not jumping
      }
    }

    renderer.render(scene, camera);
  };
  if (supportWebGL) {
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
  } else {
    var renderer = new THREE.CanvasRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
  }
  var threecanvas = renderer.domElement;
  renderer.setSize(cw, ch);
  //renderer.setClearColorHex(0x000000, 0.25);

  container.appendChild(threecanvas);

  var onMouseMove = function(e) {
    e.preventDefault();
    if (isMouseDown) {
      mouseX = e.pageX - threecanvas.offsetLeft - originMouseX;
      mouseY = e.pageY - threecanvas.offsetTop - originMouseY;
    }
  };

  threecanvas.addEventListener(
    "contextmenu",
    function(e) {
      e.preventDefault();
      isPaused = !isPaused;
      isRotating = !isRotating;
    },
    false
  );

  var clamp = function(val, min, max) {
    return Math.max(min, Math.min(max, val));
  };
  var intOverallDelta = 0;

  threecanvas.addEventListener(
    "mousedown",
    function(e) {
      e.preventDefault();
      originMouseX = e.pageX - threecanvas.offsetLeft - rad;
      originMouseY = e.pageY - threecanvas.offsetTop - mouseY;
      isMouseDown = true;
      isMouseOver = true;
      onMouseMove(e);
    },
    false
  );
  addEventListener(
    "mouseup",
    function(e) {
      e.preventDefault();
      isMouseDown = false;
    },
    false
  );
  threecanvas.addEventListener("mousemove", onMouseMove, false);
  threecanvas.addEventListener(
    "mouseout",
    function(e) {
      isMouseOver = false;
    },
    false
  );

  render();

  var backgroundimage = new Image();

  backgroundimage.onload = function() {
    skinc.clearRect(0, 0, WIDTH, HEIGHT);
    skinc.drawImage(backgroundimage, 0, 0);
  };

  var skin = new Image();

  skin.onload = function() {
    var w = skin.width;
    WIDTH = w;
    HEIGHT = w / 2;
    scale = WIDTH / 64;
    skincanvas.width = WIDTH;
    skincanvas.height = HEIGHT;

    skinc.clearRect(0, 0, WIDTH, HEIGHT);

    skinc.drawImage(skin, 0, 0);

    var imgdata = skinc.getImageData(0, 0, WIDTH, HEIGHT);
    var pixels = imgdata.data;

    sbc.clearRect(0, 0, skinBig.width, skinBig.height);
    sbc.save();

    var isOnecolor = true;

    var colorCheckAgainst = [40, 0];
    var colorIndex = (colorCheckAgainst[0] + colorCheckAgainst[1] * WIDTH) * 4;

    var isPixelDifferent = function(x, y) {
      if (
        pixels[(x + y * WIDTH) * 4 + 0] !== pixels[colorIndex + 0] ||
        pixels[(x + y * WIDTH) * 4 + 1] !== pixels[colorIndex + 1] ||
        pixels[(x + y * WIDTH) * 4 + 2] !== pixels[colorIndex + 2] ||
        pixels[(x + y * WIDTH) * 4 + 3] !== pixels[colorIndex + 3]
      ) {
        return true;
      }
      return false;
    };

    // Check if helmet/hat is a solid color
    // Bottom row
    for (var i = HEIGHT; i < WIDTH; i += 1) {
      for (var j = 8; j < 16; j += 1) {
        if (isPixelDifferent(i, j)) {
          isOnecolor = false;
          break;
        }
      }
      if (!isOnecolor) {
        break;
      }
    }
    if (!isOnecolor) {
      // Top row
      for (var i = 40; i < 56; i += 1) {
        for (var j = 0; j < 8; j += 1) {
          if (isPixelDifferent(i, j)) {
            isOnecolor = false;
            break;
          }
        }
        if (!isOnecolor) {
          break;
        }
      }
    }

    for (var i = 0; i < WIDTH; i += 1) {
      for (var j = 0; j < HEIGHT; j += 1) {
        if (
          isOnecolor &&
          ((i >= HEIGHT && i < WIDTH && j >= 8 && j < 16) ||
            (i >= 40 && i < 56 && j >= 0 && j < 8))
        ) {
          pixels[(i + j * WIDTH) * 4 + 3] = 0;
        }
        sbc.fillStyle =
          "rgba(" +
          pixels[(i + j * WIDTH) * 4 + 0] +
          ", " +
          pixels[(i + j * WIDTH) * 4 + 1] +
          ", " +
          pixels[(i + j * WIDTH) * 4 + 2] +
          ", " +
          pixels[(i + j * WIDTH) * 4 + 3] / 255 +
          ")";
        sbc.fillRect(i * sizeRatio, j * sizeRatio, sizeRatio, sizeRatio);
      }
    }
    sbc.restore();

    skinc.putImageData(imgdata, 0, 0);

    charMaterial.map.needsUpdate = true;
    charMaterialTrans.map.needsUpdate = true;
  };

  var cape = new Image();

  cape.onload = function() {
    var w = cape.width;
    CAPE_WIDTH = w;
    CAPE_HEIGHT = w / 2;
    cape_scale = CAPE_WIDTH / 64;
    capecanvas.width = CAPE_WIDTH;
    capecanvas.height = CAPE_HEIGHT;

    capec.clearRect(0, 0, CAPE_WIDTH, CAPE_HEIGHT);

    capec.drawImage(cape, 0, 0);

    capeMaterial.map.needsUpdate = true;
    capemesh.visible = true;
  };
  cape.onerror = function() {
    capemesh.visible = false;
  };

  var handleFiles = function(files) {
    if (files.length > 0) {
      var file = files[0];
      if (file.type === "image/png") {
        var fr = new FileReader();
        fr.onload = function(e) {
          var img = new Image();
          img.onload = function() {
            if (document.getElementById("mod").value == 1) skin.src = img.src;
            else cape.src = img.src;
          };
          img.onerror = function() {
            alert("Error: Not an image or unknown file format");
          };
          img.src = this.result;
        };
        fr.readAsDataURL(file);
      } else {
        alert("Error: This is not a PNG image!");
      }
    }
  };
  skin.alpha=0
skin.src="data:image/jpeg;base64,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"
  var userfile = document.getElementById("userfile");

  threecanvas.addEventListener(
    "dragenter",
    function(e) {
      e.stopPropagation();
      e.preventDefault();
      threecanvas.className = "dragenter";
    },
    false
  );
  threecanvas.addEventListener(
    "dragleave",
    function(e) {
      e.stopPropagation();
      e.preventDefault();
      threecanvas.className = "";
    },
    false
  );
  threecanvas.addEventListener(
    "dragover",
    function(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    false
  );
  threecanvas.addEventListener(
    "drop",
    function(e) {
      e.stopPropagation();
      e.preventDefault();
      threecanvas.className = "";

      var dt = e.dataTransfer;
      var files = dt.files;
      if (userfile) userfile.files = files;
      handleFiles(files);
    },
    false
  );

  if (userfile) {
    userfile.addEventListener(
      "change",
      function() {
        var files = this.files;
        handleFiles(files);
      },
      false
    );
  }

  return {
    setBackgroundImage: function(url) {
      backgroundimage.src = url;
    },
    setEars: function(val) {
      if (val) {
        headgroup.add(ears);
        leftear.visible = rightear.visible = true;
      } else {
        headgroup.remove(ears);
      }
    },
    getBase64: function() {
      return renderer.domElement.toDataURL();
    },
    changeSkin: function(url) {
      skin.src = url;
    },
    changeCape: function(url) {
      cape.src = url;
    },
    toggleMovement: function() {
      isPaused = !isPaused;
    },
    toggleRotation: function() {
      isRotating = !isRotating;
    },
    toggleCape: function() {
      if (!isCapeVisable) {
        capeOrigo.add(capemesh);
        isCapeVisable = true;
      } else {
        capeOrigo.remove(capemesh);
        isCapeVisable = false;
      }
    },
    toggleClassicRun: function() {
      isFunnyRunning = !isFunnyRunning;
    },
    toggleCameraY: function() {
      isYfreezed = !isYfreezed;
    },
    setDefault: function(url) {
      skin.onerror = function() {
        skin.src = url;
      };
    },
    getPrice: function(startPrice) {
      var a = { 64: 1, 128: 1.5, 256: 2, 512: 3, 1024: 4 };
      var mod = document.getElementById("mod").value;
      if (mod == 1) return startPrice * a[WIDTH];
      else return startPrice * a[CAPE_WIDTH];
    },
    getSize: function() {
      var mod = document.getElementById("mod").value;
      if (mod == 1) return WIDTH + "x" + HEIGHT;
      else return CAPE_WIDTH + "x" + CAPE_HEIGHT;
    }
  };
};
var msp = new MSP({
  showcape: true,
  running: false,
  spin: false,
  freezecamera: true,
  container: "#div2"
});
