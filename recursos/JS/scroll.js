function isElementInViewport(el, offset = 250) { 
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight + offset || document.documentElement.clientHeight + offset) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScroll() {
    const elements = document.querySelectorAll('.titulo, .texto');
    elements.forEach((element) => {
        if (isElementInViewport(element, 150)) { 
            element.classList.add('aparece');
        }
    });
}

window.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', handleScroll);
