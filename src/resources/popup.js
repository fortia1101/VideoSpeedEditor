// popup.html Loaded
window.addEventListener("DOMContentLoaded", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting
        .executeScript({
            target: { tabId: tab.id },
            func: getNowPlaySpeed,
        })
        .then((injectionResults) => {
            for (const { frameId, result } of injectionResults) {
                if (result[0] === 0) {
                    document.querySelector(".video-active").style.display = "none";
                    document.querySelector(".video-deactive").style.display = "block";
                } else {
                    document.querySelector(".video-active").style.display = "block";
                    document.querySelector(".video-deactive").style.display = "none";
                }
                document.getElementById("speed-select").querySelector(`option[value='${result[1]}']`).selected = true;
            }
        });
});

let speedSelector = document.getElementById("speed-select");
speedSelector.addEventListener("change", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: switchPlaySpeed,
        args: [tab, speedSelector.value],
    });
});

// Handle Current Page
function getNowPlaySpeed() {
    let videoElements = document.getElementsByTagName("video");
    let nowSpeed = 1;
    try {
        nowSpeed = videoElements[0].playbackRate;
    } catch {
        nowSpeed = 1;
    }
    if (videoElements.length > 0) {
        for (let i = 1; i < videoElements.length; i++) {
            videoElements[i].playbackRate = nowSpeed;
        }
    }
    return [videoElements.length, nowSpeed];
}

// Handle Current Page
function switchPlaySpeed(tab, speed) {
    let videoElements = document.getElementsByTagName("video");
    for (let i = 0; i < videoElements.length; i++) {
        videoElements[i].playbackRate = speed;
    }
    console.log(`Switched to ${speed}s`);
}
