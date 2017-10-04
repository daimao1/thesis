let io;

exports.setIO = function(newIO){
        io = newIO;
        console.log('Io has been set');
};

exports.getIO = function () {
    console.log('Io get');
    if(io === undefined){
        throw new Error('IO object not set. Cannot get.');
    }
    return io;
};