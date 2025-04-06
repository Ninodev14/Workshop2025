

function errase(img) {
    const parent = img.parentNode;
    const input = parent.querySelector('input');
    document.getElementById(input.id).value = "";
}