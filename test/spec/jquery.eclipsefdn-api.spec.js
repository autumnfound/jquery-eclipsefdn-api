( function( $, QUnit ) {

    "use strict";

    var $testCanvas = $( "#testCanvas" );
    var $fixture = null;

    QUnit.module( "jQuery Boilerplate", {
        beforeEach: function() {

            // fixture is the element where your jQuery plugin will act
            $fixture = $( "<div/>" );

            $testCanvas.append( $fixture );
        },
        afterEach: function() {

            // we remove the element to reset our plugin job :)
            $fixture.remove();
        }
    } );

    QUnit.test( "is inside jQuery library", function( assert ) {

        assert.equal( typeof $.fn.eclipseFdnApi, "function", "has function inside jquery.fn" );
        assert.equal( typeof $fixture.eclipseFdnApi, "function", "another way to test it" );
    } );

    QUnit.test( "returns jQuery functions after called (chaining)", function( assert ) {
        assert.equal(
            typeof $fixture.eclipseFdnApi().on,
            "function",
            "'on' function must exist after plugin call" );
    } );

    QUnit.test( "caches plugin instance", function( assert ) {
        $fixture.eclipseFdnApi();
        assert.ok(
            $fixture.data( "plugin_eclipseFdnApi" ),
            "has cached it into a jQuery data"
        );
    } );
}( jQuery, QUnit ) );
