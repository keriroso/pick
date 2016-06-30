showAlert = function (msg, callback){
        if (navigator.notification !== undefined){
                 navigator.notification.alert(msg, callback);
        } else {
                alert(msg);
                if (callback !== undefined) {
                        callback();
                }
        }
};

//function para setear el Storage
setLocalVariable = function(id, value) {
    var storage = window.localStorage;

    storage.setItem(id, value);

    return true;
};
//Funcion para obtener los localStorage
getLocalVariable = function(id) {
  var storage = window.localStorage;
  var response = storage.getItem(id);
console.log(storage);
  if (response === null || response === undefined){
    response = '';
  }

  return response;
};
// checkConnection del dispositivo
checkConnection = function(){
  var status = {
        'type': 'none',
        'online': false,
        'message': ''
      };

  if (window.Connection) {

    // Connection.NONE         No network connection
    console.log(navigator.connection.type);

    if (navigator.connection.type != Connection.NONE) {
      status.online = true;

      switch (navigator.connection.type) {
        // WiFi connection
        case Connection.WIFI:
          status.type= 'wifi';
          break;

        // Cell 2G connection
        case Connection.CELL_2G:
          status.type= '2g';
          break;

        // Cell 3G connection
        // Cell 4G connection
        case Connection.CELL_3G:
        case Connection.CELL_4G:
          status.type= '2g';
          break;
        default:
        // Connection.UNKNOWN    Unknown connection
        // Connection.ETHERNET     Ethernet connection
          status.type= 'ethernet';
          break;
      }
    }
  } else{
    // Si no tiene acceso al objeto de conexión
    var isOffline = 'onLine' in navigator && !navigator.onLine;

    if (!isOffline){
      // Asume que es una conexión permanente
      status.online = true;
      status.type= 'wifi';
    }
  }

  return status;
};
