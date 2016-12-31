var map_manager = {
    "map" : null,
    "map_items" : []
}

map_manager.map_items = [{"latitude": 40.7636057395893, "expire": 1483153329000.0, "longitude": -73.9929199225878, "pokemon_id": 452}, {"latitude": 40.7611359894947, "expire": 1483153492000.0, "longitude": -73.9929199225878, "pokemon_id": 213}, {"latitude": 40.7628840927479, "expire": 1483153613000.0, "longitude": -73.9921853484512, "pokemon_id": 276}, {"latitude": 40.7654657832132, "expire": 1483153613000.0, "longitude": -73.9973273083072, "pokemon_id": 67}, {"latitude": 40.7599010750455, "expire": 1483153616000.0, "longitude": -73.9929199225878, "pokemon_id": 48}, {"latitude": 40.7646399862109, "expire": 1483153617000.0, "longitude": -73.9958581909937, "pokemon_id": 381}, {"latitude": 40.7651116698382, "expire": 1483153886000.0, "longitude": -73.9730854344829, "pokemon_id": 417}, {"latitude": 40.7651532034487, "expire": 1483153916000.0, "longitude": -73.995123628114, "pokemon_id": 460}, {"latitude": 40.7635015200862, "expire": 1483153985000.0, "longitude": -73.9921853484512, "pokemon_id": 252}, {"latitude": 40.763196734103, "expire": 1483154070000.0, "longitude": -73.9943890624196, "pokemon_id": 70}, {"latitude": 40.7606227479996, "expire": 1483154081000.0, "longitude": -73.9936544939107, "pokemon_id": 381}, {"latitude": 40.7603178911907, "expire": 1483154100000.0, "longitude": -73.9958581909937, "pokemon_id": 487}, {"latitude": 40.7608311567418, "expire": 1483154103000.0, "longitude": -73.995123628114, "pokemon_id": 394}, {"latitude": 40.7605185355535, "expire": 1483154128000.0, "longitude": -73.9929199225878, "pokemon_id": 254}, {"latitude": 40.7637725513944, "expire": 1483154357000.0, "longitude": -73.9723507845138, "pokemon_id": 259}]

function loadMapScenario() {
    map_manager.map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        credentials: 'AjFkNBGu6xQ1QePUDJU7hVOegwUgCoLzqVMLgC8DhOHQHIVBp72ojtC3PAjUyR_U'
    });
    add_pokemon_layer();
}

// 1. Define pokemon data format, create mock pokemon data
function get_counter_down_time_from_expire_epoch(epoch) {
  var now_time = new Date().getTime() / 1000;
  var time_left = epoch / 1000 - now_time;   // unit: second
  var second = Math.floor(time_left % 60);
  var minute = Math.floor(time_left / 60);
  return minute + ":" + second;
}

// 2. Create pokemon image on map
function get_pokemon_layer_from_map_items(map_items) {
    var layer = new Microsoft.Maps.Layer();
    var pushpins = []
    for (var i in map_items) {
      var map_item = map_items[i];
      var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(map_item["latitude"], map_item["longitude"]), 
                                               { icon: 'images/pushpin_images/pokemon/' + map_item['pokemon_id'] + '.png' ,
                                                 title: get_counter_down_time_from_expire_epoch(map_item['expire']) });
      pushpins.push(pushpin)
    }
    layer.add(pushpins);
    return layer;
}
function add_pokemon_layer() {
    var pokemon_layer = get_pokemon_layer_from_map_items(map_manager.map_items)
    map_manager.map.layers.insert(pokemon_layer);
}

// 3. Add pokemon counter down refresh.
function refresh_pokemon_layer() {
  // Prepare new layer
  var pokemon_layer = get_pokemon_layer_from_map_items(map_manager.map_items)
  // Remove old layer
  map_manager.map.layers.clear()
  // Add new layer
  map_manager.map.layers.insert(pokemon_layer);
}

// 4. Connect with REST API
function refresh_pokemon_data() {
  // Get boundary of current map view
  var bounds = map_manager.map.getBounds();
  
  // Request pokemons in current map view
  var apigClient = apigClientFactory.newClient();
  var params = {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    west: bounds.getWest(),
    east: bounds.getEast(),
  };
  var body = { };
  var additionalParams = { };
 
  apigClient.mapPokemonsGet(params, body, additionalParams)
    .then(function(result){
        //This is where you would put a success callback
        map_manager.map_items = result.data;
    }).catch( function(result){
        //This is where you would put an error callback
        console.log(result)
    });   
}
window.setInterval(refresh_pokemon_data, 1000);

window.setInterval(refresh_pokemon_layer, 1000);
