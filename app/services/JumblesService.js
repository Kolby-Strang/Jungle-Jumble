import { AppState } from "../AppState.js"
import { JumblesController } from "../controllers/JumblesController.js"
import { Jumble } from "../models/Jumble.js"
import { Pop } from "../utils/Pop.js"
import { saveState } from "../utils/Store.js"
import { setHTML } from "../utils/Writer.js"


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

function _trackCurrentIndex(key) {
    if (document.getElementById('activeJumbleContent') !== document.activeElement) return
    if (key == 'Shift') return
    if (key == 'Backspace' && AppState.currentIndex == 0) return

    let contentArray = AppState.activeJumble.content.split('')
    if (contentArray[AppState.currentIndex] != key && key != 'Backspace') {
        Pop.error('WRONG KEY')
        AppState.incorrectIndexes.push(AppState.currentIndex)
    }

    if (key == 'Backspace' && AppState.currentIndex > 0) {
        AppState.currentIndex--
        if (AppState.currentIndex <= AppState.incorrectIndexes[AppState.incorrectIndexes.length - 1]) AppState.incorrectIndexes.splice(AppState.incorrectIndexes.length - 1, 1)
    } else {
        AppState.currentIndex++
    }

    _highlightIndexes()

}

function _highlightIndexes() {
    let appContent = AppState.activeJumble.content
    let index = AppState.currentIndex
    let content = '<span class="bg-highlight">'

    console.log(AppState.incorrectIndexes);

    for (let i = 0; i < index; i++) {
        if (AppState.incorrectIndexes.find(ind => ind == i)) {
            content += `</span><span class="bg-danger">${appContent[i]}</span><span class="bg-highlight">`
        } else {
            content += appContent[i]
        }
    }
    content += '</span>'
    content += appContent.substring(index)

    setHTML('jumble-content', content)
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
        onkeydown = (event) => {
            _trackCurrentIndex(event.key)
        }
    }

    endJumble() {
        AppState.jumbleEndTime = new Date()
        _calculateTimeSpent()
        AppState.jumbles.sort((jumble1, jumble2) => jumble2.timeHighScore - jumble1.timeHighScore)
        AppState.activeJumble = null
        AppState.currentIndex = 0
    }

    makeNewJumble(newJumble) {
        let newJumbleObj = new Jumble(newJumble)
        AppState.jumbles.push(newJumbleObj)
        AppState.emit('jumbles')
    }

}

export const jumblesService = new JumblesService()