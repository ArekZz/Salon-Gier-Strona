document.addEventListener('DOMContentLoaded', () => {
    let imgs = Array.from(document.querySelectorAll('img'));
    if (imgs.length > 0) {
        if ("IntersectionObserver" in window) {
            let observer = new IntersectionObserver((ent, observer) => {
                ent.forEach(entry => {
                    if (entry.isIntersecting) {
                        let image = entry.target;
                        image.src = image.dataset.src;
                        image.onload = () => {
                            image.style.opacity = '1';
                        }
                        observer.unobserve(image);
                    }
                });
            });
            imgs.forEach(img => {
                observer.observe(img);
            })
        }
    } else {
        imgs.forEach(img => {
            img.style.opacity = '1';
            img.src = img.dataset.src;
        })
    }

})