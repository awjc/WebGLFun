(function() {
    "use strict";
    function GameObject(mesh, position, update) {
        this.mesh = mesh;
        this.mesh.position = position || this.mesh.position;
        this.update = update || this.update;
    }

    GameObject.prototype = {
        update: function() {
            // Do nothing
        }
    }

    $(document).ready(function() {
        var canvas = $("#canvas");

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 60, canvas.width() / canvas.height(), 0.1, 1000 );

        var renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize(canvas.width(), canvas.height());
        canvas.html( renderer.domElement );

        $(window).resize(function() {
            camera.aspect = canvas.width() / canvas.height();
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.width(), canvas.height());
            canvas.html( renderer.domElement );
        })


        var objs = [];
        var loader = new THREE.JSONLoader(true);
        loader.load( "Models/shock.js", function ( geom ) {
            var material = new THREE.MeshPhongMaterial( {
                ambient: "#aa0000",
                diffuse: "#aaaa22",
                specular: "#00ff00",
                shininess: 1
            });

            var n = 40;
            var rx = 6;
            var rz = 0;
            if (n > 0) {
                for (var i=0; i < 360; i += 360 / n) {
                    var mesh = new THREE.Mesh(geom, material);
                    var updateFunc = function (mesh, xspeed, zspeed) {
                        mesh.rotation.x += xspeed;
                        mesh.rotation.z += zspeed;
                    }.bind(this, mesh, Math.cos(i * Math.PI / 180) * 0.04, Math.sin(i * Math.PI / 180) * 0.02);
                    var obj = new GameObject(mesh,
					    new THREE.Vector3(Math.cos(i * Math.PI / 180) * rx, Math.sin(i * Math.PI / 180) * rz, Math.sin(i * Math.PI / 180) * rz - 5),
					    updateFunc);
                    objs.push(obj);

                    scene.add(obj.mesh);
                }
            }

            render();
        } );

        //objs.push(new GameObject(new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1),
        //                                          new THREE.MeshPhongMaterial( {
        //                                             ambient: "#002200",
        //                                             diffuse: "#00aa22",
        //                                             specular: "#00ff00",
        //                                             shininess: 1
        //                                         })),
        //                         new THREE.Vector3(1, 1, 1),
        //                         function() {
        //                             this.mesh.rotation.x += 0.01;
        //                             this.mesh.rotation.y += 0.03;
        //                         }));

        //objs.push(new GameObject(new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1),
        //                                         new THREE.MeshPhongMaterial( {
        //                                             ambient: "#000022",
        //                                             diffuse: "#0022aa",
        //                                             specular: "#0000ff",
        //                                             shininess: 1
        //                                         })),
        //                         new THREE.Vector3(-1, 2, -1),
        //                         function() {
        //                             this.mesh.rotation.x += 0.02;
        //                             this.mesh.rotation.y += 0.015;
        //                         }));

        objs.forEach(function(obj) { scene.add(obj.mesh); } );


        var ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight2.position.set(0.5, 1, 1);
        scene.add(directionalLight2);

        function render() {
            requestAnimationFrame(render);

            objs.forEach(function(obj) { obj.update(); } );

            renderer.render(scene, camera);
        }

        
        var camY = 2;
        var camDist = 25;
        camera.position.x = 0;
        camera.position.y = camY;
        camera.position.z = camDist;

        camera.lookAt(new THREE.Vector3(0, 0, 0));

        $(document).keypress(function() {
            var theta = 0;

            return function () {
                theta += 0.1;
                camera.position.x = Math.sin(theta) * camDist;
                camera.position.z = Math.cos(theta) * camDist;

                camera.lookAt(new THREE.Vector3(0, 0, 0));
            }
        }());
    })
})();
