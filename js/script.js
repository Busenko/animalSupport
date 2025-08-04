

 
 
//ПОПАП .........................................................................................................................................
const openPopupBtns = document.querySelectorAll(".openPopup");
const popupOverlay = document.getElementById("popupOverlay");
const closePopupBtn = document.querySelector(".closePopup");
let lastClickedButton = null;

openPopupBtns.forEach(button => {
    button.addEventListener("click", function () {
        lastClickedButton = button;
        const buttonRect = button.getBoundingClientRect();
        const popupWidth = popupOverlay.offsetWidth;
        const popupHeight = popupOverlay.offsetHeight;

        popupOverlay.style.transition = "none";
        popupOverlay.style.transform = `translate(${buttonRect.left + buttonRect.width / 2 - popupWidth / 2}px, ${buttonRect.top + buttonRect.height / 2 - popupHeight / 2}px) scale(0)`;
        
        popupOverlay.classList.add("show");
        
        setTimeout(() => {
            popupOverlay.style.transition = "transform 0.3s ease-out";
            popupOverlay.style.transform = `translate(${window.innerWidth / 2 - popupWidth / 2}px, ${window.innerHeight / 2 - popupHeight / 2}px) scale(1)`;
        }, 10);

        document.body.classList.add('lock');
        
        // Зміна тут: шукаємо img в батьківському .pet-carousel__card
        const popupImgContainer = document.querySelector(".popup__img");
        const originalImg = button.closest('.pet-carousel__card').querySelector("img");
        if (originalImg && popupImgContainer) {
            const imgClone = originalImg.cloneNode(true);
            imgClone.classList.add("popup-clone-img");
            popupImgContainer.innerHTML = ""; // Очистити попередній вміст
            popupImgContainer.appendChild(imgClone);
        }
    });
});


popupOverlay.addEventListener("click", function (event) {
    if (event.target === popupOverlay) {
        closePopup();
    }
});

closePopupBtn.addEventListener("click", closePopup);

function closePopup() {
    if (!lastClickedButton) return;

    const buttonRect = lastClickedButton.getBoundingClientRect();

    popupOverlay.style.transform = `translate(${buttonRect.left + buttonRect.width / 2 - popupOverlay.offsetWidth / 2}px, ${buttonRect.top + buttonRect.height / 2 - popupOverlay.offsetHeight / 2}px) scale(0)`;

    setTimeout(() => {
        popupOverlay.classList.remove("show");
        document.body.classList.remove('lock');
        lastClickedButton = null;

// Видалення клону зображення
const popupImgContainer = document.querySelector(".popup__img");
if (popupImgContainer) {
    popupImgContainer.innerHTML = "";
}


    }, 300);
}







//карусель /////////////////////////////////////////////////////////////////////////////////////////////////////////
const scrollContainer = document.querySelector('.pet-carousel__scroll');

let isDown = false;
let startX;
let scrollLeft;

scrollContainer.style.cursor = 'grab';  // початковий курсор

scrollContainer.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
  scrollContainer.style.cursor = 'grabbing';  // змінюємо курсор при натисканні
  e.preventDefault();
});

scrollContainer.addEventListener('mouseleave', () => {
  isDown = false;
  scrollContainer.style.cursor = 'grab';  // повертаємо курсор
});

scrollContainer.addEventListener('mouseup', () => {
  isDown = false;
  scrollContainer.style.cursor = 'grab';  // повертаємо курсор
});

scrollContainer.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = startX - x;
  scrollContainer.scrollLeft = scrollLeft + walk;
});

//лінії  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Конфігураційні змінні для стилів та анімації
const LINE_COLORS = ["#ead409", "#ff6f61", "#4caf50", "#2196f3"];
const DOT_COLORS = ["#2196f3", "#2196f3", "#2196f3", "#2196f3"];
const LINE_WIDTH = 3;
const DOT_RADIUS = 6;
const CORNER_RADIUS = 30;
const ANIMATION_EASING = "ease-in-out";
const ANIMATION_DELAY = 0;
const LINE_DIRECTION = "farthest";
const MOBILE_BREAKPOINT = 440;

let lastViewportWidth = document.documentElement.clientWidth;

function animateLine(path, duration = 800) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${duration}ms ${ANIMATION_EASING}`;
    path.style.strokeDashoffset = "0";
}

function animateDot(dot, duration = 300) {
    dot.style.opacity = "1";
    dot.style.transition = `opacity ${duration}ms ${ANIMATION_EASING}`;
}

function drawLines() {
    const headings = Array.from(document.querySelectorAll("h2"));
    const edgeOffset = 10;
    const textOffset = 12;
    const viewportWidth = document.documentElement.clientWidth;
    const isMobile = viewportWidth <= MOBILE_BREAKPOINT;

    document.querySelectorAll('.connection-line-svg').forEach(svg => svg.remove());

    for (let i = 0; i < headings.length - 1; i++) {
        const h1 = headings[i];
        const h2 = headings[i + 1];

        const rect1 = h1.getBoundingClientRect();
        const rect2 = h2.getBoundingClientRect();

        let h1Left;
        if (isMobile) {
            h1Left = (i % 2 === 0);
        } else {
            if (LINE_DIRECTION === "closest") {
                h1Left = rect1.left < viewportWidth / 2;
            } else {
                h1Left = rect1.left >= viewportWidth / 2;
            }
        }

        const startX = h1Left ? rect1.left - textOffset : rect1.right + textOffset;
        const startY = rect1.top + rect1.height / 2 + window.scrollY;
        const endX = h1Left ? rect2.left - textOffset : rect2.right + textOffset;
        const endY = rect2.top + rect2.height / 2 + window.scrollY;
        const edgeX = h1Left ? edgeOffset : viewportWidth - edgeOffset;

        const verticalDir = endY > startY ? 1 : -1;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add('connection-line-svg');
        svg.style.position = "absolute";
        svg.style.left = "0";
        svg.style.top = "0";
        svg.style.width = "100vw";
        svg.style.height = document.documentElement.scrollHeight + "px";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "0";

        const pathData = `
            M ${startX} ${startY}
            L ${edgeX - CORNER_RADIUS * (h1Left ? -1 : 1)} ${startY}
            Q ${edgeX} ${startY} ${edgeX} ${startY + CORNER_RADIUS * verticalDir}
            L ${edgeX} ${endY - CORNER_RADIUS * verticalDir}
            Q ${edgeX} ${endY} ${edgeX - CORNER_RADIUS * (h1Left ? -1 : 1)} ${endY}
            L ${endX} ${endY}
        `;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", LINE_COLORS[i % LINE_COLORS.length]);
        path.setAttribute("stroke-width", LINE_WIDTH);
        path.setAttribute("fill", "none");
        path.setAttribute("data-index", i);
        svg.appendChild(path);

        const startDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        startDot.setAttribute("cx", startX);
        startDot.setAttribute("cy", startY);
        startDot.setAttribute("r", DOT_RADIUS);
        startDot.setAttribute("fill", DOT_COLORS[i % DOT_COLORS.length]);
        startDot.style.opacity = "0";
        startDot.setAttribute("data-dot", "start");
        svg.appendChild(startDot);

        const endDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        endDot.setAttribute("cx", endX);
        endDot.setAttribute("cy", endY);
        endDot.setAttribute("r", DOT_RADIUS);
        endDot.setAttribute("fill", DOT_COLORS[(i + 1) % DOT_COLORS.length]);
        endDot.style.opacity = "0";
        endDot.setAttribute("data-dot", "end");
        svg.appendChild(endDot);

        document.body.appendChild(svg);

        setTimeout(() => {
            path.style.strokeDasharray = path.getTotalLength();
            path.style.strokeDashoffset = path.getTotalLength();
        }, 10);
    }
}

function isHeadingCenteredOrAbove(heading) {
    const rect = heading.getBoundingClientRect();
    const centerY = window.innerHeight / 2;
    return rect.top < centerY;
}

function checkAndAnimateLines() {
    const headings = Array.from(document.querySelectorAll("h2"));
    const svgs = Array.from(document.querySelectorAll('.connection-line-svg'));
    headings.forEach((heading, i) => {
        if (i < svgs.length) {
            const svg = svgs[i];
            const path = svg.querySelector('path');
            const startDot = svg.querySelector('circle[data-dot="start"]');
            const endDot = svg.querySelector('circle[data-dot="end"]');
            if (isHeadingCenteredOrAbove(heading)) {
                if (!path.classList.contains('animated')) {
                    setTimeout(() => {
                        animateDot(startDot);
                        setTimeout(() => {
                            path.classList.add('animated');
                            animateLine(path);
                            setTimeout(() => {
                                animateDot(endDot);
                            }, 800);
                        }, 300);
                    }, ANIMATION_DELAY);
                }
            } else {
                if (!path.classList.contains('animated')) {
                    path.style.strokeDashoffset = path.getTotalLength();
                    startDot.style.opacity = "0";
                    endDot.style.opacity = "0";
                }
            }
        }
    });
}

window.addEventListener("resize", () => {
    const currentViewportWidth = document.documentElement.clientWidth;
    if (Math.abs(currentViewportWidth - lastViewportWidth) > 1) {
        lastViewportWidth = currentViewportWidth;
        drawLines();
        setTimeout(checkAndAnimateLines, 100);
    }
});

window.addEventListener("load", () => {
    lastViewportWidth = document.documentElement.clientWidth;
    drawLines();
    setTimeout(checkAndAnimateLines, 100);
});

window.addEventListener("scroll", checkAndAnimateLines);
