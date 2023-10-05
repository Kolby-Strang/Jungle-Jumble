import { generateId } from "../utils/GenerateId.js"

export class Jumble {
    constructor(jumbleData) {
        this.title = jumbleData.title
        this.content = jumbleData.content
        this.timeHighScore = jumbleData.timeHighScore ? jumbleData.timeHighScore : null
        this.highWPMScore = jumbleData.highWPMScore ? jumbleData.highWPMScore : null
        this.id = generateId()
    }

    get activeJumbleCard() {
        return /*html */`
        <div id="active-jumble" class="row p-3">
            <!-- Jumble template -->
            <div class="card text-center p-3 mb-3">

                <div class="d-flex justify-content-between fw-bold">
                    <p>${this.title}</p>
                    <p>Fastest Time: ${this.timeHighScore}</p>
                 </div>
                <div class="text-start">
                    <p>${this.content}</p>
                </div>
            </div>

            <div class="col-12 p-0">
                <!-- type area -->
                <div class="card text-center p-2">
                    <form onsubmit="app.JumblesController.submitJumbleResult(event)">
                        <input name="activeJumbleContent" id="activeJumbleContent" class="w-100">
                        <button class="btn btn-primary w-100">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        `
    }


    get menuCard() {
        return /*html */`
        <div class="d-flex menu-text align-items-center justify-content-between mb-1">
          <button onclick="app.JumblesController.setActiveJumble('${this.id}')" class="btn btn-warning ">start</button>
          <p class="fw-bold">${this.title}</p>
          <p>⏲️${this.timeHighScore}s</p>
          <p>${this.highWPMScore} wpm</p>
        </div>
        `
    }
}