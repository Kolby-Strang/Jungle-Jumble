import { AppState } from "../AppState.js"
import { Jumble } from "../models/Jumble.js"
import { Pop } from "../utils/Pop.js"
import { saveState } from "../utils/Store.js"


function _calculateTimeSpent() {
    let start = AppState.jumbleStartTime
    let end = AppState.jumbleEndTime
    const timeInSeconds = ((end.getTime() - start.getTime()) / 1000).toFixed(2)
    if (timeInSeconds > AppState.activeJumble.timeHighScore && AppState.activeJumble.timeHighScore) {
        Pop.toast(`You took ${timeInSeconds} seconds`)
        return
    }
    AppState.activeJumble.timeHighScore = timeInSeconds
    AppState.activeJumble.highWPMScore = ((AppState.activeJumble.content.split(' ').length / timeInSeconds) * 60).toFixed(2)
    AppState.emit('jumbles')
}

function _saveJumbles() {
    saveState('jumbles', AppState.jumbles)
}


class JumblesService {

    constructor() {
        AppState.on('jumbles', _saveJumbles)
    }

    setActiveJumble(jumbleId) {
        AppState.jumbleStartTime = new Date()
        let jumbles = AppState.jumbles
        let targetJumble = jumbles.find(jumble => jumble.id == jumbleId)
        AppState.activeJumble = targetJumble
        document.getElementById('activeJumbleContent').focus()
    }

    endJumble() {
        AppState.jumbleEndTime = new Date()
        _calculateTimeSpent()
        AppState.jumbles.sort((jumble1, jumble2) => jumble2.timeHighScore - jumble1.timeHighScore)
        AppState.activeJumble = null
    }

    makeNewJumble(newJumble) {
        let newJumbleObj = new Jumble(newJumble)
        AppState.jumbles.push(newJumbleObj)
        AppState.emit('jumbles')
    }

}

export const jumblesService = new JumblesService()