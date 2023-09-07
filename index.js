window.addEventListener("beforeunload", (event) => {
    if (document.getElementById("latex").value != "") {
        event.preventDefault();
        event.returnValue = "";
    }
});

const GetJsonData = (path) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();
    if (xhr.status === 200) return JSON.parse(xhr.responseText);
}

const unsupportedViewport = document.getElementById("latex").getBoundingClientRect().width < 400;

const Inserts = GetJsonData("./inserts.json").Inserts;

let latexInput = "";
let oldLatexInput = "";

let autoCompile = document.getElementById("autocompile").checked;
let compilationCooldown = 0;

const latexPreview = document.getElementById("latex-preview");

const UpdateLatexPreview = (element, latexContent) => {
    oldLatexInput = latexContent;
    element.innerHTML = latexContent;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "math"]);
}

document.getElementById("search-insert-list").addEventListener("input", (event) => {
    for (let i = 0; i < document.getElementById("insert-list").children.length; i++) {
        const e = document.getElementById("insert-list").children[i];

        if (!e.title.replace("\\", "").toLowerCase().includes(event.target.value)) e.style.display = "none";
        else e.style.display = "flex";
    }
});

if (!unsupportedViewport) {
    Inserts.forEach(e => {
        const symbolButton = document.createElement("button");
        symbolButton.type = "button";
        symbolButton.title = e.name;
        symbolButton.classList.add("hover:bg-gray-600");

        symbolButton.appendChild(document.createElement("p"))

        symbolButton.children[0].innerHTML = e.syntax;
        symbolButton.setAttribute("syntax", e.syntax);
        UpdateLatexPreview(symbolButton.children[0], `\\[${e.syntax}\\]`);

        symbolButton.addEventListener("click", () => {
            navigator.clipboard.writeText(symbolButton.getAttribute("syntax"));
        });

        document.getElementById("insert-list").appendChild(symbolButton);
    });

    document.getElementById("unsupported-viewport-modal").classList.add("hidden");
}
else {
    document.getElementById("unsupported-viewport-modal").classList.add("flex");
}

document.getElementById("autocompile").addEventListener("click", (event) => {
    autoCompile = event.target.checked;
});

document.getElementById("compile").addEventListener("click", () => {
    UpdateLatexPreview(latexPreview, latexInput);
});

setInterval(() => {
    if (!autoCompile) return;

    compilationCooldown++;
    if (compilationCooldown > 1 && oldLatexInput != latexInput) UpdateLatexPreview(latexPreview, latexInput);
}, 1000);

document.getElementById("latex").value = "";
document.getElementById("latex").addEventListener("input", (event) => {
    compilationCooldown = 0;
    latexInput = event.target.value;
});