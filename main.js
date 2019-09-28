Vue.use(Vuex);

class CommandData {
    number;
    name;
    dataList = [ ];
    constructor (number, name, dataList) {
        this.number = number;
        this.name = name;
        this.dataList = dataList;
    }
    drawPath(ctx) {
        console.debug("drawPath : [" + this.name + "]");
        if(this.name == "m") {
            console.debug("m1");
            ctx.moveTo(this.dataList[0], this.dataList[1]);
        }
        else if (this.name == "l") {
            console.debug("l1");
            ctx.lineTo(this.dataList[0], this.dataList[1]);
        }
        else if (this.name == "q") {
            console.debug("q1");
            ctx.quadraticCurveTo(this.dataList[2], this.dataList[3], this.dataList[0], this.dataList[1]);
        }
    }
    get text () {
        return this.name + " : " + this.dataList.join(" ");
    }
}

const store = new Vuex.Store({
    state: {
        commandStr: "m 583 526 l 583 531 q 791 758 791 566 q 623 977 791 916 q 416 1006 541 1006 l 132 1006 l 132 14 l 454 14 q 660 48 580 14 q 828 290 828 121 q 583 526 828 483 m 252 576 l 252 907 l 408 907 q 665 745 665 907 q 400 576 665 576 l 252 576 m 252 113 l 252 482 l 407 482 q 570 456 494 482 q 699 297 699 412 q 437 113 699 113 l 252 113",
        commandList: [ ]
    },
    mutations: {
        clearCommand(state) {
            state.commandList = [];
        },
        addCommand(state, payload) {
            state.commandList.push(payload.command);
        }
    }
});

new Vue({ 
    el: '#app',
    store,
    computed: {
        commandStr () {
            return this.$store.state.commandStr;
        },
        commandList () {
            return this.$store.state.commandList;
        },
    }
});


function onclick_update(event) {
    store.commit('clearCommand');
    const commandStr = $("#command-str").val();
    console.log("commandStr = " + commandStr);
    const tokenlist = commandStr.split(" ");
    let commandList = getCommandList(tokenlist);
    commandList.forEach(command => {
        store.commit('addCommand', { command: command });
    });
    updateCanvas(commandList);
}

function getCommandList(tokenList) {
    let i = 0;
    let index = 1;
    const commandList = new Array();
    while (i < tokenList.length) {
        if (tokenList[i] == "q") {
            dataCount = 4;
        }
        else if (tokenList[i] == "m") {
            dataCount = 2;
        }
        else if (tokenList[i] == "l") {
            dataCount = 2;
        }
        const command = new CommandData(index++, tokenList[i], tokenList.slice(i+1, i+dataCount+1));
        commandList.push(command);
        i += (dataCount + 1);
    }
    return commandList;
}

function updateCanvas(commandList) {
    let canvas = $("#canvas1")[0];
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, 300, 300);
    ctx.lineWidth = 10;
    ctx.fillStyle = "#AAA";
    ctx.translate(0, 200);
    ctx.scale(0.1, -0.1);
    ctx.beginPath();
    commandList.forEach(command => {
        console.debug(command.name);
        command.drawPath(ctx);
    });
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
