import sanitizeHtml from "sanitize-html";

const player = (name) => {
    let playerName = sanitizeHtml(name);
    let isCurrentlyPlaying = false;
    
    const attack = (coords,board,turn) => {
        turn % 2 == 0 ? isCurrentlyPlaying = true : isCurrentlyPlaying = false 
        if (isCurrentlyPlaying == true){
            board.receiveAttack(coords); //doesnt tell us if attack was successful/not successful/redundant
            return true
        }
        else{
            return false
        }
    }

    const getName = () => {
        return playerName;
    }

    const isHuman = () => true

    return {
        attack,
        getName,
        isHuman
    }
}


const AI = () => {
    let isCurrentlyPlaying = false;
    const {getName} = player("AI");

    //randomly attacks location
    const attack = (board,turn) => {
        turn % 2 == 0 ? isCurrentlyPlaying = false : isCurrentlyPlaying = true
        if (isCurrentlyPlaying == true){
                let coords = getRandomCoordinate();
                board.receiveAttack(coords);
                return true
        }
        else{
            return false
        }
    }


    const getRandomCoordinate = () => {
        let randomX = Math.floor(Math.random() * 11);
        let randomY = Math.floor(Math.random() * 11);
        return [randomX,randomY];
    }

    const isHuman = () => false

    return {
        attack,
        getName,
        isHuman
    }

}

//lets AI determine how to lock on to adjacent points after it gets a hit onto a point
function smartDetection(){

}


export { player, AI };
