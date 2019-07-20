const delay = 1000;

let quest;
let block;
let active;
let chosen;
let points;
let Mode = Object.freeze({"single": 1, "plural": 2});

function load() {
    try {
        let json = JSON.parse($("#json").val());
        if (json.version !== 1.0) throw new Error("Unsupported version");
        quest = json.blocks;
        active = 0;
        points = 0;
        validate();
        ask();
    } catch (e) {
        alert(e);
    }
}

function validate() {
    if (quest.length < 1) throw new Error("No blocks founded");
    quest.forEach((block, index) => {
        if (block.answers.length === 0) throw new Error("Block " + index + " has no answers!");
        if (block.mode === Mode.single && block.selected.length !== 1) throw new Error("Block " + index + " must have single selected answers");
    })
}

function ask() {
    block = quest[active];
    chosen = [];
    let div = $("#quest");
    div.empty();
    div.append("<div class='title'>Question " + (active + 1) + "/" + quest.length + "</div>");
    div.append("<div class='question'>" + block.question + "</div>");
    for (let i = 0; i < block.answers.length; i++) {
        div.append("<button onclick='choose(" + i + ")' class='btn btn-primary answer' id='answer-" + i + "'>" + block.answers[i] + "</button>");
    }
    if (block.mode === Mode.plural) {
        div.append("<button onclick='analyze()' class='btn btn-success answer' id='answered'>OK</button>");
    }
}

function choose(num) {
    switch (block.mode) {
        case Mode.single: {
            chosen = [num];
            analyze();
        } break;
        case Mode.plural: {
            let index = chosen.indexOf(num);
            if (index === -1) {
                $("#answer-" + num).button('toggle');
                chosen.push(num);
            } else {
                $("#answer-" + num).button('toggle');
                chosen.splice(index, 1);
            }
        } break;
    }
}

async function analyze() {
    chosen.sort();
    let equals = true;
    for (let i = 0; i < chosen.length; i++) {
        let val = chosen[i];
        let button = $("#answer-" + val);
        if (block.selected.includes(val)) {
            button.addClass("glowing-green");
        } else {
            button.addClass("glowing-red");
            equals = false;
        }
    }
    for (let i = 0; i < block.selected.length; i++) {
        let val = block.selected[i];
        let button = $("#answer-" + val);
        if (!chosen.includes(val)) {
            if (block.mode === Mode.single) button.addClass("glowing-green");
            else button.addClass("glowing-yellow");
            equals = false;
        }
    }
    points += equals;
    await sleep(delay);
    active++;
    active < quest.length ? ask() : result();
}

function result() {
    let div = $("#quest");
    div.empty();
    div.append("<div class='result'>You complete " + 100 * points / quest.length + "%</div>");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onerror = function uncheckedError(message, url, line) {
    alert("structure.js: Error occurred: " + message + " : " + url + " : " + line);
    return false;
};
