$(function(){ // on dom ready

var noExpe = 0;
var noProc = 0;
var noSyst = 0;
var noApps = 0;

var cy;

var theLayout = {
    name: 'preset',
    padding: 50,
    fit: true
  }

var graphP = $.ajax({
  //url: './data/dataCalcsPolCoordRESULT.json', 
  url: 'data/data.json', 
  type: 'GET',
  dataType: 'json'
});

var styleP = $.ajax({
  url: './data/style.cycss', 
  type: 'GET',
  dataType: 'text'
});


Promise.all([ graphP, styleP ]).then(initCy);

function initCy( then ){
  var expJson = then[0];
  var styleJson = then[1];

  cy = cytoscape({
    container: document.getElementById('cy'),
    
    boxSelectionEnabled: false,
    
    style: styleJson,
    
    elements: {
      nodes: [
        // eShape
        { data: { id: 'a', type: 'eShape' }, position: { x: 0, y:   0 }, grabbable: false, locked: true, selectable: false },
        { data: { id: 'b', type: 'eShape' }, position: { x: 0, y: 100 }, grabbable: false, locked: true, selectable: false },
        { data: { id: 'c', type: 'eShape' }, position: { x: 0, y: 200 }, grabbable: false, locked: true, selectable: false },
        { data: { id: 'aEnd', type: 'eShape' }, position: { x: 200, y:   0 }, style :{ shape:'square' }, grabbable: false, locked: true, selectable: false },
        { data: { id: 'bEnd', type: 'eShape' }, position: { x: 175, y: 100 }, style :{ shape:'square' }, grabbable: false, locked: true, selectable: false },
        { data: { id: 'cEnd', type: 'eShape' }, position: { x: 200, y: 200 }, style :{ shape:'square' }, grabbable: false, locked: true, selectable: false },

      ],
      edges: [
        { data: { type: 'eShape', source: 'a', target: 'aEnd' } },
        { data: { type: 'eShape', source: 'b', target: 'bEnd' } },
        { data: { type: 'eShape', source: 'c', target: 'cEnd' } },
        { data: { type: 'eShape', source: 'a', target: 'c' } },
      ]
    },
    
    layout: theLayout
  });


  //Event listeners
  cy.on('select', 'node', function(e){
    var node = this;

    showNodeInfo(node);
    node.select();
  });

}


var infoTemplate = Handlebars.compile([
  '<p class="ac-name">{{id}}</p>',
  '{{#if NodeType}}<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{NodeType}}</p>{{/if}}',
  '{{#if Country}}<p class="ac-country"><i class="fa fa-map-marker"></i> {{Country}}</p>{{/if}}',
  '{{#if WebsiteURL}}<p class="ac-more"><i class="fa fa-external-link"></i><a target="_blank" href="http://www.{{WebsiteURL}}">{{id}}</a></p>{{/if}}',
  '{{#if AnnRevenue}}<p class="ac-more"><i class="fa fa-usd"></i> {{AnnRevenue}}</p>{{/if}}',
  '{{#if CompanyType}}<p class="ac-more"><i class="fa fa-usd"></i> {{CompanyType}}</p>{{/if}}',    

].join(''));









var addExperience = function(){
  console.log("Add Experience");

  noExpe++;
  var position={ x: noExpe*60, y: 0 };
  if(position.x > cy.$('#aEnd').position().x){
    cy.$('#aEnd').position().x += 60;
    cy.$('#bEnd').position().x += 60;
    cy.$('#cEnd').position().x += 60;
  }

  cy.add({
    group: "nodes",
    data: { id: "Exp"+noExpe },
    position: position
  });

  cy.layout( theLayout );
}

var addProcess = function(){
  console.log("Add Process");

  noProc++;
  var position={ x: noProc*60, y: 100 };
  if(position.x > cy.$('#aEnd').position().x){
    cy.$('#aEnd').position().x += 60;
    cy.$('#bEnd').position().x += 60;
    cy.$('#cEnd').position().x += 60;
  }

  cy.add({
    group: "nodes",
    data: { id: "Proc"+noProc },
    position: position
  });

  cy.layout( theLayout );
}

var addSystem = function(){
  console.log("Add System");


  noSyst++;
  var position={ x: noSyst*60, y: 200 };
  if(position.x > cy.$('#aEnd').position().x){
    cy.$('#aEnd').position().x += 60;
    cy.$('#bEnd').position().x += 60;
    cy.$('#cEnd').position().x += 60;
  }

  cy.add({
    group: "nodes",
    data: { id: "Syst"+noSyst },
    position: position
  });

  cy.layout( theLayout );
}

var addApp = function(_appId){
  console.log("Add App"); 

  noApps++;
  var position={ x: noApps*60, y: 275 };
  if(position.x > cy.$('#aEnd').position().x){
    cy.$('#aEnd').position().x += 60;
    cy.$('#bEnd').position().x += 60;
    cy.$('#cEnd').position().x += 60;
  }

  cy.add({
    group: "nodes",
    data: { id: _appId, type: 'app' },
    position: position
  });
  
  cy.layout( theLayout );
}


//Event listeners
$('#addExperience').on('click', function(){
  addExperience();
})

$('#addSystem').on('click', function(){
  addSystem();
})

$('#addApp').on('click', function(){
  addApp('App'+noApps);
})

$('#addProcess').on('click', function(){
  addProcess();
})
$('#debug').on('click', function(){
  var data = graphP.responseJSON;
  reset();

  for(var i=0; i<data[0].Applications.length; i++){
    addApp(String(data[0].Applications[i]));
  }
})

$('#clear').on('click', function(){
  reset();
})



function showNodeInfo( node ){
  $('#info').html( infoTemplate( node.data() ) ).show();
}

function reset(){
  cy.remove( cy.elements("node[type != 'eShape']") );
  cy.$('#aEnd').position().x = 200;
  cy.$('#bEnd').position().x = 175;
  cy.$('#cEnd').position().x = 200;

  noApps = 0;
  noSyst = 0;
  noProc = 0;
  noExpe = 0;

  cy.layout(theLayout);  
}



$('#search').typeahead({
  minLength: 2,
  highlight: true,
},
{
  name: 'search-dataset',
  source: function( query, cb ){
    function matches( str, q ){
      str = (str || '').toLowerCase();
      q = (q || '').toLowerCase();
      
      return str.match( q );
    }
    
    var fields = ['id', 'NodeType', 'Country', 'CompanyType', 'Milk'];
    
    function anyFieldMatches( n ){
      for( var i = 0; i < fields.length; i++ ){
        var f = fields[i];
        
        if( matches( n.data(f), query ) ){
          return true;
        }
      }
      
      return false;
    }
    
    function getData(n){
      var data = n.data();
      
      return data;
    }
    
    function sortByName(n1, n2){
      if( n1.data('id') < n2.data('id') ){
        return -1;
      } else if( n1.data('id') > n2.data('id') ){
        return 1;
      }
      
      return 0;
    }
    
    var res = cy.nodes().stdFilter( anyFieldMatches ).sort( sortByName ).map( getData );

    // cy.batch(function(){
    //   cy.elements().stdFilter( anyFieldMatches ).removeClass('filtered');
    //   cy.elements().not( cy.elements().stdFilter( anyFieldMatches ) ).addClass('filtered');
    // });
    

    cb( res );
  },
  templates: {
    suggestion: infoTemplate
  }
}).on('typeahead:selected', function(e, entry, dataset){
  var n = cy.getElementById(entry.id);
  
  n.select();
  console.log(n.selected());
  showNodeInfo( n );
});

}); // on dom ready













