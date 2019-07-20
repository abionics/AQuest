let quest;

$(document).ready(() => init());
function init() {
    quest = new Quest();
}

function generate() {
    try {
        let json = JSON.stringify(quest.getAll(), null, 4);
        $("#json").text(json);
    } catch (e) {
        alert(e);
    }
}

function addQuestion(name) {
    let question = $("#" + name).val();
    $("#block-creator").val("");
    quest.addQuestion(question);
    showBlock();
}

function changeQuestion(name) {
    let question = $("#" + name).val();
    let idBlock = getIdBlock(name);
    quest.changeQuestion(question, idBlock);
}

function removeQuestion(name) {
    let idBlock = getIdBlock(name);
    quest.removeQuestion(idBlock);
    updateBlocks(idBlock);
    $("#block-" + quest.length).remove();
}

function addAnswer(name) {
    let idBlock = getIdBlock(name);
    let answer = $("#" + name).val();
    $("#block-" + idBlock + "-answer-creator").val("");
    quest.answer(answer, idBlock);
    showAnswer(idBlock);
}

function changeAnswer(name) {
    let idBlock = getIdBlock(name);
    let idAnswer = getIdAnswer(name);
    let answer = $("#" + name).val();
    quest.answer(answer, idBlock, idAnswer);
}

function removeAnswer(name) {
    let idBlock = getIdBlock(name);
    let idAnswer = getIdAnswer(name);
    quest.removeAnswer(idBlock, idAnswer);
    updateBlocks(idBlock);
}

function changeMode(name) {
    let idBlock = getIdBlock(name);
    let selected = $("#" + name).prop("checked");
    let mode = selected ? Mode.plural : Mode.single;
    quest.changeMode(mode, idBlock);
    updateBlocks(idBlock);
}

function selectAnswer(name) {
    let idBlock = getIdBlock(name);
    let idAnswer = getIdAnswer(name);
    let selected = $("#" + name).prop("checked");
    quest.select(selected, idBlock, idAnswer);
}

function showBlock(idBlock = quest.length - 1) {
    let block = quest.get(idBlock);
    let checked = (block.mode === Mode.single) ? "" : "checked";
    $(  "<div class='block' id='block-" + idBlock + "'>" +
        "   <div class='block-head' id='block-" + idBlock + "-head'>" +
        "       <input type='text' class='question' id='block-" + idBlock + "-question' onchange='changeQuestion(this.id)' value='" + block.question + "'>" +
        "       <input type='checkbox' class='mode' id='block-" + idBlock + "-mode' onchange='changeMode(this.id)'" + checked + "> Many answers" +
        "       <button class='block-remove btn btn-danger btn-sm' id='block-" + idBlock + "-remove' onclick='removeQuestion(this.id)'>delete</button>" +
        "   </div>" +
        "   <input type='text' class='answer-creator' id='block-" + idBlock + "-answer-creator' onchange='addAnswer(this.id)' placeholder='Input answer...'>" +
        "</div>").insertBefore("#block-creator");
    for (let idAnswer = 0; idAnswer < block.answers.length; idAnswer++) {
        showAnswer(idBlock, idAnswer);
    }
}

function showAnswer(idBlock, idAnswer) {
    let block = quest.get(idBlock);
    if (idAnswer == null) idAnswer = block.answers.length - 1;
    let type = (block.mode === Mode.single) ? "radio" : "checkbox";
    let checked = (block.selected.includes(idAnswer)) ? "checked" : "";
    let prefix = "block-" + idBlock + "-answer-" + idAnswer;
    $(  "<div class='answer' id='" + prefix + "'>" +
        "   <input type='" + type + "' class='answer-select' id='" + prefix + "-select' name='block-" + idBlock + "' onchange='selectAnswer(this.id)'" + checked + ">" +
        "   <input type='text' class='answer-answer' id='" + prefix + "-answer' onchange='changeAnswer(this.id)' value='" + block.answers[idAnswer] + "'>" +
        "   <button class='answer-remove btn btn-danger btn-sm' id=id='" + prefix + "-remove' onclick='removeAnswer(this.id)'>delete</button>" +
        "</div>").insertBefore("#block-" + idBlock + "-answer-creator");
}

function updateBlocks(from, to = quest.length) {
    for (let i = from; i < to; i++) {
        $("#block-" + i).remove();
        showBlock(i);
    }
}

function getIdBlock(name) {
    name = name + "-";
    let indexes = indexesOf(name, "-");
    return name.substring(indexes[0] + 1, indexes[1]);
}

function getIdAnswer(name) {
    name = name + "-";
    let indexes = indexesOf(name, "-");
    return name.substring(indexes[2] + 1, indexes[3]);
}

function indexesOf(string, char) {
    let indexes = [];
    for (let i = 0; i < string.length; i++)
        if (string[i] === char) indexes.push(i);
    return indexes;
}

window.onerror = function uncheckedError(message, url, line) {
    alert("script.js: Error occurred: " + message + " : " + url + " : " + line);
    return false;
};



/*
            DOM (id)                                      (class)

quest
  block-0                                               block
    block-0-head                                        block-head
      block-0-question                                  question
      block-0-mode                                      mode
      block-0-remove                                    block-remove
    block-0-answer-0                                    answer
      block-0-answer-0-select                           answer-select
      block-0-answer-0-answer                           answer-answer
      block-0-answer-0-remove                           answer-remove
    block-0-answer-1
      block-0-answer-1-select
      block-0-answer-1-answer
      block-0-answer-1-remove
    block-0-answer-2
      block-0-answer-2-select
      block-0-answer-2-answer
      block-0-answer-2-remove
    block-0-answer-creator                              answer-creator
  block-1
    block-1-head
      block-1-question
      block-1-mode
    block-1-answer-0
      block-1-answer-0-select
      block-1-answer-0-answer
      block-1-answer-0-remove
    block-1-answer-1
      block-1-answer-1-select
      block-1-answer-1-answer
      block-1-answer-1-remove
    block-1-answer-creator
  block-creator
  generate


                                        EXAMPLE

<div id="quest">
    <div class="block" id="block-0">
        <div class="block-head" id="block-0-head">
            <input type="text" class="question" id="block-0-question" onchange="changeQuestion(this.id)" value="What is my name?">
            <input type="checkbox" class="mode" id="block-0-mode" onchange="changeMode(this.id)" checked=""> Many answers
            <button class="block-remove btn btn-danger btn-sm" id="id='block-0-remove'" onclick="removeQuestion(this.id)">delete</button>
        </div>
        <div class="answer" id="block-0-answer-0">
            <input type="checkbox" class="answer-select" id="block-0-answer-0-select" name="block-0" onchange="selectAnswer(this.id)">
            <input type="text" class="answer" id="block-0-answer-0-answer" onchange="changeAnswer(this.id)" value="Alex">
            <button class="answer-remove btn btn-danger btn-sm" id="id='block-0-answer-0-remove'" onclick="removeAnswer(this.id)">delete</button>
        </div>
        <div class="answer" id="block-0-answer-1">
            <input type="checkbox" class="answer-select" id="block-0-answer-1-select" name="block-0" onchange="selectAnswer(this.id)">
            <input type="text" class="answer" id="block-0-answer-1-answer" onchange="changeAnswer(this.id)" value="Abionics">
            <button class="answer-remove btn btn-danger btn-sm" id="id='block-0-answer-1-remove'" onclick="removeAnswer(this.id)">delete</button>
        </div>
        <div class="answer" id="block-0-answer-2">
            <input type="checkbox" class="answer-select" id="block-0-answer-2-select" name="block-0" onchange="selectAnswer(this.id)">
            <input type="text" class="answer" id="block-0-answer-2-answer" onchange="changeAnswer(this.id)" value="DiSBaLaNcE">
            <button class="answer-remove btn btn-danger btn-sm" id="id='block-0-answer-2-remove'" onclick="removeAnswer(this.id)">delete</button>
        </div>
        <div class="answer" id="block-0-answer-3">
            <input type="checkbox" class="answer-select" id="block-0-answer-3-select" name="block-0" onchange="selectAnswer(this.id)">
            <input type="text" class="answer" id="block-0-answer-3-answer" onchange="changeAnswer(this.id)" value="Geotopia">
            <button class="answer-remove btn btn-danger btn-sm" id="id='block-0-answer-3-remove'" onclick="removeAnswer(this.id)">delete</button>
        </div>
        <input type="text" class="answer-creator" id="block-0-answer-creator" onchange="addAnswer(this.id)" placeholder="Input answer...">
    </div>
    <div class="block" id="block-1">
        <div class="block-head" id="block-1-head">
            <input type="text" class="question" id="block-1-question" onchange="changeQuestion(this.id)" value="How old am I?">
            <input type="checkbox" class="mode" id="block-1-mode" onchange="changeMode(this.id)"> Many answers
            <button class="block-remove btn btn-danger btn-sm" id="id='block-1-remove'" onclick="removeQuestion(this.id)">delete</button>
        </div>
        <div class="answer" id="block-1-answer-0">
            <input type="radio" class="answer-select" id="block-1-answer-0-select" name="block-1" onchange="selectAnswer(this.id)">
            <input type="text" class="answer" id="block-1-answer-0-answer" onchange="changeAnswer(this.id)" value="12">
            <button class="answer-remove btn btn-danger btn-sm" id="id='block-1-answer-0-remove'" onclick="removeAnswer(this.id)">delete</button>
        </div>
        <div class="answer" id="block-1-answer-1">
            <input type="radio" class="answer-select" id="block-1-answer-1-select" name="block-1" onchange="selectAnswer(this.id)">
            <input type="text" class="answer" id="block-1-answer-1-answer" onchange="changeAnswer(this.id)" value="19">
            <button class="answer-remove btn btn-danger btn-sm" id="id='block-1-answer-1-remove'" onclick="removeAnswer(this.id)">delete</button>
        </div>
        <div class="answer" id="block-1-answer-2">
            <input type="radio" class="answer-select" id="block-1-answer-2-select" name="block-1" onchange="selectAnswer(this.id)">
            <input type="text" class="answer" id="block-1-answer-2-answer" onchange="changeAnswer(this.id)" value="21">
            <button class="answer-remove btn btn-danger btn-sm" id="id='block-1-answer-2-remove'" onclick="removeAnswer(this.id)">delete</button>
        </div>
        <input type="text" class="answer-creator" id="block-1-answer-creator" onchange="addAnswer(this.id)" placeholder="Input answer...">
    </div>
    <input type="text" id="block-creator" onchange="addQuestion(this.id)" placeholder="Input question...">
    <button class="btn btn-success" id="generate" onclick="generate()">Generate</button>
</div>

*/
