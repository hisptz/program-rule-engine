export const getCode = (options:any[], key:string)=>{
    if(options){
        for(var i=0; i<options.length; i++){
            if( key === options[i].displayName){
                return options[i].code;
            }
        }
    }
    return key;
},
export const getName = (options:any[], key:string)=>{
    if(options){
        for(var i=0; i<options.length; i++){
            if( key === options[i].code){
                return options[i].displayName;
            }
        }
    }
    return key;
}