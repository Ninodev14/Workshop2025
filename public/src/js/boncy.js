document.querySelectorAll('.btnBoncy').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('bouncing');
        setTimeout(() => button.classList.remove('bouncing'), 400);
    });
});