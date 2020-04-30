

export const isStringNumber = (str:string) =>{
    var parsed = parseFloat(str);
    var casted = +str;
    return parsed === casted && !isNaN(parsed) && !isNaN(casted);
}
export const filter = (array:any[], predicate:{[x:string]:any})=>{
    return array.filter((d)=>{
        return Object.keys(predicate).map((prop)=>d[prop] == predicate[prop]).every(v => v === true);
    })
}
export const trimquotes = (input: any) => {
    if (!input || (typeof input !== 'string' && !(input instanceof String))) {
        return input;
    }

    var beingTrimmed = input;
    var trimmingComplete = false;
    //Trim until no more quotes can be removed.
    while (!trimmingComplete) {
        var beforeTrimming = beingTrimmed;
        beingTrimmed = input.replace(/^'/, "").replace(/'$/, "");
        beingTrimmed = beingTrimmed.replace(/^"/, "").replace(/"$/, "");

        if (beforeTrimming.length === beingTrimmed.length) {
            trimmingComplete = true;
        }
    }


    return beingTrimmed;
}

export const trimvariablequalifiers = (input: any): string => {
    if (!input || (typeof input !== 'string' && !(input instanceof String))) {
        return input;
    }

    var trimmed = input.replace(/^[#VCAvca]{/, "").replace(/}$/, "");

    return trimmed;
}