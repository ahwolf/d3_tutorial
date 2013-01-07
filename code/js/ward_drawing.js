var w = 960;
var h = 800;
var padding = 40;

var albers = d3.geo.albers()
    .scale(80000)
    .origin([-87.63073,41.836084])
    .translate([400,400]);

var path = d3.geo.path().projection(albers);

// Old rendering, no used for three.js
var vis = d3.select("#main_container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// change what you would like data to equal for different geo projections
var data = ward;
// var data = neighborhood;
// var data = census_tract;

// calculate the max and min of all the property values
var gas_min_max = d3.extent(data.features, function(feature){
    return feature.properties.gas;
});

var elec_min_max = d3.extent(data.features, function(feature){
    return feature.properties.elect;
});

var gas_eff_min_max = d3.extent(data.features, function(feature){
    return feature.properties.gas_efficiency;
});

var elec_eff_min_max = d3.extent(data.features, function(feature){
    return feature.properties.elect_efficiency;
});

// Render using d3
var color_scale = d3.scale.linear()
    .domain(elec_eff_min_max)
    .range(['red','blue']);

vis.selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr('fill', function(d){return color_scale(d.properties.elect_efficiency);})
    .attr('stroke',"black")
    .attr("d", path);

// Render using three.js

// The following code was copied from
// http://www.smartjava.org/content/render-geographic-information-3d-threejs-and-d3js
// and updated to take advantage of built in d3 tools

var scene;
var renderer;
var camera;

var appConstants  = {

    TRANSLATE_0 : 0,
    TRANSLATE_1 : 0,
    SCALE : 80000,
    origin : [-87.63073,41.836084]
}

var geons = {};

// this file contains all the geo related objects and functions
geons.geoConfig = function() {
    this.TRANSLATE_0 = appConstants.TRANSLATE_0;
    this.TRANSLATE_1 = appConstants.TRANSLATE_1;
    this.SCALE = appConstants.SCALE;
    this.origin = appConstants.origin;

    this.mercator = d3.geo.mercator();
    var wtf = this;
    this.albers = d3.geo.albers()
	.scale(wtf.SCALE)
	.origin(wtf.origin)
	.translate([wtf.TRANSLATE_0,wtf.TRANSLATE_1]);
    
    this.path = d3.geo.path().projection(this.albers);

}

// geoConfig contains the configuration for the geo functions
geo = new geons.geoConfig();

initScene();
addGeoObject();
renderer.render( scene, camera );

// Set up the three.js scene. This is the most basic setup without
// any special stuff
function initScene() {
    // set the scene size
    var WIDTH = 600, HEIGHT = 600;

    // set some camera attributes
    var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

    // create a WebGL renderer, camera, and a scene
    renderer = new THREE.WebGLRenderer({antialias:true});
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, 
					 ASPECT,
                                         NEAR, 
					 FAR);
    scene = new THREE.Scene();
    
    // add and position the camera at a fixed position
    scene.add(camera);
    camera.position.z = 550;
    camera.position.x = 0;
    camera.position.y = 550;
    camera.lookAt( scene.position );
    
    // start the renderer, and black background
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000);
    
    // add the render target to the page
    $("#main_container").append(renderer.domElement);

    // add a light at a specific position
    var pointLight = new THREE.PointLight(0xFFFFFF);
    scene.add(pointLight);
    pointLight.position.x = 800;
    pointLight.position.y = 800;
    pointLight.position.z = 800;
    
    // add a base plane on which we'll render our map
    var planeGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
    var planeMat = new THREE.MeshLambertMaterial({color: 0x666699});
    var plane = new THREE.Mesh(planeGeo, planeMat);

    // rotate it to correct position
    plane.rotation.x = -Math.PI/2;
    scene.add(plane);
}


// add the loaded gis object (in geojson format) to the map
function addGeoObject() {
    
    // convert to mesh and calculate values
    _.each(data.features, function (geoFeature){	
        var feature = geo.path(geoFeature);

        // we only need to convert it to a three.js path
        var mesh = transformSVGPathExposed(feature);

	// the two different scales that we use, extrude determines
	// the height and color is obviously color. You can choose
	// from the max_min that we calculated above, ensure this
	// matches with below where you call these functions.
	var color_scale = d3.scale.linear()
	    .domain(gas_eff_min_max)
	    .range(['blue','red']);
	
	var extrude_scale = d3.scale.linear()
	    .domain(elec_eff_min_max)
	    .range([0,100]);

        // create material color based on gas efficiency Ensure the
	// property matches with the scale above, we'll add automatic
	// matching functionality later
        var mathColor = color_scale(geoFeature.properties.gas_efficiency);

	// Need to convert the color into a hexadecimal number
	var hexMathColor = parseInt(mathColor.replace("#","0x"));
	
	// Change the color of the material!
        var material = new THREE.MeshLambertMaterial({
            color: hexMathColor
        });
	
        // create extrude based on electricity efficiency
        var extrude = extrude_scale(geoFeature.properties.elect_efficiency);

	// Add the attributes to the mesh for the height of the polygon
        var shape3d = mesh.extrude({amount: Math.round(extrude), 
				    bevelEnabled: false
				   });
	
        // create a mesh based on material and extruded shape
        var toAdd = new THREE.Mesh(shape3d, material);
        // rotate and position the elements nicely in the center
        toAdd.rotation.x = Math.PI/2;
        toAdd.translateY(extrude/2);
	
        // add to scene
        scene.add(toAdd);

    });
}

