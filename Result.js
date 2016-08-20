function Result( errorMessage, errorCode, data ){
    this.errorMessage = errorMessage;
    this.errorCode = 0;
    this.data = {};
    if( errorCode ){
        this.errorCode = errorCode;
    }
    if( data ){
        this.data = data;
    }
}

module.exports = Result;