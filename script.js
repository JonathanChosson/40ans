const canvas = document.getElementById('scratchCanvas')
const hiddenContent = document.getElementById('hiddenContent')
const ctx = canvas.getContext('2d')

canvas.width = hiddenContent.offsetWidth
canvas.height = hiddenContent.offsetHeight

// Remplir le canevas avec une couleur de couverture
ctx.fillStyle = 'gray'
ctx.fillRect(0, 0, canvas.width, canvas.height)

let isScratching = false

function getCoordinates(event) {
    const rect = canvas.getBoundingClientRect()
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}

function scratch(e) {
    if (!isScratching) return

    const { x, y } = getCoordinates(e)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()
}

function startScratch(e) {
    e.preventDefault() // Empêche le comportement par défaut
    isScratching = true
    scratch(e) // Démarrer le grattage immédiatement
}

function stopScratch() {
    isScratching = false

    // Vérifier le pourcentage de grattage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparentPixels = 0
    for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] === 0) {
            transparentPixels++
        }
    }
    const transparency =
        (transparentPixels / (canvas.width * canvas.height)) * 100
    if (transparency > 70) {
        canvas.style.display = 'none'
    }
}

// Pointer Events
canvas.addEventListener('pointerdown', startScratch)
canvas.addEventListener('pointermove', scratch)
canvas.addEventListener('pointerup', stopScratch)
canvas.addEventListener('pointercancel', stopScratch)
