class Quest {
    constructor() {
        this.blocks = [];
    }

    get length() {
        return this.blocks.length;
    }

    addQuestion(text) {
        this.blocks.push(new Block(text));
    }

    changeQuestion(text, idBlock) {
        this.blocks[idBlock].change(text);
    }

    removeQuestion(idBlock) {
        this.blocks.splice(idBlock, 1);
    }

    answer(text, idBlock, idAnswer) {
        this.blocks[idBlock].answer(text, idAnswer);
    }

    removeAnswer(idBlock, idAnswer) {
        this.blocks[idBlock].remove(idAnswer);
    }

    changeMode(mode, idBlock) {
        this.blocks[idBlock].chmod(mode);
    }

    select(value, idBlock, idAnswer) {
        this.blocks[idBlock].select(value, idAnswer);
    }

    validate() {
        if (this.blocks.length < 1) throw new Error("No blocks! Create at least one question!");
        this.blocks.forEach((value, index) => {
            let block = value.get();
            if (block.answers.length === 0) throw new Error("Block " + index + " has no answers!");
            if (block.mode === Mode.single && block.selected.length !== 1) throw new Error("Block " + index + " must have single selected answers");
        })
    }

    getAll() {
        this.validate();
        let result = [];
        this.blocks.forEach(value => result.push(value.get()));
        return {
            version: 1.0,
            blocks: result
        };
    }

    get(idBlock) {
        return this.blocks[idBlock].get();
    }
}

class Block {
    constructor(text) {
        this.question = text;
        this.answers = [];
        this.mode = Mode.single;
        this.selected = [];
    }

    get length() {
        return this.answers.length;
    }

    change(text) {
        this.question = text;
    }

    answer(text, idAnswer = this.answers.length) {
        this.answers[idAnswer] = text;
    }

    remove(idAnswer) {
        this.answers.splice(idAnswer, 1);
        this.select(false, idAnswer);
        this.selected = this.selected.map(value => value > idAnswer ? value - 1 : value);
    }

    chmod(mode) {
        this.mode = mode;
        if (mode === Mode.single && this.selected.length > 1)
            this.selected = [this.selected.shift()];
    }

    select(value, idAnswer) {
        idAnswer = parseInt(idAnswer);
        if (value === false) {
            if (this.selected.includes(idAnswer)) {
                let index = this.selected.indexOf(idAnswer);
                this.selected.splice(index, 1);
            }
        } else {
            if (this.mode === Mode.single) {
                this.selected = [idAnswer];
            } else {
                this.selected.push(idAnswer);
            }
        }
        this.selected.sort();
    }

    get() {
        return {
            question: this.question,
            answers: this.answers,
            mode: this.mode,
            selected: this.selected
        }
    }
}


let Mode = Object.freeze({"single": 1, "plural": 2});


window.onerror = function uncheckedError(message, url, line) {
    alert("structure.js: Error occurred: " + message + " : " + url + " : " + line);
    return false;
};
