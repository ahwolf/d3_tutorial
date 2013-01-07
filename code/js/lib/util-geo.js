var geons = {};

// this file contains all the geo related objects and functions
geons.geoConfig = function() {
    this.TRANSLATE_0 = appConstants.TRANSLATE_0;
    this.TRANSLATE_1 = appConstants.TRANSLATE_1;
    this.SCALE = appConstants.SCALE;
    this.origin = appConstants.origin;

    this.mercator = d3.geo.mercator();
    var wtf = this
    this.albers = d3.geo.albers()
	.scale(wtf.SCALE)
	.origin(wtf.origin)
	.translate([wtf.TRANSLATE_0,wtf.TRANSLATE_1]);
    
    this.path = d3.geo.path().projection(this.albers);

    // this.setupGeo = function() {
    //     var translate = this.albers.translate();
    //     translate[0] = this.TRANSLATE_0;
    //     translate[1] = this.TRANSLATE_1;

    //     this.albers.translate(translate);
    //     this.albers.scale(this.SCALE);
    // 	this.albers.origin(this.origin);
    // }
}

// geoConfig contains the configuration for the geo functions
geo = new geons.geoConfig();