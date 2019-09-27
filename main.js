Vue.use(Vuex);

class CommandData {
    number;
    name;
    constructor (number, name) {
        this.number = number;
        this.name = name;
    }
}

const store = new Vuex.Store({
    state: {
        count: 0,
        commandStr: "",
        commandList: [ ]
    },
    mutations: {
        clearCommand(state) {
            state.count = 0;
            state.commandList = [];
        },
        addCommand(state, payload) {
            state.count++;
            state.commandList.push(new CommandData(state.count, payload.name));
        }
    }
});

new Vue({ 
    el: '#app',
    store,
    computed: {
        count () {
            return this.$store.state.count;
        },
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
    let currentToken = "";
    let commandList = [];
    tokenlist.forEach(token => {
        console.log("token = " + token);
        if (token === "q") {
            if (currentToken != "") {
                commandList.push(currentToken);
            }
            currentToken = token;
        } else {
            currentToken += (" " + token);
        }
    });
    if (currentToken != "") {
        commandList.push(currentToken);
    }
    commandList.forEach(command => {
        store.commit('addCommand', {name: command});
    });
    updateCanvas();
}

function updateCanvas() {
    let canvas = $("#command-str")[0];
}
