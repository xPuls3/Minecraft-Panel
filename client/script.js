window.addEventListener("load", main);

function main() {

    let start = document.querySelector("#start");
    let stop = document.querySelector("#stop");
    let restart = document.querySelector("#restart");
    let state = document.querySelector("#state");

    $.get("state", function(online) {
        updateState(online);
    });

    start.addEventListener("click", function () {
        start.disabled = true;
        restart.disabled = true;
        state.innerText = "starting";
        state.style.color = getColor("starting");
        $.post("start", function(online) {
            start.disabled = online;
            stop.disabled = !online;
            restart.disabled = !online;
            updateState(online);
        });
    });

    stop.addEventListener("click", function () {
        stop.disabled = true;
        restart.disabled = true;
        state.innerText = "stopping";
        state.style.color = getColor("stopping");
        $.post("stop", function(online) {
            start.disabled = online;
            stop.disabled = !online;
            restart.disabled = !online;
            updateState(online);
        });
    });

    restart.addEventListener("click", function () {
        start.disabled = true;
        stop.disabled = true;
        restart.disabled = true;
        state.innerText = "restarting";
        state.style.color = getColor("restarting");
        $.post("restart", function(online) {
            start.disabled = online;
            stop.disabled = !online;
            restart.disabled = !online;
            updateState(online);
        });
    });

    function updateState(online) {
        start.disabled = online;
        stop.disabled = !online;
        restart.disabled = !online;
        if (online === true) {
            state.innerText = "online";
            state.style.color = getColor("online");
        } else {
            state.innerText = "offline";
            state.style.color = getColor("offline");
        }
    }

    // Colors look weird, leaving this off.
    function getColor(state) {
        return "initial"; // This disables the function
        switch (state.toLowerCase()) {
            case "online":
                return "green";
            case "offline":
                return "red";
            default:
                return "initial";
        }
    }

}