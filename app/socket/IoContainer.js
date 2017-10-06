let io;

exports.setIO = function(newIO){
        io = newIO;
        console.log('IO Container: IO set');
};

exports.getIO = function () {
    console.log('IO Container: IO get');
    if(io === undefined){
        throw new Error('IO Container: IO object not set. Cannot get.');
    }
    return io;
};