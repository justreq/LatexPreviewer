// https://sites.math.washington.edu/~reu/docs/latex_symbols.pdf

const GetJsonData = (path) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();
    if (xhr.status === 200) return JSON.parse(xhr.responseText);
}

const Inserts = GetJsonData("./inserts.json");

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

[].forEach(e => {
    const symbolButton = document.createElement("button");
    symbolButton.type = "button";
    symbolButton.title = e;
    symbolButton.classList.add("hover:bg-gray-600");

    symbolButton.innerHTML = "<div class=\"flex gap-5 h-full\"><p></p><div class=\"w-1 h-full bg-gray-600 rounded-full m-auto\"></div></div><p class=\"text-xs\"></p>";

    symbolButton.children[0].children[0].innerHTML = e;
    symbolButton.children[1].textContent = e;
    UpdateLatexPreview(symbolButton.children[0].children[0], `\\(${symbolButton.title}\\)`);

    symbolButton.addEventListener("click", () => {
        navigator.clipboard.writeText(symbolButton.title);
    })

    document.getElementById("insert-list").appendChild(symbolButton);
});

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
}, 2000);

document.getElementById("latex").value = "\\[\n\n\\]";
document.getElementById("latex").addEventListener("input", (event) => {
    compilationCooldown = 0;
    latexInput = event.target.value;
});