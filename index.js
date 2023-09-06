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

const GreekAndHebrewLetters = ["\\alpha", "\\beta", "\\chi", "\\delta", "\\epsilon", "\\eta", "\\gamma", "\\iota", "\\kappa", "\\lambda", "\\mu", "\\nu", "o", "\\omega", "\\phi", "\\pi", "\\psi", "\\rho", "\\sigma", "\\tau", "\\theta", "\\upsilon", "\\xi", "\\zeta", "\\digamma", "\\varepsilon", "\\varkappa", "\\varphi", "\\varpi", "\\varrho", "\\varsigma", "\\vartheta", "\\Delta", "\\Gamma", "\\Lambda", "\\Omega", "\\Phi", "\\Pi", "\\Psi", "\\Sigma", "\\Theta", "\\Upsilon", "\\Xi", "\\aleph", "\\beth", "\\daleth", "\\gimel"];

const LatexMathConstructs = ["\\frac{a}{b}", "f'", "\\sqrt{a}", "\\sqrt[b]{a}", "\\overline{a}", "\\underline{a}", "\\widehat{a}", "\\widetilde{a}", "\\overrightarrow{a}", "\\overleftarrow{a}", "\\overbrace{a}", "\\underbrace{a}"];

const Delimiters = ["|", "\\vert", "\\|", "\\Vert", "\\{", "\\}", "\\langle", "\\rangle", "\\lfloor", "\\rfloor", "\\lceil", "\\rceil", "/", "\\backslash", "[", "]", "\\Uparrow", "\\uparrow", "\\Downarrow", "\\downarrow", "\\llcorner", "\\lrcorner", "\\ulcorner", "\\urcorner"];

const FormulaSymbols = ["\\sum", "\\sum_{a=1}^{b} c_a", "\\prod", "\\prod_{a=1}^{b} c_a", "\\coprod", "\\coprod_{a=1}^{b} c_a", "\\int", "\\int_{a}^{b} f(x) dx", "\\oint", "\\oint_{C} f(x) dx", "\\iint", "\\iint_{R} f(x,y) dA", "\\biguplus", "\\biguplus_{a=1}^{b} C_a", "\\bigcap", "\\bigcap_{a=1}^{b} C_a", "\\bigcup", "\\bigcup_{a=1}^{b} C_a", "\\bigoplus", "\\bigoplus_{a=1}^{b} C_a", "\\bigotimes", "\\bigotimes_{a=1}^{b} C_a", "\\bigodot", "\\bigodot_{a=1}^{b} C_a", "\\bigvee", "\\bigvee_{a=1}^{b} C_a", "\\bigwedge", "\\bigwedge_{a=1}^{b} C_a", "\\bigsqcup", "\\bigsqcup_{a=1}^{b} C_a"];

const StandardFunctionNames = ["\\arccos", "\\cos", "\\csc", "\\exp", "\\ker", "\\limsup", "\\min", "\\sinh", "\\arcsin", "\\cosh", "\\deg", "\\gcd", "\\lg", "\\ln", "\\Pr", "\\sup", "\\arctan", "\\cot", "\\det", "\\hom", "\\lim", "\\log", "\\sec", "\\tan", "\\arg", "\\coth", "\\dim", "\\inf", "\\liminf", "\\max", "\\sin", "\\tanh"];

const BinaryOperationAndRelationSymbols = ["\\ast", "\\star", "\\cdot", "\\circ", "\\bullet", "\\bigcirc", "\\diamond", "\\times", "\\div", "\\centerdot", "\\circledast", "\\circledcirc", "\\circleddash", "\\dotplus", "\\divideontimes", "\\pm", "\\mp", "\\amalg", "\\odot", "\\ominus", "\\oplus", "\\oslash", "\\otimes", "\\wr", "\\Box", "\\boxplus", "\\boxminus", "\\boxtimes", "\\boxdot", "\\square", "\\cap", "\\cup", "\\uplus", "\\sqcap", "\\sqcup", "\\wedge", "\\vee", "\\dagger", "\\ddagger", "\\barwedge", "\\curlywedge", "\\Cap", "\\bot", "\\intercal", "\\doublebarwedge", "\\lhd", "\\rhd", "\\triangleleft", "\\triangleright", "\\unlhd", "\\unrhd", "\\bigtriangledown", "\\bigtriangleup", "\\setminus", "\\veebar", "\\curlyvee", "\\Cup", "\\top", "\\rightthreetimes", "\\leftthreetimes", "\\equiv", "\\cong", "\\neq", "\\sim", "\\simeq", "\\approx", "\\asymp", "\\doteq", "\\propto", "\\models", "\\leq", "\\prec", "\\preceq", "\\ll", "\\subset", "\\subseteq", "\\sqsubseteq", "\\dashv", "\\in", "\\geq", "\\succ", "\\succeq", "\\gg", "\\supset", "\\supseteq", "\\sqsupset", "\\sqsupseteq", "\\vdash", "\\ni", "\\perp", "\\mid", "\\parallel", "\\bowtie", "\\Join", "\\ltimes", "\\rtimes", "\\smile", "\\frown", "\\notin", "\\approxeq", "\\thicksim", "\\backsim", "\\triangleq", "\\circeq", "\\bumpeq", "\\Bumpeq", "\\doteqdot", "\\thickapprox", "\\fallingdotseq", "\\risingdotseq", "\\varpropto", "\\therefore", "\\because", "\\eqcirc", "\\neq", "\\leqq", "\\leqslant", "\\lessapprox", "\\lll", "\\lessdot", "\\lesssim", "\\eqslantless", "\\precsim", "\\precapprox", "\\Subset", "\\subseteqq", "\\sqsubset", "\\preccurlyeq", "\\curlyeqprec", "\\blacktriangleleft", "\\trianglelefteq", "\\vartriangleleft", "\\geqq", "\\geqslant", "\\gtrapprox", "\\ggg", "\\gtrdot", "\\gtrsim", "\\eqslantgtr", "\\succsim", "\\succapprox", "\\Supset", "\\supseteqq", "\\sqsupset", "\\succcurlyeq", "\\curlyeqsucc", "\\blacktriangleright", "\\trianglerighteq", "\\vartriangleright", "\\lessgtr", "\\lesseqgtr", "\\lesseqqgtr", "\\gtreqqless", "\\gtreqless", "\\gtrless", "\\backepsilon", "\\between", "\\pitchfork", "\\shortmid", "\\smallfrown", "\\smallsmile", "\\Vdash", "\\vDash", "\\Vvdash", "\\shortparallel", "\\nshortparallel", "\\ncong", "\\nmid", "\\nparallel", "\\nshortmid", "\\nshortparallel", "\\nsim", "\\nVDash", "\\nvDash", "\\nvdash", "\\ntriangleleft", "\\ntrianglelefteq", "\\ntriangleright", "\\ntrianglerighteq", "\\nleq", "\\nleqq", "\\nleqslant", "\\nless", "\\nprec", "\\preceq", "\\precnapprox", "\\precnsim", "\\lnapprox", "\\lneq", "\\lneqq", "\\lnsim", "\\lvertneqq", "\\ngeq", "\\ngeqq", "\\ngeqslant", "\\ngtr", "\\nsucc", "\\nsucceq", "\\succnapprox", "\\succnsim", "\\gnapprox", "\\gneq", "\\gneqq", "\\gnsim", "\\gvertneqq", "\\nsubseteq", "\\nsupseteq", "\\nsubseteqq", "\\nsupseteqq", "\\subsetneq", "\\supsetneq", "\\subseteqq", "\\supseteqq", "\\varsubsetneq", "\\varsupsetneq", "\\varsubsetneqq", "\\varsupsetneqq"];

const Symbols = GreekAndHebrewLetters.concat(LatexMathConstructs).concat(Delimiters).concat(FormulaSymbols).concat(StandardFunctionNames).concat(BinaryOperationAndRelationSymbols);

Symbols.forEach(e => {
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