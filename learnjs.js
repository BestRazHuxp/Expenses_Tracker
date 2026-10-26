const solve = (arr) => {
    let k = BigInt(2);
    for(let j = 0 ; j < 64; j++){
        const m = arr[1] % k;
        for(let i = 1; i < arr.length; i++) 
            if(arr[i] % k !== m) return k;
        k *= BigInt(2);
    }
}

const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(BigInt);

t = input[0];
cur = 1;
while(t--){
    console.log(solve(input.slice(cur , cur + Number(input[cur]) + 1)).toString());
    cur += Number(input[cur]) + 1;
}