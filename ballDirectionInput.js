const hand = document.getElementById('hand');
let isDragging = false;

hand.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
    });
});

function handleMouseMove(e) {
    if (isDragging) {
        const rect = hand.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        // Obracamy o 90 stopni przeciwnie do ruchu wskazówek zegara,
        // aby dopasować kierunek zgodny z Twoimi opisem
        const degrees = (angle * (180 / Math.PI) + 90) % 360;

        hand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;

        // Składowe prędkości w kierunkach X i Y
        const velocity = document.getElementById("force").value
        x = Math.cos(angle) * velocity;
        y = Math.sin(angle) * velocity;
        console.log(x,y);
        window.dx = x;
        window.dy = y;
    }
}
