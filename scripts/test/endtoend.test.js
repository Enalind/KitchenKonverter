import {expect, jest, test} from '@jest/globals';
import {readFile} from "fs/promises"
import { main } from "../src/content_script"
async function reciveData(){
    return {
        "data":{
            "from": "us",
            "to": "metric"
        }
    }
}

async function runScriptOnFile(folder){
    const fileContents = await readFile(folder + "before.html")
    const fileString = fileContents.toString("utf-8")
    document.body.innerHTML = fileString
    await main(document.body, reciveData)
    return document.body.innerHTML, await readFile(folder + "after.html")
}
describe("End to end testing", () => {
    test("Case 1", async () => {
        document.body.innerHTML = `<div>1 cup scrumptios flour, 2 fl oz baking soda, 5 teaspoons egg white powder</div>`
        // document.body.innerHTML = '<h1>1 cup</h1>'
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual("<div kitchen-converted=\"s egg white\">2 and 2/5 dl scrumptios flour, 3/5 dl baking soda, 1 tsps egg white powder</div>")
    })
    test("Case 2", async () => {
        document.body.innerHTML = `<li ><span ><input  aria-label="2 cups (260g) whole wheat flour"><label></label></span><span data-amount="2" data-unit="cup">2 cups</span> (<span data-amount="260" data-unit="g">260g</span>) <strong>whole wheat flour</strong></li>`
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual('<li ><span ><input aria-label="2 cups (260g) whole wheat flour"><label></label></span><span data-amount="2" data-unit="cup">2 cups</span> (<span data-amount="260" data-unit="g">260g</span>) <strong>whole wheat flour</strong></li>')
    })
})
