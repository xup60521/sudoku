const grid2whole = (i1, i2) => {

    let total = 0;
    let bigcoordx = (Math.floor(i1 % 3));
    let bigcoordy = (Math.floor(i1 / 3));
    let smallcoordx = (Math.floor(i2 % 3));
    let smallcoordy = (Math.floor(i2 / 3));
    let coordx = bigcoordx*3+smallcoordx;
    let coordy = bigcoordy*3+smallcoordy;

    total += ( Math.floor(i1 / 3) == 0 ? 0 : (Math.floor(i1 / 3) == 1 ? 27 : 54) );
    
    return [coordx, coordy];
}

const whole2grid = (i1, i2) => {
    let dist = {}
    for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
            dist[JSON.stringify(grid2whole(i, j))] = [i, j]
        }
    }
    return dist[JSON.stringify([i1, i2])];
}

export {grid2whole, whole2grid}