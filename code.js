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
  var hash = window.location.hash.substring(1);
  console.log(hash);


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
        { data: { type: 'eShape', source: 'a', target: 'aEnd', id: 'EtopBar' } },
        { data: { type: 'eShape', source: 'b', target: 'bEnd', id: 'EmidBar'  } },
        { data: { type: 'eShape', source: 'c', target: 'cEnd', id: 'EbotBar'  } },
        { data: { type: 'eShape', source: 'a', target: 'c' } },
      ]
    },
    
    layout: theLayout
  });
  

  /**
   * Searches for comp with name compName in data file
   * @param  {string} compName    [the company name/id]
   * @return {[jsonObj, bool]}    [Returns the data object if found, else returns false]
   */
  function getCompData(compName){
    for(var i=0; i<expJson.length; i++){
      if(expJson[i].id==hash)
        return expJson[i];
    }
    return false;
  }

  if (hash){
      var comp = getCompData(hash);

    if (comp)
      readData2(comp);
    else
      alert("Company with name "+hash+" not found in dataset.");
  }

  //Event listeners
  cy.on('select', 'node', function(e){
    var node = this;

    console.log(node.data());
    showNodeInfo(node);
  });

  cy.on('select', 'edge', function(e){
    var edge = this;

    console.log(edge.data());
  });
}


var infoTemplate = Handlebars.compile([
  '<p class="ac-name"> Name: {{id}}</p>',
  '{{#if connectedNodes}}<p class="ac-more"><i class="fa fa-cog"></i> Integrated with: {{connectedNodes}}</p>{{/if}}',    

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

  noApps++;
  var position={ x: noApps*60, y: 275 };
  if(position.x > cy.$('#aEnd').position().x-60){
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
  // readData2(graphP.responseJSON[1]);
  // cy.layout(theLayout);
  
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

  cy.$("#bEnd").style({
    'height': 30
  })

  //middle bar width
  cy.$("#EmidBar").style({ 
      'width': 30
  })

  //move top bar to initial position
  cy.$('#a').position().y = 0;
  cy.$('#aEnd').position().y = 0;

  //move middle bar to initial position
  cy.$('#b').position().y=100;
  cy.$('#bEnd').position().y=100;

  noApps = 0;
  noSyst = 0;
  noProc = 0;
  noExpe = 0;

  cy.layout(theLayout);  
}


//*************************************//
//*** Connection points on the side ***//
//*************************************//

function readData( data ){
  reset();

  //Add application nodes
  for(var i=0; i<data.Applications.length; i++){
    addApp(String(data.Applications[i]));
  }

  //Add application connections
  for(var i=0; i<data.edges.length; i++){
    //Add connectionPoints
    cy.add([
      { group: "nodes", data: { type: 'conPointNode', id:'conP'+i}, position: {x: cy.$('#aEnd').position().x + 70, y: i*200/data.edges.length } }, //Connection point

      { group: "edges", data: { source: data.edges[i].source, target: data.edges[i].target, type: 'spaghEdge' } },  //Spaghetti edge
      { group: "edges", data: { source: data.edges[i].source, target: 'conP'+i, type: 'goodIntEdge' } },            //int edge source->conP
      { group: "edges", data: { source: 'conP'+i, target: data.edges[i].target, type: 'goodIntEdge' } }             //int edge source->conP
    ]);

    //Add the integration edge
    cy.add({ 
      group: "edges", 
      data: { source: data.edges[i].source, target: data.edges[i].target, type: 'spaghEdge' } 
    });
  }
}

//*************************************//
//** Connection points in middle bar **//
//*************************************//
function readData2( data ){
  reset();

  //Add application nodes
  for(var i=0; i<data.Applications.length; i++){
    addApp(String(data.Applications[i]));
  }

  //Add application connections
  //for each edge
  for(var i=0; i<data.edges.length; i++){

    var dataSource = data.edges[i].source;
    var dataTarget = data.edges[i].target;

    var sourceConPosX = cy.$('#'+String(dataSource)).position().x;
    var targetConPosX = cy.$('#'+String(dataTarget)).position().x;

    //Connection points
    incMidBarWidth();
    cy.add([
      { group: "nodes", data: { type: 'conPointNode', id:'sConP'+i}, position: {x: sourceConPosX, y: 100-i*15 } },
      { group: "nodes", data: { type: 'conPointNode', id:'tConP'+i}, position: {x: targetConPosX, y: 100-i*15 } },

      { group: "edges", data: { source: dataSource, target: 'sConP'+i, type: 'goodIntEdge' } },
      { group: "edges", data: { source: 'sConP'+i, target: 'tConP'+i, type: 'goodIntEdge' } },
      { group: "edges", data: { source: 'tConP'+i, target: dataTarget, type: 'goodIntEdge' } },
      { group: "edges", data: { source: dataSource, target: dataTarget, type: 'spaghEdge' } }
    ]);
  }



  //Add data to each app containing connected targets
  var applications = cy.$('node[type="app"]');
  for(var i=0; i<applications.length; i++){
    var connectedEdges = applications[i].connectedEdges("edge[type='spaghEdge']");

    applications[i].data().connectedNodes ='';

    //loop through each connected edge
    for(var j=0; j<connectedEdges.length; j++){
      //Check if current edge target is current node, if not; add target
      if(connectedEdges[j].target().data().id!=applications[i].data().id)
        applications[i].data().connectedNodes+=connectedEdges[j].target().data().id+', ';
      if(connectedEdges[j].source().data().id!=applications[i].data().id)
        applications[i].data().connectedNodes+=connectedEdges[j].source().data().id+', ';
    }
  }
}



//Increases the middle bar width and moves top bar up
function incMidBarWidth(){
  var currH = parseInt( cy.$("#bEnd").style().height );
  var stepSize=15;
  var newH = currH+stepSize;

  cy.$("#bEnd").style({
      'height': currH+stepSize
    })

  //middle bar width
  cy.$("#EmidBar").style({ 
      'width': currH+stepSize
  })

  //move middle bar
  cy.$('#b').position().y-=stepSize/2;
  cy.$('#bEnd').position().y-=stepSize/2;

  //move top bar
  cy.$('#a').position().y -= stepSize;
  cy.$('#aEnd').position().y -= stepSize;

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

$('#filters').on('click', 'input', function(){
    
    var badIntEdges = $('#badIntEdges').is(':checked');
    var goodIntEdges = $('#goodIntEdges').is(':checked');





  cy.batch(function(){
    cy.elements().forEach(function( n ){
      var type = n.data('type');

      n.removeClass('filtered');
      
      var filter = function(){
        n.addClass('filtered');
      };

      if( type === 'goodIntEdge' || type === 'conPointNode' ){
        
        if( !goodIntEdges ){ filter(); }
        
      } else if( type === 'spaghEdge' ){
        
        if( !badIntEdges ){ filter(); }
        
      }  
    });
    // cy.nodes().forEach(function( n ){
    //   var type = n.data('NodeType');
    //   var CompanyType = n.data('CompanyType');

    //   n.removeClass('filtered');
      
    //   var filter = function(){
    //     n.addClass('filtered');
    //   };

    //   if( type === 'Customer' ){
        
    //     if( !cust ){ filter(); }
        
    //   } else if( type === 'Evangelist' ){
        
    //     if( !evan ){ filter(); }
        
    //   } else if( type === 'Subscriber' ){
        
    //     if( !subs ){ filter(); }
        
    //   } else if( type === 'Lead' ){
        
    //     if( !lead ){ filter(); }
        
    //   } else if( type === 'Marketing Qualified Lead' ){
        
    //     if( !markQualLead ){ filter(); }
        
    //   } else if( type === 'Sales Qualified Lead' ){
        
    //     if( !saleQualLead ){ filter(); }
        
    //   } else if( type === 'Prospect' ){
        
    //     if( !prosp ){ filter(); }
    //   }






    //   if( CompanyType === 'Clothing' ){
        
    //     if( !cloth ){ filter(); }
        
    //   } else if( CompanyType === 'Cars' ){
        
    //     if( !cars ){ filter(); }
        
    //   } else if( CompanyType === 'Food' ){
        
    //     if( !food ){ filter(); }
        
    //   } else if( CompanyType === 'Electronics' ){
        
    //     if( !elect ){ filter(); }
        
    //   } else if( CompanyType === 'Candy' ){
        
    //     if( !candy ){ filter(); }
        
    //   }   
    // });
  }); 
  
});

$('#appFilter').on('click', 'input', function(){

  var app = $('#app').is(':checked');


  cy.batch(function(){
    
    cy.nodes().forEach(function( n ){
      var type = n.data('NodeType');
      
      n.removeClass('filtered');
      
      var filter = function(){
        n.addClass('filtered');
      };

      if( type === 'Application' ){
        
        if( !app ){ filter(); }
        
      } 
    });
  }); 
});

$('#filter').qtip({
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  
  show: {
    event: 'click'
  },
  
  hide: {
    event: 'unfocus'
  },
  
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  },

  content: $('#filters')
});


}); // on dom ready













