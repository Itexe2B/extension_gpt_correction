let toastEl = document.createElement("div");
let APP_KEY = "YOUR_API_KEY";
toastEl.className = "reformulator-toast";
document.body.appendChild(toastEl);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.text === "reformulate") {
            // Assuming you have a URL where you can send a POST request to reformulate the text
            requestGPT(request, "Reformule le contenu de façon scientifique. Reprend les règles latex et les équations si nécessaire.", "Reformulation en cours...")
        }
        else if (request.text === "correction") {
            requestGPT(request, "Corrige les fautes en gardant la syntaxe du texte y compris si il y a du LaTex : ", "Correction en cours...")
        }
    }
);

function requestGPT(request, context, toast_title){
    let url = 'https://api.openai.com/v1/chat/completions';

    toastEl.textContent = toast_title;
    toastEl.classList.add("show");
    toastEl.style.animation = "fadein 0.5s, fadeout 0.5s 2.5s";
    setTimeout(function(){
        toastEl.classList.remove("show");
        toastEl.style.animation = "";
    }, 3000);

    // Sending a POST request to the server
    let data = {"model":"gpt-3.5-turbo",
        "messages":[
            {"role":"system","content":context},
            {"role":"assistant","content": request.data}
        ],
        "temperature":0.7}
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + APP_KEY
        },
        body: JSON.stringify(data) // request.data contains the selected text
    }).then(response => response.json())
        .then(data => {
            // let activeElement = document.activeElement;
            let gpt = data.choices[0].message.content;
            // console.log(activeElement);

            // if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            //     let start = activeElement.selectionStart;
            //     let end = activeElement.selectionEnd;
            //     activeElement.value = activeElement.value.substring(0, start) + data.text + activeElement.value.substring(end);
            // } else {
            //     console.error("Not an input or textarea element");
            // }

            navigator.clipboard.writeText(gpt).then(function() {
                toastEl.textContent = "Collez !";
                toastEl.classList.add("show");
                toastEl.style.animation = "fadein 0.5s, fadeout 0.5s 2.5s";
                setTimeout(function(){
                    toastEl.classList.remove("show");
                    toastEl.style.animation = "";
                }, 3000);
            }, function() {
                /* clipboard write failed */
            });
        }).catch(error => {
        console.error('Error:', error);
    });
}
