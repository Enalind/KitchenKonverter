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
    test("Multiple strings", async () => {
        document.body.innerHTML = `<div>1 cup scrumptios flour, 2 fl oz baking soda, 5 teaspoons egg white powder</div>`
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual("<div>2 and 2/5 dl scrumptios flour, 3/5 dl baking soda, 5 teaspoons egg white powder</div>")
    })
    test("Case 2", async () => {
        document.body.innerHTML = `<li ><span ><input  aria-label="2 cups (260g) whole wheat flour"><label></label></span><span data-amount="2" data-unit="cup">2 cups</span> (<span data-amount="260" data-unit="g">260g</span>) <strong>whole wheat flour</strong></li>`
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual('<li><span><input aria-label=\"2 cups (260g) whole wheat flour\"><label></label></span><span data-amount=\"2\" data-unit=\"cup\">4 and 2/3 dls</span> (<span data-amount=\"260\" data-unit=\"g\">260g</span>) <strong>whole wheat flour</strong></li>')
    })
    test("Split node", async () => {
        document.body.innerHTML = `<span data-amount="1">1</span><strong> and 1/2 cups </strong>pure vanilla extract</li>`
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual('<span data-amount=\"1\">3 and 3/5</span><strong>dl</strong>pure vanilla extract')
    })
    test("Temperature", async () => {
        document.body.innerHTML = `<li>Preheat oven to 425°F (218°C). Spray a</li>`
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual('<li>Preheat oven to 216 celsius (218°C). Spray a</li>')
    })
    test("Split node with number and slash style fraction", async () => {
        document.body.innerHTML = `<li><span>1 1/2 </span> <span>cups</span></li>`
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual('<li><span>3 and 3/5 </span> <span>dls</span></li>')
    })
    test("Multiple split nodes", async () => {
        document.body.innerHTML = `<li><div><span>1/2</span> <span>cup</span></div> <div><span>1/2</span> <span>cup</span></div></li>`
        await main(document.body, reciveData)
        expect(document.body.innerHTML).toEqual('<li><div><span>1 and 1/5 </span> <span>dl</span></div> <div><span>1 and 1/5 </span> <span>dl</span></div></li>')
    })
})
