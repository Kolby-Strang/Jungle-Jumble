import { AppState } from "../AppState.js";
import { jumblesService } from "../services/JumblesService.js";
import { getFormData } from "../utils/FormHandler.js";
import { Pop } from "../utils/Pop.js";
import { setHTML, setText } from "../utils/Writer.js";

function _drawActiveJumble() {
    if (AppState.activeJumble) {
        setHTML('jumble-container', AppState.activeJumble.activeJumbleCard)
    } else {
        setHTML('jumble-container', `
        <div class="card no-jumble my-2 text-center">
            <p class="p-3 fs-3">No Active Jumble</p>
        </div>
        `)
    }
}


function _drawJumbleList() {
    const jumbles = AppState.jumbles
    let content = ''
    jumbles.forEach(jumble => content += jumble.menuCard)
    setHTML('jumble-dump', content)
}



export class JumblesController {
    constructor() {
        _drawActiveJumble()
        _drawJumbleList()
        AppState.on('jumbles', _drawJumbleList)
        AppState.on('activeJumble', _drawActiveJumble)
    }

    setActiveJumble(jumbleId) {
        if (AppState.activeJumble) {
            Pop.error('There already is an active Jumble!')
            return
        }
        jumblesService.setActiveJumble(jumbleId)
    }

    submitJumbleResult(event) {
        event.preventDefault()
        let form = event.target
        let results = getFormData(form)
        if (results.activeJumbleContent == AppState.activeJumble.content) {
            Pop.success('You Won')
            jumblesService.endJumble()
            form.reset()
        } else {
            Pop.error('You have errors')
        }

    }

    createJumble(event) {
        event.preventDefault()
        let form = event.target
        let newForm = getFormData(form)
        jumblesService.makeNewJumble(newForm)
        form.reset()
    }

}